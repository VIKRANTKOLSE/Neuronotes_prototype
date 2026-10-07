# Neuronotes — Psychometric Backend Engine (Node.js & Express)

The **Neuronotes Backend** is built with **Node.js**, **Express**, and **TypeScript**, powering the mathematical psychometric learner model (Multidimensional Item Response Theory + Bayesian Knowledge Tracing).

---

## 🚀 Quick Start

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server with live reload (Port 8000)
npm run dev

# Compile TypeScript
npm run build

# Start production build
npm run start
```

The server listens on **`http://localhost:8000`** by default.

---

## 👥 Dual-User Profiles

The backend supports multi-user context via the `X-User-Id` HTTP request header:

1. **User 1: Elena Rostova (`user-new`)**
   - **Role**: New Learner (Uncalibrated Baseline).
   - **Metrics**: $\theta = 0.00$, $\sigma = 1.20$, 0 items answered, 0 past tests, 0 notes.
   - **Mastery**: Withheld (0%) with all 9 concepts in `insufficient_evidence` state.
2. **User 2: Vikrant Kolse (`user-history`)**
   - **Role**: Longitudinal Learner (Calibrated Diagnostic State).
   - **Metrics**: $\theta = +0.45$, $\sigma = 0.28$, 54 items answered, 3 past tests, 5 diagnostic notes.
   - **Mastery**: 71% calibrated with active misconception detection.

---

## 🔌 API Endpoints Reference

### 1. User Management
- `GET /api/users`: Returns all available user profiles.
- `GET /api/users/current`: Returns active user profile (uses `X-User-Id` header).
- `POST /api/users/current`: Switches active user context (`{ "userId": "user-new" | "user-history" }`).
- `GET /api/users/:id`: Returns specific user details.

### 2. Knowledge Concepts
- `GET /api/concepts`: Returns all DAG concepts with user mastery & confidence scores.
- `GET /api/concepts/:id`: Returns a specific concept by ID.

### 3. Adaptive Question Selection
- `GET /api/questions/adaptive?concept_id={optional_id}`: Evaluates user $\theta$ and returns the question maximizing Fisher Information $I(\theta)$.
- `GET /api/questions`: Returns the diagnostic question pool.

### 4. Response Submissions
- `POST /api/submissions`: Evaluates answer, calculates Bayesian posterior ability update, logs telemetry, and detects misconceptions.

### 5. Past Tests & Sessions
- `GET /api/tests`: Returns list of completed test sessions for the active user.
- `GET /api/tests/:id`: Returns detailed test session with question-by-question breakdown and linked notes.
- `POST /api/tests`: Records a newly completed test session.
- `POST /api/tests/:id/notes`: Attaches a diagnostic note directly to a test session.

### 6. Diagnostic Notes
- `GET /api/notes`: Returns user notes with filtering (`?testId=`, `?conceptId=`, `?search=`).
- `POST /api/notes`: Creates a new diagnostic study note.
- `PUT /api/notes/:id`: Updates an existing note.
- `DELETE /api/notes/:id`: Deletes a note.

### 7. Telemetry & Diagnostics
- `GET /api/misconceptions`: Returns active flagged misconception patterns.
- `GET /api/activities`: Returns longitudinal psychometric activity log.
- `GET /api/health`: Healthcheck endpoint.
