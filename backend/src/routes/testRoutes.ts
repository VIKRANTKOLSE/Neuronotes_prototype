import { Router, Request, Response } from 'express';
import { TestService } from '../services/testService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET all past tests for user
router.get('/', (req: Request, res: Response) => {
  const tests = TestService.getTests(getUserId(req));
  res.json(tests);
});

// GET single test session with full details and notes
router.get('/:id', (req: Request, res: Response) => {
  const testId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const test = TestService.getTestById(testId, getUserId(req));
  if (!test) {
    return res.status(404).json({ error: `Test session "${testId}" not found` });
  }
  return res.json(test);
});

// POST record new test session
router.post('/', (req: Request, res: Response) => {
  const { 
    title, 
    durationSeconds, 
    score, 
    correctCount, 
    totalQuestions, 
    topicsTested, 
    thetaStart, 
    thetaEnd, 
    questions, 
    notes 
  } = req.body;

  if (!title || totalQuestions === undefined) {
    return res.status(400).json({ error: 'title and totalQuestions are required' });
  }

  const newTest = TestService.recordTestSession({
    userId: getUserId(req) || 'user-history',
    title,
    durationSeconds: durationSeconds || 180,
    score: score !== undefined ? score : Math.round((correctCount / totalQuestions) * 100),
    correctCount: correctCount || 0,
    totalQuestions,
    topicsTested: topicsTested || ['General Chemistry'],
    thetaStart: thetaStart || 0.0,
    thetaEnd: thetaEnd || 0.2,
    questions: questions || [],
    notes: notes || []
  }, getUserId(req));

  return res.status(201).json(newTest);
});

// POST add note directly to test
router.post('/:id/notes', (req: Request, res: Response) => {
  const testId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { title, content, conceptId, conceptName, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const note = TestService.createNote({
    testId,
    title,
    content,
    conceptId,
    conceptName,
    tags
  }, getUserId(req));

  return res.status(201).json(note);
});

export default router;
