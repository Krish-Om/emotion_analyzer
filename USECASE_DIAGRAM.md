# Use Case Diagrams

## 🎭 Emotion Analyzer - Use Case Diagram

```mermaid
graph TB
    User["👤 User"]
    
    subgraph System["Emotion Analyzer System"]
        UC1["Analyze Text"]
        UC2["View Results"]
        UC3["Clear Input"]
        UC4["View Emotions List"]
        UC5["Check System Health"]
        UC6["Handle Errors"]
        UC7["View Confidence Score"]
        UC8["Export Results<br/>Future"]
    end
    
    subgraph ExternalSystems["External Systems"]
        BERT["BERT Model"]
        Backend["FastAPI Backend"]
    end
    
    User -->|Primary| UC1
    User -->|Primary| UC2
    User -->|Primary| UC3
    User -->|Secondary| UC4
    User -->|Secondary| UC7
    User -->|Secondary| UC8
    
    UC1 --> Backend
    UC1 --> UC5
    UC5 --> Backend
    UC1 --> UC6
    UC2 --> UC7
    UC2 --> UC4
    UC1 --> BERT
    
    style UC1 fill:#90EE90
    style UC2 fill:#87CEEB
    style UC3 fill:#FFD700
    style UC4 fill:#DDA0DD
    style UC5 fill:#F0E68C
    style UC6 fill:#FFB6C1
    style UC7 fill:#98FB98
    style UC8 fill:#B0C4DE
```

---

## 👥 Actor Interactions - Use Case Diagram

```mermaid
graph TB
    subgraph Actors["System Actors"]
        EndUser["👤 End User"]
        SystemNode["🤖 System"]
        Model["🧠 BERT Model"]
        UI["🖥️ Frontend UI"]
        API["⚙️ Backend API"]
    end
    
    EndUser -->|1. Enters Text| UI
    UI -->|2. Triggers| SystemNode
    SystemNode -->|3. Sends Request| API
    API -->|4. Prepares| Model
    Model -->|5. Predicts| API
    API -->|6. Responds| SystemNode
    SystemNode -->|7. Updates| UI
    UI -->|8. Displays| EndUser
    
    EndUser -->|Clicks Clear| UI
    UI -->|Resets| SystemNode
    SystemNode -->|Clears| UI
    
    SystemNode -->|Monitors| API
    API -->|Reports Health| SystemNode
    
    style User fill:#FFE4E1
    style System fill:#E0FFFF
    style Model fill:#F0E68C
    style UI fill:#E6E6FA
    style API fill:#F5DEB3
```

---

## 📋 Detailed Use Cases - Use Case Diagram

```mermaid
graph TB
    subgraph UseCases["Core Use Cases"]
        A["<b>UC-001</b><br/>Analyze Emotion"]
        B["<b>UC-002</b><br/>View Results"]
        C["<b>UC-003</b><br/>Clear Text"]
        D["<b>UC-004</b><br/>View Spectrum"]
        E["<b>UC-005</b><br/>Check Health"]
        F["<b>UC-006</b><br/>Handle Error"]
        G["<b>UC-007</b><br/>Export Results"]
    end
    
    subgraph ExtensionPoints["Extension Points"]
        X1["Delete History"]
        X2["Save Results"]
        X3["Compare Results"]
        X4["Share Results"]
    end
    
    User["👤 User"]
    Guest["👤 Guest User"]
    Admin["👨‍💼 Admin<br/>Future"]
    
    User -->|Primary| A
    User -->|Primary| B
    User -->|Primary| C
    User -->|Secondary| D
    User -->|Secondary| E
    User -->|Secondary| F
    User -->|Extends| G
    
    Guest -->|Limited| B
    Guest -->|Limited| A
    
    Admin -.->|Manage| E
    
    A -->|includes| E
    B -->|includes| D
    G -->|extends| B
    
    G -->|may include| X1
    G -->|may include| X2
    G -->|may include| X3
    G -->|may include| X4
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#FFD700
    style D fill:#DDA0DD
    style E fill:#F0E68C
    style F fill:#FFB6C1
    style G fill:#B0C4DE
```

---

## 🔄 User Workflow - Use Case Diagram

```mermaid
graph TD
    Start(("🎭 Start"))
    
    A["UC-001<br/>Analyze Text<br/>- User shares emotions<br/>- System validates input<br/>- BERT model processes"]
    
    B["UC-002<br/>Display Results<br/>- Show primary emotion<br/>- Show confidence score<br/>- Display 28 emotions"]
    
    C{"User<br/>Next<br/>Action?"}
    
    D["UC-004<br/>Explore Results<br/>- View emotion details<br/>- Check confidence levels<br/>- See full spectrum"]
    
    E["UC-003<br/>Clear & Repeat<br/>- Clear textarea<br/>- Reset state<br/>- Ready for new analysis"]
    
    F["UC-007<br/>Export<br/>- Export as PDF<br/>- Export as JSON<br/>- Share results"]
    
    G["UC-006<br/>Handle Errors<br/>- Network error<br/>- Server error<br/>- Validation error"]
    
    End(("✅ End"))
    
    Start --> A
    A --> B
    B --> C
    C -->|View Details| D
    C -->|New Analysis| E
    C -->|Export| F
    C -->|Error Occurs| G
    D --> C
    E --> A
    F --> End
    G --> End
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style D fill:#DDA0DD
    style E fill:#FFD700
    style F fill:#B0C4DE
    style G fill:#FFB6C1
    style C fill:#FFFACD
```

---

## 🏗️ System Boundary - Use Case Diagram

```mermaid
graph TB
    subgraph System["🌍 Emotion Analyzer System"]
        UI["Frontend Layer<br/>React Component"]
        Logic["Business Logic<br/>State Management"]
        API["API Layer<br/>HTTP Requests"]
        Backend["Backend Processing<br/>BERT Model"]
        DB["Data Layer<br/>Session State"]
    end
    
    External["External<br/>Dependencies"]
    
    User["👤 User"]
    ExternalAPI["External<br/>Services"]
    
    User -->|Interact| UI
    UI -->|Update| Logic
    Logic -->|Call| API
    API -->|Process| Backend
    Backend -->|Store| DB
    DB -->|Query| Logic
    Backend -->|Depends| External
    External -->|provides| ExternalAPI
    
    style UI fill:#E6E6FA
    style Logic fill:#FFE4E1
    style API fill:#F5DEB3
    style Backend fill:#F0E68C
    style DB fill:#87CEEB
    style System fill:#FFFACD,stroke:#333,stroke-width:3px
```

---

## 📊 Feature Prioritization - Use Case Diagram

```mermaid
graph TB
    subgraph Critical["🔴 Critical - MVP"]
        UC1["Analyze Text"]
        UC2["View Results"]
        UC3["Display Emotions"]
        UC4["Handle Errors"]
    end
    
    subgraph Important["🟡 Important - Phase 2"]
        UC5["Export Results"]
        UC6["Confidence Details"]
        UC7["History View"]
    end
    
    subgraph Nice["🟢 Nice to Have - Phase 3"]
        UC8["Compare Results"]
        UC9["Advanced Analytics"]
        UC10["User Accounts"]
    end
    
    User["👤 User"]
    
    User -->|Must Have| UC1
    User -->|Must Have| UC2
    User -->|Must Have| UC3
    User -->|Must Have| UC4
    
    User -->|Should Have| UC5
    User -->|Should Have| UC6
    User -->|Should Have| UC7
    
    User -->|Could Have| UC8
    User -->|Could Have| UC9
    User -->|Could Have| UC10
    
    style Critical fill:#FFB6C1
    style Important fill:#FFD700
    style Nice fill:#90EE90
```

---

All use case diagrams visualize different perspectives of the system! 🎭✨
