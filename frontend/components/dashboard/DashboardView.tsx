'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Concept, MisconceptionItem, ActivityLog } from '@/types';
import { MasteryBadge } from '@/components/mastery/MasteryBadge';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';

interface DashboardViewProps {
  concepts: Concept[];
  misconceptions: MisconceptionItem[];
  activities: ActivityLog[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  concepts: initialConcepts,
  misconceptions: initialMisconceptions,
  activities: initialActivities,
}) => {
  const router = useRouter();
  const { theme, researcherMode, openMisconception, setSelectedConceptId, currentUser, userRefreshTrigger } = useApp();
  const isLight = theme === 'light';

  const [concepts, setConcepts] = React.useState<Concept[]>(initialConcepts);
  const [misconceptions, setMisconceptions] = React.useState<MisconceptionItem[]>(initialMisconceptions);
  const [activities, setActivities] = React.useState<ActivityLog[]>(initialActivities);

  React.useEffect(() => {
    const refreshData = async () => {
      try {
        const [c, m, a] = await Promise.all([
          api.getConcepts(),
          api.getMisconceptions(),
          api.getRecentActivities()
        ]);
        setConcepts(c);
        setMisconceptions(m);
        setActivities(a);
      } catch (e) {
        console.error('Failed to refresh dashboard data:', e);
      }
    };
    refreshData();
  }, [currentUser?.id, userRefreshTrigger]);

  const isNew = currentUser?.isNewUser ?? false;
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Vikrant';
  const primaryMisconception = misconceptions[0];

  const handleInspectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    router.push(`/knowledge-map?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* PAGE HEADER & HIGH-VISIBILITY MASTERY KPI */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
              Chemistry
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              isLight 
                ? 'bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              Physical & Electrochemistry
            </span>
            {isNew && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                New Learner Profile
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-semibold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            Good evening, {firstName}
          </h2>
          <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {isNew 
              ? 'Welcome to Neuronotes. Complete your initial baseline diagnostic session to establish calibrated ability estimates across the prerequisite DAG.'
              : 'Neuronotes has updated your psychometric model. Your next targeted actions are calculated to minimize posterior uncertainty and address emerging misconceptions.'}
          </p>
        </div>

        {/* High-visibility Mastery KPI */}
        <div className={`p-4 rounded-xl border shrink-0 min-w-[240px] ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            <span>Estimated Mastery</span>
            <span className={`w-2 h-2 rounded-full ${isNew ? 'bg-amber-500' : 'bg-emerald-500'}`} title="Model status" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-semibold tabular-nums tracking-tight ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {isNew ? 'Withheld' : `${currentUser?.overallMastery ?? 71}%`}
            </span>
            <span className={`text-xs font-medium ${
              isNew ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {isNew ? 'Baseline' : 'Calibrated'}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">
            {isNew 
              ? '9 concepts unprobed • Prior σ = 1.20'
              : `${currentUser?.itemsAnswered ?? 54} items • ${currentUser?.reliabilityScore ?? 89}% reliability`}
          </p>
        </div>
      </section>

      {/* PRIMARY CARD: NEXT BEST ACTION */}
      <section className={`relative rounded-xl border p-5 lg:p-6 shadow-sm border-l-4 border-l-blue-600 transition-colors ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-800' 
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Tag & Uncertainty Callout */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-blue-950/50 text-blue-300 border-blue-800'
              }`}>
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                NEXT BEST ACTION
              </span>

              {/* Visually prominent Posterior Uncertainty callout */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${
                isLight 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-purple-950/40 text-purple-300 border-purple-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                {isNew ? '95% prior uncertainty' : '63% posterior uncertainty'}
              </span>

              <span className="text-xs font-mono text-slate-400 hidden sm:inline ml-auto">
                Max information gain
              </span>
            </div>

            {/* Dominant Concept Title & Diagnostic Rationale */}
            <div>
              <h3 className={`text-xl lg:text-2xl font-semibold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                {isNew ? 'Thermodynamics Foundations' : 'Gibbs Energy (ΔG)'}
              </h3>
              <p className={`text-xs lg:text-sm mt-1.5 leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {isNew
                  ? 'As a new learner, your knowledge graph is uncalibrated. Administering foundational state function diagnostic items establishes your initial latent ability θ and gates downstream concepts.'
                  : 'Your current estimate for Gibbs Energy has high posterior uncertainty (63% variance). Probing this concept is required before downstream evaluation of dependent concepts.'}
              </p>
            </div>

            {/* Graph Prerequisite Dependency Context */}
            <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}>
              <span className="text-slate-400">Dependency:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {isNew ? 'Root Concept (Level 1)' : 'Gibbs Energy'}
              </span>
              <span>→ Gates:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {isNew ? 'Enthalpy (ΔH) & Entropy (ΔS)' : 'Cell Potential & Equilibrium Constant'}
              </span>
            </div>

            {/* Useful Action Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                3 targeted questions
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~7 min estimated
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                isLight 
                  ? 'text-purple-800 bg-purple-50 border-purple-200' 
                  : 'text-purple-300 bg-purple-950/40 border-purple-800'
              }`}>
                Status: Uncertain (Needs Probing)
              </span>
            </div>

            {/* Research Mode Psychometric Parameters */}
            {researcherMode && (
              <div className={`pt-2 text-xs font-mono border-t flex flex-wrap items-center gap-4 ${
                isLight ? 'border-slate-200 text-blue-700' : 'border-slate-800 text-blue-300'
              }`}>
                <span>Fisher Information I(θ): 1.48</span>
                <span>Expected Δσ(θ): -0.14</span>
                <span>Utility Score: 0.94</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start sm:self-auto lg:self-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm group"
            >
              <span>Start 3 Questions →</span>
            </Link>
            <button
              onClick={() => handleInspectConcept('gibbs-04')}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              Inspect Concept Details
            </button>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE SECTION: UNIFIED DIAGNOSTIC CONTAINER */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Knowledge State Breakdown
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Probabilistic mastery estimates calibrated across 45 active concepts
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <span>Subject: Chemistry</span>
            <span>•</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Physical & Electrochemistry</span>
          </div>
        </div>

        {/* Single Coherent Diagnostic Summary Container */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Domain: Physical & Electrochemistry
            </span>
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              Reliability Index: {isNew ? '12% (Sparse baseline)' : '89% (Calibrated)'}
            </span>
          </div>

          {/* Segmented Distribution Bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {isNew ? (
              <div style={{ width: '100%' }} className="bg-slate-400 dark:bg-slate-600 transition-opacity" title="Insufficient Evidence: 9 concepts (100%)" />
            ) : (
              <>
                <div style={{ width: '53.3%' }} className="bg-emerald-500 transition-opacity" title="Strong: 24 concepts (53%)" />
                <div style={{ width: '24.4%' }} className="bg-amber-500 transition-opacity" title="Developing: 11 concepts (24%)" />
                <div style={{ width: '13.3%' }} className="bg-purple-500 transition-opacity" title="Uncertain: 6 concepts (13%)" />
                <div style={{ width: '8.9%' }} className="bg-rose-500 transition-opacity" title="Needs attention: 4 concepts (9%)" />
              </>
            )}
          </div>

          {/* 4 Lightweight Metric Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 pt-1">
            {/* Strong */}
            <div className="p-3 md:px-4 md:py-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Strong</span>
              </div>
              <p className={`text-2xl font-semibold tabular-nums ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {isNew ? 0 : 24} <span className="text-xs font-normal text-slate-500">concepts</span>
              </p>
              <p className="text-[11px] text-slate-500">{isNew ? 'No observations yet' : 'High mastery, narrow posterior'}</p>
            </div>

            {/* Developing */}
            <div className="p-3 md:px-4 md:py-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Developing</span>
              </div>
              <p className={`text-2xl font-semibold tabular-nums ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {isNew ? 0 : 11} <span className="text-xs font-normal text-slate-500">concepts</span>
              </p>
              <p className="text-[11px] text-slate-500">{isNew ? 'Awaiting test items' : 'Moderate ability, consolidating'}</p>
            </div>

            {/* Uncertain */}
            <div className="p-3 md:px-4 md:py-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Uncertain</span>
              </div>
              <p className={`text-2xl font-semibold tabular-nums ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {isNew ? 0 : 6} <span className="text-xs font-normal text-slate-500">concepts</span>
              </p>
              <p className="text-[11px] text-slate-500">{isNew ? 'Prior unprobed' : 'Needs probing observations'}</p>
            </div>

            {/* Needs Attention */}
            <div className="p-3 md:px-4 md:py-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{isNew ? 'Insufficient' : 'Needs attention'}</span>
              </div>
              <p className={`text-2xl font-semibold tabular-nums ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {isNew ? 9 : 4} <span className="text-xs font-normal text-slate-500">concepts</span>
              </p>
              <p className="text-[11px] text-slate-500">{isNew ? 'Withheld pending diagnostic' : 'Diagnosed conceptual gap'}</p>
            </div>
          </div>

          {/* CRITICAL DISTINCTION CALLOUT */}
          <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
            isLight 
              ? 'bg-slate-50/80 border-slate-200/80 text-slate-600' 
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Neuronotes Psychometric Principle: 
              </span>
              <span>
                {' '}Uncertain concepts are <em>not</em> treated as low scores. The model explicitly distinguishes between 
                <strong className={isLight ? 'text-rose-700' : 'text-rose-400'}> diagnosed weak knowledge</strong> (high evidence of low mastery, e.g., Nernst Equation at 28%) and 
                <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}> insufficient evidence</strong> (wide variance, e.g., Faraday’s Law with sparse observations).
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMNS: POSSIBLE MISCONCEPTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Possible Misconceptions */}
        <section className={`rounded-xl border p-5 space-y-3.5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Possible Misconceptions
              </h3>
            </div>
            <Link
              href="/review"
              className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({misconceptions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {misconceptions.length === 0 ? (
            <div className={`p-5 rounded-lg border text-center ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
            }`}>
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5 text-emerald-500" />
              <p className="text-xs font-medium">No Misconception Patterns Flagged</p>
              <p className="text-[11px] mt-0.5 opacity-80">
                {isNew ? 'Initial baseline is clean. Bayesian pattern detector active.' : 'All conceptual models operating normally.'}
              </p>
            </div>
          ) : (
            primaryMisconception && (
              <div className={`p-3.5 rounded-lg border space-y-2.5 ${
                isLight 
                  ? 'bg-amber-50/40 border-amber-200' 
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-800 dark:text-amber-300 font-medium">
                    {primaryMisconception.conceptName}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isLight 
                      ? 'bg-amber-100 text-amber-800 border-amber-300' 
                      : 'bg-amber-900/40 text-amber-200 border-amber-800'
                  }`}>
                    Confidence: {primaryMisconception.confidence}
                  </span>
                </div>

                <p className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  &ldquo;{primaryMisconception.title}&rdquo;
                </p>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {primaryMisconception.statement}
                </p>

                <div className={`pt-2 border-t flex items-center justify-between ${
                  isLight ? 'border-amber-200/80' : 'border-amber-900/40'
                }`}>
                  <span className={`text-xs font-mono ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>
                    Evidence: {primaryMisconception.evidence}
                  </span>
                  <button
                    onClick={() => openMisconception(primaryMisconception)}
                    className={`px-2.5 py-1 rounded-md font-mono text-xs font-medium border transition ${
                      isLight 
                        ? 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-sm' 
                        : 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-200 border-amber-800'
                    }`}
                  >
                    Review
                  </button>
                </div>
              </div>
            )
          )}

          <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
            isLight ? 'bg-slate-50/80 border-slate-200/80 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <span>Emerging pattern: Reaction Quotient Q Inversion</span>
            <span className="font-mono text-slate-500">Confidence: Emerging</span>
          </div>
        </section>

        {/* Card: Recent Learning Activity */}
        <section className={`rounded-xl border p-5 space-y-3.5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Recent Diagnostic Activity
              </h3>
            </div>
            <Link
              href="/progress"
              className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 ${
                  isLight ? 'bg-slate-50/80 border-slate-200/80' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {act.title}
                    </span>
                    <MasteryBadge status={act.statusBadge} size="sm" />
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {act.description}
                  </p>
                  {act.deltaMetric && (
                    <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-medium">
                      {act.deltaMetric}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
