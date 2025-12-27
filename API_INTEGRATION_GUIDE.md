# API Integration Summary

## Overview
This document outlines the API methods created and how they're integrated throughout the frontend application to communicate with the FastAPI backend running on `localhost:8000`.

---

## 📁 Files Modified/Created

### 1. **[src/utils/api.ts](src/utils/api.ts)** - NEW
Central API module for all backend communication.

#### Exported Functions:

**`checkHealth(): Promise<HealthCheckResponse>`**
- Purpose: Verify if the backend server is running
- Called: On app mount in App.tsx
- Returns: Server status and model loading state

**`getAvailableEmotions(): Promise<EmotionsListResponse>`**
- Purpose: Fetch list of all 28 available emotions
- Returns: Array of emotion names and count

**`analyzeEmotion(text: string): Promise<EmotionAnalysisResponse>`**
- Purpose: Send text to backend for emotion analysis
- Input: Plain text string
- Returns: 
  - `emotion`: Detected primary emotion
  - `confidence`: Confidence score (0-1)
  - `scores`: All 28 emotion probabilities

**`getTopEmotions(scores, limit): Array`**
- Utility function to extract top N emotions from scores

**`formatConfidence(confidence): String`**
- Utility function to format confidence as percentage

#### Error Handling:
- Custom `APIError` class for error management
- Graceful fallback for server connection issues
- User-friendly error messages

---

### 2. **[src/App.tsx](src/App.tsx)** - UPDATED
Main application component with backend integration.

#### Key Changes:

**State Management:**
```tsx
const [text, setText] = useState('');
const [emotions, setEmotions] = useState<EmotionResult[]>([]);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [serverError, setServerError] = useState<string | null>(null);
```

**Server Health Check (useEffect):**
```tsx
useEffect(() => {
  const checkServer = async () => {
    try {
      await checkHealth();
      setServerError(null);
    } catch (error) {
      setServerError(error.message);
    }
  };
  checkServer();
}, []);
```

**Emotion Analysis Handler:**
```tsx
const handleAnalyze = async () => {
  if (!text.trim()) return;
  setIsAnalyzing(true);
  setServerError(null);

  try {
    const result = await analyzeEmotion(text);
    setEmotions([{
      emotion: result.emotion,
      confidence: result.confidence,
      scores: result.scores,
    }]);
  } catch (error) {
    setServerError(error.message);
    setEmotions([]);
  } finally {
    setIsAnalyzing(false);
  }
};
```

**Error Banner UI:**
- Displays server connection errors at top of page
- Shows helpful error messages to users

---

### 3. **[src/components/EmotionResults.tsx](src/components/EmotionResults.tsx)** - UPDATED
Results display component with full emotion spectrum visualization.

#### Key Features:

**Dynamic Color Mapping:**
- All 28 emotions have unique color schemes
- Automatic color selection based on primary emotion

**Display Modes:**
1. **Loading State**: Animated spinner while analyzing
2. **Empty State**: Prompts user to enter text
3. **Results State**: Shows primary emotion + all 28 scores

**Emotion Spectrum Display:**
```tsx
{primaryEmotion.scores && (
  <div>
    {Object.entries(primaryEmotion.scores)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, score]) => (
        // Render emotion bars with scores
      ))}
  </div>
)}
```

**Confidence Visualization:**
- Progress bars for each emotion
- Color-coded by emotion type
- Sorted by score (highest first)
- Staggered animations for visual appeal

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   User Input                             │
│            (types text in textarea)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ handleAnalyze()       │
         │ in App.tsx            │
         └───────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────┐
    │  analyzeEmotion(text)          │
    │  from utils/api.ts             │
    │                                │
    │  POST /analyze                 │
    │  Content-Type: application/json│
    │  {text: "..."}                 │
    └───────────┬──────────────────┘
                │
                ▼
    ┌──────────────────────────────┐
    │  FastAPI Backend             │
    │  POST http://localhost:8000/ │
    │  /analyze                    │
    └───────────┬──────────────────┘
                │
                ▼
    ┌──────────────────────────────┐
    │  BERT Model                  │
    │  (Emotion Analysis)          │
    └───────────┬──────────────────┘
                │
                ▼
    ┌──────────────────────────────────────┐
    │  Response                            │
    │  {                                   │
    │    emotion: "joy",                   │
    │    confidence: 0.95,                 │
    │    scores: { joy: 0.95, ... 28 ... }│
    │  }                                   │
    └───────────┬──────────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ setEmotions(result)      │
    │ Update state in App.tsx   │
    └───────────┬──────────────┘
                │
                ▼
    ┌──────────────────────────────────┐
    │ EmotionResults Component          │
    │ Renders all 28 emotions with      │
    │ color bars and percentages        │
    └──────────────────────────────────┘
```

---

## 🚀 How to Run

### Backend (FastAPI)
```bash
cd /home/krishom/ritik/backend
python app.py
# or
uvicorn app:app --reload
```
✅ Runs on `http://localhost:8000`

### Frontend (React)
```bash
cd /home/krishom/ritik/frontend
npm install
npm run dev
```
✅ Runs on `http://localhost:5173`

---

## 📊 API Endpoints Used

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/` | GET | Health check | `{status, message, model_loaded}` |
| `/emotions` | GET | List emotions | `{available_emotions, count}` |
| `/analyze` | POST | Analyze text | `{text, emotion, scores, confidence}` |

---

## 🎨 Emotion Colors (All 28)

| Emotion | Primary Color | Example |
|---------|---------------|---------|
| joy | Yellow→Orange | 😄 |
| excitement | Red→Orange | 🎉 |
| sadness | Blue→Cyan | 😢 |
| anger | Red→Pink | 😠 |
| fear | Purple→Red | 😨 |
| love | Pink→Rose | 💕 |
| surprise | Cyan→Blue | 😲 |
| neutral | Gray→Slate | 😑 |
| + 20 more... | Various | ... |

---

## ✅ Features Implemented

- ✅ Real-time emotion analysis from backend
- ✅ Server health check on app load
- ✅ Error handling and user-friendly messages
- ✅ Loading states with animations
- ✅ Display all 28 emotions with scores
- ✅ Sorted emotion spectrum (highest first)
- ✅ Dynamic color coding for each emotion
- ✅ Confidence percentage visualization
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe API with TypeScript

---

## 🔧 Troubleshooting

### "Server Error" message appears
**Solution:** Make sure FastAPI backend is running on `http://localhost:8000`
```bash
cd backend && python app.py
```

### No emotions displayed
**Solution:** Check that the model files exist in `/home/krishom/ritik/emotion_model_final/`

### API call fails
**Solution:** Check browser console (F12) for detailed error messages

---

## 📝 Code Example

```typescript
// Using the API in your component
import { analyzeEmotion, APIError } from './utils/api';

const handleAnalyze = async () => {
  try {
    const result = await analyzeEmotion("I'm so happy!");
    console.log(result.emotion); // "joy"
    console.log(result.confidence); // 0.95
    console.log(result.scores); // { joy: 0.95, ... }
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`Error ${error.status}: ${error.message}`);
    }
  }
};
```

---

## 🎯 Next Steps

1. **Customize loading message** - Edit `Analyzing emotions...` in EmotionResults.tsx
2. **Add result caching** - Store previous analyses
3. **Export results** - Download emotion analysis as CSV/JSON
4. **Multi-language support** - Analyze text in different languages
5. **Real-time analysis** - Analyze as user types (debounced)

---

## 📚 Architecture

```
frontend/
├── src/
│   ├── App.tsx (Main logic, API calls)
│   ├── components/
│   │   ├── TextInput.tsx (User input)
│   │   └── EmotionResults.tsx (Display results)
│   └── utils/
│       └── api.ts (Backend communication) ← NEW
└── package.json

backend/
├── app.py (FastAPI routes)
├── model.py (Emotion analyzer logic)
└── emotion_model_final/ (BERT model files)
```

---

All systems are ready for emotion analysis! 🎭✨
