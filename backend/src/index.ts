import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import conceptRoutes from './routes/conceptRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import misconceptionRoutes from './routes/misconceptionRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
}));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  const userId = req.headers['x-user-id'] || 'default';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (User: ${userId})`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Neuronotes Psychometric Adaptive Learning Backend',
    engine: 'Multidimensional Item Response Theory (MIRT) + Bayesian Knowledge Tracing'
  });
});

// Route registration
app.use('/api/users', userRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/misconceptions', misconceptionRoutes);
app.use('/api/activities', activityRoutes);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║             NEURONOTES PSYCHOMETRIC BACKEND ENGINE             ║
║  Node.js • Express • TypeScript • 2PL MIRT • Bayesian Tracing  ║
╚════════════════════════════════════════════════════════════════╝
  Status: Active on http://localhost:${PORT}
  Users initialized:
    - User 1: Elena Rostova (user-new)       [Baseline / 0 tests / Uncalibrated]
    - User 2: Vikrant Kolse (user-history)   [History / 3 tests / 5 notes / Calibrated]
  Endpoints:
    - GET  /api/health
    - GET  /api/users
    - GET  /api/users/current
    - POST /api/users/current
    - GET  /api/concepts
    - GET  /api/questions/adaptive
    - POST /api/submissions
    - GET  /api/tests
    - GET  /api/tests/:id
    - POST /api/tests
    - GET  /api/notes
    - POST /api/notes
    - GET  /api/misconceptions
    - GET  /api/activities
`);
});
