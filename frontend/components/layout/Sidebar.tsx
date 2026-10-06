'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Target, 
  GitFork, 
  BarChart3, 
  AlertCircle, 
  Sliders, 
  ChevronRight, 
  BookOpen, 
  Sun, 
  Moon 
} from 'lucide-react';

interface SidebarProps {
  researcherMode: boolean;
  onToggleResearcherMode: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  researcherMode,
  onToggleResearcherMode,
  mobileOpen,
  onCloseMobile,
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const isLight = theme === 'light';

  const navItems = [
    { href: '/', label: 'Home', icon: Home, description: 'Adaptive overview & actions' },
    { href: '/practice', label: 'Practice', icon: Target, description: 'Adaptive & focused sessions' },
    { href: '/knowledge-map', label: 'Knowledge Map', icon: GitFork, description: 'Prerequisite DAG' },
    { href: '/progress', label: 'Progress', icon: BarChart3, description: 'Psychometric analytics' },
    { href: '/review', label: 'Review', icon: AlertCircle, description: 'Misconceptions & drills' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 z-50 flex flex-col transition-all duration-200 lg:translate-x-0 border-r ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-800' 
          : 'bg-slate-950 border-slate-800/90 text-slate-100'
      } ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className={`h-16 flex items-center px-6 border-b gap-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isLight 
              ? 'bg-blue-50 text-blue-600 border-blue-200' 
              : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold tracking-tight text-base font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Neuronotes
              </span>
              <span className={`text-[10px] font-mono uppercase px-1 rounded border ${
                isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                MIRT
              </span>
            </div>
            <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Psychometric Engine
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className={`px-3 pb-2 text-[10px] uppercase font-mono tracking-wider font-semibold ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/practice' && pathname === '/quiz');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                  isActive 
                    ? (isLight 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold' 
                        : 'bg-blue-600/15 text-blue-400 border border-blue-500/30') 
                    : (isLight 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent' 
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900 border border-transparent')
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? (isLight ? 'text-blue-600' : 'text-blue-400') 
                    : (isLight ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-400 group-hover:text-slate-300')
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                </div>
                {isActive && <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />}
              </Link>
            );
          })}
        </div>

        {/* Mode Controls Container (Research Mode + Theme Switcher) */}
        <div className="p-3 mx-3 mb-3 space-y-2">
          {/* Theme switcher pill */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              {isLight ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
              <div>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {isLight ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Appearance
                </p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Switch
            </button>
          </div>

          {/* Psychometric Research Mode Toggle */}
          <div className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Research Mode</p>
                  <p className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Expose θ, Fisher I(θ)</p>
                </div>
              </div>
              <button
                onClick={onToggleResearcherMode}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                  researcherMode ? 'bg-blue-600' : (isLight ? 'bg-slate-300' : 'bg-slate-700')
                }`}
                title="Toggle Psychometric Item Parameters"
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  researcherMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Active State */}
        <div className={`p-3 border-t ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800/80 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              V
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Vikrant Kolse
              </p>
              <p className={`text-[10px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Model: Active (71% Mastery)
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
