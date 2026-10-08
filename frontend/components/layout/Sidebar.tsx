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
  Moon,
  FileText,
  LogIn
} from 'lucide-react';
import { useApp } from './ClientLayout';

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
  const { currentUser } = useApp();
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
          ? 'bg-[#F8FAFC] border-[#DCE3EA] text-[#172033]' 
          : 'bg-slate-950 border-slate-800/90 text-slate-100'
      } ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className={`h-16 flex items-center px-6 border-b gap-3 ${
          isLight ? 'border-[#DCE3EA]' : 'border-slate-800/80'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isLight 
              ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' 
              : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold tracking-tight text-base font-sans ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                Neuronotes
              </span>
              <span className={`text-[10px] font-mono uppercase px-1 rounded border ${
                isLight 
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                MIRT
              </span>
            </div>
            <p className={`text-[11px] font-mono ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
              Psychometric Engine
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className={`px-3 pb-2 text-[11px] uppercase font-sans tracking-wider font-semibold ${
            isLight ? 'text-[#718096]' : 'text-slate-500'
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
                className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left group ${
                  isActive 
                    ? (isLight 
                        ? 'bg-[#EEF2F6] text-[#172033] font-medium' 
                        : 'bg-slate-800/80 text-slate-100 font-medium') 
                    : (isLight 
                        ? 'text-[#526176] hover:text-[#172033] hover:bg-[#EEF2F6]/60' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60')
                }`}
              >
                {/* Thin accent indicator for active state */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#2563EB] rounded-r" />
                )}
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? (isLight ? 'text-[#2563EB]' : 'text-blue-400') 
                    : (isLight ? 'text-[#718096] group-hover:text-[#172033]' : 'text-slate-500 group-hover:text-slate-300')
                }`} />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#526176]' : 'text-slate-400'}`} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Integrated Research Mode Control (seamless system control, not a floating card) */}
        <div className={`px-4 py-3 border-t flex items-center justify-between ${
          isLight ? 'border-[#D7DEE7]' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <Sliders className={`w-4 h-4 ${isLight ? 'text-[#526176]' : 'text-slate-400'}`} />
            <div>
              <p className={`text-xs font-medium ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                Research Mode
              </p>
              <p className={`text-[10px] ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                Expose θ, Fisher I(θ)
              </p>
            </div>
          </div>
          <button
            onClick={onToggleResearcherMode}
            className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
              researcherMode ? 'bg-[#2563EB]' : (isLight ? 'bg-[#CBD5E1]' : 'bg-slate-700')
            }`}
            title="Toggle Psychometric Item Parameters"
            aria-label="Toggle Research Mode"
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
              researcherMode ? 'translate-x-3.5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Footer: Appearance controls + User profile (visually integrated) */}
        <div className={`px-4 py-3 border-t space-y-2.5 ${
          isLight ? 'border-[#D7DEE7]' : 'border-slate-800'
        }`}>
          {/* Light Mode Appearance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isLight ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
              <div>
                <p className={`text-xs font-medium ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                  Light Mode
                </p>
                <p className={`text-[10px] ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                  Appearance
                </p>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                isLight
                  ? 'bg-white hover:bg-[#EEF2F6] text-[#526176] border-[#D7DEE7]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Switch
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-semibold ${
              currentUser?.isNewUser
                ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] dark:bg-amber-900/30 dark:text-amber-300'
                : (isLight
                    ? 'bg-[#EEF2F6] text-[#526176] border-[#D7DEE7]'
                    : 'bg-slate-800 text-slate-300 border-slate-700')
            }`}>
              {currentUser?.avatarInitials || 'VK'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${isLight ? 'text-[#172033]' : 'text-slate-200'}`}>
                {currentUser?.name || 'Vikrant Kolse'}
              </p>
              <p className={`text-[10px] font-mono truncate ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
                {currentUser?.isNewUser
                  ? 'Model: Baseline'
                  : `Model: Active (${currentUser?.overallMastery ?? 71}% Mastery)`}
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-white hover:bg-[#EEF2F6] text-[#526176] hover:text-[#172033] border-[#D7DEE7]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Switch Learner</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
