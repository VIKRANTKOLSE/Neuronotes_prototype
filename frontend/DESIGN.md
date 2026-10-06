# Neuronotes Design System Specification (DESIGN.md)

## 1. Visual Direction & Identity
Neuronotes is an adaptive learning system backed by psychometric item response theory (MIRT / Bayesian knowledge tracing).
Its visual identity embodies:
- **Scientific Rigor & Precision**: Styled like high-end scientific analysis and medical/engineering software rather than a classroom quiz app.
- **Calm, High-Focus Palette**: Deep slate neutrals (`#0B0F19`, `#0F172A`, `#1E293B`) to reduce cognitive fatigue during prolonged analytical practice.
- **Non-Gamified, Diagnostic Feedback**: No confetti, cartoon badges, or punitive red "wrong" banners. Replaced by diagnostic confidence ratings, evidence meters, and prerequisite dependency maps.

---

## 2. Color System
### Neutrals & Surfaces
- Background Primary: `#0B0F19` (Slate 950)
- Background Elevated (Cards/Panels): `#111827` / `#131C2E`
- Surface Subtle: `#1E293B` (Slate 800)
- Surface Border: `#283548` (Slate 750)
- Text Primary: `#F8FAFC` (Slate 50)
- Text Secondary: `#94A3B8` (Slate 400)
- Text Muted: `#64748B` (Slate 500)

### Brand Accent
- Primary Precision Blue: `#2563EB` (Interactive elements, primary actions)
- Primary Glow/Subtle: `rgba(37, 99, 235, 0.12)`

### Psychometric State Semantic Palette
*Crucial: Distinguishes actual low ability from lack of statistical evidence.*
1. **Strong (Confirmed Mastery)**:
   - Stroke/Text: `#10B981` (Emerald 500)
   - Badge Fill: `rgba(16, 185, 129, 0.10)`
   - Border: `rgba(16, 185, 129, 0.30)`
2. **Developing (In Progress)**:
   - Stroke/Text: `#F59E0B` (Amber 500)
   - Badge Fill: `rgba(245, 158, 11, 0.10)`
   - Border: `rgba(245, 158, 11, 0.30)`
3. **Uncertain (High Posterior Variance / Needs Probing)**:
   - Stroke/Text: `#8B5CF6` (Violet 500)
   - Badge Fill: `rgba(139, 92, 246, 0.12)`
   - Border: `rgba(139, 92, 246, 0.35)`
4. **Needs Attention / Weak (Confirmed Gap)**:
   - Stroke/Text: `#F43F5E` (Rose 500)
   - Badge Fill: `rgba(244, 63, 94, 0.10)`
   - Border: `rgba(244, 63, 94, 0.30)`
5. **Insufficient Evidence (Unprobed / Prior Default)**:
   - Stroke/Text: `#94A3B8` (Slate 400)
   - Badge Fill: `rgba(100, 116, 139, 0.12)`
   - Border: `rgba(100, 116, 139, 0.30)`
6. **Possible Misconception (Pattern Flag)**:
   - Stroke/Text: `#FB923C` (Warm Amber/Terracotta)
   - Badge Fill: `rgba(251, 146, 60, 0.10)`
   - Border: `rgba(251, 146, 60, 0.35)`

---

## 3. Typography
- **Headings & Body**: `Inter`, system sans-serif (`-apple-system`, `BlinkMacSystemFont`, `sans-serif`)
- **Metrics, LaTeX, Formulas & Psychometric Parameters**: `JetBrains Mono`, monospace
- Hierarchy:
  - Display: 24px–28px, Semi-Bold (600), -0.02em tracking
  - Section Titles: 16px–18px, Medium (500) / Semi-Bold (600)
  - Body: 14px, Regular (400) / Medium (500), 1.5 line height
  - Meta/Diagnostics: 11px–12px, Medium (500) / Semi-Bold (600), uppercase tracking +0.05em

---

## 4. Component Rules
- **Cards**: Border 1px `border-slate-800/80`, background `bg-slate-900/90`, rounded-xl (`rounded-xl` / 12px), subtle inner highlight.
- **Buttons**:
  - Primary: `bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium transition shadow-sm`
  - Secondary/Outline: `bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg px-4 py-2`
  - Ghost: `text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg px-3 py-1.5`
- **Knowledge Map Nodes**:
  - 180px x 68px rounded rounded-lg nodes.
  - Dual indicators: Mastery fill bar (horizontal) + Confidence ring or variance interval.
  - Hover highlights prerequisite ancestors and downstream dependents with animated glowing vectors.
- **Explainability Box ("Why this question?")**:
  - Collapsible trigger with informational icon and clean diagnostic reason bullet points.
  - Admin/Researcher Mode toggle exposing Fisher Information $I(\theta)$, ability estimate $\hat{\theta}$, and item discrimination $a_i$.
