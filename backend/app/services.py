from .llm_model import EmotionAnalyzer, EMOTION_LABELS
import os
import sys
from pathlib import Path
import torch

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))
# Initialize emotion analyzer
# Try to find model in Docker volume first, then fall back to relative path
MODEL_PATH = os.environ.get("MODEL_PATH")
if not MODEL_PATH:
    # Try Docker mount location
    docker_model_path = "/app/emotion_model_final"
    if os.path.exists(docker_model_path):
        MODEL_PATH = docker_model_path
    else:
        # Fall back to relative path for local development
        backend_dir = Path(__file__).parent.parent
        local_model_path = backend_dir / "emotion_model_final"
        MODEL_PATH = str(local_model_path.resolve())


class LLMService:
    def __init__(self) -> None:
        self.model = EmotionAnalyzer(MODEL_PATH)

    def analyze(self, text: str) -> dict:
        """
        Analyze emotion in the given text.

        Args:
            text: Input text to analyze

        Returns:
            Dictionary with emotion and scores
        """
        if not self.model.is_loaded():
            raise RuntimeError("Model is not loaded")

        text = text.strip()
        if not text:
            raise ValueError("Text cannot be empty")

        try:
            # Tokenize input
            inputs = self.model.tokenizer(
                text, return_tensors="pt", truncation=True, max_length=512
            )
            inputs = {key: value.to(self.model.device) for key, value in inputs.items()}

            # Get predictions
            with torch.no_grad():
                outputs = self.model.model(**inputs)

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
