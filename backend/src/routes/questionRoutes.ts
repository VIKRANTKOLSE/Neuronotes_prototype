import { Router, Request, Response } from 'express';
import { QUESTIONS_DATABASE } from '../data/questions.js';
import { AdaptiveService } from '../services/adaptiveService.js';
import { DiagnosticFlowService } from '../services/diagnosticFlowService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET Phase 1: 3 Fundamental Questions testing basic idea
router.get('/fundamentals', async (req: Request, res: Response) => {
  const conceptId = (req.query.concept_id as string) || (req.query.conceptId as string) || (req.query.topic as string) || 'effective-nuclear-charge';
  const userId = getUserId(req);

  try {
    const questions = await DiagnosticFlowService.getFundamentalQuestions(conceptId, userId);
    return res.json({
      success: true,
      phase: 1,
      count: questions.length,
      questions
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// GET Phase 2: 10 Adaptive Questions covering concept + connected concepts
router.get('/adaptive-quiz', async (req: Request, res: Response) => {
  const conceptId = (req.query.concept_id as string) || (req.query.conceptId as string) || (req.query.topic as string) || 'effective-nuclear-charge';
  const userId = getUserId(req);

  try {
    const questions = await DiagnosticFlowService.getAdaptiveQuizQuestions(conceptId, userId);
    return res.json({
      success: true,
      phase: 2,
      count: questions.length,
      questions
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// GET Concept Summary / Refresher
router.get('/summary', (req: Request, res: Response) => {
  const conceptId = (req.query.concept_id as string) || (req.query.conceptId as string) || (req.query.topic as string) || 'effective-nuclear-charge';
  try {
    const summary = DiagnosticFlowService.getConceptSummary(conceptId);
    return res.json({
      success: true,
      summary
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

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
