import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService.js';

import { CANONICAL_TIERS, CANONICAL_EDGES } from '../data/concepts.js';
import { DiagnosticFlowService } from '../services/diagnosticFlowService.js';

const router = Router();

// Helper to get target user
function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET full dependency graph with tiers, concepts, and explicit directed prerequisite edges
router.get('/graph', (req: Request, res: Response) => {
  const user = UserService.getUser(getUserId(req));
  res.json({
    tiers: CANONICAL_TIERS,
    concepts: user.concepts,
    edges: CANONICAL_EDGES,
    stats: {
      totalConcepts: user.concepts.length,
      totalEdges: CANONICAL_EDGES.length,
      tiersCount: Object.keys(CANONICAL_TIERS).length
    }
  });
});

// GET concept with maximum information gain based on graph connectivity
router.get('/recommended', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const recommendation = DiagnosticFlowService.getRecommendedConcept(userId);
  res.json(recommendation);
});

// GET all concepts ranked by information gain
router.get('/recommendations', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const ranked = DiagnosticFlowService.getRankedRecommendations(userId);
  res.json(ranked);
});

// GET all concepts for user
router.get('/', (req: Request, res: Response) => {

  const user = UserService.getUser(getUserId(req));
  res.json(user.concepts);
});

// GET single concept by ID
router.get('/:id', (req: Request, res: Response) => {
  const user = UserService.getUser(getUserId(req));
  const concept = user.concepts.find(c => c.id === req.params.id);
  if (!concept) {
    return res.status(404).json({ error: `Concept "${req.params.id}" not found` });
  }
  return res.json(concept);
});

export default router;
