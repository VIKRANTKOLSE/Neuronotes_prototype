import { Question, SubmissionPayload, SubmissionResult } from '../types/index.js';
import { QUESTIONS_DATABASE } from '../data/questions.js';
import { UserService } from './userService.js';
import { 
  updateBayesianAbility, 
  selectOptimalAdaptiveQuestion,
  thetaToMasteryPercentage 
} from '../psychometrics/mirtEngine.js';
import { DiagnosticFlowService } from './diagnosticFlowService.js';

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
    const activeUserId = payload.userId || userId;
    const user = UserService.getUser(activeUserId);
    const foundQuestion = DiagnosticFlowService.getQuestionById(payload.questionId);
    let question: Question;
    if (foundQuestion) {
      question = foundQuestion;
    } else {
      const fallbackConcept = payload.questionId.startsWith('fund-')
        ? DiagnosticFlowService.getConcept(payload.questionId.replace(/^fund-/, '').replace(/-\d+.*$/, ''))
        : DiagnosticFlowService.getConcept('effective-nuclear-charge');
      question = {
        id: payload.questionId,
        conceptId: fallbackConcept.id,
        conceptName: fallbackConcept.name,
        subject: fallbackConcept.subject || 'Inorganic Chemistry',
        stem: 'Diagnostic probe',
        options: [
          { id: 'opt-a', label: 'A', text: 'Option A' },
          { id: 'opt-b', label: 'B', text: 'Option B' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Foundational concept rationale.',
        diagnosticRationale: {
          uncertaintyReason: 'Standard diagnostic',
          recentDifficultyReason: 'Calibrated',
          prerequisiteReason: 'Validates prerequisite',
          informationGainReason: 'High info gain',
          fisherInformation: 1.5,
          estimatedTheta: user.estimatedTheta || 0.0,
          standardError: user.standardError || 0.35,
          itemDiscrimination: 1.6,
          itemDifficulty: 0.0,
          prerequisiteCoverageIndex: 0.9,
          utilityScore: 0.9
        }
      };
    }

    const isCorrect = payload.selectedOptionId === question.correctOptionId;
    const selectedOption = question.options?.find(o => o.id === payload.selectedOptionId);
    const priorSE = user.standardError;

    // Update 58-length theta vector and synchronize knowledge graph
    const thetaResult = DiagnosticFlowService.processAnswerAndUpdateTheta(
      activeUserId,
      question.conceptId,
      isCorrect,
      question.diagnosticRationale?.itemDiscrimination || 1.6,
      question.diagnosticRationale?.itemDifficulty || 0.0
    );

    const priorTheta = thetaResult.priorTheta;
    const newConceptMastery = thetaResult.conceptMastery;


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

    UserService.saveUser(user).catch(err => console.error('[AdaptiveService] save error:', err));

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
