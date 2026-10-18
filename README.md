# DevTrail AI — Intelligent Web Development Learning Navigator

> An adaptive, high-craft developer education application built by integrating the Google Stitch visual design system with a Python/FastAPI backend powering 10 interactive AI practicals and DAG curriculum pathfinding.

---

## 🌟 Overview & Key Features

DevTrail AI guides students from foundations to an advanced capstone project through an intelligent curriculum graph. The platform adapts to individual learner velocity, enables fast-tracking via diagnostic assessments without repeating lessons, enforces strict prerequisite rules, and demonstrates ten classic and modern Artificial Intelligence paradigms with interactive simulations.

### Visual Source of Truth
The application faithfully implements the Google Stitch design tokens, colors, typography (Plus Jakarta Sans, Inter, JetBrains Mono), spacing, elevations, and layout structures across all six views:
1. **Dashboard:** Live trajectory status, telemetry bento cards, recommended chapter hero, and current vector tracker.
2. **Learning Roadmap:** Directed Acyclic Graph (DAG) pathfinding engine comparing BFS, DFS, and A* with strict topological sort guarantees.
3. **Chapter Detail (Nodes A through G):** Interactive code laboratory console (simulating V8 event loop microtasks vs macrotasks), assignment checkpoints, and 12-minute verified fast-track diagnostics.
4. **AI Labs Catalog:** Grid of all 10 AI practicals with domain filters (Search, Logic, Fuzzy, Neural) and formula tags.
5. **Lab Detail Workbench:** Dedicated interactive experimentation harnesses with real parameter controls, dynamic calculation engines, and plain-language pedagogical explanations.
6. **My Progress & Settings:** Telemetry mastery breakdown, SVG radial gauge (57% default baseline), historical assessment ledger, curriculum pace policy, and 2-step confirmation reset modal (`RESET-ALEX`).

---

## 🏗 Architecture & Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Fast, responsive single-page application with modular routing |
| **Styling** | Tailwind CSS | Configured with exact design tokens extracted from Google Stitch `DESIGN.md` |
| **Icons & Typography** | Google Material Symbols, Plus Jakarta Sans, Inter, JetBrains Mono | Pixel-accurate visual identity |
| **State & Persistence**| React Context + Browser `localStorage` | Automatic state persistence with confirmation reset action |
| **Backend API** | Python 3 + FastAPI + Uvicorn | Modular REST service exposing graph search and AI algorithms |
| **AI Algorithms** | NumPy, SciPy, scikit-fuzzy, Pure Python | Commented, mathematical implementations running without external paid APIs |

---

## 📚 Curriculum Milestones (A through G)

DevTrail AI organizes web engineering milestones along a strict dependency DAG:

- **Node A — Web Foundations & Semantic HTML:** Document anatomy, accessibility primitives (ARIA), SEO, forms, doctypes. (4.0 hrs)
- **Node B — CSS Fundamentals & Box Model:** Box-sizing physics, margin collapsing, specificity hierarchy, modern CSS custom properties. (5.0 hrs)
- **Node C — Responsive Layouts & Grid Systems:** Fluid typography, CSS Subgrid, flexbox alignment axioms, container queries. (6.5 hrs)
- **Node D — JavaScript Fundamentals & Event Loops:** Call stack, microtask queue vs macrotask timer queue, lexical closures, memory retention. (8.0 hrs)
- **Node E — DOM, Events & REST/GraphQL APIs:** Event delegation, bubbling/capturing, reflow minimization, Fetch API, AbortController. (7.5 hrs)
- **Node F — Git, Modern React & Architecture:** Feature branching, React Fiber reconciliation, custom hooks, optimistic UI updates. (9.0 hrs)
- **Node G — Advanced Capstone Project:** Production-grade full-stack web application deployment synthesizing all prior outcomes. (12.0 hrs)
- **Elective Branches:**
  - **Opt-1:** UI Motion & SVG Animation (3.5 hrs)
  - **Opt-2:** TypeScript & Static Type Systems (4.5 hrs)

> **Important Prerequisite Rule:** A shorter path must not bypass an unmet required prerequisite. If a student demonstrates mastery via diagnostic test (score $\ge 80\%$), the prerequisite is satisfied and redundant lessons are bypassed.

---

## 🧪 All Ten AI Practicals

Each lab contains interactive parameter controls, a **Run Experiment** action, dynamic calculations, and plain-language explanations.

### 1. PEAS & Problem Formulation
- **Performance Measure:** Maximize outcome mastery while minimizing redundant hours.
- **Environment:** Partially observable, deterministic, sequential DAG of chapters.
- **Actuators:** Recommend chapter, issue diagnostic bypass, schedule revision scaffolding.
- **Sensors:** Quiz scores, assignment deliverables, confidence self-ratings.
- **Implementation:** Evaluates valid actions from current state, state transitions, goal tests, and path cost functions.

### 2. PROLOG Horn-Clause Prerequisite Rules
- **Prolog Source File:** Included at [`backend/prolog/curriculum_rules.pl`](backend/prolog/curriculum_rules.pl).
- **Rule-Trace Engine:** Python engine simulating backward-chaining Horn-clause resolution matching `can_unlock(Node)`, `capstone_ready`, and `unmet_prerequisites(Node, Missing)`.
- **Displays:** Active query, facts used, inference rules applied, and resolution trace steps.

### 3. BFS & DFS Uninformed Search
- **Breadth-First Search (BFS):** Explores level-by-level using a FIFO queue (`collections.deque`). Guarantees the shortest path in unweighted hops.
- **Depth-First Search (DFS):** Plunges deep along dependencies using a LIFO stack. Demonstrates why DFS does not guarantee the shortest route and may take long elective branches.
- **Safety:** Handles invalid nodes, reverse traversals, and unreachable goals safely.

### 4. A* Informed Heuristic Search
- **Formula:** $f(n) = g(n) + h(n)$
- **g(n):** Accumulated study effort (hours) so far.
- **h(n):** Estimated study effort heuristic to reach Capstone Node G.
- **Adaptive Pruning:** Mastered/bypassed nodes cost 0.0h, computing minimal cognitive effort paths.

### 5. Minimax Game Tree (Code Quest)
- **Scenario:** Turn-based tactical mini-game where the Developer (MAX) maximizes code stability, while Adversary Chaos/Bugs (MIN) injects latency and exceptions.
- **Visualization:** Depth-3 tree computing MAX and MIN nodes, leaf utility scores (-10 to +10), and the optimal decision path guaranteeing maximum minimum utility.

### 6. Fuzzy Logic Controller
- **Inputs:** Quiz Score ($0-100\%$) and Student Confidence ($0-100\%$).
- **Output:** Revision Support Requirement ($0-100\%$).
- **Fuzzy Sets:** Low, Medium, High triangular and trapezoidal membership functions.
- **Inference & Defuzzification:** Evaluates 9 fuzzy IF-THEN rules (handling Dunning-Kruger overconfidence and imposter syndrome) using centroid center-of-gravity defuzzification.

### 7. Mamdani vs. Sugeno Fuzzy Inference
- **Side-by-Side Comparison:** Evaluates identical inputs on both inference models.
- **Mamdani:** Continuous fuzzy output sets with numerical centroid integration.
- **Sugeno (TSK):** Singleton crisp consequences with direct weighted averaging $\frac{\sum w_i z_i}{\sum w_i}$, achieving lower computational complexity.

### 8. Hybrid Neuro-Fuzzy System
- **Neural Layer:** Feedforward synaptic model calculating technical readiness index from synthetic feature vectors (quiz accuracy, assignment ratio, practice frequency).
- **Fuzzy Layer:** Adjusts neural score based on self-reported confidence to prevent overconfidence and imposter gaps.
- **Educational Disclosure:** Prominently notes that data is synthetic and designed for educational illustration.

### 9. Supervised Perceptron & Unsupervised Competitive Learning
- **Supervised Perceptron:** Learns a linear decision boundary using target labels and error-driven weight updates $w \leftarrow w + \eta \cdot (y - \hat{y}) \cdot x$.
- **Unsupervised Competitive Learning:** Winner-Take-All vector clustering discovering natural student archetypes (*Project Builder*, *Conceptual Explorer*, *Fast-Paced Sprinter*) without external grades.

### 10. Micro & Small Language Models (Bigram & Trigram)
- **Corpus:** Bundled local technical text covering HTML, CSS, JavaScript event loops, React, and Git.
- **Bigram (Micro LM):** Calculates $P(w_t \mid w_{t-1})$.
- **Trigram (Small LM):** Calculates $P(w_t \mid w_{t-2}, w_{t-1})$ with graceful backoff.
- **Generation:** Predicts ranked next words and generates short text continuations without calling external AI APIs.

---

## 🚀 Quickstart & Setup Commands

### Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **Python** 3.10+ (tested on Python 3.14)

---

### Windows (Quick Launcher)
Double-click `run-dev.bat` in the project root:
```bat
run-dev.bat
```
This automatically launches both the FastAPI backend and Vite frontend development servers in separate console windows.

---

### Manual Setup (Windows PowerShell / CMD)

#### 1. Backend Setup
```powershell
# Open a terminal in the project root
cd backend

# Install dependencies (FastAPI, Uvicorn, NumPy, SciPy, scikit-fuzzy, pytest)
pip install -r requirements.txt

# Start the FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup
```powershell
# In a second terminal window
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server on port 5173
npm run dev -- --host 127.0.0.1 --port 5173
```
Frontend Web UI will be live at: `http://127.0.0.1:5173/`

---

### Linux / macOS Setup

#### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## 🧪 Running Automated Tests

Run the comprehensive algorithm and routing test suite:
```powershell
# From project root
python -m pytest backend/tests/test_algorithms.py -v
```
All 13 test suites verify:
- Curriculum integrity and node structure
- BFS queue traversal
- DFS stack traversal
- A* effort minimization and study hour savings
- Unreachable / invalid goal safety
- Prolog Horn-clause backward-chaining traces
- Minimax game tree evaluations
- Fuzzy controller boundary conditions
- Mamdani vs Sugeno comparison
- Neuro-fuzzy hybrid synthesis
- Supervised & unsupervised learning pipelines
- Bigram and trigram next-word prediction
- PEAS problem formulation

---

## 📁 Project Directory Structure

```
DevTrail/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application endpoints
│   │   ├── curriculum.py               # Authoritative curriculum DAG & quizzes
│   │   └── algorithms/
│   │       ├── __init__.py
│   │       ├── peas.py                 # Exp 1: PEAS & Problem Formulation
│   │       ├── prolog_demo.py          # Exp 2: Prolog rule-trace engine
│   │       ├── search.py               # Exp 3 & 4: BFS, DFS, A* algorithms
│   │       ├── minimax.py              # Exp 5: Minimax Code Quest game tree
│   │       ├── fuzzy.py                # Exp 6 & 7: Fuzzy controller, Mamdani vs Sugeno
│   │       ├── neuro_fuzzy.py          # Exp 8: Hybrid Neuro-Fuzzy system
│   │       ├── neural_learning.py      # Exp 9: Perceptron & competitive learning
│   │       └── ngram.py                # Exp 10: Bigram & Trigram language models
│   ├── prolog/
│   │   └── curriculum_rules.pl         # Sample Prolog source file
│   ├── tests/
│   │   ├── test_algorithms.py          # Pytest suite (13 passing tests)
│   │   └── verify_live_api.py          # Live endpoint verification script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx             # Stitch-styled sidebar with target card
│   │   │   └── Header.tsx              # Search, backend status & profile
│   │   ├── context/
│   │   │   └── StudentContext.tsx      # State, diagnostics, checkpoints & reset
│   │   ├── data/
│   │   │   └── curriculumData.ts       # Fallback graph & student baseline
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx       # Main student dashboard
│   │   │   ├── RoadmapPage.tsx         # DAG pathfinding & algorithm selector
│   │   │   ├── ChapterDetailPage.tsx   # Code studio, assignments, diagnostic modal
│   │   │   ├── AiLabsPage.tsx          # 10 experiments catalog
│   │   │   ├── LabDetailPage.tsx       # Interactive AI lab workbench
│   │   │   └── ProgressSettingsPage.tsx# Mastery dial, settings & reset modal
│   │   ├── services/
│   │   │   └── api.ts                  # Backend API client with offline fallback
│   │   ├── types/
│   │   │   └── curriculum.ts           # TypeScript interfaces
│   │   ├── App.tsx                     # Main layout & routing controller
│   │   ├── main.tsx
│   │   └── index.css                   # Tailwind directives & Material Symbols
│   ├── index.html                      # Google Fonts & title
│   ├── tailwind.config.js              # Stitch design system tokens
│   ├── postcss.config.js
│   ├── package.json
│   └── tsconfig.json
├── stitch_devtrail_ai_learning_navigator/ # Original Stitch source of truth
├── run-dev.bat                         # Windows quick launcher
├── .env.example
└── README.md
```

---

## 🔒 Privacy & Limitations
- **Zero Paid APIs:** All algorithms run entirely on local CPU using standard Python modules. No cloud LLMs or API keys are required.
- **Synthetic Data:** Student training sets and cluster archetypes are purely synthetic and designed for educational pedagogy.
- **Browser Automation:** If running automated Playwright browser tests in an offline environment without external access to Azure CDN drivers, manual browser verification at `http://127.0.0.1:5173/` or HTTP unit tests should be used.
