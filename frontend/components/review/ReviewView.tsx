'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FlaskConical, 
  TrendingUp
} from 'lucide-react';
import { MisconceptionItem, PastTestSession, PastTestQuestionReview } from '@/types';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';

interface ReviewViewProps {
  misconceptions: MisconceptionItem[];
  initialTests?: PastTestSession[];
}

export const ReviewView: React.FC<ReviewViewProps> = ({ 
  misconceptions: initialMisconceptions,
  initialTests = []
}) => {
  const { theme, startTargetedDrill, currentUser, userRefreshTrigger } = useApp();
  const isLight = theme === 'light';

  const [tests, setTests] = useState<PastTestSession[]>(initialTests);
  const [misconceptions, setMisconceptions] = useState<MisconceptionItem[]>(initialMisconceptions);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(initialTests[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'attempts' | 'misconceptions'>('attempts');

  // Synchronize strictly with real user attempts from backend
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [pastTests, realMisconceptions] = await Promise.all([
          api.getPastTests(),
          api.getMisconceptions()
        ]);
        setTests(pastTests || []);
        setMisconceptions(realMisconceptions || []);
        if (pastTests && pastTests.length > 0 && !expandedTestId) {
          setExpandedTestId(pastTests[0].id);
        }
      } catch (err) {
        console.error('Failed to refresh real attempt reviews:', err);
      }
    };
    fetchRealData();
  }, [currentUser?.id, userRefreshTrigger]);

  // Compute real attempt statistics
  const totalAttempts = tests.length;
  const totalQuestionsAttempted = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
  const totalCorrect = tests.reduce((sum, t) => sum + (t.correctCount || 0), 0);
  const cumulativeAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) 
    : 0;

  const toggleExpand = (testId: string) => {
    setExpandedTestId(prev => prev === testId ? null : testId);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent Session';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Diagnostic Attempt History & Review
          </h2>
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
            Real Session Telemetry
          </span>
        </div>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Item-level breakdown of all diagnostic attempts. Mistake patterns and cognitive distractors are tracked directly from your responses.
        </p>
      </div>

      {/* DYNAMIC TELEMETRY STATS (GROUNDED STRICTLY IN ACTUAL ATTEMPTS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Attempts */}
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-[11px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Completed Attempts
          </span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {totalAttempts}
          </p>
          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {totalAttempts === 0 ? 'No attempts recorded' : 'Recorded diagnostic runs'}
          </p>
        </div>

        {/* Cumulative Accuracy */}
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-[11px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Attempt Accuracy
          </span>
          <p className={`text-2xl font-bold font-mono ${
            cumulativeAccuracy >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
            cumulativeAccuracy >= 50 ? 'text-amber-600 dark:text-amber-400' :
            'text-rose-600 dark:text-rose-400'
          }`}>
            {cumulativeAccuracy}%
          </p>
          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {totalCorrect} of {totalQuestionsAttempted} items correct
          </p>
        </div>

        {/* Total Questions Attempted */}
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-[11px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Evaluated Items
          </span>
          <p className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
            {totalQuestionsAttempted}
          </p>
          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tested in adaptive sessions
          </p>
        </div>

        {/* Flagged Misconceptions */}
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-[11px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Active Misconceptions
          </span>
          <p className={`text-2xl font-bold font-mono ${
            misconceptions.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {misconceptions.length}
          </p>
          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {misconceptions.length > 0 ? 'Identified from mistakes' : 'Zero conflict patterns'}
          </p>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('attempts')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
            activeTab === 'attempts'
              ? 'bg-blue-600 text-white shadow-sm'
              : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Attempt History & Item Analysis ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('misconceptions')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
            activeTab === 'misconceptions'
              ? 'bg-blue-600 text-white shadow-sm'
              : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Detected Misconceptions ({misconceptions.length})
        </button>
      </div>

      {/* TAB 1: ATTEMPT HISTORY & ITEM-LEVEL ANALYSIS */}
      {activeTab === 'attempts' && (
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className={`p-10 rounded-2xl border text-center space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mx-auto">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  No Diagnostic Attempts Recorded Yet
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {currentUser?.name || 'You'} have not completed any adaptive assessments yet. Take an adaptive session to record your attempt history, evaluate answer choices, and identify misconception patterns.
                </p>
              </div>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition shadow-md shadow-blue-600/30"
              >
                <span>Start First Diagnostic Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            tests.map((test, testIdx) => {
              const isExpanded = expandedTestId === test.id;
              const isPerfect = test.score === 100;
              const isPassing = test.score >= 60;

              return (
                <div
                  key={test.id || testIdx}
                  className={`rounded-2xl border transition-all ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Attempt Card Header (Click to toggle expansion) */}
                  <div
                    onClick={() => toggleExpand(test.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-transparent hover:border-slate-100 dark:hover:border-slate-800/60"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isPerfect 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : isPassing 
                            ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          Attempt #{tests.length - testIdx} · {test.score}% Accuracy
                        </span>
                        <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {test.correctCount}/{test.totalQuestions} Solved
                        </span>
                      </div>
                      <h3 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {test.title}
                      </h3>
                      <div className={`flex flex-wrap items-center gap-3 text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(test.timestamp)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor((test.durationSeconds || 0) / 60)}m {(test.durationSeconds || 0) % 60}s
                        </span>
                        {test.thetaEnd !== undefined && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
                              <TrendingUp className="w-3.5 h-3.5" />
                              θ: {test.thetaStart?.toFixed(2) ?? '0.00'} → {test.thetaEnd?.toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className={`text-xs font-mono font-medium ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                        {isExpanded ? 'Hide Item Breakdown' : 'View Item Breakdown'}
                      </span>
                      <button className="p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Analysis & Breakdown */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
                      {/* Session Summary Note */}
                      {test.notes && test.notes.length > 0 && (
                        <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                          isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-blue-950/20 border-blue-900/40'
                        }`}>
                          <span className="font-mono uppercase font-bold text-blue-700 dark:text-blue-300 block">
                            Diagnostic Notes Summary:
                          </span>
                          <p className={`whitespace-pre-line leading-relaxed font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {test.notes[0].content}
                          </p>
                        </div>
                      )}

                      {/* Question by question breakdown */}
                      <div className="space-y-4">
                        <h4 className={`text-xs font-mono uppercase font-semibold tracking-wider ${
                          isLight ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          Question Breakdown & Student Decision Trace ({test.questions?.length || 0} Items)
                        </h4>

                        {test.questions && test.questions.length > 0 ? (
                          test.questions.map((q: PastTestQuestionReview, qIdx: number) => {
                            const isCorrect = q.isCorrect;

                            return (
                              <div
                                key={q.questionId || qIdx}
                                className={`p-4 rounded-xl border space-y-3 transition ${
                                  isCorrect
                                    ? isLight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-emerald-950/10 border-emerald-900/40'
                                    : isLight ? 'bg-rose-50/40 border-rose-200' : 'bg-rose-950/10 border-rose-900/40'
                                }`}
                              >
                                {/* Item Header */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                    }`}>
                                      {qIdx + 1}
                                    </span>
                                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                                      {q.conceptName}
                                    </span>
                                  </div>
                                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                                    isCorrect 
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300'
                                      : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300'
                                  }`}>
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Correct
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                        Incorrect
                                      </>
                                    )}
                                  </span>
                                </div>

                                {/* Context Notation */}
                                {q.contextNotation && (
                                  <div className={`p-2 rounded-lg font-mono text-xs border ${
                                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
                                  }`}>
                                    <span className="text-slate-400 mr-2">Context:</span>
                                    {q.contextNotation}
                                  </div>
                                )}

                                {/* Stem */}
                                <p className={`text-sm font-medium leading-relaxed whitespace-pre-line ${
                                  isLight ? 'text-slate-900' : 'text-slate-100'
                                }`}>
                                  {q.stem}
                                </p>

                                {/* Student Selection vs Correct Answer */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-mono">
                                  <div className={`p-2.5 rounded-lg border ${
                                    isCorrect 
                                      ? isLight ? 'bg-emerald-100/60 border-emerald-300 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                                      : isLight ? 'bg-rose-100/60 border-rose-300 text-rose-900' : 'bg-rose-950/40 border-rose-800 text-rose-200'
                                  }`}>
                                    <span className="block text-[10px] uppercase font-bold text-slate-500">Your Selection:</span>
                                    <span className="font-semibold">{q.selectedOptionText || 'No option recorded'}</span>
                                  </div>

                                  {!isCorrect && (
                                    <div className={`p-2.5 rounded-lg border ${
                                      isLight ? 'bg-emerald-100/60 border-emerald-300 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                                    }`}>
                                      <span className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Correct Solution:</span>
                                      <span className="font-semibold">{q.correctOptionText}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Explanation */}
                                {q.explanation && (
                                  <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                                  }`}>
                                    <strong className="text-blue-600 dark:text-blue-400 block font-mono text-[11px] mb-0.5">Scientific Rationale:</strong>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            Detailed item responses were saved at the summary level for this session.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: DETECTED COGNITIVE MISCONCEPTIONS */}
      {activeTab === 'misconceptions' && (
        <div className="space-y-4">
          {misconceptions.length === 0 ? (
            <div className={`p-10 rounded-2xl border text-center space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Zero Cognitive Misconceptions Flagged
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                No recurring cognitive misconception patterns have been detected in your diagnostic attempts so far. If you select misconception distractors during practice, the Bayesian detector will log and analyze them here.
              </p>
            </div>
          ) : (
            misconceptions.map((misc) => {
              const confidenceColor = 
                misc.confidence === 'Strong evidence'
                  ? (isLight ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-rose-500/10 text-rose-300 border-rose-500/30')
                  : misc.confidence === 'Moderate'
                  ? (isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-300 border-amber-500/30')
                  : (isLight ? 'bg-violet-50 text-violet-800 border-violet-200' : 'bg-violet-500/10 text-violet-300 border-violet-500/30');

              return (
                <div
                  key={misc.id}
                  className={`rounded-2xl border p-6 space-y-5 transition-all ${
                    isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-lg border ${
                        isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{misc.conceptName}</span>
                        <h3 className={`text-base font-bold font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                          {misc.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono border self-start sm:self-auto ${confidenceColor}`}>
                      Evidence: {misc.confidence}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className={`text-xs font-mono uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Pattern Description
                    </span>
                    <p className={`text-sm leading-relaxed font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      &ldquo;{misc.statement}&rdquo;
                    </p>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}>
                    <div className="space-y-1">
                      <span className={`font-mono text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Observable Evidence</span>
                      <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{misc.evidence}</p>
                    </div>
                    <div className={`space-y-1 md:border-l md:pl-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className={`font-mono text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recommended Remediation</span>
                      <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{misc.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Targeted drill: {misc.targetedQuestionsCount || 3} items
                    </span>
                    <button
                      onClick={() => startTargetedDrill(misc)}
                      className={`px-5 py-2.5 rounded-xl border font-mono text-xs font-semibold transition flex items-center gap-2 ${
                        isLight 
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm' 
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
                      }`}
                    >
                      <span>Launch Remediation Probe</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewView;

