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
import { getRecommendedConceptByInformationGain } from '@/lib/informationGain';

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
  const { theme, openMisconception, setSelectedConceptId, currentUser, userRefreshTrigger } = useApp();
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

  const recommendedInfo = React.useMemo(() => getRecommendedConceptByInformationGain(concepts), [concepts]);
  const targetConcept = recommendedInfo.concept;
  const targetConceptId = targetConcept.id;
  const isNew = currentUser?.isNewUser ?? false;
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Vikrant';
  const primaryMisconception = misconceptions[0];


  const handleInspectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    router.push(`/knowledge-map?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* LEVEL 1: CONTEXT HEADER & COMPACT ESTIMATED MASTERY PANEL */}
      <section className={`flex flex-col md:flex-row md:items-end justify-between gap-5 pb-4 border-b ${
        isLight ? 'border-[#D7DEE7]' : 'border-slate-800'
      }`}>
        <div className="space-y-1.5">
          {/* Subtle contextual breadcrumb, no boxed pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${
              isLight ? 'text-[#526176]' : 'text-slate-400'
            }`}>
              Adaptive Diagnostic Session
            </span>
            {isNew && (
              <>
                <span className={isLight ? 'text-[#CBD5E1]' : 'text-slate-700'}>•</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  isLight 
                    ? 'bg-[#FFF7ED] text-[#C2410C]' 
                    : 'bg-amber-950/40 text-amber-300'
                }`}>
                  New Learner Profile
                </span>
              </>
            )}
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-[#172033]' : 'text-slate-100'
          }`}>
            Good evening, {firstName}
          </h1>
          <p className={`text-sm max-w-xl leading-relaxed mt-1 ${
            isLight ? 'text-[#526176]' : 'text-slate-400'
          }`}>
            {isNew
              ? 'Complete your baseline diagnostic session to calibrate latent ability estimates across the prerequisite DAG.'
              : 'Neuronotes has updated your psychometric model. Your next targeted actions are calculated to minimize posterior uncertainty and address emerging misconceptions.'}
          </p>
        </div>

        {/* Level 2: Compact Estimated Mastery Panel */}
        <div className={`p-4 sm:p-5 rounded-xl border shrink-0 min-w-[230px] transition-colors ${
          isLight 
            ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-[#718096]' : 'text-slate-400'
          }`}>
            <span>Estimated Mastery</span>
            <span className={`w-2 h-2 rounded-full ${isNew ? 'bg-amber-500' : 'bg-emerald-500'}`} title="Model status" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className={`text-4xl font-bold tabular-nums tracking-tight ${
              isLight ? 'text-[#172033]' : 'text-slate-100'
            }`}>
              {isNew ? 'Withheld' : `${currentUser?.overallMastery ?? 71}%`}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isNew 
                ? (isLight ? 'text-[#C2410C] bg-[#FFF7ED]' : 'text-amber-400 bg-amber-950/40')
                : (isLight ? 'text-[#15803D] bg-[#F0FDF4]' : 'text-emerald-400 bg-emerald-950/40')
            }`}>
              {isNew ? 'Baseline' : 'Calibrated'}
            </span>
          </div>
          <p className={`text-xs font-mono mt-1.5 ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
            {isNew 
              ? '58 concepts unprobed · Prior σ = 1.20'
              : `${currentUser?.itemsAnswered ?? 54} items · ${currentUser?.reliabilityScore ?? 89}% reliability`}
          </p>
        </div>
      </section>

      {/* PRIMARY WORKSPACE: NEXT BEST ACTION (COMPACT, UNIFIED DECISION WORKSPACE) */}
      <section className={`rounded-xl border border-l-[3px] border-l-[#2563EB] p-5 sm:p-6 transition-colors ${
        isLight 
          ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Top header row: unboxed label & telemetry */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Next Best Action
          </span>
          <span className={`text-xs font-mono ${
            isLight ? 'text-[#718096]' : 'text-slate-400'
          }`}>
            Optimized for maximum information gain
          </span>
        </div>

        {/* Content body and CTAs in efficient layout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-3 max-w-2xl">
            {/* Concept Title & Diagnostic Rationale */}
            <div>
              <h2 className={`text-2xl font-bold tracking-tight ${
                isLight ? 'text-[#172033]' : 'text-slate-100'
              }`}>
                {targetConcept.name}
              </h2>
              <p className={`text-sm mt-1 leading-relaxed ${
                isLight ? 'text-[#526176]' : 'text-slate-300'
              }`}>
                {recommendedInfo.rationale}
              </p>
            </div>

            {/* Dependency: Clean subtle inline band, not an independent box */}
            <div className={`text-xs flex flex-wrap items-center gap-2 py-1.5 px-3 rounded-lg ${
              isLight ? 'bg-[#EEF2F6] text-[#526176]' : 'bg-slate-950/70 text-slate-300'
            }`}>
              <span className={`font-semibold ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                Information Gain Centrality:
              </span>
              <span className="font-semibold text-[#2563EB] dark:text-blue-400">
                {targetConcept.domain || `Tier ${targetConcept.tier}`}
              </span>
              <span className={isLight ? 'text-[#718096]' : 'text-slate-400'}>
                • Connected to {recommendedInfo.connectedCount} concepts:
              </span>
              <span>
                {recommendedInfo.connectedNames.slice(0, 3).join(', ')}
              </span>
            </div>

            {/* Action Metadata: unboxed inline typography */}
            <div className={`flex flex-wrap items-center gap-2.5 text-xs pt-0.5 ${
              isLight ? 'text-[#718096]' : 'text-slate-400'
            }`}>
              <span className={`flex items-center gap-1.5 font-medium ${
                isLight ? 'text-[#172033]' : 'text-slate-200'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                Phase 1 Checkpoint (3 items)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~4 min
              </span>
              <span>·</span>
              <span className={`font-medium px-2 py-0.5 rounded-full border text-xs ${
                isLight 
                  ? 'text-[#7C3AED] bg-purple-50 border-purple-200' 
                  : 'text-purple-300 bg-purple-950/40 border-purple-800'
              }`}>
                Status: {targetConcept.status === 'insufficient_evidence' ? 'Unprobed Baseline' : targetConcept.status}
              </span>
            </div>


          </div>

          {/* Action CTAs: cleanly aligned */}
          <div className="flex flex-col gap-2 shrink-0 self-start lg:self-center">
            <Link
              href={`/quiz?topic=${encodeURIComponent(targetConcept.name)}&conceptId=${encodeURIComponent(targetConceptId)}&phase=1`}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition"
            >
              <span>Start Diagnostic Practice →</span>
            </Link>
            <button
              onClick={() => handleInspectConcept(targetConceptId)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition ${
                isLight 
                  ? 'bg-transparent hover:bg-[#EEF2F6] text-[#526176] hover:text-[#172033] border-[#D7DEE7]' 
                  : 'bg-transparent hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Inspect Concept Details
            </button>
          </div>
        </div>
      </section>

      {/* YOUR KNOWLEDGE: ANALYTICAL DISTRIBUTION */}
      <section className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h3 className={`text-base font-bold tracking-tight uppercase tracking-wide ${
              isLight ? 'text-[#172033]' : 'text-slate-100'
            }`}>
              Your Knowledge
            </h3>
            <p className={`text-xs ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
              Probabilistic mastery estimates calibrated across 45 active concepts
            </p>
          </div>
          <div className={`text-xs ${isLight ? 'text-[#718096]' : 'text-slate-500'}`}>
            Subject: <span className={`font-semibold ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>Chemistry</span>
            {' '}<span className="text-[#2563EB] font-semibold">• {isNew ? '0%' : '71%'} estimated mastery</span>
          </div>
        </div>

        {/* Analytical Distribution Card */}
        <div className={`p-5 rounded-xl border transition-colors ${
          isLight 
            ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex justify-between items-center text-xs pb-3">
            <span className={`font-semibold ${isLight ? 'text-[#526176]' : 'text-slate-300'}`}>
              Domain: Inorganic &amp; Coordination Chemistry
            </span>
            <span className={`font-mono text-xs ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
              Reliability Index: <strong className={isLight ? 'text-[#172033]' : 'text-slate-100'}>{isNew ? '12%' : '80%'}</strong>
            </span>
          </div>

          {/* Segmented Distribution Bar: Primary Visual Summary */}
          <div className={`h-2.5 w-full rounded-full overflow-hidden flex ${
            isLight ? 'bg-[#EEF2F6]' : 'bg-slate-800'
          }`}>
            {isNew ? (
              <div style={{ width: '100%' }} className="bg-slate-400" title="Insufficient Evidence: 9 concepts (100%)" />
            ) : (
              <>
                <div style={{ width: '53.3%' }} className="bg-emerald-500" title="Strong: 24 concepts (53%)" />
                <div style={{ width: '24.4%' }} className="bg-amber-500" title="Developing: 11 concepts (24%)" />
                <div style={{ width: '13.3%' }} className="bg-purple-500" title="Uncertain: 6 concepts (13%)" />
                <div style={{ width: '8.9%' }} className="bg-rose-500" title="Needs attention: 4 concepts (9%)" />
              </>
            )}
          </div>

          {/* 4 Analytical Metrics Row (Seamless Grid, not 4 cards) */}
          <div className={`grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x ${
            isLight ? 'divide-[#EEF2F6]' : 'divide-slate-800'
          } pt-5 mt-2`}>
            {/* Strong */}
            <div className="p-2 md:px-4 md:py-0 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Strong</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                {isNew ? 0 : 24} <span className="text-xs font-normal text-[#718096]">concepts</span>
              </p>
              <p className="text-xs text-[#718096]">
                {isNew ? 'No observations yet' : 'High mastery, narrow posterior'}
              </p>
            </div>

            {/* Developing */}
            <div className="p-2 md:px-4 md:py-0 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Developing</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                {isNew ? 0 : 11} <span className="text-xs font-normal text-[#718096]">concepts</span>
              </p>
              <p className="text-xs text-[#718096]">
                {isNew ? 'Awaiting test items' : 'Moderate ability, consolidating'}
              </p>
            </div>

            {/* Uncertain */}
            <div className="p-2 md:px-4 md:py-0 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span>Uncertain</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                {isNew ? 0 : 6} <span className="text-xs font-normal text-[#718096]">concepts</span>
              </p>
              <p className="text-xs text-[#718096]">
                {isNew ? 'Prior unprobed' : 'Needs probing observations'}
              </p>
            </div>

            {/* Needs Attention */}
            <div className="p-2 md:px-4 md:py-0 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526176] dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{isNew ? 'Insufficient' : 'Needs attention'}</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                {isNew ? 9 : 4} <span className="text-xs font-normal text-[#718096]">concepts</span>
              </p>
              <p className="text-xs text-[#718096]">
                {isNew ? 'Withheld pending diagnostic' : 'Diagnosed conceptual gap'}
              </p>
            </div>
          </div>

          {/* Psychometric distinction callout: quiet and integrated */}
          <div className={`mt-5 pt-3.5 border-t text-xs flex items-start gap-2.5 ${
            isLight ? 'border-[#EEF2F6] text-[#526176]' : 'border-slate-800 text-slate-400'
          }`}>
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className={isLight ? 'text-[#172033]' : 'text-slate-200'}>Neuronotes Psychometric Principle: </strong>
              Uncertain concepts are not treated as low scores. The model explicitly distinguishes between 
              <strong className={isLight ? 'text-rose-700 font-semibold' : 'text-rose-400 font-semibold'}> diagnosed weak knowledge </strong> 
              (e.g., Nernst Equation at 28%) and 
              <strong className={isLight ? 'text-[#172033] font-semibold' : 'text-slate-200 font-semibold'}> insufficient evidence </strong> 
              (wide posterior variance).
            </p>
          </div>
        </div>
      </section>

      {/* TWO COLUMNS: POSSIBLE MISCONCEPTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Possible Misconceptions */}
        <section className={`rounded-xl border p-5 space-y-4 transition-colors ${
          isLight 
            ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className={`text-sm font-bold tracking-tight ${
                isLight ? 'text-[#172033]' : 'text-slate-100'
              }`}>
                Possible Misconceptions
              </h3>
            </div>
            <Link
              href="/review"
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 flex items-center gap-1"
            >
              <span>View all ({misconceptions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {misconceptions.length === 0 ? (
            <div className={`p-5 rounded-lg border text-center ${
              isLight ? 'bg-[#F8FAFC] border-[#D7DEE7] text-[#526176]' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
            }`}>
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5 text-emerald-500" />
              <p className="text-xs font-semibold">No Misconception Patterns Flagged</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-[#718096]' : 'opacity-80'}`}>
                {isNew ? 'Initial baseline is clean. Bayesian pattern detector active.' : 'All conceptual models operating normally.'}
              </p>
            </div>
          ) : (
            primaryMisconception && (
              <div className={`p-4 rounded-lg border space-y-2.5 ${
                isLight 
                  ? 'bg-[#FFFDF9] border-[#FED7AA]' 
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${
                    isLight ? 'text-[#C2410C]' : 'text-amber-300'
                  }`}>
                    {primaryMisconception.conceptName}
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    isLight 
                      ? 'bg-amber-100/70 text-[#C2410C]' 
                      : 'bg-amber-900/40 text-amber-200'
                  }`}>
                    Confidence: {primaryMisconception.confidence}
                  </span>
                </div>

                <p className={`text-xs font-semibold ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                  &ldquo;{primaryMisconception.title}&rdquo;
                </p>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-[#526176]' : 'text-slate-300'}`}>
                  {primaryMisconception.statement}
                </p>

                <div className={`pt-2 border-t flex items-center justify-between ${
                  isLight ? 'border-[#FED7AA]/60' : 'border-amber-900/40'
                }`}>
                  <span className={`text-xs font-mono ${isLight ? 'text-[#C2410C]' : 'text-amber-300/80'}`}>
                    Evidence: {primaryMisconception.evidence}
                  </span>
                  <button
                    onClick={() => openMisconception(primaryMisconception)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition ${
                      isLight 
                        ? 'bg-white hover:bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]' 
                        : 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-200 border-amber-800'
                    }`}
                  >
                    Review
                  </button>
                </div>
              </div>
            )
          )}

          <div className={`py-2 px-3 rounded-lg text-xs flex items-center justify-between ${
            isLight ? 'bg-[#EEF2F6] text-[#526176]' : 'bg-slate-950/70 text-slate-300'
          }`}>
            <span>Emerging pattern: Reaction Quotient Q Inversion</span>
            <span className={`font-mono text-xs ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
              Confidence: Emerging
            </span>
          </div>
        </section>

        {/* Card: Recent Diagnostic Activity */}
        <section className={`rounded-xl border p-5 space-y-4 transition-colors ${
          isLight 
            ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <h3 className={`text-sm font-bold tracking-tight ${
                isLight ? 'text-[#172033]' : 'text-slate-100'
              }`}>
                Recent Diagnostic Activity
              </h3>
            </div>
            <Link
              href="/progress"
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 flex items-center gap-1"
            >
              <span>Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className={`p-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors ${
                  isLight ? 'bg-[#F8FAFC] hover:bg-[#EEF2F6]' : 'bg-slate-950/50 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                      {act.title}
                    </span>
                    <MasteryBadge status={act.statusBadge} size="sm" />
                  </div>
                  <p className={`text-xs ${isLight ? 'text-[#526176]' : 'text-slate-400'}`}>
                    {act.description}
                  </p>
                  {act.deltaMetric && (
                    <p className="text-[11px] font-mono text-[#2563EB] dark:text-blue-400 font-medium">
                      {act.deltaMetric}
                    </p>
                  )}
                </div>
                <span className={`text-[11px] font-mono shrink-0 ${isLight ? 'text-[#718096]' : 'text-slate-500'}`}>
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
