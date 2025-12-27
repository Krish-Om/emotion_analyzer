from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from model import EmotionAnalyzer, get_emotion_list

app = FastAPI(title="Emotion Analysis API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

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
        MODEL_PATH = os.path.join(os.path.dirname(__file__), "../emotion_model_final")

analyzer = EmotionAnalyzer(MODEL_PATH)


# Pydantic models
class TextInput(BaseModel):
    text: str


class EmotionResponse(BaseModel):
    text: str
    emotion: str
    scores: dict
    confidence: float = None


# GET endpoint - Health check
@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Emotion Analysis API is running",
        "model_loaded": analyzer.is_loaded(),
    }


# GET endpoint - Model info
@app.get("/emotions")
def get_emotions():
    return {"available_emotions": get_emotion_list(), "count": len(get_emotion_list())}


# POST endpoint - Analyze emotion
@app.post("/analyze", response_model=EmotionResponse)
def analyze_emotion(input_data: TextInput):
    if not analyzer.is_loaded():
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        result = analyzer.analyze(input_data.text)
        return EmotionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
