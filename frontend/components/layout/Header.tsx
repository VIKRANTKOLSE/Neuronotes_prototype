'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Activity, ShieldCheck, Sun, Moon, Users, Check, CheckCircle2, Sparkles, LogIn, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useApp } from './ClientLayout';

interface HeaderProps {
  onOpenMobile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobile,
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const { currentUser, allUsers, switchUser, sidebarCollapsed, toggleSidebar } = useApp();
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
        ? 'bg-[#F8FAFC] border-[#DCE3EA] text-[#172033]' 
        : 'bg-slate-950/80 border-slate-800/80 text-slate-100'
    }`}>
      {/* Left section: mobile hamburger + desktop toggle + screen context */}
      <div className="flex items-center gap-3">
        {/* Mobile toggle */}
        <button
          onClick={onOpenMobile}
          className={`lg:hidden p-2 rounded-lg ${
            isLight ? 'text-[#526176] hover:text-[#172033] hover:bg-[#EAF1F8]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex items-center justify-center p-2 rounded-lg border transition ${
            isLight 
              ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
              : 'border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title={sidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
          aria-label={sidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold tracking-tight ${
              isLight ? 'text-[#172033]' : 'text-slate-100'
            }`}>
              {title}
            </span>
            <span className={isLight ? 'text-[#CBD5E1]' : 'text-slate-600'}>/</span>
            <span className={`text-sm font-medium ${
              isLight ? 'text-[#526176]' : 'text-slate-400'
            }`}>
              Chemistry
            </span>
          </div>
          <p className={`text-xs hidden sm:block ${isLight ? 'text-[#718096]' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section: Theme switcher + System telemetry + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Model Calibration Status: Calm telemetry indicator, not a boxed pill */}
        <div className={`hidden md:flex items-center gap-2 text-xs font-medium ${
          isLight ? 'text-[#526176]' : 'text-slate-400'
        }`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${isNew ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>{isNew ? 'Baseline uncalibrated' : 'Model calibrated'}</span>
        </div>

        {/* Vertical divider */}
        <div className={`hidden md:block w-px h-4 ${isLight ? 'bg-[#D7DEE7]' : 'bg-slate-800'}`} />



        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-sans border transition ${
            isLight
              ? 'bg-white text-[#526176] hover:bg-[#F8FAFC] border-[#D7DEE7]'
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

        {/* Calibrated Status Badge */}
        {!isNew && (
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-sans border ${
            isLight
              ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Calibrated</span>
          </div>
        )}

        {/* Profile menu dropdown container */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-md border transition ${
              isLight 
                ? 'bg-white hover:bg-[#F8FAFC] border-[#D7DEE7] text-[#172033]' 
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
              <span className="text-[10px] px-1 py-0.2 bg-[#FFF7ED] text-[#C2410C] rounded border border-[#FED7AA] font-mono">
                New
              </span>
            )}
          </button>

          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-80 border rounded-xl p-3.5 z-50 space-y-3.5 ${
              isLight 
                ? 'bg-white border-[#D7DEE7] text-[#172033] shadow-[0_4px_16px_rgba(15,23,42,0.06)]' 
                : 'bg-slate-900 border-slate-800 text-slate-100 shadow-elevated'
            }`}>
              {/* Active Profile Info */}
              <div className={`flex items-start gap-3 pb-3 border-b ${isLight ? 'border-[#E2E8F0]' : 'border-slate-800'}`}>
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-semibold text-sm ${
                  isNew
                    ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/40'
                }`}>
                  {activeInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-semibold truncate ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                      {activeName}
                    </h4>
                    {isNew ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#C2410C] dark:bg-amber-900/40 dark:text-amber-300 border border-[#FED7AA] dark:border-amber-700">
                        New Learner
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F0FDF4] text-[#15803D] dark:bg-emerald-900/40 dark:text-emerald-300 border border-[#BBF7D0] dark:border-emerald-700">
                        Has History
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${isLight ? 'text-[#526176]' : 'text-slate-400'}`}>
                    {currentUser?.major || 'Undergraduate Chemistry'}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ● {isNew ? 'Baseline Initialized' : 'Calibrated Diagnostic Profile'}
                  </p>
                </div>
              </div>

              {/* Psychometric Snapshot */}
              <div className={`space-y-1.5 text-xs ${isLight ? 'text-[#526176]' : 'text-slate-300'}`}>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-[#E2E8F0]' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-[#718096]' : 'text-slate-400'}>Global Mastery:</span>
                  <span className={`font-semibold ${isLight ? 'text-[#172033]' : 'text-slate-100'}`}>
                    {isNew ? 'Withheld (0%)' : `${activeMastery}%`}
                  </span>
                </div>
                <div className={`flex justify-between py-1 border-b font-mono ${isLight ? 'border-[#E2E8F0]' : 'border-slate-800/60'}`}>
                  <span className={isLight ? 'text-[#718096]' : 'text-slate-400'}>Items Answered:</span>
                  <span className={isLight ? 'text-[#172033]' : 'text-slate-100'}>{activeItems} items</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className={isLight ? 'text-[#718096]' : 'text-slate-400'}>Ability θ / SE σ:</span>
                  <span className={isLight ? 'text-[#172033]' : 'text-slate-100'}>
                    θ = {currentUser?.estimatedTheta.toFixed(2) ?? '0.00'}, σ = {currentUser?.standardError.toFixed(2) ?? '1.20'}
                  </span>
                </div>
              </div>

              {/* Learner Profile Switcher */}
              <div className={`pt-2 border-t ${isLight ? 'border-[#E2E8F0]' : 'border-slate-800'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${isLight ? 'text-[#718096]' : 'text-slate-400'}`}>
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
                                ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8] shadow-xs' 
                                : 'bg-blue-950/40 border-blue-700 text-blue-200')
                            : (isLight 
                                ? 'bg-[#F8FAFC] hover:bg-[#F1F4F8] border-[#D9E1E8] text-[#526176]' 
                                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-300')
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-semibold ${
                            user.isNewUser
                              ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {user.avatarInitials}
                          </div>
                          <div>
                            <div className="text-xs font-semibold flex items-center gap-1.5">
                              {user.name}
                              {user.isNewUser && (
                                <span className="text-[10px] px-1 bg-[#FFF7ED] text-[#C2410C] dark:text-amber-300 rounded border border-[#FED7AA]">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#718096] dark:text-slate-400">
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

              {/* Open Full Login Window */}
              <div className="pt-1 space-y-1.5">
                <Link
                  href="/login"
                  onClick={() => setProfileOpen(false)}
                  className={`w-full text-center py-2 text-xs font-mono font-medium rounded-lg border transition flex items-center justify-center gap-1.5 ${
                    isLight 
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#DBEAFE]' 
                      : 'bg-blue-950/40 text-blue-300 border-blue-800 hover:bg-blue-900/50'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Open Full Login Window</span>
                </Link>

                <button
                  onClick={() => setProfileOpen(false)}
                  className={`w-full text-center py-1.5 text-xs rounded-lg transition ${
                    isLight 
                      ? 'text-[#526176] hover:text-[#172033] bg-[#F1F4F8] hover:bg-[#E2E8F0]' 
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
