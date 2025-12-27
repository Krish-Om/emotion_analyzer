# 🎭 Emotion Analysis Project

A web application that analyzes the emotions in text. You write something, and the AI tells you what emotion it expresses!

---

## 📋 What is This Project?

Imagine you have a text message and want to know if it sounds happy, angry, sad, or something else. This project uses **Artificial Intelligence** to automatically detect the emotion in any text you give it.

**Example:**
- You type: "I'm so excited for my vacation!"
- AI responds: "Emotion: **Excitement**" ✨

---

## 🏗️ How Does It Work?

Here's a simple diagram showing how the application flows:

```
┌─────────────────────────────────────────────────────────────┐
│                     USER TYPES TEXT                         │
│              "I just got great news!"                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Website/App)                          │
│     (React - This is what you see on your screen)           │
└────────────────────────┬────────────────────────────────────┘
                         │ Sends text to the server
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI Server)                        │
│     (This is the brain that processes your request)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           AI MODEL (BERT - The Smart AI)                    │
│     (A trained AI that understands emotions)                │
│              ↓                                               │
│     Analyzes the text and predicts emotion                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RESULT SENT BACK                               │
│    "Emotion: Joy (Confidence: 89%)"                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│       FRONTEND DISPLAYS THE RESULT TO USER                  │
│              User sees the answer!  😊                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ritik/
├── backend/                    # Server code (the brain)
│   ├── app.py                 # Main API application
│   ├── model.py               # AI model utilities
│   ├── emotion_model_final/   # The trained AI model files
│   └── pyproject.toml         # Python dependencies
│
├── frontend/                   # Website code (what you see)
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── components/        # UI components
│   │   │   ├── TextInput.tsx  # Text input box
│   │   │   └── EmotionResults.tsx  # Result display
│   │   └── utils/
│   │       └── emotionAnalyzer.ts  # Talks to backend
│   └── package.json           # JavaScript dependencies
│
└── emotion_model_final/        # Pre-trained AI model
    ├── model.safetensors      # The actual AI brain
    ├── config.json            # Model settings
    └── tokenizer files        # Helps convert text to numbers
```

---

## 🎯 What Emotions Can It Detect?

The AI can recognize **28 different emotions**:

| Emotions |  |  |  |
|----------|--|--|--|
| 😊 Admiration | 😂 Amusement | 😠 Anger | 😤 Annoyance |
| 👍 Approval | 💕 Caring | 🤔 Confusion | 🤨 Curiosity |
| 😍 Desire | 😞 Disappointment | 👎 Disapproval | 🤮 Disgust |
| 😳 Embarrassment | 🎉 Excitement | 😨 Fear | 🙏 Gratitude |
| 😢 Grief | 😄 Joy | 💑 Love | 😰 Nervousness |
| 🌟 Optimism | 🏆 Pride | 💡 Realization | 😌 Relief |
| 😔 Remorse | 😞 Sadness | 😲 Surprise | 😑 Neutral |

---

## 🚀 Getting Started

### Prerequisites

You need to have:
- **Python 3.8+** installed
- **Node.js & npm** installed (for the website)

### Backend Setup

1. **Install Python packages:**
```bash
cd backend
pip install -r requirements.txt
```

Or with the project's setup:
```bash
cd backend
pip install fastapi uvicorn torch transformers
```

2. **Start the backend server:**
```bash
cd backend
python app.py
```

The server will run at: `http://localhost:8000`

### Frontend Setup

1. **Install JavaScript packages:**
```bash
cd frontend
npm install
```

2. **Start the website:**
```bash
cd frontend
npm run dev
```

The website will open at: `http://localhost:5173`

---

## 📡 API Endpoints (For Developers)

If you want to use this API directly:

### 1. **Health Check** ✅
```
GET http://localhost:8000/
```
**Response:**
```json
{
  "status": "ok",
  "message": "Emotion Analysis API is running",
  "model_loaded": true
}
```

### 2. **Get Available Emotions** 📋
```
GET http://localhost:8000/emotions
```
**Response:**
```json
{
  "available_emotions": ["admiration", "amusement", "anger", ...],
  "count": 28
}
```

### 3. **Analyze Emotion** 🔍
```
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "text": "I'm so happy right now!"
}
```

**Response:**
```json
{
  "text": "I'm so happy right now!",
  "emotion": "joy",
  "confidence": 0.95,
  "scores": {
    "joy": 0.95,
    "excitement": 0.03,
    "surprise": 0.02,
    ...
  }
}
```

---

## 🧠 How Does the AI Work? (Simple Explanation)

The project uses **BERT**, which is a powerful AI model trained on billions of text examples.

**Think of it like this:**
- You show a human millions of texts with labeled emotions
- After seeing so many examples, they learn to recognize emotions in new texts
- That's exactly what BERT does, but as a computer!

**The Process:**
1. You write text → "I hate waiting in traffic"
2. The AI reads each word: "hate" (negative), "traffic" (situation)
3. It combines all the clues → Predicts: **Anger** or **Annoyance**
4. It also gives a confidence score: How sure it is

---

## ⚙️ Tech Stack

### Backend
- **FastAPI** - Modern Python framework for building APIs
- **PyTorch** - AI/Machine Learning library
- **Transformers** - Pre-built AI models (BERT)
- **Pydantic** - Data validation

### Frontend
- **React** - JavaScript library for building user interfaces
- **TypeScript** - JavaScript with type checking
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling

### AI Model
- **BERT** - Bidirectional Encoder Representations from Transformers
- **28 emotion classes** - Trained on emotion detection

---

## 🔧 Troubleshooting

### Issue: "Model not loaded"
**Solution:** Make sure the `emotion_model_final/` folder exists in the root directory with all model files.

### Issue: "Connection refused" on frontend
**Solution:** Make sure backend is running on `http://localhost:8000`

### Issue: Python dependencies not installing
**Solution:** Use a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 📝 Example Use Cases

1. **Social Media Monitoring** - Track sentiment in tweets
2. **Customer Support** - Detect angry customers automatically
3. **Mental Health Apps** - Analyze how users are feeling
4. **Content Moderation** - Flag potentially toxic comments
5. **Market Research** - Understand customer feedback emotions

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/)
- [What is BERT?](https://huggingface.co/blog/bert-101)

---

## 📄 License

This project is for educational and local development purposes.

---

## 🤝 Contributing

Feel free to modify and improve this project!

**Ideas to enhance it:**
- Add support for multiple languages
- Create a dashboard to track emotions over time
- Add user authentication
- Store results in a database
- Deploy to production

---

## ❓ FAQ

**Q: Can this detect sarcasm?**
A: Not perfectly. Sarcasm is tricky even for humans sometimes!

**Q: Is my text sent to external servers?**
A: No! Everything runs locally on your computer. Your data is private.

**Q: Can I use this for real-world applications?**
A: This version is for learning/development. For production, you'd want more testing and error handling.

**Q: What's the accuracy?**
A: Usually around 80-90% depending on the text length and clarity.

---

## 🎉 Have Fun!

Try analyzing different texts and see what emotions the AI detects. You might be surprised!

```
"I can't wait for Friday!" → Excitement ✨
"This coffee is cold again..." → Annoyance 😤
"Thank you so much!" → Gratitude 🙏
"I just got a promotion!" → Joy 😄
```

**Happy emotion detecting!** 🎭
