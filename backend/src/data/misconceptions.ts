import { MisconceptionItem } from '../types/index.js';

export const MISCONCEPTIONS_DATABASE: MisconceptionItem[] = [
  {
    id: 'misc-01',
    conceptId: 'cell-pot-05',
    conceptName: 'Cell Potential (E°cell)',
    title: 'Cell Potential and Gibbs Free Energy Conflation',
    statement: 'You may be treating cell potential and Gibbs free energy as independent quantities rather than recognizing their inverse thermodynamic coupling.',
    evidence: '2 of your last 3 responses suggest this pattern.',
    confidence: 'Moderate',
    recommendedAction: 'Review the relationship ΔG° = -nFE°cell with sign invariance exercises.',
    targetedQuestionsCount: 3,
    affectedPrerequisites: ['gibbs-04', 'cell-pot-05'],
  },
  {
    id: 'misc-02',
    conceptId: 'gibbs-04',
    conceptName: 'Gibbs Energy (ΔG)',
    title: 'Standard ΔG° vs Instantaneous ΔG Spontaneity Criterion',
    statement: 'Using standard state ΔG° rather than instantaneous ΔG (or Q vs K) to determine whether a non-standard reaction proceeds spontaneously.',
    evidence: '3 recent attempts applied ΔG° < 0 as the absolute criterion under varying concentration stresses.',
    confidence: 'Emerging pattern',
    recommendedAction: 'Practice non-standard spontaneity drills contrasting standard potential with current state driving forces.',
    targetedQuestionsCount: 3,
    affectedPrerequisites: ['enthalpy-02', 'entropy-03'],
  },
  {
    id: 'misc-03',
    conceptId: 'nernst-08',
    conceptName: 'Nernst Equation',
    title: 'Reaction Quotient Q Activity Inversion',
    statement: 'Frequently inverting the ratio of ionic activities [Products]/[Reactants] in the logarithmic term of the Nernst equation.',
    evidence: '4 consecutive incorrect attempts calculated non-standard cell potential with inverted signs for diluted electrolytes.',
    confidence: 'Strong evidence',
    recommendedAction: 'Dedicated 3-item targeted drill on cell quotient setup and oxidation/reduction half-cell identification.',
    targetedQuestionsCount: 3,
    affectedPrerequisites: ['cell-pot-05', 'eq-const-07'],
  }
];
