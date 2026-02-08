# Sequence Diagrams

## 🔄 Emotion Analysis Flow - Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Browser as React<br/>Frontend
    participant API as FastAPI<br/>Backend
    participant Model as BERT<br/>Model
    
    User->>Browser: Types text in textarea
    Note over Browser: handleAnalyze triggered
    Browser->>Browser: Validate text
    Browser->>Browser: setIsAnalyzing(true)
    Browser->>Browser: setServerError(null)
    
    Browser->>API: POST /analyze<br/>{text: "user input"}
    Note over API: Receive request
    
    API->>API: Parse request body
    API->>Model: Tokenize & prepare tensors
    Model->>Model: Run BERT inference
    Model->>Model: Get logits output
    Model->>Model: Apply softmax
    Model-->>API: Return probabilities
    
    API->>API: Extract top emotion
    API->>API: Format response
    API-->>Browser: 200 OK<br/>{emotion, confidence, scores}
    
    Browser->>Browser: Parse response
    Browser->>Browser: setEmotions(result)
    Browser->>Browser: setIsAnalyzing(false)
    
    Browser->>User: Display results<br/>Primary emotion + 28 spectrum
```

---

## 🔍 Health Check - Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant App as App.tsx
    participant API as api.ts
    participant Server as FastAPI<br/>Server
    
    User->>App: Visit http://localhost:5173
    App->>App: useEffect on mount
    App->>API: checkHealth()
    
    API->>Server: GET http://localhost:8000/
    alt Server Running
        Server-->>API: 200 OK
        API-->>App: {status: ok}
        App->>App: Backend is healthy ✅
    else Server Not Running
        Server--xAPI: Connection refused
        API-->>App: Error
        App->>App: Show error banner ❌
    end
    
    App->>App: Render UI
    App->>User: Display interface
```

---

## ⚠️ Error Handling - Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Browser as React<br/>Frontend
    participant API as api.ts
    participant Backend as FastAPI<br/>Backend
    
    User->>Browser: Click Analyze button
    Browser->>Browser: Check if text empty
    
    alt Text is empty
        Browser->>Browser: Return early
        Browser->>User: No request sent
    else Text has content
        Browser->>Browser: setIsAnalyzing(true)
        Browser->>API: analyzeEmotion(text)
        
        API->>Backend: POST /analyze
        
        alt Success Response
            Backend-->>API: 200 OK<br/>{emotion, confidence, scores}
            API->>API: Parse response
            API-->>Browser: EmotionResult object
            Browser->>Browser: setEmotions(result)
            Browser->>User: Display emotions
        else Bad Request 400
            Backend-->>API: 400 Bad Request<br/>{detail: error}
            API->>API: Extract error message
            API-->>Browser: Throw error
            Browser->>Browser: setServerError(message)
            Browser->>User: Show error banner
        else Server Error 500
            Backend-->>API: 500 Internal Server Error
            API->>API: Catch error
            API-->>Browser: Throw error
            Browser->>Browser: setServerError(message)
            Browser->>User: Show error banner
        else Network Error
            Backend--xAPI: Connection timeout
            API->>API: Catch error
            API-->>Browser: Throw error
            Browser->>Browser: setServerError(message)
            Browser->>User: Show error banner
        end
        
        Browser->>Browser: setIsAnalyzing(false)
    end
```

---

## 🎨 Component Interaction - Sequence Diagram

```mermaid
sequenceDiagram
    participant App as App.tsx
    participant TextInput as TextInput.tsx
    participant EmotionResults as EmotionResults.tsx
    participant API as api.ts
    
    TextInput->>App: onChange event
    Note over App: text state updated
    
    TextInput->>App: onAnalyze callback
    App->>API: analyzeEmotion(text)
    API->>API: Validate & prepare request
    
    par Parallel UI Update
        App->>TextInput: isAnalyzing = true
        TextInput->>TextInput: Show loading disabled
        App->>EmotionResults: isAnalyzing = true
        EmotionResults->>EmotionResults: Show spinner
    end
    
    API->>API: Wait for response
    
    par Response Received
        API-->>App: Result object
        App->>App: setEmotions(result)
        App->>App: setIsAnalyzing(false)
        App->>EmotionResults: New emotions prop
        EmotionResults->>EmotionResults: Re-render with data
    end
    
    TextInput->>App: onClear callback
    App->>App: Clear all state
    App->>TextInput: Reset text
    App->>EmotionResults: Clear emotions
```

---

## 📊 State Update Cycle - Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Component as React<br/>Component
    participant State as React<br/>State
    participant Effect as useEffect<br/>Hook
    participant Render as Re-render
    
    User->>Component: Interact with UI
    Component->>State: Dispatch setState
    State->>State: Update state value
    State->>Effect: State change detected
    Effect->>Effect: Execute effect
    Effect->>Component: Update props/context
    Component->>Render: Schedule re-render
    Render->>Render: Create new VDOM
    Render->>Render: Reconciliation
    Render->>Component: Apply changes to DOM
    Component->>User: Display updated UI
```

---

All sequence diagrams visualize the complete interaction flows! 🔄✨
