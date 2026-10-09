import { FullUserData } from '../types/index.js';
import { 
  BASELINE_CONCEPTS_TEMPLATE, 
  CALIBRATED_CONCEPTS_HISTORY,
  ZERO_THETA_VECTOR_58,
  CALIBRATED_THETA_VECTOR_58
} from './concepts.js';
import { MISCONCEPTIONS_DATABASE } from './misconceptions.js';
import { USER_HISTORY_ACTIVITIES, USER_NEW_ACTIVITIES } from './activities.js';
import { INITIAL_TESTS_HISTORY } from './tests.js';
import { INITIAL_TEST_NOTES } from './notes.js';

export const USER_NEW: FullUserData = {
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
  thetaVector: [...ZERO_THETA_VECTOR_58],
  concepts: JSON.parse(JSON.stringify(BASELINE_CONCEPTS_TEMPLATE)),
  misconceptions: [],
  activities: JSON.parse(JSON.stringify(USER_NEW_ACTIVITIES)),
  tests: [],
  notes: []
};

export const USER_HISTORY: FullUserData = {
  id: 'user-history',
  name: 'Vikrant Kolse',
  email: 'vikrant.kolse@university.edu',
  major: 'Undergraduate Chemistry (Year 3)',
  avatarInitials: 'VK',
  isNewUser: true,
  overallMastery: 0,
  estimatedTheta: 0.0,
  standardError: 1.20,
  itemsAnswered: 0,
  reliabilityScore: 0,
  statusSummary: 'Unprobed baseline state. Complete adaptive diagnostic probe to begin calibration.',
  thetaVector: [...ZERO_THETA_VECTOR_58],
  concepts: JSON.parse(JSON.stringify(BASELINE_CONCEPTS_TEMPLATE)),
  misconceptions: [],
  activities: [],
  tests: [],
  notes: []
};

export const USERS_STORE: Record<string, FullUserData> = {
  'user-new': USER_NEW,
  'user-history': USER_HISTORY
};
