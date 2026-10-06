'use client';

import React from 'react';
import { 
  ArrowRight, 
  ShieldAlert, 
} from 'lucide-react';
import { MisconceptionItem } from '@/types';
import { useApp } from '@/components/layout/ClientLayout';

interface ReviewViewProps {
  misconceptions: MisconceptionItem[];
}

export const ReviewView: React.FC<ReviewViewProps> = ({ misconceptions }) => {
  const { theme, startTargetedDrill } = useApp();
  const isLight = theme === 'light';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Misconceptions & Diagnostic Review
          </h2>
          <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
            isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            Bayesian Pattern Detector
          </span>
        </div>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Probabilistic detection of conceptual conflicts. Patterns are flagged when student responses consistently follow known theoretical distractors.
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Flagged Patterns</span>
          <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">3 detected</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Non-punitive diagnostic flags</p>
        </div>
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Strong Evidence</span>
          <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">1 pattern</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>High likelihood of recurring conflict</p>
        </div>
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Emerging / Moderate</span>
          <p className="text-2xl font-bold font-mono text-violet-600 dark:text-violet-400">2 patterns</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Preliminary observations</p>
        </div>
      </div>

      {/* Misconception cards list */}
      <div className="space-y-4">
        {misconceptions.map((misc) => {
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
                  Confidence: {misc.confidence}
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
                  <span className={`font-mono text-[11px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recommended Resolution</span>
                  <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{misc.recommendedAction}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Targeted remediation: {misc.targetedQuestionsCount} diagnostic items
                </span>
                <button
                  onClick={() => startTargetedDrill(misc)}
                  className={`px-5 py-2.5 rounded-xl border font-mono text-xs font-semibold transition flex items-center gap-2 ${
                    isLight 
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm' 
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
                  }`}
                >
                  <span>Start Targeted Remediation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewView;
