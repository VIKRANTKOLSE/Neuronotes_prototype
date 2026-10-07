# Neuronotes — System & Psychometric Architecture (`design.md`)

## 1. Executive Overview

**Neuronotes** is an adaptive learning platform designed for high-rigor academic STEM domains (Physical Chemistry, Thermodynamics, and Electrochemistry). Unlike gamified trivia apps or static flashcard systems, Neuronotes is powered by a mathematical learner model based on **Multidimensional Item Response Theory (MIRT)** and **Bayesian Knowledge Tracing**.

This document outlines the end-to-end architecture across the **Next.js 14 App Router** frontend, the **Node.js Express + TypeScript** psychometric backend, the dual-user profile system, and the past tests and diagnostic notes subsystem.

---

## 2. Technology Stack & Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Next.js 14 Frontend                               │
│      React 18 • TypeScript • Tailwind CSS • Lucide Icons • Client/Server    │
│                           Port: 3000 (HTTP)                                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / JSON via services/api.ts
                                       │ Header: X-User-Id
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Node.js Express Psychometric Backend                   │
│      TypeScript • 2PL MIRT Engine • Bayesian Knowledge Tracing • REST API   │
│                           Port: 8000 (HTTP)                                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────┐              ┌────────────────┐              ┌──────────────┐
│  Dual-State  │              │  Psychometric  │              │  Past Tests  │
│ User Models  │              │  Item Engine   │              │   & Notes    │
│ (Elena vs VK)│              │  (2PL IRT / EAP│              │  (Sessions & │
└──────────────┘              └────────────────┘              └──────────────┘
```

| Layer | Technology | Responsibilities |
|---|---|---|
| **Frontend UI** | Next.js 14 (App Router), React 18, Tailwind CSS | Server rendering, interactive DAG visualization, responsive theme toggling (Dark/Light), Explainable AI accordions, and diagnostic test inspect views. |
| **Backend API** | Node.js, Express, TypeScript | REST endpoints on port 8000, multi-user session state, 2PL Item Response calculations, Fisher Information ranking, and diagnostic notes repository. |
| **Psychometric Core** | Custom TypeScript 2PL MIRT Engine | Calculates item characteristic curves $P(\theta)$, Fisher Information $I(\theta)$, Bayesian posterior ability $\hat{\theta}$, and standard error reduction $\sigma(\theta)$. |
| **Data Layer** | In-Memory Object Stores with Type Validation | Multi-tenant user profiles, diagnostic item database, completed test history records, and categorized notes. |

---

## 3. Dual-User State Specification

To evaluate and demonstrate the platform under both greenfield and mature operational conditions, the backend maintains two distinct learner profiles with instant runtime switching:

```
                  ┌────────────────────────────────────────┐
                  │          Active Profile Store          │
                  └───────────────────┬────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ User 1: Elena Rostova (`user-new`)    │   │ User 2: Vikrant Kolse (`user-history`)│
│ • First-Year Physical Sciences        │   │ • Third-Year Chemistry Major          │
│ • State: Baseline Uncalibrated        │   │ • State: Calibrated Diagnostic Profile│
│ • Latent Ability θ: 0.00              │   │ • Latent Ability θ: +0.45             │
│ • Posterior Std Error σ: 1.20 (Wide)  │   │ • Posterior Std Error σ: 0.28 (Narrow)│
│ • Global Mastery: Withheld (0%)       │   │ • Global Mastery: 71%                 │
│ • Items Answered: 0                   │   │ • Items Answered: 54                  │
│ • Past Test Sessions: 0               │   │ • Past Test Sessions: 3 completed     │
│ • Diagnostic Notes: 0                 │   │ • Diagnostic Notes: 5 recorded        │
│ • Concepts: All 9 Insufficient Evid.  │   │ • Concepts: Calibrated breakdown      │
│ • Flagged Misconceptions: 0           │   │ • Flagged Misconceptions: 3 active    │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

### 3.1. Profile 1: Elena Rostova (`user-new`)
- **Use Case**: Cold-start demonstration of an entirely new student entering the adaptive learning platform.
- **Psychometric Behavior**: Because no observations exist, posterior uncertainty is wide ($\sigma = 1.20$). All 9 curriculum concepts are classified as `insufficient_evidence` with mastery scores withheld (0%), adhering strictly to the principle that unprobed knowledge is **never** penalized as failure.
- **Dashboard Next Best Action**: Recommends a baseline diagnostic on **Thermodynamics Foundations** (Root Level 1) to initiate parameter calibration.
- **Past Tests & Notes**: Displays a clean, clinical empty state inviting the learner to administer their first session.

### 3.2. Profile 2: Vikrant Kolse (`user-history`)
- **Use Case**: Mature learner with established longitudinal performance data.
- **Psychometric Behavior**: Narrow standard error ($\sigma = 0.28$) with 54 items administered. Mastery is calibrated at 71% across the prerequisite graph.
- **Active Anomalies**:
  1. High posterior variance on **Gibbs Energy (ΔG)** (63% uncertainty).
  2. Flagged misconception on **Cell Potential (E°cell)**: sign conflation between $\Delta G^\circ$ and $E^\circ_{\text{cell}}$.
  3. Diagnosed weakness on **Nernst Equation** (28% mastery) due to reaction quotient $Q$ inversion.
- **Past Tests & Notes**: 3 detailed past test sessions with question breakdowns, and 5 student-authored diagnostic notes.

---

## 4. Psychometric Engine Architecture

### 4.1. 2-Parameter Logistic (2PL) IRT Model
For an item $j$ with discrimination parameter $a_j$ and difficulty parameter $b_j$, the probability of a correct response $u_j = 1$ given latent ability $\theta$ is:

$$P_j(\theta) = \frac{1}{1 + e^{-a_j(\theta - b_j)}}$$

### 4.2. Fisher Information $I_j(\theta)$
Fisher information quantifies the precision an item provides around the learner's current estimated ability:

$$I_j(\theta) = a_j^2 \cdot P_j(\theta) \cdot (1 - P_j(\theta))$$

The adaptive question selector identifies candidate items that maximize Fisher Information for the learner's current ability $\theta$ or target concepts exhibiting the highest posterior variance.

### 4.3. Bayesian Posterior Ability Update
Following each response $u_j \in \{0, 1\}$, ability $\theta$ and standard error $\sigma(\theta)$ are updated via Bayesian estimation:

$$\text{Posterior Precision} = \frac{1}{\sigma_{\text{prior}}^2} + I_j(\theta)$$

$$\Delta\theta = \frac{a_j (u_j - P_j(\theta))}{\text{Posterior Precision}}$$

$$\sigma_{\text{new}} = \frac{1}{\sqrt{\text{Posterior Precision}}}$$

---

## 5. Past Tests & Diagnostic Notes Subsystem

### 5.1. Domain Entities & Relationships

```
┌─────────────────────────────────┐
│          PastTestSession        │
├─────────────────────────────────┤
│ id: string                      │
│ userId: string                  │
│ title: string                   │
│ timestamp: ISO string           │
│ durationSeconds: number         │
│ score: number (0-100)           │
│ correctCount: number            │
│ totalQuestions: number          │
│ topicsTested: string[]          │
│ thetaStart / thetaEnd: number   │
└──────────────┬──────────────────┘
               │
       1       │ has many
       ├───────┴───────────────┐
       ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ PastTestQuestionReview  │ │        TestNote         │
├─────────────────────────┤ ├─────────────────────────┤
│ questionId: string      │ │ id: string              │
│ conceptId / conceptName │ │ testId?: string (opt)   │
│ stem: string            │ │ userId: string          │
│ contextNotation?: string│ │ title: string           │
│ selectedOptionId / Text │ │ content: string         │
│ correctOptionId / Text  │ │ conceptName?: string    │
│ isCorrect: boolean      │ │ tags: string[]          │
│ explanation: string     │ │ createdAt / updatedAt   │
│ latencySeconds: number  │ └─────────────────────────┘
│ psychometricDelta       │
└─────────────────────────┘
```

### 5.2. Test Review Inspection
When a student opens a past test in `/tests`:
1. **Telemetry Header**: Surfaces score percentage, item ratio, time elapsed, and $\theta$ trajectory ($\theta_{\text{start}} \to \theta_{\text{end}}$).
2. **Item-by-Item Breakdown**:
   - The question stem and chemical context notation (e.g. galvanic cell notation).
   - Side-by-side comparison of the learner's chosen option vs. the mathematically correct option.
   - Comprehensive chemical and thermodynamic rationale explaining the correct derivation.
   - Time spent on that specific item.
3. **Session-Linked Notes**: Notes created specifically during or for that test session are directly surfaced and editable.

### 5.3. Diagnostic Notes Notebook
A dedicated knowledge base accessible under the "Diagnostic Notes" tab allows learners to:
- Search notes across full-text titles, contents, and `#tags`.
- Filter notes by curriculum concept (e.g. Cell Potential, Nernst Equation).
- Create standalone study notes or test-linked notes.
- Edit and delete existing notes with real-time backend synchronization.

---

## 6. REST API Reference

The Express backend listens on `http://localhost:8000` and accepts client identification via the `X-User-Id` HTTP header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend liveness and psychometric engine status. |
| `GET` | `/api/users` | Lists all available user profiles (`user-new` and `user-history`). |
| `GET` | `/api/users/current` | Returns current active user profile and telemetry. |
| `POST` | `/api/users/current` | Switches active user (`{ userId: "user-new" \| "user-history" }`). |
| `GET` | `/api/concepts` | Returns concept graph with mastery & variance for the active user. |
| `GET` | `/api/concepts/:id` | Returns single concept by ID. |
| `GET` | `/api/questions/adaptive` | Returns the optimal diagnostic question using Fisher Information. |
| `POST` | `/api/submissions` | Evaluates learner response, updates Bayesian $\theta$, flags misconceptions. |
| `GET` | `/api/tests` | Lists past completed tests for the active user. |
| `GET` | `/api/tests/:id` | Returns detailed test session with questions and linked notes. |
| `POST` | `/api/tests` | Records a newly completed adaptive test session into user history. |
| `POST` | `/api/tests/:id/notes` | Attaches a new diagnostic note directly to a specific test session. |
| `GET` | `/api/notes` | Returns all diagnostic notes for the user (supports `?search=`, `?conceptId=`). |
| `POST` | `/api/notes` | Creates a new standalone or test-linked diagnostic note. |
| `PUT` | `/api/notes/:id` | Updates an existing note. |
| `DELETE` | `/api/notes/:id` | Deletes a note. |
| `GET` | `/api/misconceptions` | Returns active flagged misconception patterns. |
| `GET` | `/api/activities` | Returns longitudinal activity log feed for the active user. |

---

## 7. Frontend Navigation & Screen Architecture

```
/ (Home / Dashboard)
├── User Switcher (Header Profile Menu: Elena Rostova vs Vikrant Kolse)
├── Next Best Action Card (Dynamic: Thermodynamics baseline vs Gibbs Energy)
├── Knowledge State Distribution Bar (100% Insufficient vs 53% Strong)
└── Possible Misconceptions & Activity Telemetry

/practice
└── Adaptive Session Configurator & Manual Topic Filters

/quiz
├── Live Question Runner (Latex/Chemical Notation & Multiple Choice)
├── Real-Time Submission & MIRT Parameter Feedback
├── Signature Feature: "Why Am I Seeing This Question?" (Explainable AI)
├── Research Mode: Psychometric Parameters (Fisher Info, Theta, SE, a, b)
└── "Save to Past Tests" Modal & Session Note Creator

/knowledge-map
└── Interactive Prerequisite Directed Acyclic Graph (DAG) with Concept Drawer

/progress
└── MIRT Ability Distribution, Standard Error Reduction Curve & Activity Logs

/review
└── Bayesian Misconceptions Registry & 3-Question Remediation Drills

/tests (NEW)
├── Tab 1: Past Test Sessions (Cards, Scores, Detail Inspector, Session Notes)
└── Tab 2: Diagnostic Notes Notebook (Full-text Search, Concept Filters, CRUD)
```

---

## 8. Verification & Running Instructions

### 8.1. Start Express Backend (Port 8000)
```bash
cd backend
npm run dev
```

### 8.2. Start Next.js Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

### 8.3. Verification Checklist
1. Open `http://localhost:3000`.
2. Inspect active profile in top-right menu: click to switch between **Elena Rostova** (New Learner) and **Vikrant Kolse** (Calibrated Learner).
3. Observe how the dashboard, mastery KPI, distribution bar, and next best action dynamically change.
4. Navigate to **Past Tests & Notes** (`/tests`) in the sidebar:
   - For **Vikrant Kolse**: inspect 3 past tests, view question-by-question breakdown, and review 5 diagnostic notes.
   - For **Elena Rostova**: observe clean baseline state with prompt to start adaptive testing.
5. Create, edit, search, and filter diagnostic notes.
6. Run an adaptive quiz session in `/quiz` and click **"Save to Past Tests"** with a custom session note to observe real-time persistence.
