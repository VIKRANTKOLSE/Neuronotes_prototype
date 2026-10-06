'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ArrowRight, 
  Clock, 
} from 'lucide-react';
import { useApp } from '@/components/layout/ClientLayout';

export const PracticeView: React.FC = () => {
  const router = useRouter();
  const { theme } = useApp();
  const isLight = theme === 'light';

  // Manual practice configuration state
  const [subject, setSubject] = useState('Chemistry');
  const [topic, setTopic] = useState('Gibbs Energy & Electrochemistry');
  const [difficulty, setDifficulty] = useState<'adaptive' | 'introductory' | 'intermediate' | 'rigorous'>('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [sessionLength, setSessionLength] = useState(10);

  const topicsList = [
    'Thermodynamics Foundations',
    'Enthalpy (ΔH) & Hess’s Law',
    'Entropy (ΔS) & Microstates',
    'Gibbs Energy & Spontaneity',
    'Cell Potential (E°cell)',
    'Nernst Equation & Concentration Cells',
    'Equilibrium Constant (K) Coupling',
    'Faraday’s Laws of Electrolysis'
  ];

  const handleStartAdaptiveSession = () => {
    router.push('/quiz');
  };

  const handleStartManualSession = () => {
    router.push(`/quiz?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&count=${numQuestions}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight font-sans ${
          isLight ? 'text-slate-900' : 'text-slate-100'
        }`}>
          Practice Selection
        </h2>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Choose between intelligent psychometric adaptation or manual curriculum configuration.
        </p>
      </div>

      {/* PROMINENT OPTION: ADAPTIVE PRACTICE */}
      <section className={`relative overflow-hidden rounded-2xl border-2 p-6 lg:p-8 shadow-elevated ${
        isLight 
          ? 'bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-blue-400 text-slate-800' 
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-blue-500/50 text-slate-100'
      }`}>
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[11px] font-mono font-semibold tracking-wider uppercase rounded-bl-xl shadow-md">
          Recommended
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-lg border ${
                isLight 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <span className={`text-xs uppercase font-mono tracking-wider font-bold block ${
                  isLight ? 'text-blue-700' : 'text-blue-400'
                }`}>
                  ADAPTIVE PRACTICE
                </span>
                <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  &ldquo;Let Neuronotes choose what you should practice next.&rdquo;
                </h3>
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Neuronotes diagnoses your knowledge state in real time. Rather than running a predetermined list, every question is selected iteratively based on maximum diagnostic value and prerequisite dependencies.
            </p>

            <div className={`p-4 rounded-xl border space-y-2.5 ${
              isLight ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-950/70 border-slate-800/90'
            }`}>
              <p className={`text-xs font-mono font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Neuronotes will select questions based on:
              </p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>• current mastery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <span>• uncertainty (posterior variance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>• prerequisite relationships</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>• recent responses & latency</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>• possible misconceptions</span>
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-4 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                <Clock className="w-4 h-4 text-blue-500" />
                Adaptive session: ~10 minutes
              </span>
              <span>•</span>
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                Target: Gibbs Energy & Electrochemistry Coupling
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
            <button
              onClick={handleStartAdaptiveSession}
              className="w-full lg:w-64 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 group"
            >
              <span>Start Adaptive Session</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className={`text-[11px] font-mono text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Items adapt after each response
            </p>
          </div>
        </div>
      </section>

      {/* SECONDARY OPTION: MANUAL PRACTICE */}
      <section className={`rounded-2xl border p-6 lg:p-7 space-y-6 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <div>
              <h3 className={`text-base font-semibold font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Manual Practice Configuration
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Secondary mode: target specific topics without full psychometric sequencing
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
            isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            Manual Override
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Subject Selection */}
          <div className="space-y-1.5">
            <label className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full rounded-lg px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <option value="Chemistry">Chemistry (Physical & Electrochemistry)</option>
              <option value="Physics">Physics (Thermodynamics & Kinetics)</option>
              <option value="Biology">Biochemistry (Bioenergetics)</option>
            </select>
          </div>

          {/* Topic Selection */}
          <div className="space-y-1.5">
            <label className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Target Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full rounded-lg px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <label className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Target Item Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'adaptive', label: 'Adaptive' },
                { id: 'introductory', label: 'Intro' },
                { id: 'intermediate', label: 'Medium' },
                { id: 'rigorous', label: 'Rigorous' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id as any)}
                  className={`py-2 px-2 text-xs font-mono rounded-lg border text-center transition ${
                    difficulty === lvl.id
                      ? (isLight 
                          ? 'bg-blue-100 text-blue-800 border-blue-400 font-semibold shadow-sm' 
                          : 'bg-blue-600/20 text-blue-300 border-blue-500 font-semibold')
                      : (isLight 
                          ? 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200')
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions & Session Length */}
          <div className="space-y-1.5">
            <div className={`flex justify-between items-center text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="uppercase tracking-wider">Session Scope</span>
              <span className={isLight ? 'text-slate-900 font-medium' : 'text-slate-200'}>
                {numQuestions} Questions (~{sessionLength} min)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { q: 3, m: 7 },
                { q: 5, m: 10 },
                { q: 10, m: 20 },
              ].map((scope) => (
                <button
                  key={scope.q}
                  type="button"
                  onClick={() => {
                    setNumQuestions(scope.q);
                    setSessionLength(scope.m);
                  }}
                  className={`py-2 px-2 text-xs font-mono rounded-lg border text-center transition ${
                    numQuestions === scope.q
                      ? (isLight 
                          ? 'bg-blue-100 text-blue-800 border-blue-400 font-semibold shadow-sm' 
                          : 'bg-blue-600/20 text-blue-300 border-blue-500 font-semibold')
                      : (isLight 
                          ? 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200')
                  }`}
                >
                  {scope.q} items (~{scope.m}m)
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleStartManualSession}
            className={`px-5 py-2.5 rounded-lg text-xs font-mono font-medium border transition ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            Launch Manual Practice ({numQuestions} Items)
          </button>
        </div>
      </section>
    </div>
  );
};

export default PracticeView;
