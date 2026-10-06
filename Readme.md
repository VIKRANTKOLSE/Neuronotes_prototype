# Neuronotes — Psychometric Adaptive Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
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
5. **Explainability ("Why am I seeing this question?")**: Every item surfaces its diagnostic reason (uncertainty reduction, targeted remediation, prerequisite sequencing, or information gain).
6. **Research / Admin Mode**: Real-time inspection of underlying psychometric parameters:
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
| **Knowledge Map** | `/knowledge-map` | Interactive prerequisite DAG with non-overlapping hierarchical layout, animated vector paths, status filters, and sliding Concept Inspection drawer. |
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
- **Theme Support**: Seamless 1-click toggle between **Dark Mode** (Deep slate `#0B0F19`) and **Light Mode** (Clinical white/slate `#F8FAFC`), persisted in `localStorage`.

---

## 🏗️ Technical Architecture

```
Browser
  │
  ▼
Next.js 14 Frontend (App Router, Server Components + Interactive Client Views)
  │
  ▼ (HTTP / JSON via services/api.ts with fallback)
FastAPI Backend (Separate Service on port 8000)
  │
  ▼
PostgreSQL & Python Psychometric Engine (MIRT / Bayesian DAG)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm**: v9+

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
cd frontend
npm run build
npm run start
```

### 4. Configuration
Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*Note: If the FastAPI backend is not running, the frontend gracefully falls back to its local psychometric mock model in `lib/mockData.ts`, allowing full standalone demonstration of all features.*

---

## 📄 License
MIT License. Created for the Neuronotes Adaptive Learning Project.
