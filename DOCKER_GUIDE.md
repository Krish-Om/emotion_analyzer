# 🐳 Docker Setup Guide

This project is fully dockerized and can run on any machine with Docker installed.

## Prerequisites

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
chmod +x docker-start.sh
./docker-start.sh
```

This script will:
- Check for Docker and Docker Compose
- Build the images
- Start both services
- Verify everything is running

### Option 2: Manual Setup

```bash
# Build the images
docker-compose build

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Accessing the Application

Once running, access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Services

### Backend (Python FastAPI)
- **Image**: Built from `backend/Dockerfile`
- **Runtime**: Python 3.11 with uv package manager
- **Port**: 8000
- **Model**: BERT emotion classifier (419MB)
- **Endpoints**:
  - `GET /` - Health check
  - `GET /emotions` - List available emotions
  - `POST /analyze` - Analyze emotion in text

### Frontend (React + TypeScript)
- **Image**: Built from `frontend/Dockerfile`
- **Runtime**: Node 20 with Bun
- **Port**: 5173
- **Framework**: Vite + React 18 + Tailwind CSS

## Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v

# Check service status
docker-compose ps
```

## Troubleshooting

### Backend not starting
```bash
docker-compose logs backend
```

Check if port 8000 is already in use:
```bash
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend not connecting to backend
- Ensure backend is healthy: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Frontend uses `http://backend:8000` internally (Docker network)

### Model loading issues
- Ensure `emotion_model_final` folder exists at project root
- Check backend logs for model loading errors
- Model size: 419MB

## File Structure

```
.
├── docker-compose.yml          # Docker Compose configuration
├── .dockerignore               # Files to ignore in builds
├── docker-start.sh             # Quick start script
├── backend/
│   ├── Dockerfile             # Backend image definition
│   ├── app.py                 # FastAPI application
│   ├── model.py               # Emotion analyzer logic
│   ├── pyproject.toml         # Python dependencies (uv)
│   └── uv.lock                # Locked dependencies
├── frontend/
│   ├── Dockerfile             # Frontend image definition
│   ├── package.json           # Node dependencies
│   ├── bun.lockb              # Bun lock file
│   ├── vite.config.ts         # Vite configuration
│   └── src/                   # React source code
└── emotion_model_final/       # BERT model files
```

## Performance Notes

- First build takes 5-10 minutes (installing dependencies, building frontend)
- Subsequent builds are faster (cached layers)
- Model loads on first request (~30 seconds on CPU, faster on GPU)
- Restart is fast (<5 seconds)

## Deployment

### For your friend's laptop:

1. **Install Docker Desktop**
   - [macOS](https://docs.docker.com/desktop/install/mac-install/)
   - [Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Linux](https://docs.docker.com/engine/install/)

2. **Clone/Copy the project**
   ```bash
   git clone <your-repo-url>
   cd emotion-analysis
   ```

3. **Run the application**
   ```bash
   ./docker-start.sh
   # or
   docker-compose up -d
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

## Environment Variables

Available in `docker-compose.yml`:

- `PYTHONUNBUFFERED=1` - Python buffering disabled
- `VITE_API_BASE_URL` - Frontend API endpoint (internal Docker network)

## Cleaning Up

```bash
# Stop containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Remove images
docker rmi emotion-analyzer-frontend emotion-api-backend

# Clean up system (prune unused resources)
docker system prune -a
```

## Building for Specific Architectures

If deploying on different CPU architectures:

```bash
# Build for specific architecture
docker-compose build --build-arg BUILDPLATFORM=linux/arm64

# Or use docker buildx for multi-platform
docker buildx build --platform linux/amd64,linux/arm64 -t emotion-analyzer .
```

## Support

For issues or questions, check:
- Docker logs: `docker-compose logs`
- Backend health: `curl http://localhost:8000/`
- API docs: http://localhost:8000/docs
