'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Layers
} from 'lucide-react';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';
import { Concept } from '@/types';
import { getRecommendedConceptByInformationGain, rankConceptsByInformationGain } from '@/lib/informationGain';

export const PracticeView: React.FC = () => {
  const router = useRouter();
  const { theme, currentUser } = useApp();
  const isLight = theme === 'light';

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('Effective Nuclear Charge');

  const topicsList = [
    'Effective Nuclear Charge',
    'Shielding Effect',
    'Orbital Penetration',
    'Atomic Radius Trend',
    'Ionization Enthalpy Trend',
    'Electron Gain Enthalpy Trend',
    'Electronegativity Trend',
    'Dipole Moment and Molecular Polarity',
    'Valence Shell Electron Pair Repulsion Theory',
    'Hybridization and Orbital Mixing Principles',
    'Molecular Orbital Theory and Delocalization',
    'Crystal Field Splitting in Octahedral Field',
    'Crystal Field Splitting in Tetrahedral Field',
    'Crystal Field Stabilization Energy',
    'High-Spin vs Low-Spin Complexes',
    'Spectrochemical Series',
    'Lanthanoid Contraction',
    'Inert Pair Effect',
    'Solubility Product and Precipitation Logic'
  ];

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const data = await api.getConcepts();
        if (data && data.length > 0) {
          setConcepts(data);
          const topRec = getRecommendedConceptByInformationGain(data);
          if (topRec?.concept?.name) {
            setSelectedTopic(topRec.concept.name);
          }
        }
      } catch (err) {
        console.error('Failed to load concepts for practice dropdown:', err);
      }
    };
    fetchConcepts();
  }, [currentUser?.id]);

  const recommendedInfo = React.useMemo(() => {
    return getRecommendedConceptByInformationGain(concepts);
  }, [concepts]);

  const rankedConcepts = React.useMemo(() => {
    return rankConceptsByInformationGain(concepts);
  }, [concepts]);

  const handleStartSession = () => {
    // Finds matching concept ID if available
    const matched = concepts.find(
      c => c.name.toLowerCase() === selectedTopic.toLowerCase() ||
           c.id.toLowerCase() === selectedTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    );
    const conceptId = matched ? matched.id : selectedTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/quiz?topic=${encodeURIComponent(selectedTopic)}&conceptId=${encodeURIComponent(conceptId)}&phase=1`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            Adaptive Practice & Diagnostic Evaluation
          </h2>
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
            Target Difficulty: Adaptive
          </span>
        </div>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Select a concept. The psychometric engine executes a 2-stage verification protocol to update your 58-dimensional ability vector (θ).
        </p>
      </div>

      {/* TOPIC SELECTION & PROTOCOL OVERVIEW */}
      <section className={`rounded-2xl border p-6 lg:p-8 space-y-6 shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* MAXIMUM INFORMATION GAIN RECOMMENDATION BANNER */}
        <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
          isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-blue-950/20 border-blue-800/60'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Recommended for Maximum Information Gain
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-blue-700' : 'text-blue-300'}`}>
                Connected to {recommendedInfo.connectedCount} Concepts
              </span>
            </div>
            <div className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {recommendedInfo.concept.name}
            </div>
            <p className={`text-xs max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Connected to <strong className="text-blue-600 dark:text-blue-400">{recommendedInfo.connectedCount} other concepts</strong> ({recommendedInfo.connectedNames.join(', ')}). Calibrating this concept provides maximum psychometric information gain across the knowledge graph.
            </p>
          </div>
          {selectedTopic !== recommendedInfo.concept.name ? (
            <button
              type="button"
              onClick={() => setSelectedTopic(recommendedInfo.concept.name)}
              className="shrink-0 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-sm"
            >
              Select Recommended
            </button>
          ) : (
            <span className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Optimal Probe Selected
            </span>
          )}
        </div>

        <div className="space-y-3">
          <label className={`text-xs font-mono uppercase tracking-wider block font-semibold ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Target Concept from Knowledge Graph (Ranked by Information Gain)
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className={`w-full rounded-xl px-4 py-3 text-base font-medium border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLight 
                ? 'bg-slate-50 border-slate-300 text-slate-900' 
                : 'bg-slate-950 border-slate-700 text-slate-100'
            }`}
          >
            {rankedConcepts.length > 0 ? (
              rankedConcepts.map((item, idx) => (
                <option key={item.concept.id} value={item.concept.name}>
                  {idx === 0 ? '✨ [MAX INFO GAIN] ' : ''}
                  {item.concept.name} ({item.concept.domain || `Tier ${item.concept.tier || 1}`}) — {item.connectedCount} connected concepts — Mastery: {item.concept.estimatedMastery}%
                </option>
              ))
            ) : concepts.length > 0 ? (
              concepts.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.domain || `Tier ${c.tier || 1}`}) — Mastery: {c.estimatedMastery}%
                </option>
              ))
            ) : (
              topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))
            )}
          </select>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Items will update your latent ability θ for this topic and propagate variance reduction along adjacent knowledge graph edges.
          </p>
        </div>

        {/* 2-PHASE ARCHITECTURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Phase 1 Card */}
          <div className={`p-5 rounded-xl border space-y-3 transition ${
            isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-blue-950/20 border-blue-800/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}>
                Phase 1 · Entry Checkpoint
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                Automated ~4 min
              </span>
            </div>
            <div>
              <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                3 Fundamental Questions
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Tests foundational ideas of the selected topic. Requires <strong className="text-emerald-600 dark:text-emerald-400">3 out of 3 correct</strong> to pass.
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
              isLight ? 'bg-white border-blue-100 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Score 3/3: Unlocks Phase 2 Comprehensive Quiz.</span>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Even 1 mistake: Provides detailed concept summary & review before retesting.</span>
              </div>
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className={`p-5 rounded-xl border space-y-3 transition ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                isLight ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Phase 2 · Comprehensive Quiz
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Automated ~15 min
              </span>
            </div>
            <div>
              <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                10 Adaptive Multi-Concept Questions
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Explores the selected concept combined with connected prerequisite and dependent concepts from the knowledge graph.
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Dynamically updates user $\theta$ vector (length 58) after each response.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Gatekept by Phase 1 verification to ensure solid foundational mastery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* START BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className={`text-xs font-mono block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Session Strategy: Automated Assessment Protocol
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Starting Phase 1 (3 Fundamental Questions) for &ldquo;{selectedTopic}&rdquo;
            </span>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full sm:w-auto py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
          >
            <span>Begin Diagnostic Assessment</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PracticeView;
