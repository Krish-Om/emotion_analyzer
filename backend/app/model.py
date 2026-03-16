from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# Pydantic models -> validation
class TextInput(BaseModel):
    text: str


class Prediction(BaseModel):
    label: str
    score: float


class EmotionResponse(BaseModel):
    text: str
    predictions: List[Prediction]
