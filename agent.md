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
4. **Backend API Contract Integrity**: The frontend communicates via `frontend/services/api.ts` with the Node.js Express + TypeScript backend on `http://localhost:8000` (`NEXT_PUBLIC_API_URL`) using `X-User-Id` request context headers.
5. **Strict Single Notes Summary Per Session**: Each test session has strictly **only one notes summary** (`test.notes = [sessionSummaryNote]`).
   - Parts with mistakes MUST be formatted in **bold** (`**Concept with Mistake**`, `**Error Analysis**`, `**Elongated Diagnostic Breakdown**`, `**Remediation Rule**`) and **elongated in explanation** (derivation, quotient placement, physical mechanism).
   - Parts with correct answers MUST be formatted in **normal size in explanation** (`text-xs font-normal`) with concise checkmark (`✓`) summaries.
   - Frontend renders this with `StructuredSessionNoteRenderer` across both the Session Inspector and the Diagnostic Notes tab.

---

## 2. Directory & Component Architecture

```
IPD_prototype/
├── backend/                          # Express + TypeScript Psychometric Backend (port 8000)
│   ├── src/
│   │   ├── data/                     # In-memory stores (users, tests, notes, questions, concepts)
│   │   │   ├── notes.ts              # Single structured notes summaries per session
│   │   │   ├── tests.ts              # Historical test sessions linked to 1 note summary each
│   │   │   └── users.ts              # Dual-user data (user-new vs user-history)
│   │   ├── routes/                   # REST endpoints (auth, tests, notes, questions, concepts, etc.)
│   │   ├── services/                 # MIRT 2PL psychometrics & testService (session notes synthesis)
│   │   ├── types/                    # Backend TypeScript models (User, PastTestSession, TestNote, etc.)
│   │   └── index.ts                  # Express app setup, CORS, X-User-Id header handling
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout (Inter & JetBrains Mono, ClientLayout)
│   │   ├── globals.css               # Tailwind base, dark/light theme tokens
│   │   ├── page.tsx                  # Route: / (Dashboard / Next Best Action)
│   │   ├── practice/page.tsx         # Route: /practice (Adaptive & manual selection)
│   │   ├── quiz/page.tsx             # Route: /quiz (Adaptive item runner & Explainable AI)
│   │   ├── knowledge-map/page.tsx    # Route: /knowledge-map (Prerequisite DAG & Concept Drawer)
│   │   ├── progress/page.tsx         # Route: /progress (Psychometric MIRT telemetry & logs)
│   │   ├── review/page.tsx           # Route: /review (Misconceptions registry & drills)
│   │   └── tests/page.tsx            # Route: /tests (Past tests & structured diagnostic notes)
│   │
│   ├── components/
│   │   ├── layout/                   # Sidebar, Header, ClientLayout, Auth Modal
│   │   ├── dashboard/                # DashboardView (Calm scientific light/dark mode)
│   │   ├── practice/                 # PracticeView
│   │   ├── quiz/                     # QuizView
│   │   ├── knowledge-map/            # KnowledgeMapView (Non-overlapping SVG DAG)
│   │   ├── progress/                 # ProgressView
│   │   ├── review/                   # ReviewView
│   │   ├── tests/
│   │   │   └── PastTestsView.tsx     # Past tests inspector + StructuredSessionNoteRenderer
│   │   ├── mastery/                  # MasteryBadge, ConfidenceMeter
│   │   └── modals/                   # MisconceptionModal, LoginModal
│   │
│   ├── services/
│   │   └── api.ts                    # REST client with X-User-Id context & mock fallback
│   ├── types/
│   │   └── index.ts                  # Canonical frontend TypeScript interfaces
│   ├── lib/
│   │   └── mockData.ts               # Standalone fallback data model
│   ├── .env.local                    # NEXT_PUBLIC_API_URL=http://localhost:8000
│   └── package.json
│
├── agent.md                          # Persistent agent guide & technical invariants
├── design.md                         # Comprehensive system architecture & entity model
├── history.md                        # Project changelog & version records
└── Readme.md                         # Project overview, installation, & usage
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

export interface TestNote {
  id: string;
  testId?: string;
  userId: string;
  title: string;
  conceptId: string;
  conceptName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  content: string; // Structured note: bold elongated mistakes + normal size correct parts
}

export interface PastTestSession {
  id: string;
  userId: string;
  title: string;
  timestamp: string;
  durationSeconds: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  topicsTested: string[];
  thetaStart: number;
  thetaEnd: number;
  questions: PastTestQuestionResult[];
  notes: TestNote[]; // Strictly 1 notes summary per session
}
```

---

## 4. Knowledge Map 4-Tier Dependency DAG Architecture

The knowledge dependency system is grounded strictly in the project's canonical `dependencies_mapping.docx` source of truth:
* **Canonical Node Count**: Exactly **58 concepts** across 4 conceptual tiers.
* **Canonical Directed Edges**: Exactly **67 directed prerequisite edges** (`source` = prerequisite, `target` = dependent).
* **Tier Structure**:
  - **Tier 1 (Foundation)**: 10 nodes (Atomic parameters, orbital penetration, lattice energy, etc.)
  - **Tier 2 (Core Mechanisms)**: 13 nodes (Periodic trends, VSEPR, hybridization, Fajan's rule, etc.)
  - **Tier 3 (Derived Chemical Behavior)**: 17 nodes (Inert pair effect, lanthanoid contraction, d-block stability, etc.)
  - **Tier 4 (Complex Systems)**: 18 nodes (Coordination fields, crystal field splitting & stabilization energy, high/low-spin complexes, etc.)
* **SVG DAG Canvas Parameters**:
  - `NODE_WIDTH = 250px`, `NODE_HEIGHT = 82px`.
  - `CANVAS_WIDTH = 1420px`, `CANVAS_HEIGHT = 2100px`.
  - Column X-offsets: Tier 1 at `x: 60px`, Tier 2 at `x: 400px`, Tier 3 at `x: 740px`, Tier 4 at `x: 1080px`.
  - Cubic Bezier vector math:
    - Start (Prerequisite right anchor): `(conn.from.position.x + NODE_WIDTH, conn.from.position.y + NODE_HEIGHT / 2)`
    - End (Dependent left anchor): `(conn.to.position.x, conn.to.position.y + NODE_HEIGHT / 2)`
    - Curve: `M (x1, y1) C (x1 + dx, y1), (x2 - dx, y2), (x2, y2)` with `dx = |x2 - x1| * 0.55`.

---

## 5. Theme System (Dark / Light Mode)

* **Mode Mechanism**: Handled via `document.documentElement.classList.add('dark' | 'light')` and persisted in `localStorage('neuronotes-theme')`.
* **Default**: `dark`.
* **Light Mode Guidelines ("Calm Scientific Workspace")**:
  - Background: Soft neutral `#F6F8FA`, cards in elevated white `#FFFFFF` with `#E2E8F0` micro-borders.
  - Text: Deep slate `#0F172A` for headers, `#334155` for high-readability body, `#64748B` for secondary labels.
  - Visual Fatigue Prevention: Avoid raw `#000000` text on glaring `#FFFFFF` expanses; use soft neutral borders and subdued surfaces.
* **Switching**: Accessible via `Header.tsx` and `Sidebar.tsx`.

---

## 6. Common Developer Commands

```bash
# 1. Run Backend Service (Express + TypeScript on port 8000)
cd backend
npm run dev

# 2. Run Frontend Next.js App (Next.js 14 on port 3000)
cd frontend
npm run dev

# 3. Typecheck Frontend & Backend
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit

# 4. Production Build Validation
cd frontend
npm run build
```
