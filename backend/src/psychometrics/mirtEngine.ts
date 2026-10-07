import { Question } from '../types/index.js';

/**
 * 2-Parameter Logistic (2PL) Item Response Theory probability
 * P(θ) = 1 / (1 + exp(-a * (θ - b)))
 */
export function calculateItemResponseProbability(
  theta: number,
  discrimination_a: number,
  difficulty_b: number
): number {
  const z = discrimination_a * (theta - difficulty_b);
  return 1 / (1 + Math.exp(-z));
}

/**
 * Fisher Information for 2PL model
 * I(θ) = a^2 * P(θ) * (1 - P(θ))
 */
export function calculateFisherInformation(
  theta: number,
  discrimination_a: number,
  difficulty_b: number
): number {
  const p = calculateItemResponseProbability(theta, discrimination_a, difficulty_b);
  return Math.pow(discrimination_a, 2) * p * (1 - p);
}

/**
 * Convert latent ability θ (-3.0 to +3.0) to 0-100 mastery scale
 */
export function thetaToMasteryPercentage(theta: number): number {
  const rawProb = 1 / (1 + Math.exp(-1.5 * theta));
  return Math.round(Math.min(99, Math.max(1, rawProb * 100)));
}

/**
 * Bayesian update of ability θ given response u ∈ {0, 1}
 */
export function updateBayesianAbility(
  priorTheta: number,
  priorStandardError: number,
  isCorrect: boolean,
  discrimination_a: number,
  difficulty_b: number
): {
  newTheta: number;
  newStandardError: number;
  fisherInfo: number;
  deltaTheta: number;
} {
  const p = calculateItemResponseProbability(priorTheta, discrimination_a, difficulty_b);
  const fisherInfo = calculateFisherInformation(priorTheta, discrimination_a, difficulty_b);
  
  // Prior precision (inverse variance)
  const priorPrecision = 1 / Math.max(0.01, Math.pow(priorStandardError, 2));
  
  // Posterior precision
  const posteriorPrecision = priorPrecision + fisherInfo;
  const newStandardError = Math.max(0.12, 1 / Math.sqrt(posteriorPrecision));
  
  // Observation residual: u - P(θ)
  const u = isCorrect ? 1.0 : 0.0;
  const residual = u - p;
  
  // Newton-Raphson step with Bayesian prior damping
  const shift = (discrimination_a * residual) / posteriorPrecision;
  
  // Clamp step size to prevent wild swings on single items
  const clampedShift = Math.max(-0.45, Math.min(0.45, shift));
  const newTheta = Math.max(-3.0, Math.min(3.0, priorTheta + clampedShift));
  
  return {
    newTheta: parseFloat(newTheta.toFixed(2)),
    newStandardError: parseFloat(newStandardError.toFixed(2)),
    fisherInfo: parseFloat(fisherInfo.toFixed(2)),
    deltaTheta: parseFloat(clampedShift.toFixed(2))
  };
}

/**
 * Adaptive question selection based on Fisher Information & Concept Uncertainty
 */
export function selectOptimalAdaptiveQuestion(
  availableQuestions: Question[],
  learnerTheta: number,
  targetConceptId?: string
): Question {
  if (availableQuestions.length === 0) {
    throw new Error('No diagnostic questions available in pool');
  }

  let candidates = availableQuestions;
  if (targetConceptId) {
    const conceptQuestions = availableQuestions.filter(q => q.conceptId === targetConceptId);
    if (conceptQuestions.length > 0) {
      candidates = conceptQuestions;
    }
  }

  // Rank by Fisher Information at current learner θ
  const ranked = candidates.map(q => {
    const info = calculateFisherInformation(
      learnerTheta,
      q.diagnosticRationale.itemDiscrimination,
      q.diagnosticRationale.itemDifficulty
    );
    return { question: q, info };
  });

  ranked.sort((a, b) => b.info - a.info);
  return ranked[0].question;
}
