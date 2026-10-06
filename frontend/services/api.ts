import { 
  Concept, 
  Question, 
  MisconceptionItem, 
  ActivityLog, 
  SubmissionPayload, 
  SubmissionResult 
} from '../types';
import { 
  CONCEPTS, 
  QUESTIONS_POOL, 
  MISCONCEPTIONS, 
  RECENT_ACTIVITIES 
} from '../lib/mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class NeuronotesApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (fallbackData !== undefined) {
        // Fallback to local psychometric model mock data when backend is starting or offline
        return fallbackData;
      }
      throw error;
    }
  }

  /**
   * Fetch all concepts with current psychometric mastery & confidence state
   */
  async getConcepts(): Promise<Concept[]> {
    return this.request<Concept[]>('/api/concepts', { method: 'GET' }, CONCEPTS);
  }

  /**
   * Fetch a single concept by ID
   */
  async getConceptById(conceptId: string): Promise<Concept | null> {
    const fallback = CONCEPTS.find((c) => c.id === conceptId) || null;
    return this.request<Concept | null>(`/api/concepts/${conceptId}`, { method: 'GET' }, fallback);
  }

  /**
   * Request next adaptive diagnostic question from the psychometric item selection engine
   */
  async getAdaptiveQuestion(params?: { conceptId?: string; subject?: string }): Promise<Question> {
    let endpoint = '/api/questions/adaptive';
    if (params?.conceptId) {
      endpoint += `?concept_id=${encodeURIComponent(params.conceptId)}`;
    }
    const fallback = (params?.conceptId 
      ? QUESTIONS_POOL.find((q) => q.conceptId === params.conceptId)
      : null) || QUESTIONS_POOL[0];

    return this.request<Question>(endpoint, { method: 'GET' }, fallback);
  }

  /**
   * Submit learner response for MIRT evaluation & misconception pattern matching
   */
  async submitAnswer(payload: SubmissionPayload): Promise<SubmissionResult> {
    const question = QUESTIONS_POOL.find((q) => q.id === payload.questionId) || QUESTIONS_POOL[0];
    const isCorrect = payload.selectedOptionId === question.correctOptionId;
    const selectedOption = question.options.find((o) => o.id === payload.selectedOptionId);

    const fallbackResult: SubmissionResult = {
      isCorrect,
      explanation: question.explanation,
      conceptTested: question.conceptName,
      newEstimatedMastery: isCorrect ? 82 : 68,
      nextQuestionConcept: 'Gibbs Energy (ΔG)',
      triggeredMisconception: (!isCorrect && selectedOption?.isMisconceptionDistractor) 
        ? MISCONCEPTIONS[0] 
        : undefined,
      thetaUpdate: {
        priorTheta: question.diagnosticRationale.estimatedTheta,
        newTheta: isCorrect ? question.diagnosticRationale.estimatedTheta + 0.18 : question.diagnosticRationale.estimatedTheta - 0.22,
        standardErrorDelta: -0.06,
      }
    };

    return this.request<SubmissionResult>(
      '/api/submissions',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      fallbackResult
    );
  }

  /**
   * Retrieve active flagged misconception patterns
   */
  async getMisconceptions(): Promise<MisconceptionItem[]> {
    return this.request<MisconceptionItem[]>('/api/misconceptions', { method: 'GET' }, MISCONCEPTIONS);
  }

  /**
   * Retrieve psychometric learner log events
   */
  async getRecentActivities(): Promise<ActivityLog[]> {
    return this.request<ActivityLog[]>('/api/activities', { method: 'GET' }, RECENT_ACTIVITIES);
  }
}

export const api = new NeuronotesApiService();
export default api;
