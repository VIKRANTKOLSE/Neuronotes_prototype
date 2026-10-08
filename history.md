# Neuronotes — Changelog & Revision History (`history.md`)

This file tracks all architectural, design, and implementation changes across the Neuronotes platform.

---

## [v1.6.0] — 2026-10-07
### Canonical 4-Tier Chemistry Dependency Graph & Complete Removal of Fabricated Concepts
- **Removal of Fabricated Mock Data**:
  - Removed all fabricated placeholder thermodynamics concepts (`thermo-01`, `enthalpy-02`, `entropy-03`, `gibbs-04`, `cell-pot-05`, `electro-06`, `eq-const-07`, `nernst-08`, `faraday-09`) from backend, frontend mock data, and dashboard views.
- **Authoritative 4-Tier Chemistry Curriculum Grounding**:
  - Grounded the entire platform strictly in the project's canonical `dependencies_mapping.docx` source of truth across 4 tiers:
    1. **Tier 1 — Foundation** (10 concepts): Atomic parameters, orbital penetration, lattice energy, etc.
    2. **Tier 2 — Core Mechanisms** (13 concepts): Periodic trends, VSEPR, hybridization, Fajan's rule, etc.
    3. **Tier 3 — Derived Chemical Behavior** (17 concepts): Inert pair effect, lanthanoid contraction, d-block stability, etc.
    4. **Tier 4 — Complex Systems** (18 concepts): Coordination fields, crystal field splitting & stabilization energy, high/low-spin complexes, etc.
  - Total: Exactly **58 canonical concepts** and **67 directed prerequisite edges**.
- **Backend Graph API (`backend/src/routes/conceptRoutes.ts`)**:
  - Exposed `GET /api/concepts/graph` returning the complete dependency graph with tiers, nodes, and explicit directed prerequisite edges (`source` = prerequisite, `target` = dependent).
- **Redesigned Prerequisite Knowledge Map (`KnowledgeMapView.tsx`)**:
  - Implemented dual view modes:
    - **Tiered DAG Graph View**: Scalable SVG canvas with 4 tier tracks, cubic Bezier connection vectors, and directional arrow markers.
    - **Curriculum Tier Matrix**: 4-column structured grid with searchable nodes and direct prerequisite/dependent counts.
  - Interactive Selection & Path Tracing:
    - Highlighting a concept illuminates its upstream prerequisites with green/emerald incoming arrows and its downstream dependents with blue outgoing arrows.
    - Added **Curriculum Prerequisite Chain Trace** walking the DAG from foundation to complex systems (e.g. `Metal-Ligand Bonding` → `Ligand Field Theory` → `Crystal Field Splitting` → `Crystal Field Stabilization Energy` → `High-Spin vs Low-Spin Complexes`).
- **Dashboard Next Best Action Alignment**:
  - Updated dashboard to point to canonical root concept `Effective Nuclear Charge` (for baseline learners) and `Crystal Field Stabilization Energy` (for calibrated learners) with real prerequisite dependencies.

---

## [v1.5.0] — 2026-10-07
### Single Notes Summary Per Session with Bold Elongated Mistakes & Light Mode Refinement
- **Single Notes Summary Per Test Session Invariant**:
  - Enforced strictly **one notes summary per test session** (`test.notes = [sessionSummaryNote]`) across both backend and frontend layers.
  - Consolidated all historical session notes (`test-hist-01`, `test-hist-02`, `test-hist-03`) into unified, comprehensive session summaries.
  - Updated backend `recordTestSession` and `createNote` in `backend/src/services/testService.ts` to automatically synthesize a single structured summary note upon test completion, superseding loose multiple notes.
- **Diagnostic Structured Formatting**:
  - **Mistake Sections**: Formatted with **bold text** (`**Concept with Mistake**`, `**Error Analysis**`, `**Elongated Diagnostic Breakdown**`, `**Remediation Rule**`) and **elongated in-depth explanations** detailing underlying physical mechanisms, quotient inversions, and step-by-step mathematical corrections.
  - **Correct Sections**: Formatted in **normal body size** with concise bulleted checkmarks (`✓`) summarizing mastered concepts cleanly without unnecessary elongation.
- **Frontend `StructuredSessionNoteRenderer`**:
  - Implemented `StructuredSessionNoteRenderer` in `frontend/components/tests/PastTestsView.tsx`.
  - Parses structured notes dynamically and renders mistakes inside high-visibility diagnostic alert callouts with bold titles and elongated text blocks.
  - Integrated across both **Tab 1 (Past Test Sessions detail inspector)** and **Tab 2 (Diagnostic Notes catalog)**.
  - Session list reflects `1 Notes Summary` per session card.
- **Calm Scientific Light Mode Refinement**:
  - Overhauled dashboard and application light mode from stark white borders into a soft neutral research workspace (`#F6F8FA` background, `#FFFFFF` cards, `#E2E8F0` micro-borders).
  - Preserved technical psychometric character while significantly reducing visual fatigue.
- **Dual-User Login & Profile Switcher**:
  - Built interactive Login Window modal with instant 1-click authentication and credential autofill for both User 1 (`user-new` / Elena Rostova) and User 2 (`user-history` / Vikrant Kolse).

---

## [v1.4.0] — 2026-10-07
### Node.js Express Psychometric Backend, Dual-User System, Past Tests & Notes
- **Node.js Express + TypeScript Backend (`backend/`)**:
  - Implemented full psychometric backend in `backend/` with Express and TypeScript running on port 8000.
  - Built 2-Parameter Logistic (2PL) MIRT psychometric engine (`calculateItemResponseProbability`, `calculateFisherInformation`, `updateBayesianAbility`, `selectOptimalAdaptiveQuestion`).
  - Added REST API routes: `/api/users`, `/api/concepts`, `/api/questions`, `/api/submissions`, `/api/tests`, `/api/notes`, `/api/misconceptions`, `/api/activities`.
- **Dual-User Architecture**:
  - **User 1 (Elena Rostova / `user-new`)**: Completely new learner profile with 0 tests taken, 0 notes, uncalibrated prior ($\theta = 0.00, \sigma = 1.20$), all 9 concepts in "insufficient evidence" state with mastery withheld.
  - **User 2 (Vikrant Kolse / `user-history`)**: Longitudinal learner profile with 3 past tests, 5 diagnostic notes, 54 items administered, calibrated mastery (71%), and active misconception flags.
  - Seamless profile switcher integrated in the frontend header profile menu and backend `X-User-Id` request context.
- **Past Tests & Diagnostic Notes Subsystem**:
  - Added `/tests` route with dedicated **Past Tests & Notes** screen in Next.js frontend (`frontend/components/tests/PastTestsView.tsx`).
  - **Test History Inspector**: Item-by-item response comparison (student chosen vs. correct answer), duration latency, scientific rationale, and session-linked notes.
  - **Diagnostic Notes Notebook**: Full-text search, concept filter, and create/edit/delete functionality for student study notes.
  - Integrated quiz runner with "Save Session to Past Tests" workflow and inline diagnostic note creator.
- **System Design Documentation**:
  - Authored comprehensive [`design.md`](design.md) in the project root covering system architecture, psychometrics, entity relationship model, and REST API specification.

---

## [v1.3.0] — 2026-10-07
### Dashboard Visual Hierarchy & Premium Design System Refinement
- **Visual System & Aesthetic Overhaul (Linear / Vercel Diagnostic Aesthetic)**:
  - Transitioned from saturated card backgrounds to a restrained, clinical palette (`#F8FAFC` background, `#FFFFFF` surfaces, `#E5E7EB` borders, `#2563EB` solid accent).
  - Replaced the blue-purple gradient treatment on the **Next Best Action** card with a clean, authoritative card with a solid blue left-border indicator (`border-l-4 border-l-blue-600`).
- **High-Visibility Mastery KPI**:
  - Elevated the `71% Estimated Mastery` metric into a prominent KPI block alongside the page header with active calibration indicator and `45 active concepts • 89% reliability`.
- **Next Best Action Card Enhancements**:
  - Elevated `Gibbs Energy (ΔG)` as the dominant action title.
  - Positioned `63% posterior uncertainty` in a visually prominent, semantic purple badge on the top row.
  - Made the prerequisite dependency gating (`Cell Potential` and `Equilibrium Constant`) immediately scannable.
  - Changed CTA wording to `"Start 3 Questions →"`.
- **Unified Knowledge Diagnostic Container**:
  - Replaced four separate heavily-bordered cards with a single unified diagnostic summary container featuring the aligned segmented distribution bar, four lightweight metric columns (`Strong 24`, `Developing 11`, `Uncertain 6`, `Needs attention 4`), and a clear psychometric distinction callout.
- **Sidebar & Header Refinement**:
  - Refined sidebar navigation active state from a bulky card into an understated item with a subtle left accent bar.
  - Removed duplicate theme appearance toggle from the sidebar.
  - Compacted top-right controls into consistent application-state controls (`Model calibrated`, `Research Mode: OFF/ON`, `Light/Dark`, user profile).

---

## [v1.2.2] — 2026-10-07
### Backend Specification & Repository Completeness
- **Backend Directory Infrastructure**:
  - Authored [`backend/README.md`](backend/README.md) documenting the expected FastAPI endpoints, request/response JSON schemas, and MIRT estimation requirements for upcoming backend development.
  - Ensures clean repository structure on GitHub with both `frontend/` and `backend/` fully documented.

---

## [v1.2.1] — 2026-10-07
### Documentation, Repository Organization & Agent Infrastructure
- **Git Organization**:
  - Created root [`.gitignore`](.gitignore) and [`frontend/.gitignore`](frontend/.gitignore) to exclude `node_modules/`, `.next/`, `build/`, `dist/`, and `.env*.local`.
  - Added [`frontend/.env.example`](frontend/.env.example) with `NEXT_PUBLIC_API_URL`.
- **System Documentation**:
  - Rewrote [`Readme.md`](Readme.md) with comprehensive architecture overview, psychometric concepts, screen index, and quickstart commands.
  - Created [`agent.md`](agent.md) as a persistent guide for future AI agents to prevent token waste and redundant exploratory passes.
  - Created [`history.md`](history.md) to record development trajectory.

---

## [v1.2.0] — 2026-10-07
### Full Migration to Next.js App Router
- **Framework Upgrade**:
  - Migrated frontend from Vite SPA to **Next.js 14 App Router** (`app/` directory) using stable release `14.2.35`.
  - Removed legacy Vite artifacts (`vite.config.ts`, `index.html`, `dist/`).
- **Server vs. Client Component Architecture**:
  - Server Components: [`app/layout.tsx`](frontend/app/layout.tsx), [`app/page.tsx`](frontend/app/page.tsx), [`app/practice/page.tsx`](frontend/app/practice/page.tsx), [`app/quiz/page.tsx`](frontend/app/quiz/page.tsx), [`app/knowledge-map/page.tsx`](frontend/app/knowledge-map/page.tsx), [`app/progress/page.tsx`](frontend/app/progress/page.tsx), [`app/review/page.tsx`](frontend/app/review/page.tsx), [`app/loading.tsx`](frontend/app/loading.tsx), [`app/not-found.tsx`](frontend/app/not-found.tsx).
  - Client Components: Isolated inside `components/` with `"use client"` for interactive state (`useState`, `useEffect`, SVG DAG rendering, theme toggle).
- **FastAPI Integration Layer**:
  - Implemented [`services/api.ts`](frontend/services/api.ts) for communication with the FastAPI backend via `NEXT_PUBLIC_API_URL`.
  - Retained offline mock fallback capability in [`lib/mockData.ts`](frontend/lib/mockData.ts) ensuring full functionality even when the backend is offline.
- **Routing**:
  - Integrated `next/link` and `next/navigation` (`usePathname()`) in [`components/layout/Sidebar.tsx`](frontend/components/layout/Sidebar.tsx).
- **Build & Verification**:
  - Executed `next build` successfully (0 errors, 9/9 pages generated).
  - Verified live development server at `http://localhost:3000`.

---

## [v1.1.0] — 2026-10-07
### Knowledge Map Overlap Resolution & Dedicated Light Mode
- **Knowledge Graph Alignment**:
  - Repositioned concept nodes onto a non-overlapping hierarchical grid ($920 \times 920\text{px}$ canvas).
  - Fixed node dimensions to $210 \times 92\text{px}$ with $>140\text{px}$ horizontal branch clearance and $150\text{px}$ vertical tier spacing.
  - Calculated bottom-to-top Bezier connecting vectors $(x + \text{width}/2,\, y + \text{height})$ to $(x + \text{width}/2,\, y)$ eliminating intersecting lines.
- **Dedicated Light Mode**:
  - Added clinical, high-contrast light mode (`bg-slate-50`, `#FFFFFF` cards, `border-slate-200`, `text-slate-900`).
  - Added persistent 1-click theme switchers in [`Header.tsx`](frontend/components/layout/Header.tsx) and [`Sidebar.tsx`](frontend/components/layout/Sidebar.tsx) syncing with `localStorage`.

---

## [v1.0.0] — 2026-10-06
### Initial Foundation & Design System Exploration
- **Design Specification**:
  - Authored [`DESIGN.md`](frontend/DESIGN.md) establishing the Neuronotes scientific visual identity.
  - Chose `Inter` and `JetBrains Mono` fonts, slate dark mode foundations, and calibrated psychometric status colors (Emerald, Amber, Violet, Rose, Neutral Slate).
- **Core Screens Built**:
  - **Screen 1 (Dashboard)**: Next Best Action card, Mastery distribution, Principle notice distinguishing weak knowledge from insufficient evidence, Recent activity.
  - **Screen 2 (Practice)**: Adaptive session launcher and manual topic/difficulty configuration.
  - **Screen 3 (Quiz)**: Chemical cell notation, multi-state answer cards, Explainable AI accordion ("Why am I seeing this question?"), and Research/Admin Mode psychometric parameters.
  - **Screen 4 (Misconception Feedback)**: Dedicated non-punitive modal with Bayesian confidence tiers and targeted drill triggers.
  - **Screen 5 (Knowledge Map)**: Interactive DAG visualizer with status filters and zoom controls.
  - **Screen 6 (Concept Inspection)**: Detail drawer with confidence intervals, prerequisite dependencies, and response history.
