'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Activity, ShieldCheck, Sun, Moon, Users, Check, Sparkles } from 'lucide-react';
import { useApp } from './ClientLayout';

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
  const { currentUser, allUsers, switchUser } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const isLight = theme === 'light';

  const screenTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Learner Diagnostic State' },
    '/practice': { title: 'Practice Selection', subtitle: 'Adaptive & Targeted Exploration' },
    '/quiz': { title: 'Adaptive Session', subtitle: 'Real-time Item Response Measurement' },
    '/knowledge-map': { title: 'Knowledge Map', subtitle: 'Prerequisite Dependency DAG' },
    '/progress': { title: 'Progress & Analytics', subtitle: 'Mastery Distributions & Uncertainty' },
    '/review': { title: 'Misconceptions & Review', subtitle: 'Diagnostic Remediation Registry' },
    '/tests': { title: 'Past Tests & Notes', subtitle: 'Test History, Item Breakdown & Diagnostic Notes' },
  };

  const { title, subtitle } = screenTitles[pathname] || { title: 'Neuronotes', subtitle: 'Adaptive Learning Engine' };

  const activeName = currentUser?.name || 'Vikrant Kolse';
  const activeInitials = currentUser?.avatarInitials || 'VK';
  const activeMastery = currentUser?.overallMastery ?? 71;
  const activeItems = currentUser?.itemsAnswered ?? 54;
  const isNew = currentUser?.isNewUser ?? false;

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
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Model Calibration Status */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono ${
          isLight 
            ? 'bg-white text-slate-600 border-slate-200 shadow-sm' 
            : 'bg-slate-900 text-slate-400 border-slate-800'
        }`}>
          <ShieldCheck className={`w-3.5 h-3.5 ${isNew ? 'text-amber-500' : 'text-emerald-500'}`} />
          <span>{isNew ? 'Baseline uncalibrated' : 'Model calibrated'}</span>
        </div>

        {/* Research Mode control */}
        <button
          onClick={onToggleResearcherMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition ${
            researcherMode 
              ? (isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium shadow-sm' 
                  : 'bg-blue-950/40 text-blue-300 border-blue-800')
              : (isLight 
                  ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200')
          }`}
          title="Toggle psychometric parameters (Fisher Info, Theta, SE)"
        >
          <Activity className={`w-3.5 h-3.5 ${researcherMode ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Research:</span>
          <span className={researcherMode ? 'font-semibold' : ''}>{researcherMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition ${
            isLight 
              ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm' 
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
          }`}
          title="Toggle Light / Dark Mode"
        >
          {isLight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Dark</span>
            </>
          )}
        </button>

        {/* Profile menu dropdown container */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-md border transition ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center text-[10px] font-mono font-medium ${
              isNew
                ? 'bg-amber-500/20 text-amber-600 border-amber-500/30'
                : 'bg-blue-500/20 text-blue-600 border-blue-500/30'
            }`}>
              {activeInitials}
            </div>
            <span className="text-xs font-medium hidden sm:inline">{activeName.split(' ')[0]}</span>
            {isNew && (
              <span className="text-[10px] px-1 py-0.2 bg-amber-500/10 text-amber-600 rounded border border-amber-500/20 font-mono">
                New
              </span>
            )}
          </button>

          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-80 border rounded-xl shadow-elevated p-3.5 z-50 space-y-3.5 ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-800 shadow-xl' 
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              {/* Active Profile Info */}
              <div className={`flex items-start gap-3 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-semibold text-sm ${
                  isNew
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/40'
                }`}>
                  {activeInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-semibold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {activeName}
                    </h4>
                    {isNew ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        New Learner
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Has History
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {currentUser?.major || 'Undergraduate Chemistry'}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ● {isNew ? 'Baseline Initialized' : 'Calibrated Diagnostic Profile'}
                  </p>
                </div>
              </div>

              {/* Psychometric Snapshot */}
              <div className={`space-y-1.5 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-slate-100' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Global Mastery:</span>
                  <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {isNew ? 'Withheld (0%)' : `${activeMastery}%`}
                  </span>
                </div>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-slate-100' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Items Answered:</span>
                  <span className={isLight ? 'text-slate-900' : 'text-slate-100'}>{activeItems} items</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Ability θ / SE σ:</span>
                  <span className={isLight ? 'text-slate-900' : 'text-slate-100'}>
                    θ = {currentUser?.estimatedTheta.toFixed(2) ?? '0.00'}, σ = {currentUser?.standardError.toFixed(2) ?? '1.20'}
                  </span>
                </div>
              </div>

              {/* Learner Profile Switcher */}
              <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Switch Learner Profile
                  </span>
                </div>

                <div className="space-y-1.5">
                  {allUsers.map((user) => {
                    const isSelected = user.id === currentUser?.id;
                    return (
                      <button
                        key={user.id}
                        onClick={async () => {
                          await switchUser(user.id);
                          setProfileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition ${
                          isSelected
                            ? (isLight 
                                ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm' 
                                : 'bg-blue-950/40 border-blue-700 text-blue-200')
                            : (isLight 
                                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-300')
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-semibold ${
                            user.isNewUser
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {user.avatarInitials}
                          </div>
                          <div>
                            <div className="text-xs font-semibold flex items-center gap-1.5">
                              {user.name}
                              {user.isNewUser && (
                                <span className="text-[10px] px-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {user.isNewUser ? '0 tests • Prior θ = 0.00' : '3 past tests • 5 notes • Calibrated'}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
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
