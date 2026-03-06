from pydantic import BaseModel

# Pydantic models
class TextInput(BaseModel):
    text: str


class EmotionResponse(BaseModel):
    text: str
    emotion: str
    scores: dict
    confidence: float = None