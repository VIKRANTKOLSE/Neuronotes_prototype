'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  AlertTriangle, 
  Layers, 
  Search,
  SlidersHorizontal,
  ChevronRight,
  Info,
  GitBranch,
  ExternalLink,
  BookOpen,
  LayoutGrid,
  Network
} from 'lucide-react';
import { Concept, MasteryStatus, DependencyGraphData, PrerequisiteEdge } from '@/types';
import { CANONICAL_TIERS, CANONICAL_EDGES, CONCEPTS } from '@/lib/mockData';
import { MasteryBadge } from '@/components/mastery/MasteryBadge';
import { useApp } from '@/components/layout/ClientLayout';

interface KnowledgeMapViewProps {
  concepts?: Concept[];
  initialGraphData?: DependencyGraphData;
}

// Dimensions for SVG Graph layout
const NODE_WIDTH = 250;
const NODE_HEIGHT = 82;
const TIER_X_OFFSETS: Record<number, number> = {
  1: 60,
  2: 400,
  3: 740,
  4: 1080
};
const CANVAS_WIDTH = 1420;
const CANVAS_HEIGHT = 2100;

export const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({ 
  concepts: propConcepts,
  initialGraphData 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, selectedConceptId, setSelectedConceptId } = useApp();
  const isLight = theme === 'light';

  // Active graph dataset sourced strictly from backend/canonical data
  const graphData: DependencyGraphData = useMemo(() => {
    if (initialGraphData) return initialGraphData;
    const conceptList = (propConcepts && propConcepts.length > 0) ? propConcepts : CONCEPTS;
    return {
      tiers: CANONICAL_TIERS,
      concepts: conceptList,
      edges: CANONICAL_EDGES,
      stats: {
        totalConcepts: conceptList.length,
        totalEdges: CANONICAL_EDGES.length,
        tiersCount: Object.keys(CANONICAL_TIERS).length
      }
    };
  }, [initialGraphData, propConcepts]);

  const allConcepts = graphData.concepts;
  const allEdges = graphData.edges;

  // View & Filter states
  const [activeViewMode, setActiveViewMode] = useState<'graph' | 'matrix'>('graph');
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);

  // Set selected concept from URL query if present
  useEffect(() => {
    const queryConcept = searchParams.get('conceptId');
    if (queryConcept) {
      setSelectedConceptId(queryConcept);
    } else if (!selectedConceptId && allConcepts.length > 0) {
      // Default to Crystal Field Stabilization Energy or Effective Nuclear Charge
      const defaultConcept = allConcepts.find(c => c.id === 'crystal-field-stabilization-energy') || allConcepts[0];
      setSelectedConceptId(defaultConcept.id);
    }
  }, [searchParams, setSelectedConceptId, allConcepts, selectedConceptId]);

  const selectedConcept = useMemo(() => {
    return allConcepts.find((c) => c.id === selectedConceptId) || null;
  }, [allConcepts, selectedConceptId]);

  // Map concept IDs to Concept objects for quick lookup
  const conceptMap = useMemo(() => {
    const map = new Map<string, Concept>();
    allConcepts.forEach((c) => map.set(c.id, c));
    return map;
  }, [allConcepts]);

  // Compute connections: source = prerequisite, target = dependent
  const connections = useMemo(() => {
    return allEdges.map((edge) => ({
      from: conceptMap.get(edge.source) || null,
      to: conceptMap.get(edge.target) || null,
      edge
    })).filter((c): c is { from: Concept; to: Concept; edge: PrerequisiteEdge } => c.from !== null && c.to !== null);
  }, [allEdges, conceptMap]);

  // Derived relationship sets for the currently selected concept
  const { directPrereqIds, directDependentIds } = useMemo(() => {
    const prereqs = new Set<string>();
    const dependents = new Set<string>();
    if (!selectedConceptId) return { directPrereqIds: prereqs, directDependentIds: dependents };

    allEdges.forEach((e) => {
      if (e.target === selectedConceptId) {
        prereqs.add(e.source);
      }
      if (e.source === selectedConceptId) {
        dependents.add(e.target);
      }
    });

    return { directPrereqIds: prereqs, directDependentIds: dependents };
  }, [allEdges, selectedConceptId]);

  // Filtered concepts based on search & tier filter
  const filteredConcepts = useMemo(() => {
    return allConcepts.filter((c) => {
      const matchesSearch = searchQuery === '' || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tierName && c.tierName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTier = selectedTierFilter === 'all' || c.tier === selectedTierFilter;

      return matchesSearch && matchesTier;
    });
  }, [allConcepts, searchQuery, selectedTierFilter]);

  // Group concepts by tier
  const tierGroupedConcepts = useMemo(() => {
    const groups: Record<number, { title: string; subtitle: string; concepts: Concept[] }> = {
      1: { title: 'Tier 1 — Foundation', subtitle: 'Atomic parameters, orbital energies & fundamental forces', concepts: [] },
      2: { title: 'Tier 2 — Core Mechanisms', subtitle: 'Periodic trends, bonding theories & molecular geometry', concepts: [] },
      3: { title: 'Tier 3 — Derived Chemical Behavior', subtitle: 'Stability principles, series effects & electronic states', concepts: [] },
      4: { title: 'Tier 4 — Complex Systems', subtitle: 'Coordination fields, crystal field splitting & metallurgy', concepts: [] }
    };

    allConcepts.forEach((c) => {
      const tierNum = c.tier || 1;
      if (groups[tierNum]) {
        groups[tierNum].concepts.push(c);
      }
    });

    return groups;
  }, [allConcepts]);

  // Trace dependency chain for selected concept
  const dependencyChain = useMemo(() => {
    if (!selectedConcept) return [];
    
    // Find upstream path
    const upstreamPath: Concept[] = [];
    let currentId: string | null = selectedConcept.id;
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const incomingEdges = allEdges.filter(e => e.target === currentId);
      if (incomingEdges.length > 0) {
        const parentId = incomingEdges[0].source;
        const parentConcept = conceptMap.get(parentId);
        if (parentConcept) {
          upstreamPath.unshift(parentConcept);
          currentId = parentId;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Find downstream path
    const downstreamPath: Concept[] = [];
    currentId = selectedConcept.id;
    const visitedDown = new Set<string>();

    while (currentId && !visitedDown.has(currentId)) {
      visitedDown.add(currentId);
      const outgoingEdges = allEdges.filter(e => e.source === currentId);
      if (outgoingEdges.length > 0) {
        const childId = outgoingEdges[0].target;
        const childConcept = conceptMap.get(childId);
        if (childConcept) {
          downstreamPath.push(childConcept);
          currentId = childId;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return [...upstreamPath, selectedConcept, ...downstreamPath];
  }, [selectedConcept, allEdges, conceptMap]);

  const handleStartPracticeConcept = (conceptId: string) => {
    router.push(`/quiz?conceptId=${encodeURIComponent(conceptId)}`);
  };

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto pb-12">
      {/* 1. HEADER & METADATA BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-2xl font-bold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Chemistry Prerequisite Knowledge Graph
            </h1>
            <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
              isLight 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-blue-950/60 text-blue-400 border-blue-800/60'
            }`}>
              4-Tier DAG
            </span>
          </div>
          <p className={`text-xs mt-1 max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Authoritative dependency mapping governing adaptive question sequencing. Directed edges (<span className="font-mono font-medium">Prerequisite → Dependent</span>) strictly represent necessary chemical competencies.
          </p>
        </div>

        {/* Global Statistics Indicators */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-lg border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`block text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Canonical Nodes
            </span>
            <span className={`text-base font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              58
            </span>
          </div>
          <div className={`px-3 py-2 rounded-lg border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`block text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Prerequisite Edges
            </span>
            <span className={`text-base font-bold font-mono ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
              67
            </span>
          </div>
          <div className={`px-3 py-2 rounded-lg border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`block text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Conceptual Tiers
            </span>
            <span className={`text-base font-bold font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
              4
            </span>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS, SEARCH & FILTER TOOLBAR */}
      <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
      }`}>
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 58 canonical concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' 
                : 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
            }`}
          />
        </div>

        {/* Tier filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedTierFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition shrink-0 ${
              selectedTierFilter === 'all'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Tiers (58)
          </button>
          {[1, 2, 3, 4].map((tierNum) => {
            const count = tierGroupedConcepts[tierNum]?.concepts.length || 0;
            const label = tierNum === 1 ? 'Tier 1: Foundation' 
                        : tierNum === 2 ? 'Tier 2: Core' 
                        : tierNum === 3 ? 'Tier 3: Derived' 
                        : 'Tier 4: Complex';
            return (
              <button
                key={tierNum}
                onClick={() => setSelectedTierFilter(tierNum)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition shrink-0 ${
                  selectedTierFilter === tierNum
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* View Mode & Zoom buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* View mode toggle */}
          <div className={`p-0.5 rounded-lg border flex items-center ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setActiveViewMode('graph')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                activeViewMode === 'graph'
                  ? (isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-800 text-slate-100')
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Tiered DAG Visualizer"
            >
              <Network className="w-3.5 h-3.5 text-blue-500" />
              <span>DAG View</span>
            </button>
            <button
              onClick={() => setActiveViewMode('matrix')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                activeViewMode === 'matrix'
                  ? (isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-800 text-slate-100')
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Curriculum Tier Matrix"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              <span>Tier Matrix</span>
            </button>
          </div>

          {/* Zoom controls for DAG */}
          {activeViewMode === 'graph' && (
            <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 min-w-[36px] text-center text-slate-600 dark:text-slate-400">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(0.85)}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: GRAPH OR MATRIX + DETAIL INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: GRAPH OR MATRIX */}
        <div className={`${selectedConcept ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          
          {/* MODE A: INTERACTIVE TIERED DAG GRAPH CANVAS */}
          {activeViewMode === 'graph' && (
            <div className={`rounded-2xl border p-4 relative overflow-auto shadow-sm max-h-[860px] ${
              isLight 
                ? 'bg-slate-50/90 border-slate-200/90' 
                : 'bg-slate-950 border-slate-800'
            }`}>
              {/* Background grid canvas texture */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20" 
                style={{
                  backgroundImage: isLight 
                    ? 'radial-gradient(#64748b 1px, transparent 1px)' 
                    : 'radial-gradient(#38bdf8 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Tier Column Track Headers */}
              <div 
                className="relative z-20 mb-3 grid grid-cols-4 gap-4 px-2"
                style={{ width: `${CANVAS_WIDTH * zoomLevel}px` }}
              >
                {[
                  { tier: 1, name: 'Tier 1 — Foundation', count: 10, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
                  { tier: 2, name: 'Tier 2 — Core Mechanisms', count: 13, color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
                  { tier: 3, name: 'Tier 3 — Derived Behavior', count: 17, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
                  { tier: 4, name: 'Tier 4 — Complex Systems', count: 18, color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' }
                ].map((track) => (
                  <div 
                    key={track.tier} 
                    className={`py-2 px-3 rounded-lg border flex items-center justify-between text-xs font-semibold ${track.color} ${track.border} ${
                      isLight ? 'bg-white/80 shadow-xs' : 'bg-slate-900/80'
                    }`}
                  >
                    <span>{track.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {track.count} nodes
                    </span>
                  </div>
                ))}
              </div>

              {/* Scalable Canvas */}
              <div 
                className="relative origin-top-left transition-transform duration-150"
                style={{ 
                  width: `${CANVAS_WIDTH}px`, 
                  height: `${CANVAS_HEIGHT}px`,
                  transform: `scale(${zoomLevel})` 
                }}
              >
                {/* SVG Connecting Edges: Source (Prerequisite) → Target (Dependent) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    {/* Neutral Default Arrow */}
                    <marker
                      id="arrow-default"
                      markerWidth="8"
                      markerHeight="6"
                      refX="7"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 8 3, 0 6" fill={isLight ? '#94a3b8' : '#475569'} />
                    </marker>

                    {/* Upstream Prerequisite Arrow (Entering selected node) */}
                    <marker
                      id="arrow-prereq"
                      markerWidth="9"
                      markerHeight="7"
                      refX="8"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 9 3.5, 0 7" fill="#10b981" />
                    </marker>

                    {/* Downstream Dependent Arrow (Leaving selected node) */}
                    <marker
                      id="arrow-dependent"
                      markerWidth="9"
                      markerHeight="7"
                      refX="8"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 9 3.5, 0 7" fill="#2563eb" />
                    </marker>
                  </defs>

                  {connections.map((conn, idx) => {
                    const isUpstreamPrereq = selectedConceptId === conn.to.id; // conn.from is prerequisite of selected
                    const isDownstreamDependent = selectedConceptId === conn.from.id; // conn.to is dependent of selected
                    const isHighlighted = isUpstreamPrereq || isDownstreamDependent;

                    // Prerequisite source (right anchor)
                    const startX = conn.from.position.x + NODE_WIDTH;
                    const startY = conn.from.position.y + NODE_HEIGHT / 2;

                    // Dependent target (left anchor)
                    const endX = conn.to.position.x;
                    const endY = conn.to.position.y + NODE_HEIGHT / 2;

                    // Cubic Bezier curve control points
                    const dx = Math.abs(endX - startX) * 0.55;
                    const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                    let strokeColor = isLight ? '#cbd5e1' : '#334155';
                    let strokeWidth = 1.25;
                    let markerEnd = 'url(#arrow-default)';
                    let opacity = 0.65;

                    if (selectedConceptId) {
                      if (isUpstreamPrereq) {
                        strokeColor = '#10b981'; // Emerald for incoming prerequisite
                        strokeWidth = 2.5;
                        markerEnd = 'url(#arrow-prereq)';
                        opacity = 1;
                      } else if (isDownstreamDependent) {
                        strokeColor = '#2563eb'; // Blue for outgoing dependent
                        strokeWidth = 2.5;
                        markerEnd = 'url(#arrow-dependent)';
                        opacity = 1;
                      } else {
                        opacity = 0.15; // Dim irrelevant edges
                      }
                    }

                    return (
                      <path
                        key={`${conn.from.id}-${conn.to.id}-${idx}`}
                        d={pathData}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={isHighlighted ? 'none' : 'none'}
                        markerEnd={markerEnd}
                        opacity={opacity}
                        className="transition-all duration-200"
                      />
                    );
                  })}
                </svg>

                {/* Concept Nodes in Canvas */}
                {allConcepts.map((concept) => {
                  const isSelected = selectedConceptId === concept.id;
                  const isPrereqOfSelected = directPrereqIds.has(concept.id);
                  const isDependentOfSelected = directDependentIds.has(concept.id);
                  const isMatchSearch = searchQuery === '' || 
                    concept.name.toLowerCase().includes(searchQuery.toLowerCase());

                  let borderClass = isLight ? 'border-slate-200 hover:border-slate-300' : 'border-slate-800 hover:border-slate-700';
                  let ringClass = '';
                  let statusTag = null;

                  if (isSelected) {
                    borderClass = 'border-blue-600 shadow-lg';
                    ringClass = 'ring-2 ring-blue-500/40 z-30 scale-[1.02]';
                    statusTag = (
                      <span className="text-[9px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">
                        Selected
                      </span>
                    );
                  } else if (isPrereqOfSelected) {
                    borderClass = 'border-emerald-500 shadow-md';
                    ringClass = 'ring-2 ring-emerald-500/30 z-25';
                    statusTag = (
                      <span className="text-[9px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <ArrowLeft className="w-2.5 h-2.5" /> Prerequisite
                      </span>
                    );
                  } else if (isDependentOfSelected) {
                    borderClass = 'border-blue-500 shadow-md';
                    ringClass = 'ring-2 ring-blue-500/30 z-25';
                    statusTag = (
                      <span className="text-[9px] font-mono uppercase font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        Dependent <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    );
                  }

                  return (
                    <div
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.id)}
                      style={{
                        position: 'absolute',
                        left: `${concept.position.x}px`,
                        top: `${concept.position.y}px`,
                        width: `${NODE_WIDTH}px`,
                        height: `${NODE_HEIGHT}px`
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-150 flex flex-col justify-between ${
                        isLight ? 'bg-white' : 'bg-slate-900/95'
                      } ${borderClass} ${ringClass} ${
                        !isMatchSearch ? 'opacity-25' : 'opacity-100'
                      }`}
                    >
                      {/* Top row: Tier badge & Prerequisite/Dependent flag */}
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          concept.tier === 1 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' 
                            : concept.tier === 2 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : concept.tier === 3 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                        }`}>
                          Tier {concept.tier}
                        </span>

                        {statusTag}
                      </div>

                      {/* Middle: Canonical concept name */}
                      <div className="my-0.5">
                        <h4 className={`text-xs font-semibold tracking-tight leading-snug line-clamp-2 ${
                          isSelected ? (isLight ? 'text-blue-700' : 'text-blue-400') : (isLight ? 'text-slate-900' : 'text-slate-100')
                        }`}>
                          {concept.name}
                        </h4>
                      </div>

                      {/* Bottom metadata: Prerequisite count & Dependent count */}
                      <div className={`flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-100 dark:border-slate-800/80 ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <span>Prereqs: {concept.prerequisites.length}</span>
                        <span>Gates: {concept.dependents.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE B: CURRICULUM TIER MATRIX VIEW */}
          {activeViewMode === 'matrix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((tierNum) => {
                const group = tierGroupedConcepts[tierNum];
                if (!group) return null;

                const tierNodes = group.concepts.filter((c) => {
                  return searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase());
                });

                return (
                  <div 
                    key={tierNum}
                    className={`rounded-2xl border p-4 space-y-3 ${
                      isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold tracking-tight font-sans">
                          {group.title}
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {tierNodes.length} nodes
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {group.subtitle}
                      </p>
                    </div>

                    <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
                      {tierNodes.map((concept) => {
                        const isSelected = selectedConceptId === concept.id;
                        return (
                          <div
                            key={concept.id}
                            onClick={() => setSelectedConceptId(concept.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? (isLight ? 'bg-blue-50/70 border-blue-500 shadow-xs' : 'bg-blue-950/40 border-blue-600')
                                : (isLight ? 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300' : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700')
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-mono text-slate-400">
                                {concept.tierName?.split(' ')[0]}
                              </span>
                              {concept.totalResponses > 0 && (
                                <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                                  {concept.estimatedMastery}% mastery
                                </span>
                              )}
                            </div>

                            <h4 className={`font-semibold tracking-tight ${
                              isSelected ? 'text-blue-600 dark:text-blue-400' : (isLight ? 'text-slate-900' : 'text-slate-100')
                            }`}>
                              {concept.name}
                            </h4>

                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/60">
                              <span>← {concept.prerequisites.length} prereqs</span>
                              <span>{concept.dependents.length} downstream →</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: CONCEPT DETAIL INSPECTOR DRAWER */}
        {selectedConcept && (
          <div className="lg:col-span-4 space-y-4 sticky top-6">
            <div className={`p-5 rounded-2xl border shadow-sm space-y-5 transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              {/* Concept Title & Tier Badge */}
              <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    selectedConcept.tier === 1 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : selectedConcept.tier === 2 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : selectedConcept.tier === 3 
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                  }`}>
                    {selectedConcept.tierName}
                  </span>
                  
                  {selectedConcept.totalResponses > 0 ? (
                    <MasteryBadge status={selectedConcept.status} />
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Unprobed Baseline
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  {selectedConcept.name}
                </h3>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {selectedConcept.evidenceSummary}
                </p>
              </div>

              {/* DIRECT PREREQUISITES SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Direct Prerequisites ({selectedConcept.prerequisites.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Required upstream</span>
                </div>

                {selectedConcept.prerequisites.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                    Root foundation concept — no upstream prerequisites required.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedConcept.prerequisites.map((prereqId) => {
                      const prereq = conceptMap.get(prereqId);
                      if (!prereq) return null;
                      return (
                        <div
                          key={prereqId}
                          onClick={() => setSelectedConceptId(prereq.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isLight 
                              ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800' 
                              : 'bg-emerald-950/20 border-emerald-900/40 hover:bg-emerald-950/40 text-slate-200'
                          }`}
                        >
                          <span className="font-semibold line-clamp-1">{prereq.name}</span>
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 ml-2 shrink-0">
                            Tier {prereq.tier} →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DIRECT DOWNSTREAM DEPENDENTS SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Downstream Dependents ({selectedConcept.dependents.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Gated downstream</span>
                </div>

                {selectedConcept.dependents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                    Terminal concept — does not directly gate further curriculum nodes.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedConcept.dependents.map((depId) => {
                      const dep = conceptMap.get(depId);
                      if (!dep) return null;
                      return (
                        <div
                          key={depId}
                          onClick={() => setSelectedConceptId(dep.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isLight 
                              ? 'bg-blue-50/40 border-blue-200/80 hover:bg-blue-50 hover:border-blue-300 text-slate-800' 
                              : 'bg-blue-950/20 border-blue-900/40 hover:bg-blue-950/40 text-slate-200'
                          }`}
                        >
                          <span className="font-semibold line-clamp-1">{dep.name}</span>
                          <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 ml-2 shrink-0">
                            Tier {dep.tier} →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ACTIVE DEPENDENCY CHAIN TRACE */}
              {dependencyChain.length > 1 && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Curriculum Prerequisite Chain Trace
                  </span>
                  <div className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    {dependencyChain.map((node, cIdx) => (
                      <div 
                        key={node.id} 
                        onClick={() => setSelectedConceptId(node.id)}
                        className={`flex items-center gap-1.5 cursor-pointer py-0.5 ${
                          node.id === selectedConcept.id 
                            ? 'font-bold text-blue-600 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-slate-400">{cIdx + 1}.</span>
                        <span className="line-clamp-1 text-xs">{node.name}</span>
                        {node.id === selectedConcept.id && (
                          <span className="text-[9px] font-mono bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-1 rounded ml-auto">
                            current
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <button
                  onClick={() => handleStartPracticeConcept(selectedConcept.id)}
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Start Targeted Diagnostic Probe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
