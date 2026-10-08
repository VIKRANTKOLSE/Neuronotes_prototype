# Neuronotes — Psychometric Adaptive Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**Neuronotes** is an adaptive learning system designed for academic rigor, backed by a psychometric learner model based on **Multidimensional Item Response Theory (MIRT)** and **Bayesian Knowledge Tracing**.

Unlike gamified trivia apps or static flashcard platforms, Neuronotes continuously estimates a learner's latent ability ($\theta$), tracks posterior uncertainty ($\sigma$), detects emerging misconception patterns, and navigates prerequisite dependency graphs to select the mathematically optimal next question.

---

## 🔬 Core Adaptive Learning Loop

```
Learner Answers Item
        │
        ▼
Diagnose Latent State (θ & Posterior Variance σ)
        │
        ▼
Update Bayesian Learner Model
        │
        ▼
Detect Possible Conceptual Misconceptions
        │
        ▼
Traverse Prerequisite Knowledge DAG
        │
        ▼
Select Next Best Question (Max Information Gain I(θ))
        │
        ▼
Explain Item Selection Rationale ("Why This Question?")
```

---

## 🧠 Key Product & Psychometric Concepts

1. **Latent Concept Mastery ($\theta$)**: Continuous multidimensional ability estimate calibrated against calibrated item difficulty ($b$) and discrimination ($a$).
2. **Uncertainty ($\sigma_\theta$) vs. Low Score**: Neuronotes explicitly separates **confirmed weak mastery** (narrow confidence interval around low ability) from **insufficient evidence** (wide posterior variance due to sparse observations). Unprobed topics are never penalised as "failures".
3. **Prerequisite Relationships (DAG)**: Knowledge is structured as a Directed Acyclic Graph where foundational competencies gate downstream topics.
4. **Probabilistic Misconception Detection**: Non-punitive Bayesian detection flags emerging patterns (e.g. sign confusion or intensive vs extensive variable conflation) using qualified confidence tiers: *Emerging pattern*, *Moderate*, *Strong evidence*, or *Insufficient evidence*.
5. **Single Notes Summary Per Session**: Every test session synthesizes strictly **one cohesive notes summary**:
   - **Parts with Mistakes**: Formatted in **bold** (`**Concept with Mistake**`, `**Error Analysis**`, `**Elongated Diagnostic Breakdown**`, `**Remediation Rule**`) and **elongated in explanation** detailing underlying thermodynamic/redox derivations and misconception mechanisms.
   - **Parts with Correct Answers**: Formatted in **normal font size** (`text-xs font-normal`) with concise checkmark (`✓`) summaries.
6. **Dual-User Comparative Validation**:
   - **User 1 (Elena Rostova / `user-new`)**: Completely new learner profile with 0 tests taken, 0 notes, uncalibrated prior ($\theta = 0.00, \sigma = 1.20$), all 9 concepts in "insufficient evidence" state with mastery withheld.
   - **User 2 (Vikrant Kolse / `user-history`)**: Longitudinal learner profile with 3 past tests, single notes summaries per session, 54 items administered, calibrated mastery (71%), and active misconception flags.
7. **Research / Admin Mode**: Real-time inspection of underlying psychometric parameters:
   - Fisher Information $I(\theta)$
   - Estimated Ability $\hat{\theta}$
   - Standard Error $\sigma(\theta)$
   - Item Discrimination $a$ & Difficulty $b$
   - Prerequisite Coverage Index & Utility Score

---

## 🖥️ Screen Architecture

| Screen | Route | Description |
|---|---|---|
| **Home / Dashboard** | `/` | Answers *"What should I do next?"* with Next Best Action card, Mastery Breakdown (Strong, Developing, Uncertain, Needs Attention), Principle Notice, and Active Misconceptions. |
| **Practice Selection** | `/practice` | Offers prominent 1-click **Adaptive Practice** and secondary manual curriculum filter. |
| **Active Quiz** | `/quiz` | High-fidelity scientific item runner with chemical notation, accessible cards, instant feedback, Explainable AI accordion, and research metrics. |
| **Past Tests & Notes** | `/tests` | Detailed test session history and diagnostic notes catalog. Features item-by-item response comparison and strictly **one structured notes summary per session** with bold elongated mistakes and normal-size correct concepts. |
| **Knowledge Map** | `/knowledge-map` | Interactive 4-tier chemistry prerequisite dependency DAG (58 canonical concepts across Foundation, Core Mechanisms, Derived Behavior, and Complex Systems; 67 directed prerequisite edges), with dual DAG/Matrix view modes and detailed dependency path tracing. |
| **Progress & Telemetry** | `/progress` | Detailed MIRT parameter distribution, standard error reduction curve, and historical activity logs. |
| **Review & Remediation** | `/review` | Bayesian Misconception Registry with targeted 3-question diagnostic remediation drills. |

---

## 🎨 Design System & Visual Direction

Neuronotes adheres to a calm, clinical, scientific aesthetic inspired by modern medical and productivity software:
- **Typography**: `Inter` for high-clarity UI; `JetBrains Mono` for formulas, notation, and psychometric metrics.
- **Color Semantic System**:
  - **Strong / Mastered**: Emerald (`#10B981`)
  - **Developing**: Amber (`#F59E0B`)
  - **Uncertain (Needs Probing)**: Violet (`#8B5CF6`)
  - **Needs Attention**: Rose (`#F43F5E`)
  - **Insufficient Evidence**: Slate Neutral (`#64748B`)
  - **Misconception Signal**: Diagnostic Ochre/Terracotta (`#FB923C`)
- **Theme Support**: Seamless 1-click toggle between **Dark Mode** (Deep slate `#0B0F19`) and **Light Mode** (Calm scientific neutral `#F6F8FA` surfaces, `#E2E8F0` micro-borders), persisted in `localStorage`.

---

## 🏗️ Technical Architecture

```
Browser
  │
  ▼
Next.js 14 Frontend (App Router, Server Components + Interactive Client Views on port 3000)
  │
  ▼ (HTTP / JSON via services/api.ts with X-User-Id header)
Node.js Express + TypeScript Psychometric Backend (port 8000)
  │
  ├── 2PL MIRT Engine (Item Response, Fisher Information, Bayesian θ update)
  ├── Dual-User In-Memory Store (user-new vs user-history)
  ├── Session Diagnostic Notes Synthesizer (Single note per session)
  └── REST Endpoints (/api/users, /api/tests, /api/notes, /api/concepts, etc.)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm**: v9+

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start Express + TypeScript server on port 8000
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Configuration
A `.env.local` file is located inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

A `.env` file is located inside `backend/`:
```env
PORT=8000
NVIDIA_API_KEY=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
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.2-11b-vision-instruct
```

*Note: The platform features full NVIDIA NIM integration for generating adaptive diagnostic items and performing graph-wide mastery calculations across all 58 concepts in the canonical 4-tier knowledge graph.*

### 5. Production Build Validation
```bash
# Frontend Build
cd frontend
npm run build

# Backend Build
cd backend
npm run build
```

---

## 📄 License
MIT License. Created for the Neuronotes Adaptive Learning Project.
