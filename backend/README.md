# Neuronotes — Backend Specification (FastAPI)

This directory is reserved for the Python **FastAPI** backend powering the psychometric learner model (MIRT & Bayesian Knowledge Tracing).

## API Contracts Expected by Next.js Frontend

The frontend communicates with this backend at `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL` in `frontend/.env.local`).

### 1. `GET /api/concepts`
- **Description**: Returns all concepts with current psychometric mastery & confidence state.
- **Response**: `List[Concept]`

### 2. `GET /api/concepts/{concept_id}`
- **Description**: Returns a single concept by ID.
- **Response**: `Concept`

### 3. `GET /api/questions/adaptive?concept_id={optional_id}`
- **Description**: Evaluates current latent ability $\theta$, item parameters ($a, b, c$), and Fisher Information to return the optimal next diagnostic question.
- **Response**: `Question`

### 4. `POST /api/submissions`
- **Description**: Submits a learner response for MIRT evaluation and misconception pattern matching.
- **Request Body**:
  ```json
  {
    "questionId": "q101",
    "selectedOptionId": "b",
    "durationSeconds": 42
  }
  ```
- **Response**:
  ```json
  {
    "isCorrect": true,
    "explanation": "...",
    "conceptTested": "Gibbs Energy",
    "newEstimatedMastery": 82,
    "nextQuestionConcept": "Nernst Equation",
    "triggeredMisconception": null,
    "thetaUpdate": {
      "priorTheta": 0.45,
      "newTheta": 0.63,
      "standardErrorDelta": -0.06
    }
  }
  ```

### 5. `GET /api/misconceptions`
- **Description**: Returns active flagged misconception patterns with Bayesian confidence ratings.
- **Response**: `List[MisconceptionItem]`

### 6. `GET /api/activities`
- **Description**: Returns recent learner evaluation events and standard error telemetry.
- **Response**: `List[ActivityLog]`

---

## Recommended Tech Stack
- **Framework**: FastAPI + Uvicorn
- **Validation**: Pydantic v2
- **Psychometrics**: NumPy / SciPy for MIRT estimation ($P(\theta)$, Fisher Information $I(\theta)$)
- **Database**: PostgreSQL (or SQLite for prototype) with asyncpg / SQLAlchemy
