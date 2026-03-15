from fastapi import APIRouter, HTTPException, Request
from .model import EmotionResponse, TextInput
from .llm_model import EMOTION_LABELS

router = APIRouter()


def get_analyzer(request: Request):
    analyzer = getattr(request.app.state, "llmservice", None)
    if analyzer is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    return analyzer


@router.get("/")
def read_root(request: Request):
    analyzer = get_analyzer(request)
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
def analyze_emotion(input_data: TextInput, request: Request):
    analyzer = get_analyzer(request)
    if not analyzer.model.is_loaded():
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        result = analyzer.analyze(input_data.text)
        return EmotionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
