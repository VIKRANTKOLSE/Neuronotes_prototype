'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Activity, 
  RotateCcw,
  AlertTriangle,
  FlaskConical,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Question, SubmissionResult, PastTestQuestionReview } from '@/types';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';
import { QUESTIONS_POOL, CANONICAL_EDGES } from '@/lib/mockData';

interface QuizViewProps {
  initialQuestion?: Question;
  isAiGenerated?: boolean;
  initialConceptId?: string;
  initialTopic?: string;
  initialPhase?: number;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialQuestion = QUESTIONS_POOL[0],
  isAiGenerated = false,
  initialConceptId = 'effective-nuclear-charge',
  initialTopic = 'Effective Nuclear Charge',
  initialPhase = 1,
}) => {
  const router = useRouter();
  const { theme, openMisconception, currentUser, triggerRefresh } = useApp();
  const isLight = theme === 'light';

  // Phase state: 1 = Fundamental Checkpoint (3 questions), 2 = Comprehensive Adaptive Quiz (10 questions)
  const [phase, setPhase] = useState<number>(initialPhase);
  const [conceptId, setConceptId] = useState<string>(initialConceptId);
  const [conceptTopic, setConceptTopic] = useState<string>(initialTopic);

  const [questionsQueue, setQuestionsQueue] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const totalQuestions = phase === 1 ? 3 : 10;

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [showWhyQuestion, setShowWhyQuestion] = useState<boolean>(false);

  // Time is automatically allocated by the system:
  // Phase 1: 4 mins (240s), Phase 2: 15 mins (900s)
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Completed items in this session
  const [sessionReviews, setSessionReviews] = useState<PastTestQuestionReview[]>([]);
  const [finishModalOpen, setFinishModalOpen] = useState<boolean>(false);
  const [sessionNoteTitle, setSessionNoteTitle] = useState<string>('');
  const [sessionNoteContent, setSessionNoteContent] = useState<string>('');
  const [isSavingTest, setIsSavingTest] = useState<boolean>(false);

  // Phase 1 Outcome States
  const [phase1Completed, setPhase1Completed] = useState<boolean>(false);
  const [phase1Passed, setPhase1Passed] = useState<boolean>(false);
  const [conceptSummaryData, setConceptSummaryData] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

  // Load questions for the active phase
  const loadPhaseQuestions = useCallback(async (targetPhase: number, targetConcept: string) => {
    setIsQuestionsLoading(true);
    setQuestionIndex(1);
    setSessionReviews([]);
    setIsSubmitted(false);
    setSelectedOptionId(null);
    setSubmissionResult(null);
    setPhase1Completed(false);
    setPhase1Passed(false);

    try {
      if (targetPhase === 1) {
        const fundamentalQs = await api.getFundamentalQuestions(targetConcept);
        if (fundamentalQs && fundamentalQs.length > 0) {
          setCurrentQuestion(fundamentalQs[0]);
          setQuestionsQueue(fundamentalQs.slice(1));
        }
      } else {
        const adaptiveQs = await api.getAdaptiveQuizQuestions(targetConcept);
        if (adaptiveQs && adaptiveQs.length > 0) {
          setCurrentQuestion(adaptiveQs[0]);
          setQuestionsQueue(adaptiveQs.slice(1));
        }
      }
    } catch (err) {
      console.warn('Failed to load phase questions, using default pool:', err);
      setCurrentQuestion(QUESTIONS_POOL[0]);
      setQuestionsQueue(QUESTIONS_POOL.slice(1, targetPhase === 1 ? 3 : 10));
    } finally {
      setIsQuestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhaseQuestions(phase, conceptId);
  }, [phase, conceptId, loadPhaseQuestions]);

  // Automated timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (id: string) => {
    if (isSubmitted || isSubmitting) return;
    setSelectedOptionId(id);
  };

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitted || isSubmitting) return;
    setIsSubmitting(true);

    const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const correctOpt = currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId);

    try {
      const result = await api.submitAnswer({
        questionId: currentQuestion.id,
        selectedOptionId,
        latencySeconds: secondsElapsed,
      });

      setSubmissionResult(result);
      setIsSubmitted(true);

      const review: PastTestQuestionReview = {
        questionId: currentQuestion.id,
        conceptId: currentQuestion.conceptId,
        conceptName: currentQuestion.conceptName,
        stem: currentQuestion.stem,
        contextNotation: currentQuestion.contextNotation,
        selectedOptionId,
        selectedOptionText: chosenOption?.text || '',
        correctOptionId: currentQuestion.correctOptionId,
        correctOptionText: correctOpt?.text || '',
        isCorrect: result.isCorrect,
        explanation: result.explanation || currentQuestion.explanation,
        latencySeconds: secondsElapsed,
        psychometricDelta: result.thetaUpdate ? {
          priorTheta: result.thetaUpdate.priorTheta,
          newTheta: result.thetaUpdate.newTheta,
          delta: parseFloat((result.thetaUpdate.newTheta - result.thetaUpdate.priorTheta).toFixed(2))
        } : undefined
      };

      setSessionReviews((prev) => {
        const nextReviews = [...prev, review];
        
        // If this was the last question of Phase 1 (3 items)
        if (phase === 1 && nextReviews.length >= 3) {
          const correctCount = nextReviews.filter(r => r.isCorrect).length;
          const score = Math.round((correctCount / nextReviews.length) * 100);
          setPhase1Completed(true);
          if (correctCount === 3) {
            setPhase1Passed(true);
          } else {
            setPhase1Passed(false);
            // Load concept refresher summary
            setLoadingSummary(true);
            api.getConceptSummary(conceptId).then(summary => {
              setConceptSummaryData(summary);
              setLoadingSummary(false);
            }).catch(() => setLoadingSummary(false));
          }

          // Strictly save attempt to history and analysis
          api.recordTest({
            title: `Phase 1 Fundamental Checkpoint: ${conceptTopic}`,
            durationSeconds: secondsElapsed,
            score,
            correctCount,
            totalQuestions: nextReviews.length,
            topicsTested: [conceptTopic],
            thetaStart: currentUser?.estimatedTheta || 0.0,
            thetaEnd: (currentUser?.estimatedTheta || 0.0) + (score === 100 ? 0.25 : -0.25),
            questions: nextReviews,
          }).catch(err => console.error('Failed to auto-save Phase 1 attempt:', err));
        }

        return nextReviews;
      });

      // Notify app that user mastery was updated so header/badges update live
      triggerRefresh();
    } catch {
      const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
      const fallbackResult = {
        isCorrect,
        explanation: currentQuestion.explanation,
        conceptTested: currentQuestion.conceptName,
        newEstimatedMastery: isCorrect ? 82 : 68,
        nextQuestionConcept: currentQuestion.conceptName,
      };
      setSubmissionResult(fallbackResult);
      setIsSubmitted(true);

      const review: PastTestQuestionReview = {
        questionId: currentQuestion.id,
        conceptId: currentQuestion.conceptId,
        conceptName: currentQuestion.conceptName,
        stem: currentQuestion.stem,
        contextNotation: currentQuestion.contextNotation,
        selectedOptionId,
        selectedOptionText: chosenOption?.text || '',
        correctOptionId: currentQuestion.correctOptionId,
        correctOptionText: correctOpt?.text || '',
        isCorrect,
        explanation: currentQuestion.explanation,
        latencySeconds: secondsElapsed,
      };

      setSessionReviews((prev) => {
        const nextReviews = [...prev, review];
        if (phase === 1 && nextReviews.length >= 3) {
          const correctCount = nextReviews.filter(r => r.isCorrect).length;
          const score = Math.round((correctCount / nextReviews.length) * 100);
          setPhase1Completed(true);
          if (correctCount === 3) {
            setPhase1Passed(true);
          } else {
            setPhase1Passed(false);
            api.getConceptSummary(conceptId).then(summary => {
              setConceptSummaryData(summary);
            });
          }

          api.recordTest({
            title: `Phase 1 Fundamental Checkpoint: ${conceptTopic}`,
            durationSeconds: secondsElapsed,
            score,
            correctCount,
            totalQuestions: nextReviews.length,
            topicsTested: [conceptTopic],
            thetaStart: currentUser?.estimatedTheta || 0.0,
            thetaEnd: (currentUser?.estimatedTheta || 0.0) + (score === 100 ? 0.25 : -0.25),
            questions: nextReviews,
          }).catch(err => console.error('Failed to auto-save Phase 1 attempt:', err));
        }
        return nextReviews;
      });
      triggerRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (questionsQueue.length > 0) {
      const nextQ = questionsQueue[0];
      setQuestionsQueue((prev) => prev.slice(1));
      setCurrentQuestion(nextQ);
      setQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setSubmissionResult(null);
    } else {
      // Completed current phase questions!
      if (phase === 1) {
        const correctCount = sessionReviews.filter(r => r.isCorrect).length;
        setPhase1Completed(true);
        if (correctCount === 3) {
          setPhase1Passed(true);
        } else {
          setPhase1Passed(false);
          api.getConceptSummary(conceptId).then(setConceptSummaryData);
        }
      } else {
        // Phase 2 completed! Open finish modal
        setFinishModalOpen(true);
      }
    }
  };

  // User unlocks Phase 2 after passing Phase 1
  const handleProceedToPhase2 = () => {
    setPhase(2);
    setPhase1Completed(false);
    setPhase1Passed(false);
    loadPhaseQuestions(2, conceptId);
  };

  // User retests fundamentals after reading summary
  const handleRetestFundamentals = () => {
    setPhase(1);
    setPhase1Completed(false);
    setPhase1Passed(false);
    setConceptSummaryData(null);
    loadPhaseQuestions(1, conceptId);
  };

  const handleFinishAndSaveTest = async () => {
    if (sessionReviews.length === 0) return;
    setIsSavingTest(true);

    const correctCount = sessionReviews.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / sessionReviews.length) * 100);
    const topicsTested = Array.from(new Set(sessionReviews.map((r) => r.conceptName)));
    const testTitle = `${phase === 1 ? 'Fundamental Checkpoint' : 'Adaptive Diagnostic'}: ${conceptTopic}`;

    try {
      await api.evaluateAiSession({
        questions: sessionReviews,
        title: testTitle,
        durationSeconds: secondsElapsed
      });
      setFinishModalOpen(false);
      triggerRefresh();
      router.push('/tests');
    } catch {
      const testPayload = {
        title: testTitle,
        durationSeconds: secondsElapsed,
        score,
        correctCount,
        totalQuestions: sessionReviews.length,
        topicsTested,
        thetaStart: currentUser?.estimatedTheta || 0.0,
        thetaEnd: (currentUser?.estimatedTheta || 0.0) + (score >= 60 ? 0.15 : -0.1),
        questions: sessionReviews,
        notes: sessionNoteTitle.trim() ? [{
          id: `note-auto-${Date.now().toString(36)}`,
          userId: currentUser?.id || 'user-history',
          title: sessionNoteTitle.trim(),
          content: sessionNoteContent.trim() || 'Key takeaways from adaptive session.',
          conceptName: topicsTested[0] || 'General Chemistry',
          tags: ['Adaptive Test Note', 'Review'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }] : []
      };

      try {
        await api.recordTest(testPayload);
      } catch (recordErr) {
        console.error('Failed to record test session:', recordErr);
      }
      setFinishModalOpen(false);
      triggerRefresh();
      router.push('/tests');
    } finally {
      setIsSavingTest(false);
    }
  };

  const isCorrect = submissionResult ? submissionResult.isCorrect : selectedOptionId === currentQuestion.correctOptionId;
  const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
  const progressPct = Math.round((questionIndex / totalQuestions) * 100);

  // Derive prerequisite concept names
  const conceptSlug = currentQuestion.conceptId;
  const prerequisiteNames = CANONICAL_EDGES
    .filter((e) => e.target === conceptSlug)
    .map((e) => e.sourceName);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* PHASE BANNER & TELEMETRY HEADER */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl border ${
              phase === 1 
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}>
              <FlaskConical className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  phase === 1 
                    ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                }`}>
                  {phase === 1 ? 'Phase 1: Fundamental Checkpoint' : 'Phase 2: Comprehensive Adaptive Quiz'}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Target: {currentQuestion.conceptName}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {phase === 1 
                  ? 'Answer 3/3 fundamental questions correctly to unlock the 10-question adaptive quiz.' 
                  : 'Testing target topic + interconnected DAG concepts. Continuous θ calibration.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className={`text-[11px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Scope</span>
              <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Item {questionIndex} / {totalQuestions}
              </span>
            </div>

            {/* Automated Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <button
              onClick={() => router.push('/practice')}
              className={`text-xs font-mono underline ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ${phase === 1 ? 'bg-blue-600' : 'bg-emerald-600'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className={`flex justify-between items-center text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Target Item Difficulty: Adaptive</span>
            <span>{progressPct}% Completed ({questionIndex}/{totalQuestions})</span>
          </div>
        </div>
      </div>

      {/* --- PHASE 1 FAILED: SHOW CONCEPT REFRESHER SUMMARY --- */}
      {phase === 1 && phase1Completed && !phase1Passed && (
        <div className={`p-6 lg:p-8 rounded-2xl border space-y-6 shadow-md transition ${
          isLight ? 'bg-amber-50/50 border-amber-300' : 'bg-amber-950/20 border-amber-800/80'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-400">
                  Fundamental Checkpoint Incomplete ({sessionReviews.filter(r => r.isCorrect).length}/3 Correct)
                </span>
                <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Concept Mastery Refresher: &ldquo;{conceptTopic}&rdquo;
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded border bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200">
              Review Required Before Retest
            </span>
          </div>

          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Because you got at least one foundational question wrong, your MIRT ability vector has registered uncertainty in this node. Review the essential principles below, then re-attend the 3-question checkpoint to prove mastery.
          </p>

          {/* Refresher Details */}
          {loadingSummary ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              Synthesizing domain knowledge summary...
            </div>
          ) : (
            <div className={`p-5 rounded-xl border space-y-4 text-xs font-mono leading-relaxed ${
              isLight ? 'bg-white border-amber-200 text-slate-800' : 'bg-slate-900 border-amber-800/60 text-slate-200'
            }`}>
              <div>
                <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider mb-1">
                  1. Core Scientific Principle & Definition
                </span>
                <p className="font-sans text-sm">
                  {conceptSummaryData?.coreDefinition || 'Core atomic/molecular principle governing electronic stability and orbital interactions.'}
                </p>
              </div>

              <div>
                <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider mb-1">
                  2. Governing Laws & Dependencies
                </span>
                <ul className="list-disc pl-5 space-y-1">
                  {conceptSummaryData?.governingPrinciples?.map((p: string, idx: number) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {conceptSummaryData?.keyEquations?.length > 0 && (
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider mb-1">
                    3. Essential Equations & Formulas
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {conceptSummaryData.keyEquations.map((eq: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded border bg-slate-100 dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider mb-1">
                  4. Common Cognitive Misconceptions to Avoid
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {conceptSummaryData?.commonMisconceptions?.map((m: string, idx: number) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action to Attend Again */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Ready to re-test? You will receive 3 fresh fundamental diagnostic probes.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/practice')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                Back to Practice
              </button>
              <button
                onClick={handleRetestFundamentals}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs font-mono transition shadow-md shadow-amber-600/30 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>I&apos;ve Reviewed — Retest Fundamentals</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 1 PASSED: UNLOCK PHASE 2 MODAL/BANNER --- */}
      {phase === 1 && phase1Completed && phase1Passed && (
        <div className={`p-6 lg:p-8 rounded-2xl border space-y-6 shadow-md transition ${
          isLight ? 'bg-emerald-50/60 border-emerald-300' : 'bg-emerald-950/20 border-emerald-800/80'
        }`}>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
              <Award className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400">
                Perfect Score: 3/3 on Fundamentals
              </span>
              <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Fundamentals Verified! Phase 2 Unlocked
              </h3>
            </div>
          </div>

          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Outstanding! You correctly answered all 3 fundamental questions for <strong className="text-emerald-600 dark:text-emerald-400">{conceptTopic}</strong>. Your latent ability $\theta$ has been updated and your baseline mastery has risen. You are now cleared to enter the comprehensive 10-question adaptive quiz.
          </p>

          <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
            isLight ? 'bg-white border-emerald-200 text-slate-800' : 'bg-slate-900 border-emerald-800/60 text-slate-200'
          }`}>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
              Phase 2 Scope: 10 Adaptive Multi-Concept Questions
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
              This session will test {conceptTopic} alongside connected prerequisite and dependent concepts in the Knowledge Graph, dynamically updating your 58-dimensional ability vector.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => router.push('/practice')}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Return to Practice
            </button>
            <button
              onClick={handleProceedToPhase2}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs font-mono transition shadow-md shadow-emerald-600/30 flex items-center gap-2"
            >
              <span>Enter 10-Question Comprehensive Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- STANDARD QUESTION RUNNER (When not showing phase completion banner) --- */}
      {(!phase1Completed || phase === 2) && (
        isQuestionsLoading ? (
          <div className={`rounded-2xl border p-12 text-center space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Retrieving calibrated diagnostic probe...
            </p>
          </div>
        ) : (
        <div className={`rounded-2xl border p-6 lg:p-8 space-y-6 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Context Notation */}
          {currentQuestion.contextNotation && (
            <div className={`p-3.5 rounded-xl border font-mono text-xs tracking-wide flex items-center justify-between ${
              isLight ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-slate-950/80 border-slate-800 text-blue-300/90'
            }`}>
              <span className={`font-sans font-medium ${isLight ? 'text-blue-800' : 'text-slate-400'}`}>Chemical Context:</span>
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{currentQuestion.contextNotation}</span>
            </div>
          )}

          {/* Stem */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
              Item #{questionIndex} · {phase === 1 ? 'Fundamental Checkpoint' : 'Adaptive Probe'}
            </span>
            <p className={`text-base lg:text-lg font-medium leading-relaxed whitespace-pre-line ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {currentQuestion.stem}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOpt = option.id === currentQuestion.correctOptionId;

              let optionStyle = isLight 
                ? 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-800' 
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-200';

              if (isSelected && !isSubmitted) {
                optionStyle = isLight
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                  : 'bg-blue-950/40 border-blue-500 text-blue-200 shadow-sm';
              }

              if (isSubmitted) {
                if (isCorrectOpt) {
                  optionStyle = isLight
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                    : 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium';
                } else if (isSelected && !isCorrectOpt) {
                  optionStyle = isLight
                    ? 'bg-red-50 border-red-500 text-red-950'
                    : 'bg-red-950/40 border-red-500 text-red-200';
                } else {
                  optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-xl border text-sm transition cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                    isSelected 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}>
                    {option.label}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="leading-relaxed">{option.text}</p>
                    {isSubmitted && option.isMisconceptionDistractor && option.misconceptionRationale && (
                      <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 pt-1">
                        Cognitive Misconception Pattern: {option.misconceptionRationale}
                      </p>
                    )}
                  </div>
                  {isSubmitted && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          {!isSubmitted ? (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId || isSubmitting}
                className={`py-3 px-8 rounded-xl font-medium text-xs font-mono transition shadow-md flex items-center gap-2 ${
                  !selectedOptionId || isSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                <span>{isSubmitting ? 'Calibrating MIRT Parameters...' : 'Submit Diagnostic Response'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Post-submission Review Block */
            <div className="space-y-5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className={`p-4 rounded-xl border space-y-2 ${
                isCorrect 
                  ? isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-800' 
                  : isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/20 border-red-800'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-800 dark:text-emerald-300">Correct Response · Latent Ability θ Boosted</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-red-800 dark:text-red-300">Incorrect Response · Uncertainty Flagged</span>
                    </>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {phase === 1 
                    ? `Phase 1 Progress: ${questionIndex} of 3 completed` 
                    : `Phase 2 Progress: ${questionIndex} of 10 completed`}
                </span>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono transition shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>
                    {questionIndex < totalQuestions 
                      ? 'Proceed to Next Item' 
                      : phase === 1 ? 'Evaluate Phase 1 Fundamentals' : 'Complete Adaptive Quiz'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        )
      )}

      {/* FINISH MODAL FOR PHASE 2 */}
      {finishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Complete & Save Adaptive Diagnostic Quiz
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Record this session ({sessionReviews.length} items) into {currentUser?.name}&apos;s test history.
                </p>
              </div>
              <button
                onClick={() => setFinishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className={`p-3.5 rounded-xl border grid grid-cols-3 gap-2 text-center text-xs font-mono ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-700'
            }`}>
              <div>
                <span className="text-slate-400 block text-[10px]">SOLVED</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {sessionReviews.filter(r => r.isCorrect).length}/{sessionReviews.length}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ACCURACY</span>
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {Math.round((sessionReviews.filter(r => r.isCorrect).length / sessionReviews.length) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TIME</span>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  {Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
              isLight ? 'bg-purple-50/70 border-purple-200 text-purple-900' : 'bg-purple-950/30 border-purple-800 text-purple-200'
            }`}>
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">MIRT Theta Vector Calibration</span>
                <span className="text-[10px] opacity-90 block mt-0.5 leading-relaxed">
                  Upon saving, the backend synchronizes your 58-dimensional $\theta$ vector and updates the Knowledge Graph in Supabase.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setFinishModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono border"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishAndSaveTest}
                disabled={isSavingTest}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono shadow-md"
              >
                {isSavingTest ? 'Saving & Calibrating...' : 'Confirm & Save Test Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
