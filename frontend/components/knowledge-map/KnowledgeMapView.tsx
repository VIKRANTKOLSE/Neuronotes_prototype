'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
} from 'lucide-react';
import { Concept, MasteryStatus } from '@/types';
import { MasteryBadge } from '@/components/mastery/MasteryBadge';
import { ConfidenceMeter } from '@/components/mastery/ConfidenceMeter';
import { useApp } from '@/components/layout/ClientLayout';

interface KnowledgeMapViewProps {
  concepts: Concept[];
}

const NODE_WIDTH = 210;
const NODE_HEIGHT = 92;

export const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({ concepts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, selectedConceptId, setSelectedConceptId } = useApp();
  const isLight = theme === 'light';

  const [filterStatus, setFilterStatus] = useState<MasteryStatus | 'all'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    const queryConcept = searchParams.get('conceptId');
    if (queryConcept) {
      setSelectedConceptId(queryConcept);
    }
  }, [searchParams, setSelectedConceptId]);

  const selectedConcept = concepts.find((c) => c.id === selectedConceptId);

  // Compute connections between prerequisites and concepts
  const connections: { from: Concept; to: Concept }[] = [];
  concepts.forEach((concept) => {
    concept.prerequisites.forEach((prereqId) => {
      const prereqConcept = concepts.find((c) => c.id === prereqId);
      if (prereqConcept) {
        connections.push({ from: prereqConcept, to: concept });
      }
    });
  });

  const getStatusBorder = (status: MasteryStatus, isSelected: boolean) => {
    if (isSelected) {
      return isLight 
        ? 'border-blue-600 shadow-[0_0_16px_rgba(37,99,235,0.25)] ring-2 ring-blue-500/40' 
        : 'border-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/30';
    }
    switch (status) {
      case 'strong': 
        return isLight 
          ? 'border-emerald-500/60 hover:border-emerald-600 hover:shadow-md' 
          : 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'developing': 
        return isLight 
          ? 'border-amber-500/60 hover:border-amber-600 hover:shadow-md' 
          : 'border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'uncertain': 
        return isLight 
          ? 'border-violet-500/70 hover:border-violet-600 hover:shadow-md animate-pulse' 
          : 'border-violet-500/50 hover:border-violet-400 hover:shadow-[0_0_12px_rgba(139,92,246,0.3)] animate-pulse';
      case 'weak': 
        return isLight 
          ? 'border-rose-500/60 hover:border-rose-600 hover:shadow-md' 
          : 'border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'insufficient_evidence': 
        return isLight 
          ? 'border-slate-300 hover:border-slate-400' 
          : 'border-slate-700/60 hover:border-slate-500';
    }
  };

  const getStatusNodeBg = (status: MasteryStatus) => {
    if (isLight) {
      switch (status) {
        case 'strong': return 'bg-white hover:bg-emerald-50/40';
        case 'developing': return 'bg-white hover:bg-amber-50/40';
        case 'uncertain': return 'bg-white hover:bg-violet-50/50';
        case 'weak': return 'bg-white hover:bg-rose-50/40';
        case 'insufficient_evidence': return 'bg-slate-50/90 hover:bg-white';
      }
    }
    switch (status) {
      case 'strong': return 'bg-gradient-to-b from-slate-900 to-emerald-950/20';
      case 'developing': return 'bg-gradient-to-b from-slate-900 to-amber-950/20';
      case 'uncertain': return 'bg-gradient-to-b from-slate-900 to-violet-950/30';
      case 'weak': return 'bg-gradient-to-b from-slate-900 to-rose-950/20';
      case 'insufficient_evidence': return 'bg-gradient-to-b from-slate-900 to-slate-950';
    }
  };

  const handleStartPracticeConcept = (conceptId: string) => {
    router.push(`/quiz?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-semibold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Prerequisite Knowledge Map
            </h2>
            <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
              isLight 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              DAG Visualizer
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Directional dependencies governing adaptive question sequencing. Clean hierarchical layout without node overlaps.
          </p>
        </div>

        {/* Filter & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            {(['all', 'strong', 'developing', 'uncertain', 'weak', 'insufficient_evidence'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                  filterStatus === st 
                    ? 'bg-blue-600 text-white font-medium shadow-sm' 
                    : isLight 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'all' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.65, z - 0.1))}
              className={`p-1 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={`text-xs font-mono px-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className={`p-1 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className={`p-1 border-l ${isLight ? 'text-slate-600 hover:text-slate-900 border-slate-200' : 'text-slate-400 hover:text-slate-200 border-slate-800'}`}
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Graph on Left/Center, Detail Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GRAPH CANVAS CONTAINER */}
        <div className={`${selectedConcept ? 'lg:col-span-8' : 'lg:col-span-12'} rounded-2xl p-6 relative overflow-auto min-h-[640px] shadow-sm transition-all border ${
          isLight 
            ? 'bg-slate-100/70 border-slate-200' 
            : 'bg-slate-950 border-slate-800/90'
        }`}>
          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-25" 
            style={{
              backgroundImage: isLight 
                ? 'radial-gradient(#94a3b8 1px, transparent 1px)' 
                : 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div 
            className="relative transition-transform duration-200 origin-top-left"
            style={{ 
              width: '920px', 
              height: '920px',
              transform: `scale(${zoomLevel})` 
            }}
          >
            {/* SVG Connecting Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <marker
                  id="arrowhead-default"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill={isLight ? '#94a3b8' : '#475569'} />
                </marker>
                <marker
                  id="arrowhead-highlight"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
                </marker>
              </defs>

              {connections.map((conn, idx) => {
                const isHighlighted = 
                  selectedConceptId === conn.from.id || 
                  selectedConceptId === conn.to.id;

                // Center of parent node (bottom)
                const startX = conn.from.position.x + NODE_WIDTH / 2;
                const startY = conn.from.position.y + NODE_HEIGHT;
                // Center of child node (top)
                const endX = conn.to.position.x + NODE_WIDTH / 2;
                const endY = conn.to.position.y;

                // Smooth Bezier curve
                const midY = (startY + endY) / 2;
                const pathData = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

                return (
                  <path
                    key={`conn-${idx}`}
                    d={pathData}
                    fill="none"
                    stroke={isHighlighted ? '#2563eb' : (isLight ? '#cbd5e1' : '#334155')}
                    strokeWidth={isHighlighted ? '2.5' : '1.75'}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                    markerEnd={isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead-default)'}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* RENDER GRAPH NODES (Zero overlaps) */}
            {concepts.map((concept) => {
              const isSelected = selectedConceptId === concept.id;
              const matchesFilter = filterStatus === 'all' || concept.status === filterStatus;

              return (
                <div
                  key={concept.id}
                  onClick={() => setSelectedConceptId(isSelected ? null : concept.id)}
                  style={{
                    left: `${concept.position.x}px`,
                    top: `${concept.position.y}px`,
                    width: `${NODE_WIDTH}px`,
                    minHeight: `${NODE_HEIGHT}px`,
                  }}
                  className={`absolute z-20 cursor-pointer rounded-xl border p-3.5 transition-all duration-200 select-none shadow-sm ${getStatusNodeBg(concept.status)} ${getStatusBorder(concept.status, isSelected)} ${
                    !matchesFilter ? 'opacity-25 grayscale' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      L{concept.level} · {concept.domain.split(' ')[0]}
                    </span>
                    <MasteryBadge status={concept.status} size="sm" />
                  </div>

                  <h4 className={`text-xs font-semibold leading-tight mb-2 truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {concept.name}
                  </h4>

                  <ConfidenceMeter
                    mastery={concept.estimatedMastery}
                    confidence={concept.confidenceScore}
                    status={concept.status}
                    compact
                  />

                  {concept.possibleMisconception && (
                    <div className={`mt-2 pt-1.5 border-t flex items-center gap-1 text-[10px] font-mono ${
                      isLight 
                        ? 'border-slate-200 text-amber-700' 
                        : 'border-slate-800/80 text-amber-400'
                    }`}>
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">Misconception Flagged</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SCREEN 6 — CONCEPT DETAIL DRAWER */}
        {selectedConcept && (
          <aside className={`lg:col-span-4 rounded-2xl p-6 space-y-6 shadow-elevated border transition-all animate-in slide-in-from-right duration-200 ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-800' 
              : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            {/* Top header */}
            <div className={`flex items-start justify-between gap-3 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  Concept Inspection
                </span>
                <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {selectedConcept.name}
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {selectedConcept.subject} · {selectedConcept.domain}
                </p>
              </div>
              <button
                onClick={() => setSelectedConceptId(null)}
                className={`text-xs font-mono px-2 py-1 rounded border ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                Close
              </button>
            </div>

            {/* ESTIMATED MASTERY & CONFIDENCE METER */}
            <ConfidenceMeter
              mastery={selectedConcept.estimatedMastery}
              confidence={selectedConcept.confidenceScore}
              status={selectedConcept.status}
            />

            {/* RECENT PERFORMANCE / EVIDENCE HISTORY */}
            <div className="space-y-2">
              <span className={`text-xs font-mono uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Recent Evidence
              </span>
              <div className={`grid grid-cols-3 gap-2 p-3 rounded-xl font-mono text-xs text-center border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div>
                  <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>TOTAL ITEMS</span>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{selectedConcept.totalResponses}</span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">CORRECT</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedConcept.correctResponses}</span>
                </div>
                <div>
                  <span className="text-rose-600 dark:text-rose-400 block text-[10px]">INCORRECT</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{selectedConcept.incorrectResponses}</span>
                </div>
              </div>
              <p className={`text-xs leading-relaxed pt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {selectedConcept.evidenceSummary}
              </p>
            </div>

            {/* PREREQUISITES & DEPENDENTS */}
            <div className={`space-y-3 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="space-y-1.5">
                <span className={`text-xs font-mono uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Prerequisites
                </span>
                {selectedConcept.prerequisites.length > 0 ? (
                  <div className="space-y-1">
                    {selectedConcept.prerequisites.map((pId) => {
                      const pObj = concepts.find((c) => c.id === pId);
                      return (
                        <div key={pId} className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
                        }`}>
                          <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            {pObj?.name || pId}
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{pObj?.estimatedMastery}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Foundational concept (No prerequisites)</p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className={`text-xs font-mono uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Downstream Concepts
                </span>
                {selectedConcept.dependents.length > 0 ? (
                  <div className="space-y-1">
                    {selectedConcept.dependents.map((dId) => {
                      const dObj = concepts.find((c) => c.id === dId);
                      return (
                        <div key={dId} className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
                        }`}>
                          <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                            {dObj?.name || dId}
                          </span>
                          <span className={`font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{dObj?.estimatedMastery}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Terminal leaf node</p>
                )}
              </div>
            </div>

            {/* POSSIBLE MISCONCEPTION ALERT IF PRESENT */}
            {selectedConcept.possibleMisconception && (
              <div className={`p-3.5 rounded-xl space-y-1.5 border ${
                isLight 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Possible Misconception</span>
                </div>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {selectedConcept.possibleMisconception.title}
                </p>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {selectedConcept.possibleMisconception.evidenceText}
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={() => handleStartPracticeConcept(selectedConcept.id)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <span>Practice This Concept</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </aside>
        )}
      </div>
    </div>
  );
};

export default KnowledgeMapView;
