'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Question, SubmissionResult, PastTestQuestionReview } from '@/types';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';
import { QUESTIONS_POOL } from '@/lib/mockData';

interface QuizViewProps {
  initialQuestion?: Question;
  isAiGenerated?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialQuestion = QUESTIONS_POOL[0],
  isAiGenerated = false,
}) => {
  const router = useRouter();
  const { theme, researcherMode, toggleResearcherMode, openMisconception, currentUser } = useApp();
  const isLight = theme === 'light';

  const [aiActive, setAiActive] = useState<boolean>(isAiGenerated);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGeneratedQueue, setAiGeneratedQueue] = useState<Question[]>([]);

  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [totalQuestions] = useState<number>(5);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [showWhyQuestion, setShowWhyQuestion] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Completed items in this session
  const [sessionReviews, setSessionReviews] = useState<PastTestQuestionReview[]>([]);
  const [finishModalOpen, setFinishModalOpen] = useState<boolean>(false);
  const [sessionNoteTitle, setSessionNoteTitle] = useState<string>('');
  const [sessionNoteContent, setSessionNoteContent] = useState<string>('');
  const [isSavingTest, setIsSavingTest] = useState<boolean>(false);

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
    if (isSubmitted || isLoading) return;
    setSelectedOptionId(id);
  };

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsLoading(true);

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
      setSessionReviews((prev) => [...prev, review]);
    } catch {
      const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
      const fallbackResult = {
        isCorrect,
        explanation: currentQuestion.explanation,
        conceptTested: currentQuestion.conceptName,
        newEstimatedMastery: isCorrect ? 82 : 68,
        nextQuestionConcept: 'Gibbs Energy (ΔG)',
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
      setSessionReviews((prev) => [...prev, review]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerAiTest = async () => {
    setIsGeneratingAi(true);
    try {
      const generated = await api.generateAiTest({
        numQuestions: 5,
        userTheta: currentUser?.estimatedTheta || 0.2
      });
      if (generated && generated.length > 0) {
        setAiActive(true);
        setCurrentQuestion(generated[0]);
        setAiGeneratedQueue(generated.slice(1));
        setQuestionIndex(1);
        setSessionReviews([]);
        handleReset();
      }
    } catch (e) {
      console.warn('AI Test generation error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFinishAndSaveTest = async () => {
    if (sessionReviews.length === 0) return;
    setIsSavingTest(true);

    const correctCount = sessionReviews.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / sessionReviews.length) * 100);
    const topicsTested = Array.from(new Set(sessionReviews.map((r) => r.conceptName)));
    const testTitle = `Adaptive Diagnostic: ${topicsTested.join(', ')}`;

    try {
      // 1. Invoke NVIDIA NIM AI Evaluation:
      // Finds errors, calculates mastery across ALL 58 concepts in the knowledge graph,
      // and synthesizes structured bold elongated mistake diagnostic summaries.
      await api.evaluateAiSession({
        questions: sessionReviews,
        title: testTitle,
        durationSeconds: secondsElapsed
      });

      setFinishModalOpen(false);
      router.push('/tests');
    } catch (err) {
      console.warn('AI session evaluation failed, falling back to standard test recorder:', err);
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
      router.push('/tests');
    } finally {
      setIsSavingTest(false);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsLoading(false);
    setSubmissionResult(null);
  };

  const handleNextQuestion = async () => {
    setIsLoading(true);
    try {
      if (aiGeneratedQueue.length > 0) {
        const nextQ = aiGeneratedQueue[0];
        setAiGeneratedQueue((prev) => prev.slice(1));
        setCurrentQuestion(nextQ);
        setQuestionIndex((prev) => Math.min(totalQuestions, prev + 1));
        handleReset();
      } else {
        const nextQ = await api.getAdaptiveQuestion();
        setCurrentQuestion(nextQ);
        setQuestionIndex((prev) => Math.min(totalQuestions, prev + 1));
        handleReset();
      }
    } catch {
      const nextIndex = (QUESTIONS_POOL.findIndex((q) => q.id === currentQuestion.id) + 1) % QUESTIONS_POOL.length;
      setCurrentQuestion(QUESTIONS_POOL[nextIndex]);
      setQuestionIndex((prev) => Math.min(totalQuestions, prev + 1));
      handleReset();
    } finally {
      setIsLoading(false);
    }
  };

  const isCorrect = submissionResult ? submissionResult.isCorrect : selectedOptionId === currentQuestion.correctOptionId;
  const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
  const hasTriggeredMisconception = isSubmitted && !isCorrect && (selectedOption?.isMisconceptionDistractor || !!submissionResult?.triggeredMisconception);

  const progressPct = Math.round((questionIndex / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TOP BAR */}
      <div className={`rounded-xl border p-4 lg:p-5 space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`p-1.5 rounded-lg border ${
              isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              <FlaskConical className="w-4 h-4" />
            </span>
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Subject
              </span>
              <h3 className={`text-sm font-semibold font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {currentQuestion.subject}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Question Counter */}
            <div className="text-right">
              <span className={`text-xs font-mono block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Progress</span>
              <span className={`text-sm font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Question {questionIndex} / {totalQuestions}
              </span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            {/* NVIDIA AI Generator Button */}
            <button
              onClick={handleTriggerAiTest}
              disabled={isGeneratingAi}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition ${
                aiActive
                  ? isLight ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm' : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  : isLight ? 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200' : 'bg-slate-950 hover:bg-purple-950/40 text-slate-300 border-slate-800'
              }`}
              title="Generate fresh adaptive diagnostic test using NVIDIA NIM API"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin text-purple-500' : 'text-purple-500'}`} />
              <span>{isGeneratingAi ? 'Generating...' : aiActive ? 'NVIDIA AI Mode' : '✨ Generate with NVIDIA AI'}</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className={`text-xs font-mono underline ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Exit Session
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="space-y-1">
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className={`flex justify-between items-center text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Adaptive Item Stream</span>
            <span>{progressPct}% Completed</span>
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className={`rounded-2xl border p-6 lg:p-8 space-y-6 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Context / Notation block */}
        {currentQuestion.contextNotation && (
          <div className={`p-3.5 rounded-xl border font-mono text-xs tracking-wide flex items-center justify-between ${
            isLight ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-slate-950/80 border-slate-800 text-blue-300/90'
          }`}>
            <span className={`font-sans font-medium ${isLight ? 'text-blue-800' : 'text-slate-400'}`}>Cell Notation:</span>
            <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{currentQuestion.contextNotation}</span>
          </div>
        )}

        {/* Question Stem */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
            Target Item
          </span>
          <p className={`text-base lg:text-lg font-medium leading-relaxed whitespace-pre-line ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {currentQuestion.stem}
          </p>
        </div>

        {/* ANSWER OPTIONS (All states) */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isOptionCorrect = opt.id === currentQuestion.correctOptionId;

            let cardClasses = isLight
              ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              : 'bg-slate-950/70 border-slate-800/90 text-slate-200 hover:border-slate-700 hover:bg-slate-950';

            let badgeClasses = isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : 'bg-slate-900 border-slate-800 text-slate-400';

            if (isSelected && !isSubmitted) {
              cardClasses = isLight
                ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-sm'
                : 'bg-blue-600/10 border-blue-500 text-slate-100 shadow-[0_0_12px_rgba(37,99,235,0.15)]';
              badgeClasses = 'bg-blue-600 text-white border-blue-500';
            }

            if (isSubmitted) {
              if (isOptionCorrect) {
                cardClasses = isLight
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-emerald-500/10 border-emerald-500/60 text-slate-100 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
                badgeClasses = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isOptionCorrect) {
                cardClasses = isLight
                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-sm'
                  : 'bg-rose-500/10 border-rose-500/60 text-slate-100 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
                badgeClasses = 'bg-rose-600 text-white border-rose-600';
              } else {
                cardClasses = isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  : 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                badgeClasses = isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-400'
                  : 'bg-slate-900 border-slate-800 text-slate-600';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSubmitted || isLoading}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 lg:p-5 rounded-xl border text-left flex items-start gap-4 transition-all duration-150 ${cardClasses} ${
                  isSubmitted ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${badgeClasses}`}>
                  {opt.label}
                </span>
                <div className="flex-1 text-sm lg:text-base leading-relaxed pt-0.5">
                  {opt.text}
                </div>
                {isSubmitted && isOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !isOptionCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT ACTION BAR */}
        {!isSubmitted ? (
          <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {selectedOptionId ? 'Answer chosen · Ready to evaluate' : 'Select an answer option to proceed'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId || isLoading}
              className={`px-6 py-3 rounded-xl font-medium text-sm font-mono transition shadow-md flex items-center gap-2 ${
                selectedOptionId && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                  : isLight
                  ? 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* POST-SUBMISSION IMMEDIATE FEEDBACK */
          <div className={`pt-4 border-t space-y-5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className={`p-5 rounded-xl border ${
              isCorrect 
                ? (isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30')
                : (isLight ? 'bg-amber-50 border-amber-300' : 'bg-amber-500/10 border-amber-500/30')
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">✓ Correct</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-300">Analysis Completed</span>
                  </>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {submissionResult?.explanation || currentQuestion.explanation}
              </p>
            </div>

            {/* PSYCHOMETRIC TELEMETRY PILLS */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl font-mono text-xs border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div>
                <span className={`text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>CONCEPT TESTED</span>
                <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{currentQuestion.conceptName}</span>
              </div>
              <div>
                <span className={`text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ESTIMATED MASTERY</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{submissionResult?.newEstimatedMastery || 78}%</span>
              </div>
              <div>
                <span className={`text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>NEXT QUESTION</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{submissionResult?.nextQuestionConcept || 'Gibbs Energy (ΔG)'}</span>
              </div>
            </div>

            {/* MISCONCEPTION DETECTION HOOK */}
            {hasTriggeredMisconception && (
              <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border ${
                isLight ? 'bg-amber-50 border-amber-300' : 'bg-amber-500/15 border-amber-500/40'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>POSSIBLE MISCONCEPTION DETECTED</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {selectedOption?.misconceptionRationale || 'Cell potential and Gibbs free energy may be getting conflated.'}
                  </p>
                </div>
                <button
                  onClick={() => openMisconception({
                    id: 'misc-modal-1',
                    conceptId: currentQuestion.conceptId,
                    conceptName: currentQuestion.conceptName,
                    title: 'Cell Potential and Gibbs Free Energy Conflation',
                    statement: 'You may be treating cell potential and Gibbs free energy as independent quantities rather than recognizing their inverse thermodynamic coupling.',
                    evidence: '2 of your last 3 responses suggest this pattern.',
                    confidence: 'Moderate',
                    recommendedAction: 'Review the relationship ΔG° = -nFE°cell with sign invariance exercises.',
                    targetedQuestionsCount: 3,
                    affectedPrerequisites: ['crystal-field-splitting-in-octahedral-field', 'ligand-field-theory']
                  })}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium border whitespace-nowrap transition ${
                    isLight 
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm' 
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
                  }`}
                >
                  View Misconception Report
                </button>
              </div>
            )}

            {/* NEXT QUESTION & FINISH TEST ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={handleReset}
                className={`px-3 py-2 text-xs font-mono flex items-center gap-1.5 ${
                  isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Option Re-selection (Simulation)</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {sessionReviews.length > 0 && (
                  <button
                    onClick={() => setFinishModalOpen(true)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition flex items-center gap-2 ${
                      isLight 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>Save to Past Tests ({sessionReviews.length})</span>
                  </button>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono transition shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Proceed to Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FINISH SESSION & SAVE MODAL */}
      {finishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Complete & Save Adaptive Test
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

            {/* NVIDIA AI Evaluation Notice */}
            <div className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
              isLight ? 'bg-purple-50/70 border-purple-200 text-purple-900' : 'bg-purple-950/30 border-purple-800 text-purple-200'
            }`}>
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">NVIDIA NIM Psychometric AI Evaluation</span>
                <span className="text-[10px] opacity-90 block mt-0.5 leading-relaxed">
                  Upon saving, NVIDIA NIM analyzes your cognitive mistakes, calculates mastery for all 58 concepts across the 4-tier Knowledge Graph, and generates an in-depth elongated diagnostic summary note.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono font-medium text-slate-500">
                Attach Diagnostic Note to this Session (Optional)
              </label>
              <input
                type="text"
                placeholder="Note Title: e.g. Sign rule for galvanic cell ΔG°"
                value={sessionNoteTitle}
                onChange={(e) => setSessionNoteTitle(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-slate-800 border-slate-700 focus:border-blue-500'
                }`}
              />
              <textarea
                rows={3}
                placeholder="Write observations, tricky formulas, or mistakes to review later in your Notes..."
                value={sessionNoteContent}
                onChange={(e) => setSessionNoteContent(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-slate-800 border-slate-700 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFinishModalOpen(false)}
                className={`px-4 py-2 text-xs rounded-lg border ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                Keep Testing
              </button>
              <button
                onClick={handleFinishAndSaveTest}
                disabled={isSavingTest}
                className="px-4 py-2 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm"
              >
                {isSavingTest ? 'Saving to Database...' : 'Save & View in Past Tests →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE FEATURE: "WHY THIS QUESTION?" */}
      <section className={`rounded-xl border overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <button
          onClick={() => setShowWhyQuestion(!showWhyQuestion)}
          className={`w-full p-4 flex items-center justify-between text-left transition ${
            isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Why am I seeing this question?
            </span>
            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
              isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              Explainable AI
            </span>
          </div>
          {showWhyQuestion ? (
            <ChevronUp className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          )}
        </button>

        {showWhyQuestion && (
          <div className={`p-5 pt-2 border-t space-y-4 ${
            isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/60'
          }`}>
            <div className={`p-4 rounded-xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <p className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Neuronotes selected this question because:
              </p>
              <ol className={`space-y-2 text-xs font-sans list-decimal list-inside leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <li className="pl-1">
                  <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-100 font-medium'}>
                    Uncertainty resolution: 
                  </strong> 
                  {' '}{currentQuestion.diagnosticRationale.uncertaintyReason}
                </li>
                <li className="pl-1">
                  <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-100 font-medium'}>
                    Targeted remediation: 
                  </strong> 
                  {' '}{currentQuestion.diagnosticRationale.recentDifficultyReason}
                </li>
                <li className="pl-1">
                  <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-100 font-medium'}>
                    Prerequisite sequencing: 
                  </strong> 
                  {' '}{currentQuestion.diagnosticRationale.prerequisiteReason}
                </li>
                <li className="pl-1">
                  <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-100 font-medium'}>
                    Information optimization: 
                  </strong> 
                  {' '}{currentQuestion.diagnosticRationale.informationGainReason}
                </li>
              </ol>
            </div>

            {/* RESEARCHER / ADMIN MODE PSYCHOMETRICS */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span className={`text-xs font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Psychometric Model Parameters
                  </span>
                </div>
                <button
                  onClick={toggleResearcherMode}
                  className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {researcherMode ? 'Hide Admin View' : 'Show Admin / Research View'}
                </button>
              </div>

              {researcherMode ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 font-mono text-[11px]">
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Fisher Info I(θ)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentQuestion.diagnosticRationale.fisherInformation}</span>
                  </div>
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Estimated Ability (θ)</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{currentQuestion.diagnosticRationale.estimatedTheta}</span>
                  </div>
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Standard Error σ(θ)</span>
                    <span className="text-violet-600 dark:text-violet-400 font-bold">{currentQuestion.diagnosticRationale.standardError}</span>
                  </div>
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Item Discrim. (a)</span>
                    <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{currentQuestion.diagnosticRationale.itemDiscrimination}</span>
                  </div>
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Prereq. Coverage</span>
                    <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{currentQuestion.diagnosticRationale.prerequisiteCoverageIndex}</span>
                  </div>
                  <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className={isLight ? 'text-slate-500 block' : 'text-slate-500 block'}>Selection Utility</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{currentQuestion.diagnosticRationale.utilityScore}</span>
                  </div>
                </div>
              ) : (
                <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Mathematical item selection formulas are withheld from student view. Toggle Research Mode to inspect Fisher Information, θ, and discrimination metrics.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default QuizView;
