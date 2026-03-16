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


def format_predictions(scores: dict, top_n: int = 3) -> list:
    """
    Format emotion scores as a list of predictions with label and score.

    Args:
        scores: Dictionary of emotion labels to confidence scores
        top_n: Number of top predictions to return

    Returns:
        List of dicts with 'label' and 'score' keys, sorted by score descending
    """
    sorted_emotions = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [
        {"label": emotion, "score": round(float(score), 4)}
        for emotion, score in sorted_emotions[:top_n]
    ]


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
            # Use sigmoid for multi-label classification - each emotion is independent
            probabilities = torch.sigmoid(logits)

            # Prepare scores for all emotions (independent probabilities 0-100%)
            scores = {
                EMOTION_LABELS[i]: float(probabilities[0][i].item())
                for i in range(len(EMOTION_LABELS))
            }
            # Format as list of top 3 predictions
            predictions = format_predictions(scores, top_n=3)

            return {
                "text": text,
                "predictions": predictions,
            }

        except Exception as e:
            raise RuntimeError(f"Error analyzing emotion: {str(e)}")

    def clear(self) -> None:
        """Release model resources during application shutdown."""
        self.model.model = None
        self.model.tokenizer = None
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
