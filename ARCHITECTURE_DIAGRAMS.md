# System Architecture & Data Flow Diagrams

## 🏗️ Overall System Architecture

```mermaid
graph TB
    subgraph Frontend["FRONTEND (React + TS)<br/>http://localhost:5173"]
        App["App.tsx (Main)<br/>• State management<br/>• Event handlers<br/>• API calls"]
        TextInput["TextInput.tsx<br/>• Textarea<br/>• Char/word counter<br/>• Button controls"]
        EmotionResults["EmotionResults.tsx<br/>• Primary emotion display<br/>• Confidence bar<br/>• 28 emotion spectrum<br/>• Color-coded bars"]
        API["api.ts<br/>• checkHealth()<br/>• analyzeEmotion()<br/>• getAvailableEmotions()<br/>• Error handling"]
    end
    
    subgraph Backend["BACKEND (FastAPI)<br/>http://localhost:8000"]
        Routes["API Routes<br/>GET /<br/>GET /emotions<br/>POST /analyze"]
        Model["model.py<br/>• EmotionAnalyzer<br/>• load_model()<br/>• analyze()"]
        BERT["BERT Model GPU/CPU<br/>• emotion_model_final<br/>• tokenizer.json<br/>• model.safetensors<br/>• config.json"]
    end
    
    App <-->|HTTP| Routes
    API <-->|HTTP| Routes
    Routes --> Model
    Model --> BERT
```

---

## 📊 Data Flow Diagram

```mermaid
flowchart TD
    A["👤 USER TYPES TEXT INPUT"] --> B["App.tsx<br/>handleAnalyze<br/>• Check if text not empty<br/>• setIsAnalyzing true<br/>• setServerError null"]
    B --> C["api.ts<br/>analyzeEmotion<br/>• Validate text<br/>• Create POST request<br/>• Send to :8000"]
    C --> D["📨 FASTAPI BACKEND<br/>POST /analyze<br/>Request: text input"]
    D --> E["model.py<br/>EmotionAnalyzer.analyze<br/>1. Tokenize text<br/>2. Prepare tensors<br/>3. Run BERT model<br/>4. Get logits<br/>5. Softmax probabilities<br/>6. Get top emotion"]
    E --> F["✅ Response<br/>emotion: joy<br/>confidence: 0.95<br/>scores: all 28 emotions"]
    F --> G["api.ts<br/>Handle Response<br/>• Parse JSON<br/>• Check for errors<br/>• Return EmotionResult"]
    G --> H["App.tsx<br/>setEmotions<br/>• Store result in state<br/>• setIsAnalyzing false<br/>• Clear server error"]
    H --> I["EmotionResults.tsx<br/>Re-render<br/>• Display primary emotion<br/>• Show confidence bar<br/>• List all 28 emotions<br/>• Apply color coding<br/>• Animate bars"]
    I --> J["🎭 USER SEES RESULTS!<br/>Primary: Joy 95%<br/>Emotional Spectrum displayed"]
```

---

## 🔄 State Management Flow

```mermaid
graph TB
    subgraph AppState["React State in App.tsx"]
        Text["text: string<br/>• User input<br/>• Updated by TextInput onChange"]
        Emotions["emotions: EmotionResult[]<br/>• Array of emotion objects<br/>• {emotion, confidence, scores}<br/>• Updated after API response"]
        IsAnalyzing["isAnalyzing: boolean<br/>• true: Show loading spinner<br/>• false: Show results<br/>• Updated during API call lifecycle"]
        ServerError["serverError: string | null<br/>• Error message from server/network<br/>• Displayed in error banner<br/>• Cleared on successful analysis"]
    end
    
    subgraph Components["React Components"]
        TextInput["TextInput.tsx<br/>Uses:<br/>• text<br/>• setText<br/>• onAnalyze<br/>• onClear"]
        EmotionResults["EmotionResults.tsx<br/>Uses:<br/>• emotions<br/>• isAnalyzing<br/>• serverError"]
    end
    
    Text --> TextInput
    Emotions --> EmotionResults
    IsAnalyzing --> EmotionResults
    ServerError --> EmotionResults
```

---

## 🎨 Component Hierarchy

```mermaid
graph TD
    App["App.tsx (Root)"]
    
    App --> ErrorBanner["Error Banner<br/>conditional<br/>Displays: serverError"]
    App --> Header["Header<br/>Title: Emotion Recognizer<br/>Subtitle description"]
    App --> Grid["Grid Layout<br/>lg:grid-cols-2"]
    App --> Footer["Footer<br/>Powered by FastAPI & BERT AI"]
    
    Grid --> TextInput["TextInput.tsx"]
    Grid --> Results["EmotionResults.tsx"]
    
    TextInput --> Label["Label: Share Your Emotions"]
    TextInput --> Textarea["Textarea<br/>value, onChange"]
    TextInput --> Stats["Stats<br/>char count, word count"]
    TextInput --> Buttons["Buttons"]
    TextInput --> Loading1["Loading state"]
    
    Buttons --> Analyze["Analyze Button<br/>onClick: handleAnalyze"]
    Buttons --> Clear["Clear Button<br/>onClick: handleClear"]
    
    Results --> LoadingState["Loading State<br/>Spinner + Analyzing emotions..."]
    Results --> EmptyState["Empty State<br/>Icon + Ready to discover emotions"]
    Results --> ResultsState["Results State"]
    
    ResultsState --> PrimaryBox["Primary Emotion Box<br/>• Icon<br/>• Name<br/>• Confidence Bar 0-100%"]
    ResultsState --> Spectrum["Emotional Spectrum<br/>All 28 Emotions sorted"]
    
    Spectrum --> SpectrumItem["Each emotion:<br/>• Name<br/>• Percentage<br/>• Progress bar color-coded"]
```

---

## 🌐 API Request/Response Format

```
REQUEST:
┌─────────────────────────────────────┐
│  POST /analyze                      │
│  Content-Type: application/json     │
│                                     │
│  {                                  │
│    "text": "I'm so happy!"          │
│  }                                  │
└─────────────────────────────────────┘

RESPONSE (200 OK):
┌──────────────────────────────────────────┐
│  {                                       │
│    "text": "I'm so happy!",              │
│    "emotion": "joy",                     │
│    "confidence": 0.9534,                 │
│    "scores": {                           │
│      "admiration": 0.0012,               │
│      "amusement": 0.0084,                │
│      ...                                 │
│      "joy": 0.9534,                      │
│      ...                                 │
│      "neutral": 0.0024                   │
│    }                                     │
│  }                                       │
└──────────────────────────────────────────┘

ERROR RESPONSE (400/500):
┌──────────────────────────────────────────┐
│  {                                       │
│    "detail": "Error message here"        │
│  }                                       │
└──────────────────────────────────────────┘
```

---

## 🎯 User Journey Map

```mermaid
flowchart TD
    Start(["START"]) --> Visit["Visit http://localhost:5173"]
    Visit --> HealthCheck["App loads<br/>checkHealth()<br/>Backend OK ✅"]
    HealthCheck --> EmptyState["See empty state<br/>Ready to discover emotions"]
    EmptyState --> TypeText["Type in textarea<br/>I'm so excited!"]
    TypeText --> Counter["Live character/word<br/>count updates"]
    Counter --> ClickAnalyze["Click Analyze button"]
    ClickAnalyze --> Spinner["Shows spinner<br/>Analyzing emotions..."]
    Spinner --> Processing["Backend processes<br/>with BERT model<br/>200-500ms"]
    Processing --> Results["Results display"]
    Results --> PrimaryEmotion["Primary Emotion: Joy 95%<br/>All 28 emotions ranked"]
    PrimaryEmotion --> CanDo{"User can:"}
    CanDo --> Details["See more details<br/>by hovering"]
    CanDo --> Clear["Clear and analyze<br/>new text"]
    CanDo --> Export["Export results<br/>future feature"]
    Details --> Repeat{"Repeat?"}
    Clear --> Repeat
    Export --> Repeat
    Repeat -->|Yes| TypeText
    Repeat -->|No| End(["END"])
```

---

## 🛠️ Technical Stack

```
FRONTEND
├── React 18 (UI Framework)
├── TypeScript (Type Safety)
├── Vite (Build Tool)
├── Tailwind CSS (Styling)
├── Lucide React (Icons)
└── Fetch API (HTTP Requests)

BACKEND  
├── FastAPI (Web Framework)
├── Pydantic (Data Validation)
├── PyTorch (ML Framework)
├── Transformers (BERT Model)
└── Uvicorn (ASGI Server)

COMMUNICATION
├── HTTP REST API
├── JSON Request/Response
├── CORS Enabled
└── No authentication (dev mode)
```

---

## 📈 Processing Pipeline

```mermaid
flowchart TD
    Input["🔤 Text Input"] --> Tokenization["Tokenization<br/>Convert text to tokens<br/>Special tokens: [CLS] [SEP] etc"]
    Tokenization --> Embedding["Embedding<br/>Convert tokens to vectors<br/>768-dimensional embeddings"]
    Embedding --> BERT["BERT Processing<br/>12-layer transformer<br/>Self-attention mechanisms<br/>Contextual understanding"]
    BERT --> Classification["Classification Head<br/>28 emotion output nodes<br/>Logits calculated"]
    Classification --> Softmax["Softmax Normalization<br/>Convert logits to probabilities<br/>Sum to 1.0"]
    Softmax --> Results["📊 Results"]
    Results --> TopEmotion["Top emotion argmax"]
    Results --> Confidence["Confidence score"]
    Results --> AllEmotions["All 28 emotion probabilities"]
    AllEmotions --> Display["Display to user"]
    
    Time["⏱️ Total Time: 200-500ms per request"]
    Display -.-> Time
```

---

## 🔐 Error Handling Flow

```mermaid
flowchart TD
    APICall["📞 API Call Made"] --> Check{"What happens?"}
    
    Check -->|Network Error| NetError["🔴 Catch block<br/>setServerError<br/>Unable to reach server..."]
    NetError --> ShowBanner1["Show error banner"]
    
    Check -->|Server Error 500| ServerError["🔴 Catch block<br/>setServerError<br/>Server error: ..."]
    ServerError --> ShowBanner2["Show error banner"]
    
    Check -->|Validation Error 400| ValError["🔴 Catch block<br/>setServerError<br/>Bad request: ..."]
    ValError --> ShowBanner3["Show error banner"]
    
    Check -->|Empty Text| EmptyCheck["Check before API call<br/>Prevent request"]
    
    Check -->|Success 200| Success["✅ Parse response"]
    Success --> UpdateState["Update state"]
    UpdateState --> Display["Display results"]
    
    ShowBanner1 --> End(["User sees error"])
    ShowBanner2 --> End
    ShowBanner3 --> End
    Display --> End
```

---

All diagrams visualize the complete system architecture! 🎭✨
