from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import LLMService
from contextlib import asynccontextmanager
from app import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initializes the model only once for the whole lifespan
    app.state.llmservice = LLMService()
    yield
    app.state.llmservice.clear()


# FastAPI ko object(instance) with FastAPI attributes
app = FastAPI(title="Emotion Analysis API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware( # Middlewares for fastapi, which are included in app, security 
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
