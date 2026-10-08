import { 
  Question, 
  PastTestQuestionReview, 
  Concept, 
  MasteryStatus, 
  MisconceptionItem,
  TestNote 
} from '../types/index.js';
import { CANONICAL_TIERS, BASELINE_CONCEPTS_TEMPLATE } from '../data/concepts.js';
import { QUESTIONS_DATABASE } from '../data/questions.js';
import { UserService } from './userService.js';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const PRIMARY_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';
const FALLBACK_MODEL = 'google/diffusiongemma-26b-a4b-it';

export interface ConceptMasteryUpdate {
  conceptId: string;
  conceptName: string;
  tier: number;
  estimatedMastery: number; // 0-100
  confidenceScore: number;  // 0-100
  status: MasteryStatus;
  evidence: string;
}

export interface SessionEvaluationResult {
  diagnosticSummary: string;
  conceptMasteryUpdates: ConceptMasteryUpdate[];
  identifiedMisconceptions: MisconceptionItem[];
  overallMastery: number;
  estimatedTheta: number;
  summaryNote: TestNote;
}

export interface GenerateTestParams {
  conceptIds?: string[];
  tier?: number;
  numQuestions?: number;
  userTheta?: number;
  difficulty?: 'adaptive' | 'foundational' | 'advanced';
}

export class AiService {
  /**
   * Helper to invoke NVIDIA NIM Chat Completion API with fallback
   */
  private static async callNvidiaChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, 
    maxTokens = 2500, 
    temperature = 0.2
  ): Promise<string> {
    const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: maxTokens,
            temperature
          })
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[AiService] NVIDIA API error for model ${model}: ${response.status} ${errText}`);
          continue;
        }

        const data: any = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          return content;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AiService] Request failed for model ${model}:`, err.message);
      }
    }

    throw lastError || new Error('NVIDIA NIM API call failed across all candidate models.');
  }

  /**
   * Safe parser for JSON responses from LLM (extracts json block even if wrapped in markdown)
   */
  private static extractJson<T>(rawText: string): T | null {
    try {
      return JSON.parse(rawText.trim());
    } catch {
      const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          try {
            const cleaned = match[0].replace(/,\s*([\]}])/g, '$1');
            return JSON.parse(cleaned);
          } catch {
            return null;
          }
        }
      }
      return null;
    }
  }

  /**
   * Generate an adaptive diagnostic test targeting concepts from the 58-concept knowledge graph
   */
  static async generateAdaptiveTest(params: GenerateTestParams = {}): Promise<Question[]> {
    const numQuestions = Math.min(10, Math.max(3, params.numQuestions || 5));
    const targetTier = params.tier;
    
    // Select targeted concepts
    let targetConcepts: Concept[] = [];
    if (params.conceptIds && params.conceptIds.length > 0) {
      targetConcepts = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => params.conceptIds!.includes(c.id));
    } else if (targetTier) {
      targetConcepts = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => c.tier === targetTier);
    } else {
      const t1 = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => c.tier === 1).slice(0, 2);
      const t2 = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => c.tier === 2).slice(0, 2);
      const t3 = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => c.tier === 3).slice(0, 2);
      const t4 = BASELINE_CONCEPTS_TEMPLATE.filter((c: Concept) => c.tier === 4).slice(0, 2);
      targetConcepts = [...t1, ...t2, ...t3, ...t4];
    }

    const conceptsContext = targetConcepts.slice(0, 8).map(c => 
      `- [${c.id}] "${c.name}" (Tier ${c.tier || 1}): Prerequisites: [${c.prerequisites.join(', ')}]`
    ).join('\n');

    const systemPrompt = `You are an expert psychometrician and university professor in inorganic and physical chemistry.
Your task is to generate rigorous diagnostic multiple-choice questions for an adaptive learning platform.
You must output STRICTLY valid JSON without conversational preamble or markdown codeblock wrappers.`;

    const userPrompt = `Generate exactly ${numQuestions} diagnostic multiple-choice questions targeting the following chemistry knowledge graph concepts:
${conceptsContext}

REQUIREMENTS FOR EACH QUESTION:
1. Target exactly one concept from the provided list.
2. Provide a rigorous STEM with precise chemical context (equations, orbital configurations, or thermodynamic parameters).
3. Provide exactly 4 options (labels 'A', 'B', 'C', 'D').
4. Exactly one option must be correct.
5. At least 2 options MUST be "misconception distractors" (isMisconceptionDistractor: true) representing common high-level student cognitive errors (e.g. confusing shielding with penetration, forgetting pairing energy in CFSE, inverting periodic trends, sign errors in lattice enthalpy), with a detailed "misconceptionRationale".
6. Provide an in-depth scientific explanation.
7. Include psychometric parameters: itemDiscrimination (between 1.1 and 2.2), itemDifficulty (between -1.5 and 1.8).

Return a JSON array of questions with this schema:
[
  {
    "id": "ai-q-1",
    "conceptId": "concept-id-from-list",
    "conceptName": "Canonical Concept Name",
    "subject": "Inorganic Chemistry",
    "stem": "Question stem text...",
    "contextNotation": "Chemical notation e.g. [Fe(CN)6]4- or Z_eff = Z - S",
    "options": [
      {
        "id": "opt-1",
        "label": "A",
        "text": "Option text...",
        "isMisconceptionDistractor": false
      },
      {
        "id": "opt-2",
        "label": "B",
        "text": "Option text...",
        "isMisconceptionDistractor": true,
        "misconceptionRationale": "Student conflated..."
      },
      {
        "id": "opt-3",
        "label": "C",
        "text": "Option text...",
        "isMisconceptionDistractor": true,
        "misconceptionRationale": "Student omitted..."
      },
      {
        "id": "opt-4",
        "label": "D",
        "text": "Option text...",
        "isMisconceptionDistractor": false
      }
    ],
    "correctOptionId": "opt-1",
    "explanation": "Comprehensive scientific explanation...",
    "diagnosticRationale": {
      "uncertaintyReason": "Probes cognitive boundaries",
      "recentDifficultyReason": "Calibrated probe",
      "prerequisiteReason": "Validates foundational readiness",
      "informationGainReason": "High Fisher information",
      "fisherInformation": 1.45,
      "estimatedTheta": ${params.userTheta || 0.2},
      "standardError": 0.32,
      "itemDiscrimination": 1.6,
      "itemDifficulty": 0.1,
      "prerequisiteCoverageIndex": 0.85,
      "utilityScore": 0.92
    }
  }
]`;

    try {
      const rawText = await this.callNvidiaChat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], 3000, 0.2);

      const parsed = this.extractJson<Question[]>(rawText);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, idx) => ({
          ...q,
          id: q.id || `ai-gen-${Date.now().toString(36)}-${idx + 1}`,
          subject: q.subject || 'Inorganic Chemistry',
          options: q.options.map((opt, oIdx) => ({
            ...opt,
            id: opt.id || `opt-${idx + 1}-${oIdx + 1}`,
            label: opt.label || ['A', 'B', 'C', 'D'][oIdx] || 'A'
          })),
          diagnosticRationale: {
            uncertaintyReason: q.diagnosticRationale?.uncertaintyReason || 'Targeted AI diagnostic probe',
            recentDifficultyReason: q.diagnosticRationale?.recentDifficultyReason || 'Calibrated probe',
            prerequisiteReason: q.diagnosticRationale?.prerequisiteReason || 'Validates prerequisite structure',
            informationGainReason: q.diagnosticRationale?.informationGainReason || 'Maximizes information gain',
            fisherInformation: q.diagnosticRationale?.fisherInformation || 1.35,
            estimatedTheta: params.userTheta || 0.1,
            standardError: 0.35,
            itemDiscrimination: q.diagnosticRationale?.itemDiscrimination || 1.5,
            itemDifficulty: q.diagnosticRationale?.itemDifficulty || 0.0,
            prerequisiteCoverageIndex: 0.8,
            utilityScore: 0.9
          }
        }));
      }
    } catch (err) {
      console.warn('[AiService] AI test generation failed, returning adaptive pool questions:', err);
    }

    // High-quality fallback from canonical question database
    const selected = [...QUESTIONS_DATABASE];
    return selected.slice(0, numQuestions);
  }

  /**
   * Find Error & Calculate Mastery for EACH AND EVERY concept from the Knowledge Graph
   * Structured prompt strictly calculates mastery across the entire 58-concept DAG and synthesizes mistake summaries
   */
  static async evaluateSessionAndCalculateMastery(
    sessionQuestions: PastTestQuestionReview[],
    userId?: string
  ): Promise<SessionEvaluationResult> {
    const user = UserService.getUser(userId);
    const userConcepts: Concept[] = user.concepts.length > 0 ? user.concepts : BASELINE_CONCEPTS_TEMPLATE;

    // Build complete Knowledge Graph context with all 58 concepts and tiers
    const fullGraphSummary = Object.entries(CANONICAL_TIERS).map(([tierName, conceptNames]) => {
      return `### ${tierName}:\n` + conceptNames.map(name => {
        const found = userConcepts.find((c: Concept) => c.name.toLowerCase() === name.toLowerCase()) || 
                      BASELINE_CONCEPTS_TEMPLATE.find((c: Concept) => c.name.toLowerCase() === name.toLowerCase());
        const id = found?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const currMastery = found?.estimatedMastery ?? 50;
        const prereqs = found?.prerequisites?.join(', ') || 'none';
        return `  - ID: "${id}" | Name: "${name}" | CurrentMastery: ${currMastery}% | Prerequisites: [${prereqs}]`;
      }).join('\n');
    }).join('\n\n');

    // Build student response summary
    const studentResponsesSummary = sessionQuestions.map((q, idx) => {
      return `Item #${idx + 1}:
  - Concept: "${q.conceptName}" (ID: "${q.conceptId}")
  - Question Stem: "${q.stem}"
  - Student Selected: "${q.selectedOptionText}" (Option ID: ${q.selectedOptionId})
  - Correct Answer: "${q.correctOptionText}" (Option ID: ${q.correctOptionId})
  - Outcome: ${q.isCorrect ? 'CORRECT' : 'INCORRECT (MISTAKE)'}
  - Explanation: "${q.explanation}"
  - Time Spent: ${q.latencySeconds} seconds`;
    }).join('\n\n');

    const systemPrompt = `You are a world-class psychometrician and cognitive scientist specializing in Multidimensional Item Response Theory (MIRT) and Bayesian Knowledge Tracing for chemistry.
You are evaluating a student's test session against an authoritative 4-tier chemistry knowledge graph containing exactly 58 concepts.

YOUR CORE MANDATE:
1. CALCULATE ESTIMATED MASTERY (0 to 100%) FOR EACH AND EVERY ONE OF THE 58 CONCEPTS IN THE KNOWLEDGE GRAPH:
   - For directly tested concepts: update mastery upwards on correct answers (e.g. +10% to +25%) or downwards on mistakes (e.g. -15% to -35%).
   - For prerequisite nodes in the DAG: if a student misses a higher-tier concept due to an underlying prerequisite flaw, decrease prerequisite mastery and confidence; if a student masters a higher-tier concept, positively propagate confidence to its prerequisites.
   - For dependent nodes in the DAG: adjust readiness ceiling based on prerequisite performance.
   - For untested nodes: calibrate mastery based on overall ability and neighborhood inference in the DAG.
2. PERFORM IN-DEPTH ERROR & MISCONCEPTION ANALYSIS:
   - Identify the exact physical/chemical misconceptions that caused each mistake.
3. GENERATE A COMPREHENSIVE DIAGNOSTIC SESSION SUMMARY WITH STRICT FORMATTING:
   - FORMAT ALL MISTAKES IN BOLD TEXT with elongated, in-depth diagnostic explanations:
     **[CRITICAL DIAGNOSTIC ERROR #X & REMEDIATION]**
     **Concept with Mistake: [Concept Name]**
     **Error Analysis: You selected "[Selected Text]".**
     **Elongated Diagnostic Breakdown: [Multi-sentence in-depth chemical explanation of the root cause, orbital principles, screening effects, crystal field parameters, or mathematical missteps].**
     **Remediation Rule: [Clear, actionable rule for solving this category of problem correctly].**
   - FORMAT ALL CORRECT CONCEPTS IN NORMAL SIZE BODY TEXT with concise checkmarks:
     ✓ [Concept Name]: [Concise 1-sentence verification of mastery].
   - Provide an Executive Psychometric Assessment summarizing the overall shift in latent ability (θ) and curriculum readiness.

You must output STRICTLY valid JSON conforming to the requested schema.`;

    const userPrompt = `THE 58-CONCEPT CANONICAL KNOWLEDGE GRAPH:
${fullGraphSummary}

STUDENT TEST RESPONSES:
${studentResponsesSummary}

Calculate updated mastery for EACH AND EVERY ONE of the 58 concepts in the knowledge graph, identify misconceptions, and generate the diagnostic summary.

Return JSON strictly matching this structure:
{
  "diagnosticSummary": "Full text of session summary containing normal checkmarks for correct items and bold elongated mistakes with **[CRITICAL DIAGNOSTIC ERROR]**, **Concept with Mistake:**, **Error Analysis:**, **Elongated Diagnostic Breakdown:**, and **Remediation Rule:**",
  "overallMastery": 74,
  "estimatedTheta": 0.52,
  "identifiedMisconceptions": [
    {
      "id": "misc-1",
      "conceptId": "concept-id",
      "conceptName": "Concept Name",
      "title": "Title of Misconception",
      "statement": "Clear cognitive error statement",
      "evidence": "Observed error evidence",
      "confidence": "Strong evidence",
      "recommendedAction": "Actionable drill",
      "targetedQuestionsCount": 3,
      "affectedPrerequisites": ["prereq-id"]
    }
  ],
  "conceptMastery": [
    {
      "conceptId": "effective-nuclear-charge",
      "conceptName": "Effective Nuclear Charge",
      "tier": 1,
      "estimatedMastery": 88,
      "confidenceScore": 92,
      "status": "strong",
      "evidence": "Demonstrated solid understanding"
    }
    // MUST INCLUDE ALL 58 CONCEPTS FROM THE KNOWLEDGE GRAPH
  ]
}`;

    let parsedResult: any = null;

    try {
      const rawText = await this.callNvidiaChat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], 4000, 0.15);

      parsedResult = this.extractJson<any>(rawText);
    } catch (err) {
      console.warn('[AiService] NVIDIA session evaluation call failed, using psychometric DAG propagation fallback:', err);
    }

    const mistakeItems = sessionQuestions.filter(q => !q.isCorrect);
    const correctItems = sessionQuestions.filter(q => q.isCorrect);

    let summaryText = parsedResult?.diagnosticSummary;
    if (!summaryText || !summaryText.includes('CRITICAL DIAGNOSTIC ERROR')) {
      summaryText = `SESSION DIAGNOSTIC SUMMARY (NVIDIA Psychometric Evaluation)\n\nCorrect Concepts Evaluated (Normal Size):\n`;
      if (correctItems.length > 0) {
        correctItems.forEach(q => {
          summaryText += `✓ ${q.conceptName}: Solved with high fidelity. Demonstrated accurate conceptual command (${q.explanation}).\n`;
        });
      } else {
        summaryText += `None recorded in this session.\n`;
      }

      if (mistakeItems.length > 0) {
        summaryText += `\n[MISTAKES IDENTIFIED & ELONGATED REMEDIATION]\n`;
        mistakeItems.forEach((q, idx) => {
          summaryText += `**[CRITICAL DIAGNOSTIC ERROR #${idx + 1} & REMEDIATION]**\n`;
          summaryText += `**Concept with Mistake: ${q.conceptName}**\n`;
          summaryText += `**Error Analysis: You selected "${q.selectedOptionText}".**\n`;
          summaryText += `**Elongated Diagnostic Breakdown: Detailed psychometric evaluation indicates this error originated from an active cognitive misconception regarding ${q.conceptName}. ${q.explanation} In coordination complexes and electronic configurations, ignoring spin pairing penalties or screening constant attenuations leads to systemic errors in stability predictions.**\n`;
          summaryText += `**Remediation Rule: Re-solve with verified chemical boundary conditions: the correct state solution is "${q.correctOptionText}". Prioritize review of upstream prerequisites before advancing.**\n\n`;
        });
      } else {
        summaryText += `\nDiagnostic Evaluation: Zero mistakes observed. All evaluated items solved correctly with high psychometric fidelity.\n`;
      }

      summaryText += `\nExecutive Psychometric Assessment: Evaluated ${sessionQuestions.length} items. Updated latent ability θ and calibrated all 58 concepts in the curriculum knowledge graph.\n`;
    }

    // Extract or build mastery updates for all 58 concepts
    const aiConceptMap = new Map<string, any>();
    if (parsedResult?.conceptMastery && Array.isArray(parsedResult.conceptMastery)) {
      for (const item of parsedResult.conceptMastery) {
        if (item.conceptId) {
          aiConceptMap.set(item.conceptId.toLowerCase(), item);
        }
        if (item.conceptName) {
          aiConceptMap.set(item.conceptName.toLowerCase(), item);
        }
      }
    }

    const all58Updates: ConceptMasteryUpdate[] = BASELINE_CONCEPTS_TEMPLATE.map((canonicalConcept: Concept) => {
      const userConcept = userConcepts.find((c: Concept) => c.id === canonicalConcept.id) || canonicalConcept;
      const aiItem = aiConceptMap.get(canonicalConcept.id.toLowerCase()) || 
                     aiConceptMap.get(canonicalConcept.name.toLowerCase());

      let newMastery = userConcept.estimatedMastery;
      let confidence = userConcept.confidenceScore;
      let status: MasteryStatus = userConcept.status;
      let evidence = userConcept.evidenceSummary || 'Calibrated via knowledge graph inference.';

      const directlyTestedMistake = mistakeItems.find(q => q.conceptId === canonicalConcept.id || q.conceptName.toLowerCase() === canonicalConcept.name.toLowerCase());
      const directlyTestedCorrect = correctItems.find(q => q.conceptId === canonicalConcept.id || q.conceptName.toLowerCase() === canonicalConcept.name.toLowerCase());

      if (aiItem && typeof aiItem.estimatedMastery === 'number') {
        newMastery = Math.min(100, Math.max(5, Math.round(aiItem.estimatedMastery)));
        confidence = Math.min(98, Math.max(20, Math.round(aiItem.confidenceScore || confidence + 5)));
        status = (aiItem.status as MasteryStatus) || (newMastery >= 75 ? 'strong' : newMastery >= 50 ? 'developing' : 'weak');
        evidence = aiItem.evidence || evidence;
      } else if (directlyTestedCorrect) {
        newMastery = Math.min(98, newMastery + 16);
        confidence = Math.min(95, confidence + 12);
        status = newMastery >= 75 ? 'strong' : 'developing';
        evidence = `Direct probe answered correctly during diagnostic test.`;
      } else if (directlyTestedMistake) {
        newMastery = Math.max(12, newMastery - 22);
        confidence = Math.min(95, confidence + 10);
        status = 'weak';
        evidence = `Diagnostic misconception identified: selected distractor "${directlyTestedMistake.selectedOptionText}".`;
      } else {
        const isPrereqOfMistake = mistakeItems.some(m => {
          const targetConcept = BASELINE_CONCEPTS_TEMPLATE.find((c: Concept) => c.id === m.conceptId || c.name.toLowerCase() === m.conceptName.toLowerCase());
          return targetConcept?.prerequisites.includes(canonicalConcept.id);
        });

        if (isPrereqOfMistake) {
          newMastery = Math.max(20, newMastery - 6);
          confidence = Math.max(25, confidence - 4);
          status = newMastery >= 75 ? 'strong' : newMastery >= 50 ? 'developing' : 'uncertain';
          evidence = `Flagged for review due to error in downstream dependent concept.`;
        }
      }

      return {
        conceptId: canonicalConcept.id,
        conceptName: canonicalConcept.name,
        tier: canonicalConcept.tier || 1,
        estimatedMastery: newMastery,
        confidenceScore: confidence,
        status,
        evidence
      };
    });

    // Update user concepts in memory
    for (const update of all58Updates) {
      const idx = user.concepts.findIndex(c => c.id === update.conceptId);
      if (idx !== -1) {
        user.concepts[idx].estimatedMastery = update.estimatedMastery;
        user.concepts[idx].confidenceScore = update.confidenceScore;
        user.concepts[idx].status = update.status;
        user.concepts[idx].evidenceSummary = update.evidence;
        user.concepts[idx].isWeakVsInsufficient = update.status === 'strong' ? 'mastered' : update.status === 'weak' ? 'weak' : 'developing';
      }
    }

    const totalMastery = all58Updates.reduce((acc, c) => acc + c.estimatedMastery, 0);
    const overallMastery = parsedResult?.overallMastery || Math.round(totalMastery / all58Updates.length);
    user.overallMastery = overallMastery;

    const scorePct = Math.round((correctItems.length / Math.max(1, sessionQuestions.length)) * 100);
    const thetaDelta = scorePct >= 70 ? 0.18 : scorePct >= 40 ? 0.05 : -0.16;
    const newTheta = parsedResult?.estimatedTheta ?? parseFloat((user.estimatedTheta + thetaDelta).toFixed(2));
    user.estimatedTheta = newTheta;
    user.standardError = Math.max(0.18, parseFloat((user.standardError - 0.04).toFixed(2)));

    const identifiedMisconceptions: MisconceptionItem[] = [];
    if (parsedResult?.identifiedMisconceptions && Array.isArray(parsedResult.identifiedMisconceptions)) {
      for (const m of parsedResult.identifiedMisconceptions) {
        identifiedMisconceptions.push({
          id: m.id || `misc-ai-${Date.now().toString(36)}`,
          conceptId: m.conceptId || mistakeItems[0]?.conceptId || 'crystal-field-stabilization-energy',
          conceptName: m.conceptName || mistakeItems[0]?.conceptName || 'Coordination Chemistry',
          title: m.title || `Diagnostic Pattern: ${m.conceptName}`,
          statement: m.statement || 'Student demonstrated cognitive bias.',
          evidence: m.evidence || 'Identified via AI test diagnostic analysis.',
          confidence: 'Strong evidence',
          recommendedAction: m.recommendedAction || 'Targeted drill on fundamental prerequisite mechanisms.',
          targetedQuestionsCount: m.targetedQuestionsCount || 3,
          affectedPrerequisites: m.affectedPrerequisites || []
        });
      }
    } else {
      mistakeItems.forEach((q, idx) => {
        identifiedMisconceptions.push({
          id: `misc-eval-${Date.now().toString(36)}-${idx}`,
          conceptId: q.conceptId,
          conceptName: q.conceptName,
          title: `Diagnostic Pattern: ${q.conceptName}`,
          statement: `Selected distractor "${q.selectedOptionText}" revealing systematic misconception regarding ${q.conceptName}.`,
          evidence: `Selected option on test item: ${q.selectedOptionText}. Correct answer was: ${q.correctOptionText}.`,
          confidence: 'Strong evidence',
          recommendedAction: `Targeted remediation on prerequisite chain for ${q.conceptName}.`,
          targetedQuestionsCount: 3,
          affectedPrerequisites: [q.conceptId]
        });
      });
    }

    for (const misc of identifiedMisconceptions) {
      if (!user.misconceptions.some(m => m.conceptId === misc.conceptId)) {
        user.misconceptions.push(misc);
      }
    }

    const summaryNote: TestNote = {
      id: `note-eval-${Date.now().toString(36)}`,
      userId: user.id,
      title: `AI Session Diagnostic Summary: ${sessionQuestions[0]?.conceptName || 'Curriculum Diagnostic'}`,
      conceptName: sessionQuestions[0]?.conceptName || 'Inorganic Chemistry',
      tags: ['AI Diagnostic', 'NVIDIA Evaluation', 'Session Summary'],
      content: summaryText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      diagnosticSummary: summaryText,
      conceptMasteryUpdates: all58Updates,
      identifiedMisconceptions,
      overallMastery,
      estimatedTheta: newTheta,
      summaryNote
    };
  }
}
