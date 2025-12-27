# 🚀 Quick Start Guide

Get your Emotion Recognition app running in 5 minutes!

---

## Terminal 1: Start Backend (FastAPI)

```bash
cd /home/krishom/ritik/backend
python app.py
```

**Expected output:**
```
Model loaded successfully on cpu
Uvicorn running on http://0.0.0.0:8000
```

✅ Backend is ready at `http://localhost:8000`

---

## Terminal 2: Start Frontend (React)

```bash
cd /home/krishom/ritik/frontend
npm run dev
```

**Expected output:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend is ready at `http://localhost:5173`

---

## Testing the Application

1. **Open your browser:** http://localhost:5173
2. **Type some text:** e.g., "I'm so excited about this amazing opportunity!"
3. **Click "Analyze"** or press Ctrl+Enter
4. **See the results!** All 28 emotions with scores

---

## API Testing (Optional)

### Test with cURL:

**Health Check:**
```bash
curl http://localhost:8000/
```

**Get Emotions List:**
```bash
curl http://localhost:8000/emotions
```

**Analyze Text:**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this!"}'
```

### Test with Python:

```python
import requests

# Analyze emotion
response = requests.post(
    'http://localhost:8000/analyze',
    json={'text': 'I am so happy right now!'}
)

print(response.json())
# Output:
# {
#   "text": "I am so happy right now!",
#   "emotion": "joy",
#   "confidence": 0.95,
#   "scores": { "joy": 0.95, "excitement": 0.03, ... }
# }
```

---

## What You'll See

### Main Screen
- Text input area on the left
- Emotion analysis results on the right
- Real-time emotion detection

### Emotion Results Show:
1. **Primary Emotion** - The main emotion detected
2. **Confidence Level** - How sure the AI is (0-100%)
3. **Emotional Spectrum** - All 28 emotions ranked by score

### Colors
- 🟡 Joy/Excitement - Yellow/Orange
- 🔵 Sadness/Fear - Blue/Purple
- 🔴 Anger - Red/Pink
- 💚 Optimism/Relief - Green
- And more...

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Server Error" appears | Make sure backend is running: `python app.py` |
| Backend won't start | Check if port 8000 is free: `lsof -i :8000` |
| Frontend won't start | Install dependencies: `npm install` |
| Emotions not showing | Wait for model to load (2-3 seconds) |
| Blank analysis results | Check browser console (F12) for errors |

---

## Project Structure

```
/home/krishom/ritik/
├── backend/                  # FastAPI server
│   ├── app.py               # Main application
│   ├── model.py             # Emotion analyzer logic
│   └── emotion_model_final/ # BERT model files
│
├── frontend/                # React application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── TextInput.tsx
│   │   │   └── EmotionResults.tsx
│   │   └── utils/
│   │       └── api.ts       # API communication
│   └── package.json
│
├── README.md                # Project overview
└── API_INTEGRATION_GUIDE.md # Detailed API docs
```

---

## File Locations

| File | Path |
|------|------|
| Backend Main | `/home/krishom/ritik/backend/app.py` |
| Model Logic | `/home/krishom/ritik/backend/model.py` |
| API Module | `/home/krishom/ritik/frontend/src/utils/api.ts` |
| App Component | `/home/krishom/ritik/frontend/src/App.tsx` |
| Results Component | `/home/krishom/ritik/frontend/src/components/EmotionResults.tsx` |

---

## Features

✅ **Real-time Analysis** - Instant emotion detection
✅ **28 Emotions** - Comprehensive emotion recognition
✅ **AI-Powered** - Uses BERT transformer model
✅ **Beautiful UI** - Modern gradient design with animations
✅ **Error Handling** - Graceful error messages
✅ **Local Processing** - All data stays on your computer
✅ **Type-Safe** - TypeScript for reliability

---

## Next: Customization

Want to customize something?

- **Change colors** → Edit `emotionColors` in [EmotionResults.tsx](frontend/src/components/EmotionResults.tsx)
- **Adjust timeout** → Change `setIsAnalyzing(true/false)` timing in [App.tsx](frontend/src/App.tsx)
- **Modify backend port** → Change in [backend/app.py](backend/app.py)
- **Change API URL** → Edit `API_BASE_URL` in [api.ts](frontend/src/utils/api.ts)

---

## Performance Tips

- Backend startup takes ~2-3 seconds (model loading)
- Analysis is fast after that (~200ms)
- UI is responsive with React Fast Refresh
- No external API calls - everything is local

---

## Support

If something doesn't work:

1. Check the console (F12 in browser)
2. Read the error message
3. Make sure both backend and frontend are running
4. Check that `localhost:8000` and `localhost:5173` are not blocked

---

**You're all set! 🎉 Start analyzing emotions!**
