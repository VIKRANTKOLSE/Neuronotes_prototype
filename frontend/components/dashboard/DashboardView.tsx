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

interface DashboardViewProps {
  concepts: Concept[];
  misconceptions: MisconceptionItem[];
  activities: ActivityLog[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  concepts: _concepts,
  misconceptions,
  activities,
}) => {
  const router = useRouter();
  const { theme, researcherMode, openMisconception, setSelectedConceptId } = useApp();
  const isLight = theme === 'light';
  const primaryMisconception = misconceptions[0];

  const handleInspectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    router.push(`/knowledge-map?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Greeting & Subtitle */}
      <div>
        <p className={`text-xs uppercase font-mono tracking-widest font-medium mb-1 ${
          isLight ? 'text-blue-700' : 'text-blue-400'
        }`}>
          Adaptive Diagnostic Session
        </p>
        <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${
          isLight ? 'text-slate-900' : 'text-slate-100'
        }`}>
          Good evening, Vikrant
        </h2>
        <p className={`text-sm mt-1 max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Neuronotes has updated your psychometric model. Your next targeted actions are calculated to minimize posterior uncertainty and address emerging misconceptions.
        </p>
      </div>

      {/* PRIMARY CARD: WHAT SHOULD I DO NEXT? */}
      <section className={`relative overflow-hidden rounded-2xl border p-6 lg:p-7 shadow-elevated ${
        isLight 
          ? 'bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border-blue-200 text-slate-800' 
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-blue-500/30 text-slate-100'
      }`}>
        {/* Subtle accent border line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                isLight 
                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                  : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                NEXT BEST ACTION
              </span>
              <span className={`text-xs font-mono hidden sm:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Optimized for maximum information gain
              </span>
            </div>

            <div>
              <h3 className={`text-2xl font-bold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Gibbs Energy (ΔG)
              </h3>
              <p className={`text-sm mt-1.5 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Your current estimate for Gibbs Energy has high posterior uncertainty (63% confidence). Resolving this is critical before testing dependent concepts like Cell Potential and Equilibrium Constant.
              </p>
            </div>

            <div className={`flex flex-wrap items-center gap-4 text-xs font-mono pt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                <CheckCircle2 className="w-4 h-4 text-violet-500" />
                3 targeted questions
              </span>
              <span className="text-slate-400">•</span>
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                <Clock className="w-4 h-4 text-slate-400" />
                ~7 min estimated
              </span>
              <span className="text-slate-400">•</span>
              <span className={`px-2 py-0.5 rounded border ${
                isLight 
                  ? 'text-violet-800 bg-violet-50 border-violet-200' 
                  : 'text-violet-300 bg-violet-500/10 border-violet-500/20'
              }`}>
                Status: Uncertain (Needs Probing)
              </span>
            </div>

            {researcherMode && (
              <div className={`pt-2 text-xs font-mono border-t flex items-center gap-4 ${
                isLight ? 'border-slate-200 text-blue-700' : 'border-slate-800/80 text-blue-300/90'
              }`}>
                <span>Fisher Information I(θ): 1.48</span>
                <span>Expected Δσ(θ): -0.14</span>
                <span>Utility Score: 0.94</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/25 group"
            >
              <span>Start Practice</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => handleInspectConcept('gibbs-04')}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm' 
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              Inspect Concept Details
            </button>
          </div>
        </div>
      </section>

      {/* YOUR KNOWLEDGE OVERVIEW */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className={`text-base font-semibold uppercase tracking-wider font-mono ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              Your Knowledge
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Probabilistic mastery estimates calibrated across 45 active concepts
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Subject:</span>
            <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Chemistry</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">71% estimated mastery</span>
          </div>
        </div>

        {/* Global Progress Distribution Bar */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Domain: Physical & Electrochemistry</span>
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Reliability Index: 89%</span>
          </div>

          {/* Segmented Distribution Bar */}
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: '53.3%' }} className="bg-emerald-500 hover:opacity-90 transition-opacity" title="Strong: 24 concepts (53%)" />
            <div style={{ width: '24.4%' }} className="bg-amber-500 hover:opacity-90 transition-opacity" title="Developing: 11 concepts (24%)" />
            <div style={{ width: '13.3%' }} className="bg-violet-500 hover:opacity-90 transition-opacity" title="Uncertain: 6 concepts (13%)" />
            <div style={{ width: '8.9%' }} className="bg-rose-500 hover:opacity-90 transition-opacity" title="Needs attention: 4 concepts (9%)" />
          </div>

          {/* 4 Concept Categories Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Strong */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950/60 border-emerald-500/25'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">Strong</span>
              </div>
              <p className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                24 <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>concepts</span>
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>High mastery, tight posterior</p>
            </div>

            {/* Developing */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950/60 border-amber-500/25'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-mono font-medium text-amber-700 dark:text-amber-300">Developing</span>
              </div>
              <p className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                11 <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>concepts</span>
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Moderate ability, consolidating</p>
            </div>

            {/* Uncertain */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isLight ? 'bg-violet-50/60 border-violet-200' : 'bg-slate-950/60 border-violet-500/25'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-xs font-mono font-medium text-violet-700 dark:text-violet-300">Uncertain</span>
              </div>
              <p className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                6 <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>concepts</span>
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Needs probing observations</p>
            </div>

            {/* Needs Attention */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-950/60 border-rose-500/25'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-mono font-medium text-rose-700 dark:text-rose-400">Needs attention</span>
              </div>
              <p className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                4 <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>concepts</span>
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Diagnosed conceptual gap</p>
            </div>
          </div>

          {/* CRITICAL DISTINCTION CALLOUT */}
          <div className={`flex items-start gap-3 p-3.5 rounded-lg border text-xs ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}>
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Neuronotes Psychometric Principle: 
              </span>
              <span>
                {' '}Uncertain concepts are <em>not</em> treated as low scores. The model explicitly distinguishes between 
                <strong className={isLight ? 'text-rose-700' : 'text-rose-300'}> diagnosed weak knowledge</strong> (high evidence of low mastery, e.g., Nernst Equation at 28%) and 
                <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}> insufficient evidence</strong> (wide variance, e.g., Faraday’s Law with only 1 item).
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMNS: POSSIBLE MISCONCEPTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Possible Misconceptions */}
        <section className={`rounded-xl border p-5 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className={`text-sm font-semibold uppercase tracking-wider font-mono ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                Possible Misconceptions
              </h3>
            </div>
            <Link
              href="/review"
              className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all (3)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {primaryMisconception && (
            <div className={`p-4 rounded-xl border space-y-3 ${
              isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-500/10 border-amber-500/25'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-800 dark:text-amber-300 font-medium">
                  {primaryMisconception.conceptName}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isLight 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                }`}>
                  Confidence: {primaryMisconception.confidence}
                </span>
              </div>

              <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                &ldquo;{primaryMisconception.title}&rdquo;
              </p>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {primaryMisconception.statement}
              </p>

              <div className={`pt-2 border-t flex items-center justify-between ${
                isLight ? 'border-amber-200' : 'border-amber-500/20'
              }`}>
                <span className={`text-xs font-mono ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>
                  Evidence: {primaryMisconception.evidence}
                </span>
                <button
                  onClick={() => openMisconception(primaryMisconception)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition ${
                    isLight 
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm' 
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
                  }`}
                >
                  Review
                </button>
              </div>
            </div>
          )}

          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
          }`}>
            <span>Emerging pattern: Reaction Quotient Q Inversion</span>
            <span className={`font-mono ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Confidence: Emerging</span>
          </div>
        </section>

        {/* Card: Recent Learning Activity */}
        <section className={`rounded-xl border p-5 space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className={`text-sm font-semibold uppercase tracking-wider font-mono ${
                isLight ? 'text-slate-900' : 'text-slate-100'
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

          <div className="space-y-3">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{act.title}</span>
                    <MasteryBadge status={act.statusBadge} size="sm" />
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{act.description}</p>
                  {act.deltaMetric && (
                    <p className="text-[11px] font-mono text-blue-600 dark:text-blue-300">{act.deltaMetric}</p>
                  )}
                </div>
                <span className={`text-[11px] font-mono shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
