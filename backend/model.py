from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

# Emotion label mapping
EMOTION_LABELS = {
    0: "admiration",
    1: "amusement",
    2: "anger",
    3: "annoyance",
    4: "approval",
    5: "caring",
    6: "confusion",
    7: "curiosity",
    8: "desire",
    9: "disappointment",
    10: "disapproval",
    11: "disgust",
    12: "embarrassment",
    13: "excitement",
    14: "fear",
    15: "gratitude",
    16: "grief",
    17: "joy",
    18: "love",
    19: "nervousness",
    20: "optimism",
    21: "pride",
    22: "realization",
    23: "relief",
    24: "remorse",
    25: "sadness",
    26: "surprise",
    27: "neutral",
}


class EmotionAnalyzer:
    def __init__(self, model_path: str):
        """Initialize the emotion analyzer with model and tokenizer."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = None
        self.model = None
        self.load_model(model_path)

    def load_model(self, model_path: str) -> bool:
        """Load model and tokenizer from the given path."""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
            self.model.eval()
            self.model.to(self.device)
            print(f"Model loaded successfully on {self.device}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None and self.tokenizer is not None

    def analyze(self, text: str) -> dict:
        """
        Analyze emotion in the given text.

        Args:
            text: Input text to analyze

        Returns:
            Dictionary with emotion and scores
        """
        if not self.is_loaded():
            raise RuntimeError("Model is not loaded")

        text = text.strip()
        if not text:
            raise ValueError("Text cannot be empty")

        try:
            # Tokenize input
            inputs = self.tokenizer(
                text, return_tensors="pt", truncation=True, max_length=512
            )
            inputs = {key: value.to(self.device) for key, value in inputs.items()}

            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1)
            predicted_class = torch.argmax(probabilities, dim=-1).item()

            # Get emotion label
            emotion = EMOTION_LABELS[predicted_class]

            # Prepare scores for all emotions
            scores = {
                EMOTION_LABELS[i]: float(probabilities[0][i].item())
                for i in range(len(EMOTION_LABELS))
            }

            return {
                "text": text,
                "emotion": emotion,
                "scores": scores,
                "confidence": float(probabilities[0][predicted_class].item()),
            }

        except Exception as e:
            raise RuntimeError(f"Error analyzing emotion: {str(e)}")


def get_emotion_list() -> list:
    """Get list of all available emotions."""
    return list(EMOTION_LABELS.values())
