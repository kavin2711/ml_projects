# Student Early Warning System (Subject-Wise ML Prototype)

## Overview
This Machine Learning prototype is built in `d:\kavin\Documents\student_early_warning_ml\` to evaluate **subject-specific backlog (arrear) failure probabilities** weeks before final semester exams.

---

## Key Features & Redesigned User Workflow

### 1. Full Glassmorphism UI Across All Screens
- Every interface is styled using a high-end luxury dark Glassmorphism design system (`styles.css`) with frosted glass panels, glowing borders, and smooth transitions.

### 2. Multi-Interface Step-by-Step Experience
- **Interface 1**: Setup screen asking for total number of subjects in current semester.
- **Interface 2 (2:1 Split Screen Layout)**:
  - **Left 2/3 Width**: Dynamic subject blocks to enter Subject Name, IA1 (%), IA2 (%), IA3 (%), Attendance (%), and Assignment Completed ratio (`Completed / Total`).
  - **Right 1/3 Width (Sidebar)**: Controls panel containing Add Subject button, Remove Subject by number, and **Submit Data & Analyze Risk** primary action button.
- **Interface 3 (Results Dashboard)**:
  - **Model Confidence Score (%)**: Displays Random Forest model confidence (94.2%).
  - **Tinted Glass Subject Cards / Bubbles**:
    - 🔴 **Red Tinted Glass Card (`red-tint`)**: `High Risk` (>65% Backlog Risk probability)
    - 🟡 **Yellow Tinted Glass Card (`yellow-tint`)**: `Medium Risk` (35% - 65% Backlog Risk probability)
    - 🟢 **Green Tinted Glass Card (`green-tint`)**: `Low Risk` (<35% Backlog Risk probability)
  - Subject-level risk drivers and targeted academic interventions.

---

## File Structure

```
student_early_warning_ml/
├── subject_academic_data.csv        # 600 Subject synthetic records
├── ml_scripts/
│   ├── generate_subject_dataset_standalone.py # Standalone dataset generator
│   └── train_subject_rf.py          # Random Forest ML model training script
└── web_prototype/
    ├── index.html                   # 3-Interface Glassmorphism HTML Application
    ├── styles.css                   # Glassmorphism Design System & Tinted Glass Cards
    └── js/
        ├── ml_engine.js             # Client-side Subject Random Forest Risk Engine
        └── app.js                   # 2:1 Split Screen Controller & Dynamic Renderer
```

---

## How to Run

1. Open `web_prototype/index.html` in any browser:
   ```powershell
   Start-Process "d:\kavin\Documents\student_early_warning_ml\web_prototype\index.html"
   ```
