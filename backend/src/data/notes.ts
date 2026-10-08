import { TestNote } from '../types/index.js';

export const INITIAL_TEST_NOTES: TestNote[] = [
  {
    id: 'note-summary-01',
    testId: 'test-hist-01',
    userId: 'user-history',
    title: 'Session Diagnostic Notes Summary: Electrochemistry & Cell Potentials',
    conceptId: 'nernst-08',
    conceptName: 'Electrochemistry & Cell Potentials',
    tags: ['Session Summary', 'Nernst Equation', 'Gibbs Energy', 'Intensive Property'],
    createdAt: '2026-10-06T14:32:00Z',
    updatedAt: '2026-10-06T14:32:00Z',
    content: `SESSION DIAGNOSTIC SUMMARY

Correct Concepts Evaluated (Normal Size):
✓ Gibbs Energy & Spontaneity: Correctly derived standard free energy from cell potential using ΔG° = -nFE°cell = -212.3 kJ/mol; recognized that negative free energy confirms galvanic spontaneity.
✓ Intensive Property Scaling: Correctly identified that electric potential (E°) is an intensive property (Joules per Coulomb) and does not scale with stoichiometric electron coefficients.
✓ Equilibrium Constant Coupling: Accurately calculated K ≈ 1.0 × 10⁻³ from ΔG° = +17.1 kJ/mol using the thermodynamic bridge ΔG° = -RT ln(K).
✓ Thermodynamics Foundations: Confirmed path independence of state functions where cyclic integrals ∮ dX = 0.

[MISTAKE IDENTIFIED & ELONGATED REMEDIATION]
**Concept with Mistake: Nernst Equation (Reaction Quotient Inversion)**
**Error Analysis: You selected that the initial cell potential was negative (-0.089 V), mistakenly concluding that the anode compartment has a negative thermodynamic driving force because of its lower copper activity (0.0010 M).**
**Elongated Diagnostic Breakdown: In a concentration cell constructed with identical copper half-cells, the standard cell potential is identically zero (E° = 0.00 V). The entire thermodynamic driving force is entropic (ΔS_mix > 0), derived exclusively from the spontaneous movement toward concentration equalization. The Nernst equation governs this: E = E° - (0.0592 / n) · log10(Q). By IUPAC redox convention, oxidation occurs at the anode: Cu(s) → Cu²⁺(dilute) + 2e⁻, so the dilute compartment (0.0010 M) is the PRODUCT of the spontaneous process and belongs in the numerator of the reaction quotient. Conversely, the concentrated compartment (1.0 M) undergoes reduction: Cu²⁺(conc) + 2e⁻ → Cu(s), acting as the REACTANT in the denominator. This yields Q = [Cu²⁺]_anode / [Cu²⁺]_cathode = 10⁻³ / 1.0 = 10⁻³. Because log10(10⁻³) = -3, the negative sign inside the logarithm negates the leading negative sign in the Nernst formula: E = 0 - (0.0592 / 2) · (-3) = +0.0888 V. The voltage is unequivocally POSITIVE.**
**Remediation Rule: Whenever evaluating concentration cells, ALWAYS place the more dilute solution in the numerator of Q. Since Q < 1, log(Q) is inherently negative, which forces the subtraction term in the Nernst equation to become positive (+), ensuring positive voltage and spontaneous discharge until concentrations equalize (Q = 1, E = 0 V).**`
  },
  {
    id: 'note-summary-02',
    testId: 'test-hist-02',
    userId: 'user-history',
    title: 'Session Diagnostic Notes Summary: Thermodynamics Foundations & State Functions',
    conceptId: 'thermo-01',
    conceptName: 'Thermodynamics Foundations',
    tags: ['Session Summary', 'State Functions', 'Mastery Confirmed', 'First Law'],
    createdAt: '2026-10-04T10:48:00Z',
    updatedAt: '2026-10-04T10:48:00Z',
    content: `SESSION DIAGNOSTIC SUMMARY

Correct Concepts Evaluated (Normal Size):
✓ State Functions vs. Path Functions: Correctly confirmed that state functions (U, H, S, G) depend strictly on the boundary equilibrium states (∮ dX = 0), whereas heat (q) and work (w) depend on the exact transformation trajectory.
✓ Standard Free Energy: Accurately calculated ΔG° = -nFE°cell = -212.3 kJ/mol for a standard Daniell cell, verifying negative free energy alignment with positive cell potential.
✓ Invariance of Standard Potentials: Correctly maintained that standard reduction potential E° is an intensive thermodynamic quantity (J/C) that remains unchanged when half-reactions are multiplied by stoichiometric coefficients.
✓ Equilibrium Constant Quantification: Successfully evaluated K = e^(-ΔG°/RT) ≈ 1.0 × 10⁻³ for an endergonic process at 298 K, confirming reactant favoritism.

Diagnostic Evaluation: All items in this session were answered correctly. Latent ability calibrated upward (+0.18 θ) across foundational state function nodes with zero misconception patterns triggered.`
  },
  {
    id: 'note-summary-03',
    testId: 'test-hist-03',
    userId: 'user-history',
    title: 'Session Diagnostic Notes Summary: Non-Standard Potentials & Reaction Quotients',
    conceptId: 'nernst-08',
    conceptName: 'Nernst Equation & Chemical Equilibrium',
    tags: ['Session Summary', 'Quotient Inversion', 'Intensive Property Error', 'Remediation'],
    createdAt: '2026-10-02T17:08:00Z',
    updatedAt: '2026-10-02T17:08:00Z',
    content: `SESSION DIAGNOSTIC SUMMARY

Correct Concepts Evaluated (Normal Size):
✓ Equilibrium Constant Coupling: Correctly applied ΔG° = -RT ln(K) to determine K ≈ 1.0 × 10⁻³ under standard conditions.
✓ Thermodynamic State Functions: Correctly affirmed that path independence applies to thermodynamic potentials.

[MISTAKE IDENTIFIED & ELONGATED REMEDIATION]
**[CRITICAL DIAGNOSTIC ERROR #1 & REMEDIATION]**
**Concept with Mistake: Concentration Cell Driving Force (Nernst Equation)**
**Error Analysis: You answered that the initial potential is 0.00 V because identical chemical species (Cu/Cu²⁺) supposedly possess zero net chemical driving force.**
**Elongated Diagnostic Breakdown: While standard potential E° is indeed 0.00 V for identical chemical electrodes, the non-standard potential E is NOT zero when ion activities differ. The driving force in a concentration cell is entropic dilution (ΔG = -TΔS_mixing < 0). Current flows spontaneously to dilute the concentrated cathode compartment and concentrate the dilute anode compartment. As long as [Cu²⁺]_cathode ≠ [Cu²⁺]_anode, a measurable potential of E = +0.089 V exists. E only decays to 0.00 V when the cell reaches true dynamic equilibrium (concentrations become equal on both sides).**
**Remediation Rule: Never conflate E° with instantaneous E. E° = 0 simply means standard states (1.0 M on both sides) would produce no voltage; any concentration gradient produces a spontaneous positive cell voltage.**

**[CRITICAL DIAGNOSTIC ERROR #2 & REMEDIATION]**
**Concept with Mistake: Reaction Quotient Q Ratio Inversion**
**Error Analysis: You calculated a negative initial potential (-0.089 V) by inverting the reaction quotient Q in the Nernst logarithm.**
**Elongated Diagnostic Breakdown: The Nernst equation is E = E° - (0.0592/n)·log(Q). By assigning Q = [Cu²⁺]_conc / [Cu²⁺]_dilute = 1000, you obtained log(1000) = +3, which subtracted 0.089 V from zero, yielding -0.089 V. However, the oxidation compartment is the dilute half-cell: Cu(s) → Cu²⁺(dilute) + 2e⁻. Dilute Cu²⁺ is the PRODUCT, placing it in the NUMERATOR: Q = [Cu²⁺]_dilute / [Cu²⁺]_conc = 10⁻³. Because log10(10⁻³) = -3, the negative signs multiply out: - (0.0296) · (-3) = +0.089 V.**
**Remediation Rule: Always define Q = [Oxidation Products]^c / [Reduction Reactants]^c. Dilute ions are generated at the anode, so they are always in the numerator.**

**[CRITICAL DIAGNOSTIC ERROR #3 & REMEDIATION]**
**Concept with Mistake: Stoichiometric Scaling of Standard Potentials (Intensive Property)**
**Error Analysis: You multiplied E° by 2 after multiplying the half-reaction by 2 to balance electrons.**
**Elongated Diagnostic Breakdown: Electric potential E° is an INTENSIVE thermodynamic property with units of Volts (Joules per Coulomb of charge). When you double a reaction equation, you double both the free energy change ΔG (Joules) and the moles of electrons transferred n (Coulombs). Since E° = -ΔG / (nF), doubling both numerator and denominator leaves the potential E° strictly identical. Only extensive quantities (ΔH, ΔS, ΔG) scale with stoichiometric multipliers.**
**Remediation Rule: Standard reduction potentials are intrinsic physical characteristics of the redox couple. NEVER multiply E° by any stoichiometric coefficient when balancing half-reactions.**`
  }
];
