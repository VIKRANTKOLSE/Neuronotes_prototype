import { Router, Request, Response } from 'express';
import { AdaptiveService } from '../services/adaptiveService.js';
import { SubmissionPayload } from '../types/index.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// POST item submission
router.post('/', (req: Request, res: Response) => {
  const { questionId, selectedOptionId, latencySeconds, durationSeconds } = req.body;

  if (!questionId || !selectedOptionId) {
    return res.status(400).json({ error: 'questionId and selectedOptionId are required' });
  }

  const payload: SubmissionPayload = {
    questionId,
    selectedOptionId,
    latencySeconds: latencySeconds || durationSeconds || 30,
    userId: getUserId(req)
  };

  const result = AdaptiveService.processSubmission(payload, getUserId(req));
  return res.json(result);
});

export default router;
