# Neuronotes — Changelog & Revision History (`history.md`)

This file tracks all architectural, design, and implementation changes across the Neuronotes platform.

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
