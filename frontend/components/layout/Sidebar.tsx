'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Target, 
  GitFork, 
  BarChart3, 
  AlertCircle, 
  ChevronRight, 
  BookOpen, 
  Sun, 
  Moon,
  LogOut,
  PanelLeftClose
} from 'lucide-react';
import { useApp } from './ClientLayout';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const isLight = theme === 'light';

  const navItems = [
    { href: '/', label: 'Home', icon: Home, description: 'Adaptive overview & actions' },
    { href: '/practice', label: 'Practice', icon: Target, description: 'Adaptive & focused sessions' },
    { href: '/knowledge-map', label: 'Knowledge Map', icon: GitFork, description: 'Prerequisite DAG' },
    { href: '/progress', label: 'Progress', icon: BarChart3, description: 'Psychometric analytics' },
    { href: '/review', label: 'Review', icon: AlertCircle, description: 'Misconceptions & drills' },
  ];

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neuronotes-authenticated');
    }
    onCloseMobile();
    router.push('/login');
  };

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
      <aside className={`fixed top-0 bottom-0 left-0 w-64 z-50 flex flex-col transition-transform duration-200 ease-in-out border-r ${
        isLight 
          ? 'bg-[#F8FAFC] border-[#DCE3EA] text-[#172033]' 
          : 'bg-slate-950 border-slate-800/90 text-slate-100'
      } ${
        mobileOpen 
          ? 'translate-x-0' 
          : collapsed 
            ? '-translate-x-full' 
            : 'translate-x-0 lg:translate-x-0 -translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className={`h-16 flex items-center justify-between px-5 border-b ${
          isLight ? 'border-[#DCE3EA]' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-3">
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

          {/* Close / Collapse button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg border transition ${
                isLight 
                  ? 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100' 
                  : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Close Sidebar"
              aria-label="Close Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
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

        {/* Footer: Appearance + User profile + Sign Out */}
        <div className={`px-4 py-3 border-t space-y-2.5 ${
          isLight ? 'border-[#D7DEE7]' : 'border-slate-800'
        }`}>
          {/* Light Mode Toggle */}
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

          {/* Current user info */}
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-semibold ${
              currentUser?.isNewUser
                ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'
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

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-white hover:bg-rose-50 text-[#526176] hover:text-rose-700 border-[#D7DEE7] hover:border-rose-200'
                : 'bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border-slate-800 hover:border-rose-900'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
