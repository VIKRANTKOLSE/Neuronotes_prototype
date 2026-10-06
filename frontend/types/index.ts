export type MasteryStatus = 
  | 'strong' 
  | 'developing' 
  | 'uncertain' 
  | 'weak' 
  | 'insufficient_evidence';

export type ConfidenceTier = 
  | 'Insufficient evidence'
  | 'Emerging pattern'
  | 'Moderate'
  | 'Strong evidence';

export interface Concept {
  id: string;
  name: string;
  subject: string;
  domain: string;
  estimatedMastery: number; // 0-100
  confidenceScore: number;  // 0-100 (statistical confidence / 1 - variance)
  status: MasteryStatus;
  prerequisites: string[];  // IDs of prerequisite concepts
  dependents: string[];     // IDs of downstream concepts
  totalResponses: number;
  correctResponses: number;
  incorrectResponses: number;
  evidenceSummary: string;
  isWeakVsInsufficient: 'weak' | 'insufficient' | 'mastered' | 'developing';
  possibleMisconception?: {
    title: string;
    description: string;
    confidence: ConfidenceTier;
    evidenceText: string;
  };
  recommendedAction: string;
  position: { x: number; y: number };
  level: number; // 1 to 6 depth in DAG
}

export interface QuestionOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
  isMisconceptionDistractor?: boolean;
  misconceptionRationale?: string;
}

export interface Question {
  id: string;
  conceptId: string;
  conceptName: string;
  subject: string;
  stem: string;
  contextNotation?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  diagnosticRationale: {
    uncertaintyReason: string;
    recentDifficultyReason: string;
    prerequisiteReason: string;
    informationGainReason: string;
    fisherInformation: number;
    estimatedTheta: number; // ability estimate θ (-3.0 to +3.0)
    standardError: number;   // σ(θ)
    itemDiscrimination: number; // a parameter
    itemDifficulty: number;     // b parameter
    prerequisiteCoverageIndex: number;
    utilityScore: number;
  };
}

export interface MisconceptionItem {
  id: string;
  conceptId: string;
  conceptName: string;
  title: string;
  statement: string;
  evidence: string;
  confidence: ConfidenceTier;
  recommendedAction: string;
  targetedQuestionsCount: number;
  affectedPrerequisites: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'diagnostic_update' | 'adaptive_probe' | 'misconception_flag' | 'mastery_promotion';
  title: string;
  description: string;
  conceptName: string;
  deltaMetric?: string;
  statusBadge: MasteryStatus;
}

export interface SubmissionPayload {
  questionId: string;
  selectedOptionId: string;
  latencySeconds: number;
}

export interface SubmissionResult {
  isCorrect: boolean;
  explanation: string;
  conceptTested: string;
  newEstimatedMastery: number;
  nextQuestionConcept: string;
  triggeredMisconception?: MisconceptionItem;
  thetaUpdate?: {
    priorTheta: number;
    newTheta: number;
    standardErrorDelta: number;
  };
}
