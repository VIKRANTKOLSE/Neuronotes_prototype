'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Activity, ShieldCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
  researcherMode: boolean;
  onToggleResearcherMode: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobile,
  researcherMode,
  onToggleResearcherMode,
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const isLight = theme === 'light';

  const screenTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Learner Diagnostic State' },
    '/practice': { title: 'Practice Selection', subtitle: 'Adaptive & Targeted Exploration' },
    '/quiz': { title: 'Adaptive Session', subtitle: 'Real-time Item Response Measurement' },
    '/knowledge-map': { title: 'Knowledge Map', subtitle: 'Prerequisite Dependency DAG' },
    '/progress': { title: 'Progress & Analytics', subtitle: 'Mastery Distributions & Uncertainty' },
    '/review': { title: 'Misconceptions & Review', subtitle: 'Diagnostic Remediation Registry' },
  };

  const { title, subtitle } = screenTitles[pathname] || { title: 'Neuronotes', subtitle: 'Adaptive Learning Engine' };

  return (
    <header className={`h-16 border-b sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-colors backdrop-blur-md ${
      isLight 
        ? 'bg-white/90 border-slate-200 text-slate-800' 
        : 'bg-slate-950/80 border-slate-800/80 text-slate-100'
    }`}>
      {/* Left section: mobile hamburger + screen context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className={`lg:hidden p-2 rounded-lg ${
            isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-base font-semibold tracking-tight font-sans ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {title}
            </h1>
            <span className="hidden sm:inline-block text-slate-400 font-mono text-xs">/</span>
            <span className={`hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded border ${
              isLight 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              Chemistry
            </span>
          </div>
          <p className={`text-xs hidden sm:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section: Theme switcher + System telemetry + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition ${
            isLight 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-sm' 
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
          }`}
          title="Toggle Light / Dark Mode"
        >
          {isLight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Research Mode quick indicator */}
        <button
          onClick={onToggleResearcherMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition ${
            researcherMode 
              ? (isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm font-semibold' 
                  : 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm')
              : (isLight 
                  ? 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300')
          }`}
          title="Toggle psychometric parameters (Fisher Info, Theta, SE)"
        >
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden md:inline">Research Mode:</span>
          <span>{researcherMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Diagnostic confidence health pill */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${
          isLight 
            ? 'bg-slate-100 text-slate-700 border-slate-200' 
            : 'bg-slate-900 text-slate-300 border-slate-800'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Calibrated</span>
        </div>

        {/* Profile menu dropdown container */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg border transition ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-medium ${
              isLight 
                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
            }`}>
              VK
            </div>
            <span className="text-xs font-medium hidden sm:inline">Vikrant</span>
          </button>

          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-elevated p-3 z-50 space-y-3 ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-800 shadow-xl' 
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              <div className={`flex items-start gap-3 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono font-medium ${
                  isLight 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                }`}>
                  VK
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Vikrant Kolse
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Undergraduate Chemistry
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ● Diagnostic Session Active
                  </p>
                </div>
              </div>

              <div className={`space-y-1.5 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-slate-100' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Global Mastery:</span>
                  <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>71%</span>
                </div>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-slate-100' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Items Answered:</span>
                  <span className={isLight ? 'text-slate-900' : 'text-slate-100'}>54 total</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Active Misconceptions:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">1 flagged</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className={`w-full text-center py-1.5 text-xs rounded-lg transition ${
                    isLight 
                      ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' 
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  Close Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
