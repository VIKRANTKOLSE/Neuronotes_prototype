import { Question, SubmissionPayload, SubmissionResult } from '../types/index.js';
import { QUESTIONS_DATABASE } from '../data/questions.js';
import { UserService } from './userService.js';
import { 
  updateBayesianAbility, 
  selectOptimalAdaptiveQuestion,
  thetaToMasteryPercentage 
} from '../psychometrics/mirtEngine.js';

export class AdaptiveService {
  /**
   * Selects next optimal adaptive question for the learner
   */
  static getAdaptiveQuestion(userId?: string, conceptId?: string): Question {
    const user = UserService.getUser(userId);
    return selectOptimalAdaptiveQuestion(QUESTIONS_DATABASE, user.estimatedTheta, conceptId);
  }

  /**
   * Process item submission, update MIRT parameters, concept stats, and misconception flags
   */
  static processSubmission(payload: SubmissionPayload, userId?: string): SubmissionResult {
    const user = UserService.getUser(payload.userId || userId);
    const question = QUESTIONS_DATABASE.find(q => q.id === payload.questionId) || QUESTIONS_DATABASE[0];

    const isCorrect = payload.selectedOptionId === question.correctOptionId;
    const selectedOption = question.options.find(o => o.id === payload.selectedOptionId);

    // MIRT Bayesian ability update
    const mirtUpdate = updateBayesianAbility(
      user.estimatedTheta,
      user.standardError,
      isCorrect,
      question.diagnosticRationale.itemDiscrimination,
      question.diagnosticRationale.itemDifficulty
    );

    const priorTheta = user.estimatedTheta;
    const priorSE = user.standardError;
    user.estimatedTheta = mirtUpdate.newTheta;
    user.standardError = mirtUpdate.newStandardError;
    user.itemsAnswered += 1;
    user.isNewUser = false;

    // Update global overall mastery
    user.overallMastery = thetaToMasteryPercentage(user.estimatedTheta);
    user.reliabilityScore = Math.min(96, Math.max(20, Math.round((1 - user.standardError / 2.0) * 100)));

    // Update specific concept stats
    const concept = user.concepts.find(c => c.id === question.conceptId);
    let newConceptMastery = user.overallMastery;
    if (concept) {
      concept.totalResponses += 1;
      if (isCorrect) {
        concept.correctResponses += 1;
      } else {
        concept.incorrectResponses += 1;
      }
      
      const conceptTheta = user.estimatedTheta + (isCorrect ? 0.1 : -0.1);
      concept.estimatedMastery = thetaToMasteryPercentage(conceptTheta);
      newConceptMastery = concept.estimatedMastery;
      concept.confidenceScore = Math.min(95, Math.round((1 - user.standardError / 2.0) * 100));

      if (concept.totalResponses >= 3) {
        if (concept.estimatedMastery >= 75) {
          concept.status = 'strong';
          concept.isWeakVsInsufficient = 'mastered';
        } else if (concept.estimatedMastery >= 55) {
          concept.status = 'developing';
          concept.isWeakVsInsufficient = 'developing';
        } else if (user.standardError > 0.45) {
          concept.status = 'uncertain';
          concept.isWeakVsInsufficient = 'developing';
        } else {
          concept.status = 'weak';
          concept.isWeakVsInsufficient = 'weak';
        }
      } else {
        concept.status = 'insufficient_evidence';
        concept.isWeakVsInsufficient = 'insufficient';
      }
    }

    // Misconception detection
    let triggeredMisconception = undefined;
    if (!isCorrect && selectedOption?.isMisconceptionDistractor) {
      const match = user.misconceptions.find(m => m.conceptId === question.conceptId);
      if (match) {
        triggeredMisconception = match;
      } else {
        triggeredMisconception = {
          id: `misc-auto-${Date.now().toString(36)}`,
          conceptId: question.conceptId,
          conceptName: question.conceptName,
          title: `Diagnostic Pattern: ${selectedOption.label} Distractor`,
          statement: selectedOption.misconceptionRationale || 'Misconception pattern identified during adaptive probe.',
          evidence: `Selected option ${selectedOption.label} on item ${question.id}.`,
          confidence: 'Emerging pattern' as const,
          recommendedAction: 'Targeted remediation drill recommended.',
          targetedQuestionsCount: 3,
          affectedPrerequisites: [question.conceptId]
        };
        user.misconceptions.push(triggeredMisconception);
      }
    }

    // Add activity log
    user.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      type: triggeredMisconception ? 'misconception_flag' : isCorrect ? 'mastery_promotion' : 'adaptive_probe',
      title: isCorrect ? `Accurate Probe: ${question.conceptName}` : `Diagnostic Pattern: ${question.conceptName}`,
      description: isCorrect 
        ? `Solved item with discrimination a = ${question.diagnosticRationale.itemDiscrimination}. Posterior ability increased.`
        : `Item missed. Standard error reduced by ${(priorSE - user.standardError).toFixed(2)}.`,
      conceptName: question.conceptName,
      deltaMetric: `θ: ${priorTheta.toFixed(2)} → ${user.estimatedTheta.toFixed(2)}`,
      statusBadge: isCorrect ? 'strong' : 'developing'
    });

    return {
      isCorrect,
      explanation: question.explanation,
      conceptTested: question.conceptName,
      newEstimatedMastery: newConceptMastery,
      nextQuestionConcept: 'Gibbs Energy (ΔG)',
      triggeredMisconception,
      thetaUpdate: {
        priorTheta,
        newTheta: user.estimatedTheta,
        standardErrorDelta: parseFloat((user.standardError - priorSE).toFixed(2))
      }
    };
  }
}
