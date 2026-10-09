import {
  Concept,
  Question,
  MisconceptionItem,
  ActivityLog,
  SubmissionPayload,
  SubmissionResult,
  UserProfile,
  PastTestSession,
  PastTestQuestionReview,
  TestNote,
  FullUserData,
  DependencyGraphData
} from '../types';
import { getStoredUsers } from '../lib/auth';
import { 
  CONCEPTS, 
  CANONICAL_TIERS,
  CANONICAL_EDGES,
  QUESTIONS_POOL, 
  MISCONCEPTIONS, 
  RECENT_ACTIVITIES 
} from '../lib/mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class NeuronotesApiService {
  private baseUrl: string;
  private currentUserId: string = 'user-history';

  constructor() {
    this.baseUrl = BASE_URL.replace(/\/$/, '');
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('neuronotes-active-user');
      if (savedUser) {
        this.currentUserId = savedUser;
      }
    }
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('neuronotes-active-user', userId);
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': this.currentUserId,
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
   * Fetch all users — merges registered AuthUsers with the legacy mock UserProfiles
   */
  async getUsers(): Promise<UserProfile[]> {
    const fallbackUsers: UserProfile[] = [
      {
        id: 'user-new',
        name: 'Elena Rostova',
        email: 'elena.rostova@university.edu',
        major: 'First-Year Physical Sciences',
        avatarInitials: 'ER',
        isNewUser: true,
        overallMastery: 0,
        estimatedTheta: 0.0,
        standardError: 1.20,
        itemsAnswered: 0,
        reliabilityScore: 12,
        statusSummary: 'Unprobed baseline state. Complete adaptive diagnostic probe to begin calibration.'
      },
      {
        id: 'user-history',
        name: 'Vikrant Kolse',
        email: 'vikrant.kolse@university.edu',
        major: 'Undergraduate Chemistry (Year 3)',
        avatarInitials: 'VK',
        isNewUser: false,
        overallMastery: 71,
        estimatedTheta: 0.45,
        standardError: 0.28,
        itemsAnswered: 54,
        reliabilityScore: 89,
        statusSummary: 'Model calibrated. Gibbs Energy has posterior uncertainty; Nernst Equation requires targeted review.'
      }
    ];

    const serverUsers = await this.request<UserProfile[]>('/api/users', { method: 'GET' }, []);
    const registered = getStoredUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      major: 'Registered Learner',
      avatarInitials: u.avatarInitials,
      isNewUser: false,
      overallMastery: 0,
      estimatedTheta: 0.0,
      standardError: 1.0,
      itemsAnswered: 0,
      reliabilityScore: 0,
      statusSummary: 'New account — complete the adaptive diagnostic to begin calibration.',
    }));

    const merged = [...registered];
    for (const fu of fallbackUsers) {
      if (!merged.find(u => u.id === fu.id)) merged.push(fu);
    }
    for (const su of serverUsers) {
      if (!merged.find(u => u.id === su.id)) merged.push(su);
    }
    return merged;
  }

  /**
   * Fetch current active user data
   */
  async getCurrentUser(): Promise<FullUserData> {
    return this.request<FullUserData>(`/api/users/current`, { method: 'GET' });
  }

  /**
   * Authenticate user with email and password or userId.
   * Falls back to local auth when the backend is offline (no server running).
   */
  async login(credentials: { email?: string; password?: string; userId?: string }): Promise<{ message: string; token: string; user: FullUserData }> {
    try {
      const res = await this.request<{ message: string; token: string; user: FullUserData }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res?.user?.id) {
        this.setCurrentUserId(res.user.id);
      }
      return res;
    } catch {
      // Offline fallback: resolve seed users or local auth store
      const emailLower = (credentials.email || '').toLowerCase().trim();
      if (emailLower === 'vikrant.kolse@university.edu' || credentials.userId === 'user-history') {
        this.setCurrentUserId('user-history');
        return {
          message: 'Authenticated as Vikrant Kolse',
          token: 'local-user-history',
          user: {
            id: 'user-history',
            name: 'Vikrant Kolse',
            email: 'vikrant.kolse@university.edu',
            major: 'Undergraduate Chemistry (Year 3)',
            avatarInitials: 'VK',
            isNewUser: false,
            overallMastery: 71,
            estimatedTheta: 0.45,
            standardError: 0.28,
            itemsAnswered: 54,
            reliabilityScore: 89,
            statusSummary: 'Model calibrated. Gibbs Energy has posterior uncertainty; Nernst Equation requires targeted review.',
            concepts: CONCEPTS,
            misconceptions: MISCONCEPTIONS,
            activities: RECENT_ACTIVITIES,
            tests: [],
            notes: [],
          }
        };
      }
      if (emailLower === 'elena.rostova@university.edu' || credentials.userId === 'user-new') {
        this.setCurrentUserId('user-new');
        return {
          message: 'Authenticated as Elena Rostova',
          token: 'local-user-new',
          user: {
            id: 'user-new',
            name: 'Elena Rostova',
            email: 'elena.rostova@university.edu',
            major: 'First-Year Physical Sciences',
            avatarInitials: 'ER',
            isNewUser: true,
            overallMastery: 0,
            estimatedTheta: 0.0,
            standardError: 1.20,
            itemsAnswered: 0,
            reliabilityScore: 12,
            statusSummary: 'Unprobed baseline state. Complete adaptive diagnostic probe to begin calibration.',
            concepts: CONCEPTS,
            misconceptions: [],
            activities: [],
            tests: [],
            notes: [],
          }
        };
      }

      const userId = credentials.userId
        || getStoredUsers().find(u => u.email.toLowerCase() === emailLower)?.id
        || credentials.email;

      const localUser = getStoredUsers().find(u => u.id === userId)
        || getStoredUsers().find(u => u.email.toLowerCase() === emailLower);

      if (!localUser) {
        throw new Error('No account found with this email. Please register first.');
      }

      this.setCurrentUserId(localUser.id);
      return {
        message: 'Authenticated locally (backend offline)',
        token: 'local-token-' + localUser.id,
        user: {
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          major: 'Registered Learner',
          avatarInitials: localUser.avatarInitials,
          isNewUser: false,
          overallMastery: 0,
          estimatedTheta: 0.0,
          standardError: 1.0,
          itemsAnswered: 0,
          reliabilityScore: 0,
          statusSummary: 'New account — complete the adaptive diagnostic to begin calibration.',
          concepts: [],
          misconceptions: [],
          activities: [],
          tests: [],
          notes: [],
        },
      };
    }
  }

  /**
   * Terminate active session
   */
  async logout(): Promise<void> {
    try {
      await this.request<{ message: string }>('/api/auth/logout', { method: 'POST' });
    } catch {
      // offline fallback
    }
  }

  /**
   * Switch active user on backend
   */
  async switchUser(userId: string): Promise<void> {
    this.setCurrentUserId(userId);
    try {
      await fetch(`${this.baseUrl}/api/users/current`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (e) {
      console.warn('Backend user switch notification failed, client state updated', e);
    }
  }

  /**
   * Fetch complete knowledge dependency graph with 4 tiers and explicit directed prerequisite edges
   */
  async getDependencyGraph(): Promise<DependencyGraphData> {
    const fallbackData: DependencyGraphData = {
      tiers: CANONICAL_TIERS,
      concepts: CONCEPTS,
      edges: CANONICAL_EDGES,
      stats: {
        totalConcepts: CONCEPTS.length,
        totalEdges: CANONICAL_EDGES.length,
        tiersCount: Object.keys(CANONICAL_TIERS).length
      }
    };
    return this.request<DependencyGraphData>('/api/concepts/graph', { method: 'GET' }, fallbackData);
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
   * Request next adaptive diagnostic question
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
   * Phase 1: Retrieve 3 easy fundamental questions testing basic idea of the concept
   */
  async getFundamentalQuestions(conceptId: string): Promise<Question[]> {
    try {
      const res = await this.request<{ success: boolean; phase: number; count: number; questions: Question[] }>(
        `/api/questions/fundamentals?concept_id=${encodeURIComponent(conceptId)}`,
        { method: 'GET' }
      );
      if (res?.questions && res.questions.length > 0) {
        return res.questions;
      }
    } catch (e) {
      console.warn('Backend fundamental questions failed, using fallback:', e);
    }
    return QUESTIONS_POOL.slice(0, 3);
  }

  /**
   * Phase 2: Retrieve 10 adaptive questions testing concept + interconnected concepts
   */
  async getAdaptiveQuizQuestions(conceptId: string): Promise<Question[]> {
    try {
      const res = await this.request<{ success: boolean; phase: number; count: number; questions: Question[] }>(
        `/api/questions/adaptive-quiz?concept_id=${encodeURIComponent(conceptId)}`,
        { method: 'GET' }
      );
      if (res?.questions && res.questions.length > 0) {
        return res.questions;
      }
    } catch (e) {
      console.warn('Backend adaptive quiz questions failed, using fallback:', e);
    }
    return QUESTIONS_POOL.slice(0, 10);
  }

  /**
   * Retrieve conceptual summary/refresher when user fails Phase 1
   */
  async getConceptSummary(conceptId: string): Promise<any> {
    try {
      const res = await this.request<{ success: boolean; summary: any }>(
        `/api/questions/summary?concept_id=${encodeURIComponent(conceptId)}`,
        { method: 'GET' }
      );
      if (res?.summary) {
        return res.summary;
      }
    } catch (e) {
      console.warn('Backend concept summary failed, using fallback:', e);
    }
    return {
      conceptId,
      conceptName: conceptId,
      domain: 'Inorganic Chemistry',
      tier: 1,
      coreDefinition: `Key conceptual foundation for ${conceptId}. Review electron configuration and governing physical laws.`,
      governingPrinciples: [
        'Atomic and molecular states follow thermodynamic free energy minimization.',
        'Radial distribution functions dictate effective nuclear attraction and shielding.'
      ],
      keyEquations: ['Z_eff = Z - S', 'ΔG = ΔH - TΔS'],
      commonMisconceptions: ['Applying superficial trend heuristics without checking electronic states.'],
      recommendedReview: 'Read the foundational principles and retry the 3-question checkpoint.'
    };
  }

  /**
   * Generate an adaptive diagnostic test powered by Neuronotes Psychometric AI Engine
   */
  async generateAiTest(params?: {
    conceptIds?: string[];
    tier?: number;
    numQuestions?: number;
    userTheta?: number;
    difficulty?: 'adaptive' | 'foundational' | 'advanced';
  }): Promise<Question[]> {
    try {
      const res = await this.request<{ success: boolean; count: number; questions: Question[] }>(
        '/api/ai/generate-test',
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        }
      );
      if (res?.questions && res.questions.length > 0) {
        return res.questions;
      }
    } catch (e) {
      console.warn('AI test generation API unavailable, falling back to pool:', e);
    }
    return QUESTIONS_POOL.slice(0, params?.numQuestions || 5);
  }

  /**
   * Evaluate session with Neuronotes Psychometric AI Engine: find errors, calculate mastery for each and every concept in the knowledge graph, and synthesize structured diagnostic summary
   */
  async evaluateAiSession(payload: {
    questions: PastTestQuestionReview[];
    testId?: string;
    title?: string;
    durationSeconds?: number;
  }): Promise<{
    diagnosticSummary: string;
    conceptMasteryUpdates: Array<{
      conceptId: string;
      conceptName: string;
      tier: number;
      estimatedMastery: number;
      status: string;
    }>;
    summaryNote: TestNote;
    overallMastery: number;
    estimatedTheta: number;
  }> {
    const res = await this.request<{
      success: boolean;
      evaluation: any;
      test: PastTestSession | null;
    }>(
      '/api/ai/evaluate-session',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res.evaluation;
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

  /**
   * Past Tests: Fetch list of tests taken by the user
   */
  async getPastTests(): Promise<PastTestSession[]> {
    return this.request<PastTestSession[]>('/api/tests', { method: 'GET' }, []);
  }

  /**
   * Past Tests: Fetch detailed test session with questions and notes
   */
  async getPastTestById(testId: string): Promise<PastTestSession | null> {
    return this.request<PastTestSession | null>(`/api/tests/${testId}`, { method: 'GET' }, null);
  }

  /**
   * Past Tests: Record a newly finished test session
   */
  async recordTest(testData: Partial<PastTestSession>): Promise<PastTestSession> {
    return this.request<PastTestSession>('/api/tests', {
      method: 'POST',
      body: JSON.stringify(testData)
    });
  }

  /**
   * Diagnostic Notes: Retrieve all notes taken by the user
   */
  async getNotes(filter?: { testId?: string; conceptId?: string; search?: string }): Promise<TestNote[]> {
    let endpoint = '/api/notes';
    const params = new URLSearchParams();
    if (filter?.testId) params.append('testId', filter.testId);
    if (filter?.conceptId) params.append('conceptId', filter.conceptId);
    if (filter?.search) params.append('search', filter.search);
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;

    return this.request<TestNote[]>(endpoint, { method: 'GET' }, []);
  }

  /**
   * Diagnostic Notes: Create a new note
   */
  async createNote(noteData: {
    testId?: string;
    title: string;
    content: string;
    conceptId?: string;
    conceptName?: string;
    tags?: string[];
  }): Promise<TestNote> {
    return this.request<TestNote>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  }

  /**
   * Diagnostic Notes: Add note directly to a specific test
   */
  async addNoteToTest(testId: string, noteData: {
    title: string;
    content: string;
    conceptId?: string;
    conceptName?: string;
    tags?: string[];
  }): Promise<TestNote> {
    return this.request<TestNote>(`/api/tests/${testId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  }

  /**
   * Diagnostic Notes: Update a note
   */
  async updateNote(noteId: string, updates: Partial<Pick<TestNote, 'title' | 'content' | 'tags' | 'conceptId' | 'conceptName'>>): Promise<TestNote> {
    return this.request<TestNote>(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Diagnostic Notes: Delete a note
   */
  async deleteNote(noteId: string): Promise<boolean> {
    try {
      await this.request<{ message: string; id: string }>(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const api = new NeuronotesApiService();
export default api;
