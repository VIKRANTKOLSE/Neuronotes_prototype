import { Concept } from '@/types';

export interface RecommendedConceptInfo {
  concept: Concept;
  score: number;
  connectedCount: number;
  connectedNames: string[];
  rationale: string;
}

/**
 * Calculates the concept that provides MAXIMUM INFORMATION GAIN about the user
 * based on DAG connectivity (degree centrality) and node posterior uncertainty.
 * If concept X is connected to many other concepts whose mastery we want to determine,
 * X is prioritized.
 */
export function getRecommendedConceptByInformationGain(concepts: Concept[]): RecommendedConceptInfo {
  if (!concepts || concepts.length === 0) {
    return {
      concept: {
        id: 'effective-nuclear-charge',
        name: 'Effective Nuclear Charge',
        subject: 'Inorganic Chemistry',
        domain: 'Tier 1 (Foundation)',
        tier: 1,
        tierName: 'Tier 1 (Foundation)',
        estimatedMastery: 0,
        confidenceScore: 0,
        status: 'insufficient_evidence',
        prerequisites: [],
        dependents: [
          'atomic-radius-trend',
          'ionization-enthalpy-trend',
          'electron-gain-enthalpy-trend',
          'electronegativity-trend',
          'inert-pair-effect'
        ],
        totalResponses: 0,
        correctResponses: 0,
        incorrectResponses: 0,
        evidenceSummary: 'Unprobed baseline state.',
        isWeakVsInsufficient: 'insufficient',
        recommendedAction: 'Foundational node with maximum graph degree.',
        position: { x: 50, y: 40 },
        level: 1
      },
      score: 18.5,
      connectedCount: 5,
      connectedNames: ['Atomic Radius Trend', 'Ionization Enthalpy Trend', 'Electronegativity Trend'],
      rationale: 'Connected to 5 downstream periodic concepts. Calibrating this node provides maximum information gain about your ability.'
    };
  }

  // Calculate Information Gain score for each concept
  const scored = concepts.map(c => {
    // Unique list of connected neighbor IDs (prerequisites + dependents)
    const connectedIds = Array.from(new Set([...(c.prerequisites || []), ...(c.dependents || [])]));

    // Find neighbor concept objects
    const neighbors = connectedIds
      .map(id => concepts.find(other => other.id === id))
      .filter((n): n is Concept => !!n);

    // Count how many connected neighbors are currently unprobed or uncertain
    const uncertainNeighborsCount = neighbors.filter(
      n => n.totalResponses === 0 || n.status === 'insufficient_evidence' || n.status === 'uncertain' || n.confidenceScore < 60
    ).length;

    // Node posterior uncertainty (higher if 0 responses or low confidence)
    const nodeUncertainty = c.totalResponses === 0 
      ? 2.0 
      : Math.max(0.4, (100 - c.confidenceScore) / 45);

    // Foundational priority multiplier: Tier 1 concepts that gate multiple downstream subgraphs provide foundational information
    const tierMultiplier = c.tier === 1 ? 1.5 : c.tier === 2 ? 1.25 : c.tier === 3 ? 1.1 : 1.0;

    // Information Gain formula:
    // InfoGain = Uncertainty(X) * (1 + 1.2 * ConnectedCount + 1.8 * UncertainNeighbors) * TierMultiplier
    const score = nodeUncertainty * (1.0 + (connectedIds.length * 1.2) + (uncertainNeighborsCount * 1.8)) * tierMultiplier;

    return {
      concept: c,
      score: parseFloat(score.toFixed(2)),
      connectedCount: connectedIds.length,
      connectedNames: neighbors.map(n => n.name).slice(0, 5),
      rationale: connectedIds.length > 0 
        ? `Connected to ${connectedIds.length} other concepts (${neighbors.slice(0, 3).map(n => n.name).join(', ')}). Calibrating this concept provides maximum information gain across downstream topics.`
        : `Primary diagnostic node for latent ability calibration.`
    };
  });

  // Sort descending by Information Gain score
  scored.sort((a, b) => b.score - a.score);

  return scored[0];
}

/**
 * Returns all concepts ranked by information gain
 */
export function rankConceptsByInformationGain(concepts: Concept[]): RecommendedConceptInfo[] {
  if (!concepts || concepts.length === 0) return [];
  return concepts.map(c => {
    const connectedIds = Array.from(new Set([...(c.prerequisites || []), ...(c.dependents || [])]));
    const neighbors = connectedIds
      .map(id => concepts.find(other => other.id === id))
      .filter((n): n is Concept => !!n);
    const uncertainNeighborsCount = neighbors.filter(
      n => n.totalResponses === 0 || n.status === 'insufficient_evidence' || n.status === 'uncertain' || n.confidenceScore < 60
    ).length;
    const nodeUncertainty = c.totalResponses === 0 ? 2.0 : Math.max(0.4, (100 - c.confidenceScore) / 45);
    const tierMultiplier = c.tier === 1 ? 1.5 : c.tier === 2 ? 1.25 : c.tier === 3 ? 1.1 : 1.0;
    const score = nodeUncertainty * (1.0 + (connectedIds.length * 1.2) + (uncertainNeighborsCount * 1.8)) * tierMultiplier;
    return {
      concept: c,
      score: parseFloat(score.toFixed(2)),
      connectedCount: connectedIds.length,
      connectedNames: neighbors.map(n => n.name).slice(0, 4),
      rationale: `Connected to ${connectedIds.length} other concepts. Provides maximum information gain.`
    };
  }).sort((a, b) => b.score - a.score);
}
