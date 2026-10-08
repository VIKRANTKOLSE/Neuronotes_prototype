'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Plus, 
  Search, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Calendar, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PastTestSession, TestNote } from '@/types';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';

interface StructuredNoteProps {
  content: string;
  isLight: boolean;
}

const StructuredSessionNoteRenderer: React.FC<StructuredNoteProps> = ({ content, isLight }) => {
  const sections = content.split('\n\n');

  return (
    <div className="space-y-3 font-sans">
      {sections.map((section, sIdx) => {
        const isMistake = section.includes('[MISTAKE') || 
                          section.includes('**Concept with Mistake') || 
                          section.includes('**[CRITICAL DIAGNOSTIC ERROR') ||
                          section.toLowerCase().includes('critical diagnostic error');

        if (isMistake) {
          // Mistake Section: Bolded, elongated in explanation, highlighted
          return (
            <div
              key={sIdx}
              className={`p-4 rounded-xl border-l-[3px] border-l-rose-500 border space-y-2.5 transition-colors ${
                isLight 
                  ? 'bg-[#FFFDF9] border-[#FED7AA]/80 text-[#172033]' 
                  : 'bg-rose-950/20 border-rose-900/40 text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Diagnostic Error Identified & In-Depth Remediation</span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                {section.split('\n').map((line, lIdx) => {
                  const clean = line.replace(/\[MISTAKE IDENTIFIED & ELONGATED REMEDIATION\]/g, '').trim();
                  if (!clean) return null;

                  const isHeader = clean.startsWith('**Concept with Mistake') || clean.startsWith('**[CRITICAL') || clean.startsWith('**Error Analysis');
                  const isRemediation = clean.startsWith('**Remediation Rule');

                  return (
                    <div 
                      key={lIdx} 
                      className={`${
                        isHeader 
                          ? 'font-bold text-sm text-[#172033] dark:text-slate-100 mt-1' 
                          : isRemediation
                          ? 'font-bold text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 p-2.5 rounded-md mt-2'
                          : 'font-semibold text-xs leading-relaxed text-[#334155] dark:text-slate-200'
                      }`}
                    >
                      {clean.replace(/\*\*/g, '')}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Correct / Normal section: normal size, concise explanation
        return (
          <div key={sIdx} className={`text-xs leading-relaxed ${isLight ? 'text-[#526176]' : 'text-slate-300'} font-normal space-y-1`}>
            {section.split('\n').map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.includes('SESSION DIAGNOSTIC SUMMARY') || trimmed.includes('Correct Concepts Evaluated')) {
                return (
                  <p key={lIdx} className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#718096]' : 'text-slate-400'} pt-1`}>
                    {trimmed}
                  </p>
                );
              }

              return (
                <div key={lIdx} className="flex items-start gap-1.5 py-0.5">
                  <span className="leading-relaxed">{trimmed}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const PastTestsView: React.FC = () => {
  const { theme, currentUser, userRefreshTrigger } = useApp();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'tests' | 'notes'>('tests');
  const [tests, setTests] = useState<PastTestSession[]>([]);
  const [notes, setNotes] = useState<TestNote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  
  // Note creation / editing state
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<TestNote | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteConcept, setNoteConcept] = useState<string>('Cell Potential (E°cell)');
  const [noteTags, setNoteTags] = useState<string>('Formula, Review');
  const [noteTargetTestId, setNoteTargetTestId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [conceptFilter, setConceptFilter] = useState<string>('all');

  const isNew = currentUser?.isNewUser ?? false;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [testsData, notesData] = await Promise.all([
        api.getPastTests(),
        api.getNotes()
      ]);
      setTests(testsData);
      setNotes(notesData);
      if (testsData.length > 0 && !selectedTestId) {
        setSelectedTestId(testsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load past tests and notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id, userRefreshTrigger]);

  const handleOpenAddNote = (testId?: string) => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteConcept('Cell Potential (E°cell)');
    setNoteTags('Diagnostic, Review');
    setNoteTargetTestId(testId || (tests[0]?.id ?? ''));
    setNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: TestNote) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteConcept(note.conceptName || 'General Chemistry');
    setNoteTags(note.tags.join(', '));
    setNoteTargetTestId(note.testId || '');
    setNoteModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const parsedTags = noteTags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editingNote) {
        await api.updateNote(editingNote.id, {
          title: noteTitle,
          content: noteContent,
          conceptName: noteConcept,
          tags: parsedTags
        });
      } else {
        await api.createNote({
          testId: noteTargetTestId || undefined,
          title: noteTitle,
          content: noteContent,
          conceptName: noteConcept,
          tags: parsedTags
        });
      }
      setNoteModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Delete this diagnostic note?')) {
      try {
        await api.deleteNote(noteId);
        loadData();
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesConcept = 
      conceptFilter === 'all' || 
      n.conceptName?.toLowerCase() === conceptFilter.toLowerCase();

    return matchesSearch && matchesConcept;
  });

  const selectedTest = tests.find(t => t.id === selectedTestId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${
                isNew
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
              }`}>
                {isNew ? 'New Profile Baseline' : 'Historical Diagnostics'}
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {currentUser?.name || 'Learner'} ({currentUser?.id})
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Past Tests & Diagnostic Notes
            </h1>
            <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Review item-by-item responses, standard error telemetry deltas, and notes recorded across diagnostic sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddNote(selectedTestId || undefined)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Diagnostic Note</span>
            </button>
            <Link
              href="/quiz"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <span>Take New Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t ${
          isLight ? 'border-slate-100' : 'border-slate-800/80'
        }`}>
          <div>
            <div className="text-xs text-slate-500 font-mono">Completed Tests</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {tests.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isNew ? '0 items administered' : `${currentUser?.itemsAnswered ?? 54} total items`}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-mono">Average Accuracy</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${
              tests.length === 0 ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {tests.length === 0 ? '—' : `${Math.round(tests.reduce((acc, t) => acc + t.score, 0) / tests.length)}%`}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {tests.length === 0 ? 'Awaiting initial probe' : 'Across all administrations'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-mono">Diagnostic Notes</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {notes.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isNew ? 'Empty notebook' : 'Linked to past sessions'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-mono">Latent Ability θ</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              θ = {currentUser?.estimatedTheta.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              σ = {currentUser?.standardError.toFixed(2) ?? '1.20'} ({isNew ? 'High variance' : 'Calibrated'})
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'tests'
              ? (isLight 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                  : 'bg-blue-950/50 text-blue-300 font-semibold')
              : (isLight 
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Past Test Sessions ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'notes'
              ? (isLight 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                  : 'bg-blue-950/50 text-blue-300 font-semibold')
              : (isLight 
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Diagnostic Notes ({notes.length})</span>
        </button>
      </div>

      {/* TAB 1: PAST TEST SESSIONS */}
      {activeTab === 'tests' && (
        <>
          {tests.length === 0 ? (
            /* Empty State for New User */
            <div className={`p-12 rounded-2xl border text-center transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-4 text-amber-600">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                No Past Tests Recorded Yet for {currentUser?.name}
              </h3>
              <p className={`text-sm max-w-md mx-auto mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Elena is currently in an uncalibrated baseline state with zero recorded diagnostic attempts. Take an adaptive session to create your first test history and view psychometric parameter telemetry.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/quiz"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Baseline Adaptive Test</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Test List Column */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Select Session ({tests.length})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Sorted by recency</span>
                </div>

                {tests.map((test) => {
                  const isSelected = test.id === selectedTestId;
                  const formattedDate = new Date(test.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const durationMin = Math.floor(test.durationSeconds / 60);
                  const durationSec = test.durationSeconds % 60;

                  return (
                    <div
                      key={test.id}
                      onClick={() => setSelectedTestId(test.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? (isLight 
                              ? 'bg-blue-50/70 border-blue-400 shadow-sm' 
                              : 'bg-blue-950/30 border-blue-600')
                          : (isLight 
                              ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                              : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm font-semibold truncate ${
                            isSelected 
                              ? (isLight ? 'text-blue-900' : 'text-blue-200')
                              : (isLight ? 'text-slate-900' : 'text-slate-100')
                          }`}>
                            {test.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {durationMin}m {durationSec}s
                            </span>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold shrink-0 ${
                          test.score >= 80
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : test.score >= 50
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {test.score}% ({test.correctCount}/{test.totalQuestions})
                        </div>
                      </div>

                      {/* Topics Tested Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {test.topicsTested.map((topic, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              isLight 
                                ? 'bg-slate-50 text-slate-600 border-slate-200' 
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Footer: Notes indicator + Ability delta */}
                      <div className={`flex items-center justify-between mt-3 pt-2.5 border-t text-[11px] font-mono ${
                        isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/60 text-slate-400'
                      }`}>
                        <span>
                          θ: {test.thetaStart.toFixed(2)} → {test.thetaEnd.toFixed(2)}
                        </span>
                        <span className="text-[#2563EB] flex items-center gap-1 font-medium font-sans">
                          <FileText className="w-3 h-3" />
                          <span>1 Notes Summary</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Test Detail Inspector Column */}
              <div className="lg:col-span-7 space-y-4">
                {selectedTest ? (
                  <div className={`p-6 rounded-2xl border transition-colors space-y-6 ${
                    isLight ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {/* Header Details */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#718096]">
                          Session ID: {selectedTest.id}
                        </span>
                        <span className={`text-xs font-sans px-2.5 py-0.5 rounded font-semibold ${
                          selectedTest.score >= 80
                            ? 'bg-[#F0FDF4] text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-[#FFF7ED] text-[#C2410C] dark:bg-amber-950/40 dark:text-amber-400'
                        }`}>
                          Score: {selectedTest.score}% • {selectedTest.correctCount}/{selectedTest.totalQuestions} Solved
                        </span>
                      </div>
                      <h2 className={`text-xl font-bold mt-1 ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                        {selectedTest.title}
                      </h2>
                      <p className={`text-xs mt-1 ${isLight ? 'text-[#526176]' : 'text-slate-400'}`}>
                        Conducted on {new Date(selectedTest.timestamp).toLocaleString()} • Duration: {Math.floor(selectedTest.durationSeconds / 60)}m {selectedTest.durationSeconds % 60}s
                      </p>
                    </div>

                    {/* Single Session Diagnostic Notes Summary */}
                    {(() => {
                      const sessionNote = selectedTest.notes?.[0];
                      return (
                        <div className={`p-5 rounded-xl border transition-colors ${
                          isLight ? 'bg-white border-[#D7DEE7] shadow-[0_1px_2px_rgba(15,23,42,0.04)]' : 'bg-slate-900 border-slate-800'
                        }`}>
                          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#2563EB]" />
                              <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                                Session Diagnostic Notes Summary
                              </h4>
                            </div>
                            {sessionNote ? (
                              <button
                                onClick={() => handleOpenEditNote(sessionNote)}
                                className="text-xs text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 flex items-center gap-1 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Summary</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenAddNote(selectedTest.id)}
                                className="text-xs text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 flex items-center gap-1 font-medium"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create Notes Summary</span>
                              </button>
                            )}
                          </div>

                          {sessionNote ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className={`text-sm font-bold ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                                  {sessionNote.title}
                                </h5>
                                <span className={`text-[11px] font-mono ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                                  {new Date(sessionNote.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Structured Notes Summary: Mistakes in bold & elongated, other parts normal */}
                              <StructuredSessionNoteRenderer content={sessionNote.content} isLight={isLight} />

                              {sessionNote.tags && sessionNote.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                  {sessionNote.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#EEF2F6] text-[#526176] dark:bg-slate-800 dark:text-slate-300"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className={`text-xs italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              No diagnostic notes summary recorded for this session yet.
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Question Breakdown List */}
                    <div className="space-y-4">
                      <h4 className={`text-xs font-semibold uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Item-by-Item Diagnostic Breakdown ({selectedTest.questions.length} Questions)
                      </h4>

                      <div className="space-y-3.5">
                        {selectedTest.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border transition ${
                              isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  q.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}>
                                  {q.isCorrect ? <Check className="w-3 h-3" /> : '✕'}
                                </span>
                                <span className="text-xs font-semibold font-mono text-slate-500">
                                  Question {idx + 1}
                                </span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                                  {q.conceptName}
                                </span>
                              </div>

                              <span className="text-xs font-mono text-slate-400">
                                {q.latencySeconds}s elapsed
                              </span>
                            </div>

                            <p className={`text-xs mt-2.5 font-medium leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                              {q.stem}
                            </p>

                            {q.contextNotation && (
                              <div className={`mt-2 p-2 rounded text-[11px] font-mono ${
                                isLight ? 'bg-white border border-slate-200 text-slate-700' : 'bg-slate-900 border border-slate-800 text-slate-300'
                              }`}>
                                {q.contextNotation}
                              </div>
                            )}

                            {/* Response Comparison */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                              <div className={`p-2.5 rounded-lg border ${
                                q.isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800'
                                  : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800'
                              }`}>
                                <div className="text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-80">
                                  Your Choice:
                                </div>
                                <div className="leading-snug">{q.selectedOptionText}</div>
                              </div>

                              {!q.isCorrect && (
                                <div className="p-2.5 rounded-lg border bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800">
                                  <div className="text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-80">
                                    Correct Solution:
                                  </div>
                                  <div className="leading-snug">{q.correctOptionText}</div>
                                </div>
                              )}
                            </div>

                            {/* Scientific Explanation */}
                            <div className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed ${
                              isLight ? 'bg-white text-slate-600 border border-slate-200' : 'bg-slate-900 text-slate-300 border border-slate-800'
                            }`}>
                              <span className="font-semibold text-slate-700 dark:text-slate-200">Rationale: </span>
                              {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-12 text-center rounded-2xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <p className="text-sm text-slate-500">Select a test from the left to inspect its detailed question breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: DIAGNOSTIC NOTES NOTEBOOK */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes by keyword or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border transition outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' 
                    : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={conceptFilter}
                onChange={(e) => setConceptFilter(e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-700' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <option value="all">All Concepts</option>
                <option value="Cell Potential (E°cell)">Cell Potential</option>
                <option value="Nernst Equation">Nernst Equation</option>
                <option value="Gibbs Energy (ΔG)">Gibbs Energy</option>
                <option value="Thermodynamics Foundations">Thermodynamics</option>
                <option value="Equilibrium Constant (K)">Equilibrium Constant</option>
              </select>

              <button
                onClick={() => handleOpenAddNote()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <h4 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {notes.length === 0 ? 'No Diagnostic Notes Recorded' : 'No Matching Notes Found'}
              </h4>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {notes.length === 0 
                  ? 'Record key formulas, sign rules, or conceptual notes to solidify your psychometric progress.' 
                  : 'Try clearing your search query or concept filter.'}
              </p>
              <button
                onClick={() => handleOpenAddNote()}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write First Note</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition hover:shadow-md ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate">
                        {note.conceptName || 'General Chemistry'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditNote(note)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-sm font-semibold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {note.title}
                    </h4>

                    <div className="mt-3">
                      <StructuredSessionNoteRenderer content={note.content} isLight={isLight} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      {note.testId && <span className="text-blue-500">Linked to test</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT NOTE MODAL */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">
                {editingNote ? 'Edit Diagnostic Note' : 'Create Diagnostic Note'}
              </h3>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sign Inversion Rule in ΔG° = -nFE°cell"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-slate-800 border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
                  Concept Association
                </label>
                <select
                  value={noteConcept}
                  onChange={(e) => setNoteConcept(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <option value="Cell Potential (E°cell)">Cell Potential (E°cell)</option>
                  <option value="Nernst Equation">Nernst Equation</option>
                  <option value="Gibbs Energy (ΔG)">Gibbs Energy (ΔG)</option>
                  <option value="Thermodynamics Foundations">Thermodynamics Foundations</option>
                  <option value="Equilibrium Constant (K)">Equilibrium Constant (K)</option>
                  <option value="Enthalpy (ΔH)">Enthalpy (ΔH)</option>
                  <option value="Entropy (ΔS)">Entropy (ΔS)</option>
                </select>
              </div>

              {tests.length > 0 && (
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
                    Link to Past Test (Optional)
                  </label>
                  <select
                    value={noteTargetTestId}
                    onChange={(e) => setNoteTargetTestId(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <option value="">Standalone Note (No Test Link)</option>
                    {tests.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({new Date(t.timestamp).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
                  Content / Diagnostic Observation
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Record your formula derivation, sign convention, or note on what to avoid on the next probe..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none leading-relaxed ${
                    isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-slate-800 border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Formula, Pitfall, Review"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-slate-800 border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className={`px-4 py-2 text-xs rounded-lg border transition ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastTestsView;
