from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import LLMService
from contextlib import asynccontextmanager
from app import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.llmservice = LLMService()
    yield
    app.state.llmservice.clear()


app = FastAPI(title="Emotion Analysis API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(router=router, prefix="/v1")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
