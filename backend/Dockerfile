# syntax=docker/dockerfile:1.4

# Stage 1: Build with uv
FROM python:3.11-slim as builder

WORKDIR /app

# Install uv and build essentials
RUN apt-get update && apt-get install -y build-essential && pip install uv

# Copy project files
COPY pyproject.toml uv.lock ./

# Sync dependencies using uv with cache mount (speeds up rebuilds)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY . .

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["fastapi", "run", "app.py", "--host", "0.0.0.0", "--port", "8000"]
