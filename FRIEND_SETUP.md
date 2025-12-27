# Setup Guide for Friend

## Prerequisites
- **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- **Git** installed
- **~2GB disk space** for dependencies + model
- **~419MB** for the emotion model file

## Setup Steps

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd ritik
```

### 2. Download the Model
Your friend will share the model file via cloud storage. Download it and extract:

```bash
# Download emotion_model_final.zip from the shared cloud link
# Then extract it to the project root:

unzip emotion_model_final.zip
# This creates: emotion_model_final/
```

The folder should contain:
```
emotion_model_final/
├── config.json
├── model.safetensors
├── special_tokens_map.json
├── tokenizer_config.json
├── tokenizer.json
└── vocab.txt
```

### 3. Start the Application
```bash
docker-compose up -d
```

Wait 2-3 minutes for Docker to build and start services.

### 4. Access the App
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

**"Model not loaded" error?**
- Verify `emotion_model_final/` folder exists in project root
- Check folder contains all files listed above
- Restart: `docker-compose down && docker-compose up -d`

**Can't reach backend?**
- Wait 30-60 seconds for backend to fully start
- Check logs: `docker-compose logs backend`
- Ensure ports 5173 and 8000 are not in use

**Out of disk space?**
- First build downloads ~2.5GB of Python packages
- Model: 419MB
- Built images: ~3GB total
- Clean up: `docker system prune -a`

## Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Rebuild (if code changed)
docker-compose build && docker-compose up -d
```

## First Build Time
- Initial build: **5-10 minutes** (downloading Python packages)
- Subsequent builds: **<1 minute** (cached)

Enjoy the Emotion Analyzer! 🎉
