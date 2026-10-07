import { Router, Request, Response } from 'express';
import { QUESTIONS_DATABASE } from '../data/questions.js';
import { AdaptiveService } from '../services/adaptiveService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET adaptive question
router.get('/adaptive', (req: Request, res: Response) => {
  const conceptId = (req.query.concept_id as string) || (req.query.conceptId as string);
  const userId = getUserId(req);

  try {
    const question = AdaptiveService.getAdaptiveQuestion(userId, conceptId);
    return res.json(question);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// GET all questions in pool
router.get('/', (_req: Request, res: Response) => {
  return res.json(QUESTIONS_DATABASE);
});

export default router;
