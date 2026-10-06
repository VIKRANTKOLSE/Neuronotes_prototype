# Neuronotes — Agent Reference Guide (`agent.md`)

> **Note for Future AI Agents & LLMs:**
> Read this document first before exploring the codebase. It contains the complete architectural map, psychometric domain model, design system tokens, and development conventions to eliminate redundant analysis and token waste.

---

## 1. Executive Summary & Purpose
**Neuronotes** is an adaptive learning system backed by a psychometric learner model (Multidimensional Item Response Theory + Bayesian Knowledge Tracing).

### Core Rules & Invariants
1. **Never gamify childishly**: No confetti, cartoon badges, neon AI gradients, robot mascots, or childish sounds. The audience is serious university students preparing for difficult academic disciplines (e.g., Physical Chemistry, Thermodynamics, Electrochemistry).
2. **Never equate uncertainty with low score**: Low ability ($\theta < 0$ with narrow $\sigma$) is fundamentally distinct from insufficient evidence ($\sigma$ wide due to sparse items). Unprobed topics must display as *"Insufficient evidence / Withheld"*, never as low mastery.
3. **Probabilistic Misconception Phrasing**: Misconceptions must always use probabilistic, non-punitive phrasing (*"Possible misconception"*, *"Emerging pattern"*, *"Confidence: Moderate"*). Never state conclusively that a student "has a flaw" without sufficient Bayesian evidence.
4. **FastAPI Contract Integrity**: The frontend communicates via `frontend/services/api.ts` with a separate FastAPI backend on `http://localhost:8000` (`NEXT_PUBLIC_API_URL`). Never modify backend contracts or relocate FastAPI into Next.js routes.

---

## 2. Directory & Component Architecture

```
frontend/
├── app/                              # Next.js 14 App Router (Server Components by default)
│   ├── layout.tsx                    # Root Server layout (fonts: Inter & JetBrains Mono, ClientLayout)
│   ├── globals.css                   # Tailwind base, dark mode, typography
│   ├── loading.tsx                   # Route-level loading state
│   ├── not-found.tsx                 # Custom 404 page
│   ├── page.tsx                      # Route: / (Dashboard / Next Best Action)
│   ├── practice/page.tsx             # Route: /practice (Adaptive & manual selection)
│   ├── quiz/page.tsx                 # Route: /quiz (Adaptive item runner & Explainable AI)
│   ├── knowledge-map/page.tsx        # Route: /knowledge-map (Prerequisite DAG & Concept Drawer)
│   ├── progress/page.tsx             # Route: /progress (Psychometric MIRT telemetry & logs)
│   └── review/page.tsx               # Route: /review (Misconceptions registry & drills)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Navigation sidebar (uses next/link and next/navigation)
│   │   ├── Header.tsx                # Top header bar, breadcrumbs, theme toggle, profile menu
│   │   └── ClientLayout.tsx          # Client provider managing theme, research mode, modal
│   ├── dashboard/
│   │   └── DashboardView.tsx         # Dashboard UI implementation
│   ├── practice/
│   │   └── PracticeView.tsx          # Adaptive & manual practice configuration UI
│   ├── quiz/
│   │   └── QuizView.tsx              # Interactive quiz runner, timer, option states, "Why this question?"
│   ├── knowledge-map/
│   │   └── KnowledgeMapView.tsx      # SVG DAG visualizer, zoom/filter, inspection drawer
│   ├── progress/
│   │   └── ProgressView.tsx          # Ability spectrum & uncertainty breakdown UI
│   ├── review/
│   │   └── ReviewView.tsx            # Misconceptions registry & remediation launcher
│   ├── mastery/
│   │   ├── MasteryBadge.tsx          # Calibrated status indicator badge
│   │   └── ConfidenceMeter.tsx       # Estimated mastery & confidence interval [min%, max%]
│   └── modals/
│       └── MisconceptionModal.tsx    # Diagnostic pattern alert modal with remediation drill trigger
│
├── services/
│   └── api.ts                        # FastAPI client (GET /api/concepts, POST /api/submissions, etc. with mock fallback)
├── types/
│   └── index.ts                      # Canonical TypeScript interfaces
├── lib/
│   └── mockData.ts                   # Realistic physical chemistry mock dataset
├── public/                           # Static assets
├── .env.local                        # NEXT_PUBLIC_API_URL=http://localhost:8000
├── next.config.mjs                   # Next.js config
├── tailwind.config.js                # Tailwind theme with darkMode: 'class'
├── postcss.config.js                 # CommonJS PostCSS config
├── tsconfig.json                     # Path alias `@/*` -> `./*`
└── package.json                      # Next.js scripts
```

---

## 3. Data Model & Types (`types/index.ts`)

```typescript
export type MasteryStatus = 'strong' | 'developing' | 'uncertain' | 'weak' | 'insufficient_evidence';
export type ConfidenceTier = 'Insufficient evidence' | 'Emerging pattern' | 'Moderate' | 'Strong evidence';

export interface Concept {
  id: string;
  name: string;
  subject: string;
  domain: string;
  estimatedMastery: number; // 0-100
  confidenceScore: number;  // 0-100 (1 - variance)
  status: MasteryStatus;
  prerequisites: string[];  // Parent IDs in DAG
  dependents: string[];     // Child IDs in DAG
  totalResponses: number;
  correctResponses: number;
  incorrectResponses: number;
  evidenceSummary: string;
  isWeakVsInsufficient: 'weak' | 'insufficient' | 'mastered' | 'developing';
  possibleMisconception?: { title: string; description: string; confidence: ConfidenceTier; evidenceText: string };
  recommendedAction: string;
  position: { x: number; y: number }; // Coordinates on DAG canvas
  level: number;
}
```

---

## 4. Knowledge Map DAG Layout Math

To prevent node overlaps in the SVG Knowledge Map visualizer:
* **Node Dimensions**: `NODE_WIDTH = 210px`, `NODE_HEIGHT = 92px`.
* **Canvas Dimensions**: `width: 920px`, `height: 920px`.
* **Connecting Arrows Anchor Math**:
  ```typescript
  const startX = parentNode.position.x + NODE_WIDTH / 2; // Bottom center
  const startY = parentNode.position.y + NODE_HEIGHT;
  const endX = childNode.position.x + NODE_WIDTH / 2;     // Top center
  const endY = childNode.position.y;
  ```
* **Coordinate Grid**:
  - Level 1: `x: 355, y: 40` (Thermodynamics Foundations)
  - Level 2: `x: 150, y: 190` (Enthalpy), `x: 560, y: 190` (Entropy)
  - Level 3: `x: 355, y: 340` (Gibbs Energy)
  - Level 4: `x: 180, y: 490` (Cell Potential), `x: 530, y: 490` (Equilibrium Constant)
  - Level 5: `x: 80, y: 640` (Electrochemistry Cells), `x: 480, y: 640` (Nernst Equation)
  - Level 6: `x: 80, y: 790` (Faraday's Law)

---

## 5. Theme System (Dark / Light Mode)

* **Mode Mechanism**: Handled via `document.documentElement.classList.add('dark' | 'light')` and persisted in `localStorage('neuronotes-theme')`.
* **Default**: `dark`.
* **Light Mode Token Guidelines**:
  - Background: `bg-slate-50`, cards in pure `#FFFFFF` with `border-slate-200` and `shadow-sm`.
  - Text: `text-slate-900` for headings, `text-slate-600` for body, `text-slate-500` for captions.
  - Active Pills: Crisp soft tints (`bg-blue-50 text-blue-700 border-blue-200`).
* **Switching**: Accessible via `Header.tsx` and `Sidebar.tsx`.

---

## 6. Common Developer Commands

```bash
# Navigate to frontend
cd frontend

# Run development server (runs on port 3000)
npm run dev

# Run production build validation
npm run build

# Start production server
npm run start
```
