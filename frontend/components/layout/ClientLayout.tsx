'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MisconceptionModal } from '@/components/modals/MisconceptionModal';
import { MisconceptionItem } from '@/types';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  researcherMode: boolean;
  toggleResearcherMode: () => void;
  activeMisconception: MisconceptionItem | null;
  openMisconception: (item: MisconceptionItem) => void;
  closeMisconception: () => void;
  selectedConceptId: string | null;
  setSelectedConceptId: (id: string | null) => void;
  startTargetedDrill: (item: MisconceptionItem) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within ClientLayout');
  }
  return context;
};

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [researcherMode, setResearcherMode] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activeMisconception, setActiveMisconception] = useState<MisconceptionItem | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('neuronotes-theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('neuronotes-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleResearcherMode = () => {
    setResearcherMode((prev) => !prev);
  };

  const openMisconception = (item: MisconceptionItem) => {
    setActiveMisconception(item);
  };

  const closeMisconception = () => {
    setActiveMisconception(null);
  };

  const startTargetedDrill = (item: MisconceptionItem) => {
    setActiveMisconception(null);
    router.push(`/quiz?conceptId=${encodeURIComponent(item.conceptId)}`);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        researcherMode,
        toggleResearcherMode,
        activeMisconception,
        openMisconception,
        closeMisconception,
        selectedConceptId,
        setSelectedConceptId,
        startTargetedDrill,
      }}
    >
      <div className={`min-h-screen transition-colors font-sans selection:bg-blue-600/30 selection:text-blue-200 ${
        theme === 'light' ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}>
        {/* Sidebar Navigation */}
        <Sidebar
          researcherMode={researcherMode}
          onToggleResearcherMode={toggleResearcherMode}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <Header
            onOpenMobile={() => setMobileOpen(true)}
            researcherMode={researcherMode}
            onToggleResearcherMode={toggleResearcherMode}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Misconception Diagnostic Modal */}
        <MisconceptionModal
          misconception={activeMisconception}
          onClose={closeMisconception}
          onStartTargetedDrill={startTargetedDrill}
          theme={theme}
        />
      </div>
    </AppContext.Provider>
  );
};

export default ClientLayout;
