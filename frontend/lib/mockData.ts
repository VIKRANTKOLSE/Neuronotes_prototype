import { Concept, Question, MisconceptionItem, ActivityLog, PrerequisiteEdge } from '../types';

export const CANONICAL_TIERS: Record<string, string[]> = {
  "Tier 1 (Foundation)": [
    "Effective Nuclear Charge",
    "Shielding Effect",
    "Orbital Penetration",
    "Electron-Electron Repulsion",
    "Energy Level Splitting in Atomic Orbitals",
    "Charge Density (Z/r) and Ionic Potential",
    "Lattice Energy",
    "Hydration Enthalpy",
    "Bond Dissociation Energy and Stability",
    "Sigma and Pi Bonding in Molecular Orbitals"
  ],
  "Tier 2 (Core Mechanisms)": [
    "Atomic Radius Trend",
    "Ionization Enthalpy Trend",
    "Electron Gain Enthalpy Trend",
    "Electronegativity Trend",
    "Dipole Moment and Molecular Polarity",
    "Valence Shell Electron Pair Repulsion Theory",
    "Hybridization and Orbital Mixing Principles",
    "Molecular Orbital Theory and Delocalization",
    "Hydrogen Bonding",
    "Back Bonding",
    "Bent’s Rule",
    "Polarization Effects (Fajan’s Rule + Polarizing Power)",
    "Solubility Product and Precipitation Logic"
  ],
  "Tier 3 (Derived Chemical Behavior)": [
    "Diagonal Relationship",
    "Inert Pair Effect",
    "Polymerization of Silicate Units",
    "Thermal Stability from Lattice Energy and Polarization",
    "Oxoacid Strength and Basicity from Structure",
    "Lanthanoid Contraction",
    "Actinoid Contraction",
    "4d and 5d Series Similarity Post-Lanthanoid Contraction",
    "Variable Oxidation State Stability in d-block",
    "Exchange Energy and Half-Filled Shell Stability",
    "Standard Electrode Potential Trends in d-block",
    "Magnetic Properties from Unpaired d-electrons",
    "Hard and Soft Acids and Bases (HSAB) Principle",
    "Electron-Deficient Bonding in Boranes",
    "VSEPR Application to Hypervalent Molecules",
    "Noble Gas Compound Stability",
    "Redox Stability and Disproportionation Tendencies"
  ],
  "Tier 4 (Complex Systems)": [
    "Spectrochemical Series",
    "Crystal Field Splitting in Octahedral Field",
    "Crystal Field Splitting in Tetrahedral Field",
    "Crystal Field Stabilization Energy",
    "High-Spin vs Low-Spin Complexes",
    "Jahn-Teller Distortion",
    "Ligand Field Theory",
    "Color Origin in Coordination Compounds",
    "Chelate Effect",
    "Stability Constants of Complexes",
    "Linkage Isomerism",
    "Geometric Isomerism in Coordination Compounds",
    "Optical Isomerism in Coordination Compounds",
    "Ellingham Diagram and Thermodynamic Feasibility",
    "Electrochemical Reduction Principles in Metallurgy",
    "Coordination Number and Geometry Relationships",
    "Ligand Denticity and Polydentate Binding",
    "Metal-Ligand Bonding (σ and π interactions in complexes)"
  ]
};

export const CANONICAL_EDGES: PrerequisiteEdge[] = [
  {
    "source": "effective-nuclear-charge",
    "target": "atomic-radius-trend",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Atomic Radius Trend",
    "type": "prerequisite"
  },
  {
    "source": "shielding-effect",
    "target": "atomic-radius-trend",
    "sourceName": "Shielding Effect",
    "targetName": "Atomic Radius Trend",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "ionization-enthalpy-trend",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Ionization Enthalpy Trend",
    "type": "prerequisite"
  },
  {
    "source": "atomic-radius-trend",
    "target": "ionization-enthalpy-trend",
    "sourceName": "Atomic Radius Trend",
    "targetName": "Ionization Enthalpy Trend",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "electron-gain-enthalpy-trend",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Electron Gain Enthalpy Trend",
    "type": "prerequisite"
  },
  {
    "source": "atomic-radius-trend",
    "target": "electron-gain-enthalpy-trend",
    "sourceName": "Atomic Radius Trend",
    "targetName": "Electron Gain Enthalpy Trend",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "electronegativity-trend",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Electronegativity Trend",
    "type": "prerequisite"
  },
  {
    "source": "atomic-radius-trend",
    "target": "electronegativity-trend",
    "sourceName": "Atomic Radius Trend",
    "targetName": "Electronegativity Trend",
    "type": "prerequisite"
  },
  {
    "source": "electronegativity-trend",
    "target": "dipole-moment-and-molecular-polarity",
    "sourceName": "Electronegativity Trend",
    "targetName": "Dipole Moment and Molecular Polarity",
    "type": "prerequisite"
  },
  {
    "source": "valence-shell-electron-pair-repulsion-theory",
    "target": "dipole-moment-and-molecular-polarity",
    "sourceName": "Valence Shell Electron Pair Repulsion Theory",
    "targetName": "Dipole Moment and Molecular Polarity",
    "type": "prerequisite"
  },
  {
    "source": "electron-electron-repulsion",
    "target": "valence-shell-electron-pair-repulsion-theory",
    "sourceName": "Electron-Electron Repulsion",
    "targetName": "Valence Shell Electron Pair Repulsion Theory",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "hybridization-and-orbital-mixing-principles",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Hybridization and Orbital Mixing Principles",
    "type": "prerequisite"
  },
  {
    "source": "energy-level-splitting-in-atomic-orbitals",
    "target": "molecular-orbital-theory-and-delocalization",
    "sourceName": "Energy Level Splitting in Atomic Orbitals",
    "targetName": "Molecular Orbital Theory and Delocalization",
    "type": "prerequisite"
  },
  {
    "source": "valence-shell-electron-pair-repulsion-theory",
    "target": "hybridization-and-orbital-mixing-principles",
    "sourceName": "Valence Shell Electron Pair Repulsion Theory",
    "targetName": "Hybridization and Orbital Mixing Principles",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "back-bonding",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Back Bonding",
    "type": "prerequisite"
  },
  {
    "source": "molecular-orbital-theory-and-delocalization",
    "target": "back-bonding",
    "sourceName": "Molecular Orbital Theory and Delocalization",
    "targetName": "Back Bonding",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "bent-s-rule",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Bent’s Rule",
    "type": "prerequisite"
  },
  {
    "source": "lattice-energy",
    "target": "solubility-product-and-precipitation-logic",
    "sourceName": "Lattice Energy",
    "targetName": "Solubility Product and Precipitation Logic",
    "type": "prerequisite"
  },
  {
    "source": "hydration-enthalpy",
    "target": "solubility-product-and-precipitation-logic",
    "sourceName": "Hydration Enthalpy",
    "targetName": "Solubility Product and Precipitation Logic",
    "type": "prerequisite"
  },
  {
    "source": "charge-density-z-r-and-ionic-potential",
    "target": "polarization-effects-fajan-s-rule-polarizing-power",
    "sourceName": "Charge Density (Z/r) and Ionic Potential",
    "targetName": "Polarization Effects (Fajan’s Rule + Polarizing Power)",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "polarization-effects-fajan-s-rule-polarizing-power",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Polarization Effects (Fajan’s Rule + Polarizing Power)",
    "type": "prerequisite"
  },
  {
    "source": "lattice-energy",
    "target": "thermal-stability-from-lattice-energy-and-polarization",
    "sourceName": "Lattice Energy",
    "targetName": "Thermal Stability from Lattice Energy and Polarization",
    "type": "prerequisite"
  },
  {
    "source": "polarization-effects-fajan-s-rule-polarizing-power",
    "target": "thermal-stability-from-lattice-energy-and-polarization",
    "sourceName": "Polarization Effects (Fajan’s Rule + Polarizing Power)",
    "targetName": "Thermal Stability from Lattice Energy and Polarization",
    "type": "prerequisite"
  },
  {
    "source": "electronegativity-trend",
    "target": "oxoacid-strength-and-basicity-from-structure",
    "sourceName": "Electronegativity Trend",
    "targetName": "Oxoacid Strength and Basicity from Structure",
    "type": "prerequisite"
  },
  {
    "source": "hybridization-and-orbital-mixing-principles",
    "target": "oxoacid-strength-and-basicity-from-structure",
    "sourceName": "Hybridization and Orbital Mixing Principles",
    "targetName": "Oxoacid Strength and Basicity from Structure",
    "type": "prerequisite"
  },
  {
    "source": "molecular-orbital-theory-and-delocalization",
    "target": "oxoacid-strength-and-basicity-from-structure",
    "sourceName": "Molecular Orbital Theory and Delocalization",
    "targetName": "Oxoacid Strength and Basicity from Structure",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "inert-pair-effect",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Inert Pair Effect",
    "type": "prerequisite"
  },
  {
    "source": "shielding-effect",
    "target": "inert-pair-effect",
    "sourceName": "Shielding Effect",
    "targetName": "Inert Pair Effect",
    "type": "prerequisite"
  },
  {
    "source": "orbital-penetration",
    "target": "inert-pair-effect",
    "sourceName": "Orbital Penetration",
    "targetName": "Inert Pair Effect",
    "type": "prerequisite"
  },
  {
    "source": "shielding-effect",
    "target": "lanthanoid-contraction",
    "sourceName": "Shielding Effect",
    "targetName": "Lanthanoid Contraction",
    "type": "prerequisite"
  },
  {
    "source": "orbital-penetration",
    "target": "lanthanoid-contraction",
    "sourceName": "Orbital Penetration",
    "targetName": "Lanthanoid Contraction",
    "type": "prerequisite"
  },
  {
    "source": "lanthanoid-contraction",
    "target": "4d-and-5d-series-similarity-post-lanthanoid-contraction",
    "sourceName": "Lanthanoid Contraction",
    "targetName": "4d and 5d Series Similarity Post-Lanthanoid Contraction",
    "type": "prerequisite"
  },
  {
    "source": "exchange-energy-and-half-filled-shell-stability",
    "target": "variable-oxidation-state-stability-in-d-block",
    "sourceName": "Exchange Energy and Half-Filled Shell Stability",
    "targetName": "Variable Oxidation State Stability in d-block",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "variable-oxidation-state-stability-in-d-block",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Variable Oxidation State Stability in d-block",
    "type": "prerequisite"
  },
  {
    "source": "energy-level-splitting-in-atomic-orbitals",
    "target": "magnetic-properties-from-unpaired-d-electrons",
    "sourceName": "Energy Level Splitting in Atomic Orbitals",
    "targetName": "Magnetic Properties from Unpaired d-electrons",
    "type": "prerequisite"
  },
  {
    "source": "electron-electron-repulsion",
    "target": "magnetic-properties-from-unpaired-d-electrons",
    "sourceName": "Electron-Electron Repulsion",
    "targetName": "Magnetic Properties from Unpaired d-electrons",
    "type": "prerequisite"
  },
  {
    "source": "standard-electrode-potential-trends-in-d-block",
    "target": "redox-stability-and-disproportionation-tendencies",
    "sourceName": "Standard Electrode Potential Trends in d-block",
    "targetName": "Redox Stability and Disproportionation Tendencies",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "metal-ligand-bonding-and-interactions-in-complexes",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "type": "prerequisite"
  },
  {
    "source": "molecular-orbital-theory-and-delocalization",
    "target": "metal-ligand-bonding-and-interactions-in-complexes",
    "sourceName": "Molecular Orbital Theory and Delocalization",
    "targetName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "type": "prerequisite"
  },
  {
    "source": "metal-ligand-bonding-and-interactions-in-complexes",
    "target": "ligand-field-theory",
    "sourceName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "targetName": "Ligand Field Theory",
    "type": "prerequisite"
  },
  {
    "source": "ligand-field-theory",
    "target": "crystal-field-splitting-in-octahedral-field",
    "sourceName": "Ligand Field Theory",
    "targetName": "Crystal Field Splitting in Octahedral Field",
    "type": "prerequisite"
  },
  {
    "source": "ligand-field-theory",
    "target": "crystal-field-splitting-in-tetrahedral-field",
    "sourceName": "Ligand Field Theory",
    "targetName": "Crystal Field Splitting in Tetrahedral Field",
    "type": "prerequisite"
  },
  {
    "source": "crystal-field-splitting-in-octahedral-field",
    "target": "crystal-field-stabilization-energy",
    "sourceName": "Crystal Field Splitting in Octahedral Field",
    "targetName": "Crystal Field Stabilization Energy",
    "type": "prerequisite"
  },
  {
    "source": "crystal-field-splitting-in-tetrahedral-field",
    "target": "crystal-field-stabilization-energy",
    "sourceName": "Crystal Field Splitting in Tetrahedral Field",
    "targetName": "Crystal Field Stabilization Energy",
    "type": "prerequisite"
  },
  {
    "source": "crystal-field-stabilization-energy",
    "target": "high-spin-vs-low-spin-complexes",
    "sourceName": "Crystal Field Stabilization Energy",
    "targetName": "High-Spin vs Low-Spin Complexes",
    "type": "prerequisite"
  },
  {
    "source": "spectrochemical-series",
    "target": "high-spin-vs-low-spin-complexes",
    "sourceName": "Spectrochemical Series",
    "targetName": "High-Spin vs Low-Spin Complexes",
    "type": "prerequisite"
  },
  {
    "source": "crystal-field-stabilization-energy",
    "target": "color-origin-in-coordination-compounds",
    "sourceName": "Crystal Field Stabilization Energy",
    "targetName": "Color Origin in Coordination Compounds",
    "type": "prerequisite"
  },
  {
    "source": "energy-level-splitting-in-atomic-orbitals",
    "target": "color-origin-in-coordination-compounds",
    "sourceName": "Energy Level Splitting in Atomic Orbitals",
    "targetName": "Color Origin in Coordination Compounds",
    "type": "prerequisite"
  },
  {
    "source": "crystal-field-stabilization-energy",
    "target": "jahn-teller-distortion",
    "sourceName": "Crystal Field Stabilization Energy",
    "targetName": "Jahn-Teller Distortion",
    "type": "prerequisite"
  },
  {
    "source": "metal-ligand-bonding-and-interactions-in-complexes",
    "target": "chelate-effect",
    "sourceName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "targetName": "Chelate Effect",
    "type": "prerequisite"
  },
  {
    "source": "ligand-denticity-and-polydentate-binding",
    "target": "chelate-effect",
    "sourceName": "Ligand Denticity and Polydentate Binding",
    "targetName": "Chelate Effect",
    "type": "prerequisite"
  },
  {
    "source": "chelate-effect",
    "target": "stability-constants-of-complexes",
    "sourceName": "Chelate Effect",
    "targetName": "Stability Constants of Complexes",
    "type": "prerequisite"
  },
  {
    "source": "coordination-number-and-geometry-relationships",
    "target": "geometric-isomerism-in-coordination-compounds",
    "sourceName": "Coordination Number and Geometry Relationships",
    "targetName": "Geometric Isomerism in Coordination Compounds",
    "type": "prerequisite"
  },
  {
    "source": "coordination-number-and-geometry-relationships",
    "target": "optical-isomerism-in-coordination-compounds",
    "sourceName": "Coordination Number and Geometry Relationships",
    "targetName": "Optical Isomerism in Coordination Compounds",
    "type": "prerequisite"
  },
  {
    "source": "metal-ligand-bonding-and-interactions-in-complexes",
    "target": "linkage-isomerism",
    "sourceName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "targetName": "Linkage Isomerism",
    "type": "prerequisite"
  },
  {
    "source": "lattice-energy",
    "target": "ellingham-diagram-and-thermodynamic-feasibility",
    "sourceName": "Lattice Energy",
    "targetName": "Ellingham Diagram and Thermodynamic Feasibility",
    "type": "prerequisite"
  },
  {
    "source": "bond-dissociation-energy-and-stability",
    "target": "ellingham-diagram-and-thermodynamic-feasibility",
    "sourceName": "Bond Dissociation Energy and Stability",
    "targetName": "Ellingham Diagram and Thermodynamic Feasibility",
    "type": "prerequisite"
  },
  {
    "source": "ellingham-diagram-and-thermodynamic-feasibility",
    "target": "electrochemical-reduction-principles-in-metallurgy",
    "sourceName": "Ellingham Diagram and Thermodynamic Feasibility",
    "targetName": "Electrochemical Reduction Principles in Metallurgy",
    "type": "prerequisite"
  },
  {
    "source": "electronegativity-trend",
    "target": "diagonal-relationship",
    "sourceName": "Electronegativity Trend",
    "targetName": "Diagonal Relationship",
    "type": "prerequisite"
  },
  {
    "source": "atomic-radius-trend",
    "target": "diagonal-relationship",
    "sourceName": "Atomic Radius Trend",
    "targetName": "Diagonal Relationship",
    "type": "prerequisite"
  },
  {
    "source": "sigma-and-pi-bonding-in-molecular-orbitals",
    "target": "polymerization-of-silicate-units",
    "sourceName": "Sigma and Pi Bonding in Molecular Orbitals",
    "targetName": "Polymerization of Silicate Units",
    "type": "prerequisite"
  },
  {
    "source": "charge-density-z-r-and-ionic-potential",
    "target": "hard-and-soft-acids-and-bases-hsab-principle",
    "sourceName": "Charge Density (Z/r) and Ionic Potential",
    "targetName": "Hard and Soft Acids and Bases (HSAB) Principle",
    "type": "prerequisite"
  },
  {
    "source": "valence-shell-electron-pair-repulsion-theory",
    "target": "vsepr-application-to-hypervalent-molecules",
    "sourceName": "Valence Shell Electron Pair Repulsion Theory",
    "targetName": "VSEPR Application to Hypervalent Molecules",
    "type": "prerequisite"
  },
  {
    "source": "effective-nuclear-charge",
    "target": "noble-gas-compound-stability",
    "sourceName": "Effective Nuclear Charge",
    "targetName": "Noble Gas Compound Stability",
    "type": "prerequisite"
  },
  {
    "source": "ligand-field-theory",
    "target": "spectrochemical-series",
    "sourceName": "Ligand Field Theory",
    "targetName": "Spectrochemical Series",
    "type": "prerequisite"
  },
  {
    "source": "valence-shell-electron-pair-repulsion-theory",
    "target": "coordination-number-and-geometry-relationships",
    "sourceName": "Valence Shell Electron Pair Repulsion Theory",
    "targetName": "Coordination Number and Geometry Relationships",
    "type": "prerequisite"
  },
  {
    "source": "metal-ligand-bonding-and-interactions-in-complexes",
    "target": "ligand-denticity-and-polydentate-binding",
    "sourceName": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "targetName": "Ligand Denticity and Polydentate Binding",
    "type": "prerequisite"
  }
];

export const BASELINE_CONCEPTS_TEMPLATE: Concept[] = [
  {
    "id": "effective-nuclear-charge",
    "name": "Effective Nuclear Charge",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "atomic-radius-trend",
      "ionization-enthalpy-trend",
      "electron-gain-enthalpy-trend",
      "electronegativity-trend",
      "inert-pair-effect",
      "variable-oxidation-state-stability-in-d-block",
      "noble-gas-compound-stability"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 40
    },
    "level": 1
  },
  {
    "id": "shielding-effect",
    "name": "Shielding Effect",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "atomic-radius-trend",
      "inert-pair-effect",
      "lanthanoid-contraction"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 150
    },
    "level": 1
  },
  {
    "id": "orbital-penetration",
    "name": "Orbital Penetration",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "inert-pair-effect",
      "lanthanoid-contraction"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 260
    },
    "level": 1
  },
  {
    "id": "electron-electron-repulsion",
    "name": "Electron-Electron Repulsion",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "valence-shell-electron-pair-repulsion-theory",
      "magnetic-properties-from-unpaired-d-electrons"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 370
    },
    "level": 1
  },
  {
    "id": "energy-level-splitting-in-atomic-orbitals",
    "name": "Energy Level Splitting in Atomic Orbitals",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "molecular-orbital-theory-and-delocalization",
      "magnetic-properties-from-unpaired-d-electrons",
      "color-origin-in-coordination-compounds"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 480
    },
    "level": 1
  },
  {
    "id": "charge-density-z-r-and-ionic-potential",
    "name": "Charge Density (Z/r) and Ionic Potential",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "polarization-effects-fajan-s-rule-polarizing-power",
      "hard-and-soft-acids-and-bases-hsab-principle"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 590
    },
    "level": 1
  },
  {
    "id": "lattice-energy",
    "name": "Lattice Energy",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "solubility-product-and-precipitation-logic",
      "thermal-stability-from-lattice-energy-and-polarization",
      "ellingham-diagram-and-thermodynamic-feasibility"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 700
    },
    "level": 1
  },
  {
    "id": "hydration-enthalpy",
    "name": "Hydration Enthalpy",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "solubility-product-and-precipitation-logic"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 810
    },
    "level": 1
  },
  {
    "id": "bond-dissociation-energy-and-stability",
    "name": "Bond Dissociation Energy and Stability",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "ellingham-diagram-and-thermodynamic-feasibility"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 920
    },
    "level": 1
  },
  {
    "id": "sigma-and-pi-bonding-in-molecular-orbitals",
    "name": "Sigma and Pi Bonding in Molecular Orbitals",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 1 (Foundation)",
    "tier": 1,
    "tierName": "Tier 1 (Foundation)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "hybridization-and-orbital-mixing-principles",
      "back-bonding",
      "bent-s-rule",
      "polarization-effects-fajan-s-rule-polarizing-power",
      "metal-ligand-bonding-and-interactions-in-complexes",
      "polymerization-of-silicate-units"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Foundational concept available for initial diagnostic probing.",
    "position": {
      "x": 50,
      "y": 1030
    },
    "level": 1
  },
  {
    "id": "atomic-radius-trend",
    "name": "Atomic Radius Trend",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge",
      "shielding-effect"
    ],
    "dependents": [
      "ionization-enthalpy-trend",
      "electron-gain-enthalpy-trend",
      "electronegativity-trend",
      "diagonal-relationship"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 40
    },
    "level": 2
  },
  {
    "id": "ionization-enthalpy-trend",
    "name": "Ionization Enthalpy Trend",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge",
      "atomic-radius-trend"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 150
    },
    "level": 2
  },
  {
    "id": "electron-gain-enthalpy-trend",
    "name": "Electron Gain Enthalpy Trend",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge",
      "atomic-radius-trend"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 260
    },
    "level": 2
  },
  {
    "id": "electronegativity-trend",
    "name": "Electronegativity Trend",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge",
      "atomic-radius-trend"
    ],
    "dependents": [
      "dipole-moment-and-molecular-polarity",
      "oxoacid-strength-and-basicity-from-structure",
      "diagonal-relationship"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 370
    },
    "level": 2
  },
  {
    "id": "dipole-moment-and-molecular-polarity",
    "name": "Dipole Moment and Molecular Polarity",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "electronegativity-trend",
      "valence-shell-electron-pair-repulsion-theory"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 480
    },
    "level": 2
  },
  {
    "id": "valence-shell-electron-pair-repulsion-theory",
    "name": "Valence Shell Electron Pair Repulsion Theory",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "electron-electron-repulsion"
    ],
    "dependents": [
      "dipole-moment-and-molecular-polarity",
      "hybridization-and-orbital-mixing-principles",
      "vsepr-application-to-hypervalent-molecules",
      "coordination-number-and-geometry-relationships"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 590
    },
    "level": 2
  },
  {
    "id": "hybridization-and-orbital-mixing-principles",
    "name": "Hybridization and Orbital Mixing Principles",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "sigma-and-pi-bonding-in-molecular-orbitals",
      "valence-shell-electron-pair-repulsion-theory"
    ],
    "dependents": [
      "oxoacid-strength-and-basicity-from-structure"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 700
    },
    "level": 2
  },
  {
    "id": "molecular-orbital-theory-and-delocalization",
    "name": "Molecular Orbital Theory and Delocalization",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "energy-level-splitting-in-atomic-orbitals"
    ],
    "dependents": [
      "back-bonding",
      "oxoacid-strength-and-basicity-from-structure",
      "metal-ligand-bonding-and-interactions-in-complexes"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 810
    },
    "level": 2
  },
  {
    "id": "hydrogen-bonding",
    "name": "Hydrogen Bonding",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 0 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 920
    },
    "level": 2
  },
  {
    "id": "back-bonding",
    "name": "Back Bonding",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "sigma-and-pi-bonding-in-molecular-orbitals",
      "molecular-orbital-theory-and-delocalization"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 1030
    },
    "level": 2
  },
  {
    "id": "bent-s-rule",
    "name": "Bent’s Rule",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "sigma-and-pi-bonding-in-molecular-orbitals"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 1140
    },
    "level": 2
  },
  {
    "id": "polarization-effects-fajan-s-rule-polarizing-power",
    "name": "Polarization Effects (Fajan’s Rule + Polarizing Power)",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "charge-density-z-r-and-ionic-potential",
      "sigma-and-pi-bonding-in-molecular-orbitals"
    ],
    "dependents": [
      "thermal-stability-from-lattice-energy-and-polarization"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 1250
    },
    "level": 2
  },
  {
    "id": "solubility-product-and-precipitation-logic",
    "name": "Solubility Product and Precipitation Logic",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 2 (Core Mechanisms)",
    "tier": 2,
    "tierName": "Tier 2 (Core Mechanisms)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "lattice-energy",
      "hydration-enthalpy"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 380,
      "y": 1360
    },
    "level": 2
  },
  {
    "id": "diagonal-relationship",
    "name": "Diagonal Relationship",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "electronegativity-trend",
      "atomic-radius-trend"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 40
    },
    "level": 3
  },
  {
    "id": "inert-pair-effect",
    "name": "Inert Pair Effect",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge",
      "shielding-effect",
      "orbital-penetration"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 3 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 150
    },
    "level": 3
  },
  {
    "id": "polymerization-of-silicate-units",
    "name": "Polymerization of Silicate Units",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "sigma-and-pi-bonding-in-molecular-orbitals"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 260
    },
    "level": 3
  },
  {
    "id": "thermal-stability-from-lattice-energy-and-polarization",
    "name": "Thermal Stability from Lattice Energy and Polarization",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "lattice-energy",
      "polarization-effects-fajan-s-rule-polarizing-power"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 370
    },
    "level": 3
  },
  {
    "id": "oxoacid-strength-and-basicity-from-structure",
    "name": "Oxoacid Strength and Basicity from Structure",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "electronegativity-trend",
      "hybridization-and-orbital-mixing-principles",
      "molecular-orbital-theory-and-delocalization"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 3 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 480
    },
    "level": 3
  },
  {
    "id": "lanthanoid-contraction",
    "name": "Lanthanoid Contraction",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "shielding-effect",
      "orbital-penetration"
    ],
    "dependents": [
      "4d-and-5d-series-similarity-post-lanthanoid-contraction"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 590
    },
    "level": 3
  },
  {
    "id": "actinoid-contraction",
    "name": "Actinoid Contraction",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 0 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 700
    },
    "level": 3
  },
  {
    "id": "4d-and-5d-series-similarity-post-lanthanoid-contraction",
    "name": "4d and 5d Series Similarity Post-Lanthanoid Contraction",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "lanthanoid-contraction"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 810
    },
    "level": 3
  },
  {
    "id": "variable-oxidation-state-stability-in-d-block",
    "name": "Variable Oxidation State Stability in d-block",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "exchange-energy-and-half-filled-shell-stability",
      "effective-nuclear-charge"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 920
    },
    "level": 3
  },
  {
    "id": "exchange-energy-and-half-filled-shell-stability",
    "name": "Exchange Energy and Half-Filled Shell Stability",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "variable-oxidation-state-stability-in-d-block"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 0 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1030
    },
    "level": 3
  },
  {
    "id": "standard-electrode-potential-trends-in-d-block",
    "name": "Standard Electrode Potential Trends in d-block",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [
      "redox-stability-and-disproportionation-tendencies"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 0 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1140
    },
    "level": 3
  },
  {
    "id": "magnetic-properties-from-unpaired-d-electrons",
    "name": "Magnetic Properties from Unpaired d-electrons",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "energy-level-splitting-in-atomic-orbitals",
      "electron-electron-repulsion"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1250
    },
    "level": 3
  },
  {
    "id": "hard-and-soft-acids-and-bases-hsab-principle",
    "name": "Hard and Soft Acids and Bases (HSAB) Principle",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "charge-density-z-r-and-ionic-potential"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1360
    },
    "level": 3
  },
  {
    "id": "electron-deficient-bonding-in-boranes",
    "name": "Electron-Deficient Bonding in Boranes",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 0 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1470
    },
    "level": 3
  },
  {
    "id": "vsepr-application-to-hypervalent-molecules",
    "name": "VSEPR Application to Hypervalent Molecules",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "valence-shell-electron-pair-repulsion-theory"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1580
    },
    "level": 3
  },
  {
    "id": "noble-gas-compound-stability",
    "name": "Noble Gas Compound Stability",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "effective-nuclear-charge"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1690
    },
    "level": 3
  },
  {
    "id": "redox-stability-and-disproportionation-tendencies",
    "name": "Redox Stability and Disproportionation Tendencies",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 3 (Derived Chemical Behavior)",
    "tier": 3,
    "tierName": "Tier 3 (Derived Chemical Behavior)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "standard-electrode-potential-trends-in-d-block"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 710,
      "y": 1800
    },
    "level": 3
  },
  {
    "id": "spectrochemical-series",
    "name": "Spectrochemical Series",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "ligand-field-theory"
    ],
    "dependents": [
      "high-spin-vs-low-spin-complexes"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 40
    },
    "level": 4
  },
  {
    "id": "crystal-field-splitting-in-octahedral-field",
    "name": "Crystal Field Splitting in Octahedral Field",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "ligand-field-theory"
    ],
    "dependents": [
      "crystal-field-stabilization-energy"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 150
    },
    "level": 4
  },
  {
    "id": "crystal-field-splitting-in-tetrahedral-field",
    "name": "Crystal Field Splitting in Tetrahedral Field",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "ligand-field-theory"
    ],
    "dependents": [
      "crystal-field-stabilization-energy"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 260
    },
    "level": 4
  },
  {
    "id": "crystal-field-stabilization-energy",
    "name": "Crystal Field Stabilization Energy",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "crystal-field-splitting-in-octahedral-field",
      "crystal-field-splitting-in-tetrahedral-field"
    ],
    "dependents": [
      "high-spin-vs-low-spin-complexes",
      "color-origin-in-coordination-compounds",
      "jahn-teller-distortion"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 370
    },
    "level": 4
  },
  {
    "id": "high-spin-vs-low-spin-complexes",
    "name": "High-Spin vs Low-Spin Complexes",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "crystal-field-stabilization-energy",
      "spectrochemical-series"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 480
    },
    "level": 4
  },
  {
    "id": "jahn-teller-distortion",
    "name": "Jahn-Teller Distortion",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "crystal-field-stabilization-energy"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 590
    },
    "level": 4
  },
  {
    "id": "ligand-field-theory",
    "name": "Ligand Field Theory",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "metal-ligand-bonding-and-interactions-in-complexes"
    ],
    "dependents": [
      "crystal-field-splitting-in-octahedral-field",
      "crystal-field-splitting-in-tetrahedral-field",
      "spectrochemical-series"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 700
    },
    "level": 4
  },
  {
    "id": "color-origin-in-coordination-compounds",
    "name": "Color Origin in Coordination Compounds",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "crystal-field-stabilization-energy",
      "energy-level-splitting-in-atomic-orbitals"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 810
    },
    "level": 4
  },
  {
    "id": "chelate-effect",
    "name": "Chelate Effect",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "metal-ligand-bonding-and-interactions-in-complexes",
      "ligand-denticity-and-polydentate-binding"
    ],
    "dependents": [
      "stability-constants-of-complexes"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 920
    },
    "level": 4
  },
  {
    "id": "stability-constants-of-complexes",
    "name": "Stability Constants of Complexes",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "chelate-effect"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1030
    },
    "level": 4
  },
  {
    "id": "linkage-isomerism",
    "name": "Linkage Isomerism",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "metal-ligand-bonding-and-interactions-in-complexes"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1140
    },
    "level": 4
  },
  {
    "id": "geometric-isomerism-in-coordination-compounds",
    "name": "Geometric Isomerism in Coordination Compounds",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "coordination-number-and-geometry-relationships"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1250
    },
    "level": 4
  },
  {
    "id": "optical-isomerism-in-coordination-compounds",
    "name": "Optical Isomerism in Coordination Compounds",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "coordination-number-and-geometry-relationships"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1360
    },
    "level": 4
  },
  {
    "id": "ellingham-diagram-and-thermodynamic-feasibility",
    "name": "Ellingham Diagram and Thermodynamic Feasibility",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "lattice-energy",
      "bond-dissociation-energy-and-stability"
    ],
    "dependents": [
      "electrochemical-reduction-principles-in-metallurgy"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1470
    },
    "level": 4
  },
  {
    "id": "electrochemical-reduction-principles-in-metallurgy",
    "name": "Electrochemical Reduction Principles in Metallurgy",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "ellingham-diagram-and-thermodynamic-feasibility"
    ],
    "dependents": [],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1580
    },
    "level": 4
  },
  {
    "id": "coordination-number-and-geometry-relationships",
    "name": "Coordination Number and Geometry Relationships",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "valence-shell-electron-pair-repulsion-theory"
    ],
    "dependents": [
      "geometric-isomerism-in-coordination-compounds",
      "optical-isomerism-in-coordination-compounds"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1690
    },
    "level": 4
  },
  {
    "id": "ligand-denticity-and-polydentate-binding",
    "name": "Ligand Denticity and Polydentate Binding",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "metal-ligand-bonding-and-interactions-in-complexes"
    ],
    "dependents": [
      "chelate-effect"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 1 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1800
    },
    "level": 4
  },
  {
    "id": "metal-ligand-bonding-and-interactions-in-complexes",
    "name": "Metal-Ligand Bonding (σ and π interactions in complexes)",
    "subject": "Inorganic Chemistry",
    "domain": "Tier 4 (Complex Systems)",
    "tier": 4,
    "tierName": "Tier 4 (Complex Systems)",
    "estimatedMastery": 0,
    "confidenceScore": 0,
    "status": "insufficient_evidence",
    "prerequisites": [
      "sigma-and-pi-bonding-in-molecular-orbitals",
      "molecular-orbital-theory-and-delocalization"
    ],
    "dependents": [
      "ligand-field-theory",
      "chelate-effect",
      "linkage-isomerism",
      "ligand-denticity-and-polydentate-binding"
    ],
    "totalResponses": 0,
    "correctResponses": 0,
    "incorrectResponses": 0,
    "evidenceSummary": "Insufficient evidence. Unprobed baseline state in adaptive knowledge graph.",
    "isWeakVsInsufficient": "insufficient",
    "recommendedAction": "Gated by prerequisite competencies: 2 prerequisite(s).",
    "position": {
      "x": 1040,
      "y": 1910
    },
    "level": 4
  }
];

// Historical user with calibrated evidence on key coordination & periodic trend concepts
export const CALIBRATED_CONCEPTS_HISTORY: Concept[] = BASELINE_CONCEPTS_TEMPLATE.map((c) => {
  // Real calibrated concepts based on test responses administered
  if (c.id === 'effective-nuclear-charge') {
    return {
      ...c,
      estimatedMastery: 84,
      confidenceScore: 88,
      status: 'strong' as const,
      totalResponses: 14,
      correctResponses: 13,
      incorrectResponses: 1,
      evidenceSummary: 'Strong mastery verified across Slater rules and shielding differentiation.',
      isWeakVsInsufficient: 'mastered' as const,
      recommendedAction: 'Mastered foundational driver; upstream prerequisites active for downstream periodic trends.'
    };
  }
  if (c.id === 'shielding-effect') {
    return {
      ...c,
      estimatedMastery: 82,
      confidenceScore: 85,
      status: 'strong' as const,
      totalResponses: 12,
      correctResponses: 11,
      incorrectResponses: 1,
      evidenceSummary: 'Reliable differentiation of s > p > d > f shielding efficacy.',
      isWeakVsInsufficient: 'mastered' as const,
      recommendedAction: 'Competency confirmed across periodic contraction items.'
    };
  }
  if (c.id === 'atomic-radius-trend') {
    return {
      ...c,
      estimatedMastery: 78,
      confidenceScore: 82,
      status: 'strong' as const,
      totalResponses: 10,
      correctResponses: 8,
      incorrectResponses: 2,
      evidenceSummary: 'Demonstrated solid grasp of isoelectronic radii and screening effects.',
      isWeakVsInsufficient: 'mastered' as const,
      recommendedAction: 'Active prerequisite support for ionization enthalpy and electron gain enthalpy.'
    };
  }
  if (c.id === 'valence-shell-electron-pair-repulsion-theory') {
    return {
      ...c,
      estimatedMastery: 75,
      confidenceScore: 80,
      status: 'strong' as const,
      totalResponses: 9,
      correctResponses: 7,
      incorrectResponses: 2,
      evidenceSummary: 'Solid predictive accuracy on electron domain geometries (linear to octahedral).',
      isWeakVsInsufficient: 'mastered' as const,
      recommendedAction: 'Prerequisite for hybridization and dipole moment.'
    };
  }
  if (c.id === 'ligand-field-theory') {
    return {
      ...c,
      estimatedMastery: 68,
      confidenceScore: 72,
      status: 'developing' as const,
      totalResponses: 8,
      correctResponses: 6,
      incorrectResponses: 2,
      evidenceSummary: 'Developing understanding of metal-ligand orbital overlap and spectrochemical sequence.',
      isWeakVsInsufficient: 'developing' as const,
      recommendedAction: 'Focus on sigma donor vs pi acceptor orbital mixing in octahedral complexes.'
    };
  }
  if (c.id === 'crystal-field-splitting-in-octahedral-field') {
    return {
      ...c,
      estimatedMastery: 64,
      confidenceScore: 70,
      status: 'developing' as const,
      totalResponses: 7,
      correctResponses: 5,
      incorrectResponses: 2,
      evidenceSummary: 'Good recognition of eg vs t2g orbital splitting energy (Δo).',
      isWeakVsInsufficient: 'developing' as const,
      recommendedAction: 'Targeted drill on pairing energy vs delta oct.'
    };
  }
  if (c.id === 'crystal-field-stabilization-energy') {
    return {
      ...c,
      estimatedMastery: 52,
      confidenceScore: 55,
      status: 'uncertain' as const,
      totalResponses: 6,
      correctResponses: 3,
      incorrectResponses: 3,
      evidenceSummary: 'High posterior uncertainty (variance elevated) in CFSE formula and pairing corrections.',
      isWeakVsInsufficient: 'developing' as const,
      possibleMisconception: {
        title: 'CFSE Electron Counting & Pairing Energy Error',
        description: 'Possible confusion in calculating net CFSE when electrons pair up in t2g vs eg orbitals.',
        confidence: 'Moderate' as const,
        evidenceText: 'Inconsistent calculation of P (pairing energy) offsets across d4-d7 configurations.'
      },
      recommendedAction: 'Next Best Action: Drill 3 adaptive items targeting CFSE calculation.'
    };
  }
  if (c.id === 'high-spin-vs-low-spin-complexes') {
    return {
      ...c,
      estimatedMastery: 42,
      confidenceScore: 68,
      status: 'weak' as const,
      totalResponses: 8,
      correctResponses: 3,
      incorrectResponses: 5,
      evidenceSummary: 'Confirmed misconception pattern in determining spin states based on Δo vs pairing energy (P).',
      isWeakVsInsufficient: 'weak' as const,
      possibleMisconception: {
        title: 'Δo vs Pairing Energy Decision Inversion',
        description: 'Predicting high-spin for strong-field ligands with large Δo > P.',
        confidence: 'Strong evidence' as const,
        evidenceText: 'Failed 4 consecutive items classifying [Fe(CN)6]4- and [Co(NH3)6]3+ spin states.'
      },
      recommendedAction: 'Requires targeted remediation drill on Spectrochemical Series vs Pairing Energy.'
    };
  }
  return c;
});

export const CONCEPTS: Concept[] = CALIBRATED_CONCEPTS_HISTORY;

export const QUESTIONS_POOL: Question[] = [
  {
    id: 'q-gibbs-cell-01',
    conceptId: 'gibbs-04',
    conceptName: 'Gibbs Energy',
    subject: 'Electrochemistry & Thermodynamics',
    stem: 'Based on the following standard galvanic cell notation and standard reduction potentials at 298 K:\n\nZn(s) | Zn²⁺(aq, 1.0 M) || Cu²⁺(aq, 1.0 M) | Cu(s)\n\nGiven E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V, what is the standard Gibbs free energy change (ΔG°) for the spontaneous cell reaction, and what does its sign imply?',
    contextNotation: 'Zn(s) | Zn²⁺(1.0 M) || Cu²⁺(1.0 M) | Cu(s)  •  F ≈ 96,485 C/mol  •  n = 2',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'ΔG° = -212.3 kJ/mol; negative sign indicates the cell reaction is thermodynamically spontaneous under standard conditions.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'ΔG° = +212.3 kJ/mol; positive sign indicates work is done by the system on the surroundings during spontaneous discharge.',
        isMisconceptionDistractor: true,
        misconceptionRationale: 'Cell potential and Gibbs free energy may be getting conflated. ΔG° is inversely related to E°cell via ΔG° = -nFE°cell.',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'ΔG° = -106.1 kJ/mol; because standard potentials are intensive, n is omitted from the energetic conversion.',
        isMisconceptionDistractor: true,
        misconceptionRationale: 'Omission of n indicates confusion between intensive potential (Volts = J/C) and extensive thermodynamic free energy (Joules).',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'ΔG° = 0 kJ/mol; standard cell notation implies the system is at dynamic equilibrium at 1.0 M concentrations.',
        isMisconceptionDistractor: true,
        misconceptionRationale: 'Equilibrium corresponds to non-standard E = 0 and ΔG = 0, not standard conditions where Q = 1.',
      }
    ],
    correctOptionId: 'opt-a',
    explanation: 'For the standard cell reaction Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), the standard cell potential is E°cell = E°(cathode) - E°(anode) = +0.34 V - (-0.76 V) = +1.10 V. The relationship to standard Gibbs free energy is ΔG° = -nFE°cell. With n = 2 mol e⁻, ΔG° = -2 × 96,485 C/mol × 1.10 J/C = -212,267 J/mol ≈ -212.3 kJ/mol. A negative ΔG° confirms thermodynamic spontaneity.',
    diagnosticRationale: {
      uncertaintyReason: 'Your current estimate for Gibbs Energy is uncertain (confidence: 63%, posterior variance elevated).',
      recentDifficultyReason: 'You recently showed difficulty connecting thermodynamic state functions to electrochemical work.',
      prerequisiteReason: 'Gibbs Energy is a direct prerequisite for the downstream concept Cell Potential (E°cell) being studied.',
      informationGainReason: 'This item maximizes Fisher Information I(θ = -0.22) = 1.48, providing maximum diagnostic discrimination.',
      fisherInformation: 1.48,
      estimatedTheta: -0.22,
      standardError: 0.38,
      itemDiscrimination: 1.82,
      itemDifficulty: -0.15,
      prerequisiteCoverageIndex: 0.89,
      utilityScore: 0.94,
    }
  },
  {
    id: 'q-nernst-02',
    conceptId: 'nernst-08',
    conceptName: 'Nernst Equation',
    subject: 'Inorganic Chemistry',
    stem: 'Consider a concentration cell operated at 298 K with copper electrodes: Cu(s) | Cu²⁺(aq, 0.0010 M) || Cu²⁺(aq, 1.0 M) | Cu(s). How does the cell potential change as the reaction approaches equilibrium?',
    contextNotation: 'E = E° - (0.0592 / n) log(Q)  •  E° = 0.00 V for identical half-cells',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Initial E is positive (+0.089 V) and decreases continuously toward 0.00 V as Cu²⁺ concentrations equalize.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Initial E is 0.00 V because identical chemical species have zero net electrochemical driving force.',
        isMisconceptionDistractor: true,
        misconceptionRationale: 'Confusing standard potential E° (which is 0) with non-standard potential E driven by the entropic gradient of concentration.',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Initial E is negative (-0.089 V) because the anode compartment has lower ionic activity than standard state.',
        isMisconceptionDistractor: true,
        misconceptionRationale: 'Inversion of the reaction quotient Q = [Cu²⁺_dilute] / [Cu²⁺_conc] in the Nernst logarithm.',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Initial E remains invariant until the copper anode electrode is completely dissolved.',
        isMisconceptionDistractor: true,
      }
    ],
    correctOptionId: 'opt-a',
    explanation: 'In a concentration cell, E° = 0. The anode reaction generates Cu²⁺ in the dilute compartment (0.001 M), and cathode plates out Cu²⁺ from the concentrated compartment (1.0 M). Q = [Cu²⁺_dilute] / [Cu²⁺_conc] = 10⁻³. E = 0 - (0.0592/2) log(10⁻³) = -0.0296 × (-3) = +0.0888 V. As current flows, Q increases to 1, causing E to approach 0 V at equilibrium.',
    diagnosticRationale: {
      uncertaintyReason: 'Identifies whether low performance on Nernst is caused by Q inversion vs lack of conceptual grasp.',
      recentDifficultyReason: 'Confirmed low ability estimate (28% mastery) requires targeted diagnostic isolation.',
      prerequisiteReason: 'Tests mastery of reaction quotient integration with cell potential.',
      informationGainReason: 'High discriminatory power (a = 2.1) between sign inversion misconceptions and conceptual gaps.',
      fisherInformation: 1.62,
      estimatedTheta: -0.85,
      standardError: 0.29,
      itemDiscrimination: 2.10,
      itemDifficulty: -0.70,
      prerequisiteCoverageIndex: 0.95,
      utilityScore: 0.91,
    }
  }
];

export const MISCONCEPTIONS: MisconceptionItem[] = [
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

export const RECENT_ACTIVITIES: ActivityLog[] = [
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
