import { Router, Request, Response } from 'express';
import { AiService } from '../services/aiService.js';
import { TestService } from '../services/testService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

/**
 * POST /api/ai/generate-test
 * Generates an adaptive diagnostic test using Neuronotes Psychometric AI Engine
 */
router.post('/generate-test', async (req: Request, res: Response) => {
  try {
    const { conceptIds, tier, numQuestions, userTheta, difficulty } = req.body;
    const questions = await AiService.generateAdaptiveTest({
      conceptIds,
      tier,
      numQuestions: numQuestions ? parseInt(numQuestions, 10) : 5,
      userTheta: userTheta !== undefined ? parseFloat(userTheta) : undefined,
      difficulty
    });
    return res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error: any) {
    console.error('[AiRoutes] Test generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate test' });
  }
});

/**
 * POST /api/ai/evaluate-session
 * Evaluates student answers, identifies errors/misconceptions,
 * calculates mastery for EACH AND EVERY concept in the knowledge graph,
 * and synthesizes an elongated diagnostic mistake summary.
 */
router.post('/evaluate-session', async (req: Request, res: Response) => {
  try {
    const { questions, testId, title, durationSeconds } = req.body;
    const userId = getUserId(req);

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Array of session questions is required' });
    }

    // Call AiService to evaluate errors and calculate mastery across all 58 concepts
    const evaluation = await AiService.evaluateSessionAndCalculateMastery(questions, userId);

    // If testId is provided or saving is requested, record or update the test session
    let recordedTest = null;
    if (testId || title) {
      const correctCount = questions.filter((q: any) => q.isCorrect).length;
      const score = Math.round((correctCount / questions.length) * 100);
      const topics = Array.from(new Set(questions.map((q: any) => q.conceptName)));

      recordedTest = TestService.recordTestSession({
        userId: userId || 'user-history',
        title: title || `AI Evaluated Diagnostic (${topics.slice(0, 2).join(', ')})`,
        durationSeconds: durationSeconds || 180,
        score,
        correctCount,
        totalQuestions: questions.length,
        topicsTested: topics as string[],
        thetaStart: evaluation.estimatedTheta - 0.1,
        thetaEnd: evaluation.estimatedTheta,
        questions,
        notes: [evaluation.summaryNote]
      }, userId);
    }

    return res.json({
      success: true,
      evaluation,
      test: recordedTest
    });
  } catch (error: any) {
    console.error('[AiRoutes] Session evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate session' });
  }
});

export default router;
