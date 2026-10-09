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
  tier?: number;
  tierName?: string;
  estimatedMastery: number; // 0-100
  confidenceScore: number;  // 0-100 (1 - variance)
  status: MasteryStatus;
  prerequisites: string[];  // Parent IDs in DAG
  dependents: string[];     // Child IDs in DAG
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
  level: number;
}

export interface PrerequisiteEdge {
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
  type: 'prerequisite';
}

export interface DependencyGraphData {
  tiers: Record<string, string[]>;
  concepts: Concept[];
  edges: PrerequisiteEdge[];
  stats: {
    totalConcepts: number;
    totalEdges: number;
    tiersCount: number;
  };
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
  userId?: string;
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

export interface TestNote {
  id: string;
  testId?: string;
  userId: string;
  title: string;
  content: string;
  conceptId?: string;
  conceptName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PastTestQuestionReview {
  questionId: string;
  conceptId: string;
  conceptName: string;
  stem: string;
  contextNotation?: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  explanation: string;
  latencySeconds: number;
  psychometricDelta?: {
    priorTheta: number;
    newTheta: number;
    delta: number;
  };
}

export interface PastTestSession {
  id: string;
  userId: string;
  title: string;
  timestamp: string;
  durationSeconds: number;
  score: number; // percentage (0-100)
  correctCount: number;
  totalQuestions: number;
  topicsTested: string[];
  thetaStart: number;
  thetaEnd: number;
  questions: PastTestQuestionReview[];
  notes: TestNote[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  major: string;
  avatarInitials: string;
  isNewUser: boolean;
  overallMastery: number; // 0-100
  estimatedTheta: number;
  standardError: number;
  itemsAnswered: number;
  reliabilityScore: number; // percentage
  statusSummary: string;
  thetaVector: number[]; // 58-dimensional ability vector for canonical concepts in index order
}

export interface FullUserData extends UserProfile {
  concepts: Concept[];
  misconceptions: MisconceptionItem[];
  activities: ActivityLog[];
  tests: PastTestSession[];
  notes: TestNote[];
}
