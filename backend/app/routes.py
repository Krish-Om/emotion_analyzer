from fastapi import APIRouter, HTTPException
from .model import EmotionResponse, TextInput
from .llm_model import EMOTION_LABELS

router = APIRouter()

# Lazy initialization to avoid circular imports
analyzer = None


def get_analyzer():
    global analyzer
    if analyzer is None:
        from .services import LLMService
        analyzer = LLMService()
    return analyzer


@router.get("/")
def read_root():
    analyzer = get_analyzer()
    return {
        "status": "ok",
        "message": "Emotion Analysis API is running",
        "model_loaded": analyzer.model.is_loaded(),
    }


# GET endpoint - Model info
@router.get("/emotions")
def get_emotions():
    return {"available_emotions": list(EMOTION_LABELS), "count": len(EMOTION_LABELS)}


# POST endpoint - Analyze emotion
@router.post("/analyze", response_model=EmotionResponse)
def analyze_emotion(input_data: TextInput):
    analyzer = get_analyzer()
    if not analyzer.model.is_loaded():
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        result = analyzer.analyze(input_data.text)
        return EmotionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
