import { ActivityLog } from '../types/index.js';

export const USER_HISTORY_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '14 min ago',
    type: 'adaptive_probe',
    title: 'Administered Adaptive Probe',
    description: 'Diagnosed Gibbs Free Energy & Cell Potential coupling with item discrimination a = 1.82.',
    conceptName: 'Gibbs Energy',
    deltaMetric: 'Uncertainty reduced: σ(θ) 0.52 → 0.38',
    statusBadge: 'uncertain',
  },
  {
    id: 'act-2',
    timestamp: '2 hours ago',
    type: 'misconception_flag',
    title: 'Possible Misconception Flagged',
    description: 'Pattern identified: E°cell and ΔG° sign coupling conflict detected with moderate confidence.',
    conceptName: 'Cell Potential',
    statusBadge: 'developing',
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday',
    type: 'mastery_promotion',
    title: 'Prerequisite Validated',
    description: 'Enthalpy (ΔH) verified with high statistical reliability across 14 independent test items.',
    conceptName: 'Enthalpy (ΔH)',
    deltaMetric: 'Mastery: 72% → 84%',
    statusBadge: 'strong',
  },
  {
    id: 'act-4',
    timestamp: '2 days ago',
    type: 'diagnostic_update',
    title: 'Insufficient Evidence Flagged',
    description: 'Faraday’s Law observed with only 1 item. Model withheld mastery score to prevent premature low score label.',
    conceptName: 'Faraday’s Law',
    deltaMetric: 'Status: Insufficient Evidence',
    statusBadge: 'insufficient_evidence',
  }
];

export const USER_NEW_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-new-1',
    timestamp: 'Just now',
    type: 'diagnostic_update',
    title: 'Learner Diagnostic Profile Created',
    description: 'Account initialized with non-informative prior distribution θ ~ N(0, 1.44).',
    conceptName: 'Thermodynamics Foundations',
    deltaMetric: 'Prior σ(θ) = 1.20',
    statusBadge: 'insufficient_evidence',
  }
];
