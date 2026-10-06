'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Clock, 
} from 'lucide-react';
import { Concept, ActivityLog } from '@/types';
import { MasteryBadge } from '@/components/mastery/MasteryBadge';
import { ConfidenceMeter } from '@/components/mastery/ConfidenceMeter';
import { useApp } from '@/components/layout/ClientLayout';

interface ProgressViewProps {
  concepts: Concept[];
  activities: ActivityLog[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  concepts,
  activities,
}) => {
  const router = useRouter();
  const { theme, setSelectedConceptId } = useApp();
  const isLight = theme === 'light';

  const handleInspectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    router.push(`/knowledge-map?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Psychometric Progress & Calibration
          </h2>
          <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
            isLight 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            MIRT Model Telemetry
          </span>
        </div>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Tracking multidimensional ability ($\theta$), posterior standard error reduction ($\sigma$), and concept stability over time.
        </p>
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Estimated Mean Mastery</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">71%</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Standardized across 45 topics</p>
        </div>
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Mean Standard Error</span>
          <p className="text-2xl font-bold font-mono text-violet-600 dark:text-violet-400">0.34 σ(θ)</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Down from initial prior 1.00</p>
        </div>
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Items Answered</span>
          <p className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>88 items</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>72% accuracy rate</p>
        </div>
        <div className={`p-4 rounded-xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Calibration Quality</span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">High</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>AIC/BIC convergence verified</p>
        </div>
      </div>

      {/* CONCEPT-BY-CONCEPT MASTERY BREAKDOWN */}
      <section className={`rounded-2xl border p-6 space-y-5 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className={`text-base font-semibold font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Concept Ability & Uncertainty Spectrum
            </h3>
          </div>
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Click any row to inspect
          </span>
        </div>

        <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleInspectConcept(concept.id)}
              className={`py-3.5 px-3 rounded-xl transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/60'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    {concept.name}
                  </h4>
                  <MasteryBadge status={concept.status} size="sm" />
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {concept.domain} · {concept.totalResponses} items administered
                </p>
              </div>

              <div className="w-full md:w-64 shrink-0">
                <ConfidenceMeter
                  mastery={concept.estimatedMastery}
                  confidence={concept.confidenceScore}
                  status={concept.status}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED ACTIVITY TIMELINE */}
      <section className={`rounded-2xl border p-6 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <h3 className={`text-base font-semibold font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Diagnostic History & Model Updates
          </h3>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{act.title}</span>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">({act.conceptName})</span>
                  <MasteryBadge status={act.statusBadge} size="sm" />
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{act.description}</p>
                {act.deltaMetric && (
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{act.deltaMetric}</p>
                )}
              </div>
              <span className={`text-xs font-mono shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProgressView;
