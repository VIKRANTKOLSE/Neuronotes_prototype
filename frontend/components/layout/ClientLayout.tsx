'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MisconceptionModal } from '@/components/modals/MisconceptionModal';
import { MisconceptionItem, UserProfile } from '@/types';
import { api } from '@/services/api';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  activeMisconception: MisconceptionItem | null;
  openMisconception: (item: MisconceptionItem) => void;
  closeMisconception: () => void;
  selectedConceptId: string | null;
  setSelectedConceptId: (id: string | null) => void;
  startTargetedDrill: (item: MisconceptionItem) => void;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  switchUser: (userId: string) => Promise<void>;
  userRefreshTrigger: number;
  triggerRefresh: () => void;
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
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activeMisconception, setActiveMisconception] = useState<MisconceptionItem | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userRefreshTrigger, setUserRefreshTrigger] = useState<number>(0);

  // Automatically collapse sidebar when a test starts (/quiz) for distraction-free full-screen testing
  useEffect(() => {
    if (pathname === '/quiz' || pathname?.startsWith('/quiz/')) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Detect auth pages — no nav chrome on login
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/login/');

  useEffect(() => {
    const saved = localStorage.getItem('neuronotes-theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  // Auth guard: redirect to /login if not authenticated (and not already on login page)
  useEffect(() => {
    if (!mounted) return;
    if (isAuthPage) return;
    const isAuthenticated = localStorage.getItem('neuronotes-authenticated');
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthPage, router]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await api.getUsers();
        setAllUsers(users);
        const activeId = api.getCurrentUserId();
        const found = users.find(u => u.id === activeId) || users[1] || users[0];
        if (found) {
          setCurrentUser(found);
          api.setCurrentUserId(found.id);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    fetchUsers();
  }, [userRefreshTrigger]);

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

  const switchUser = async (userId: string) => {
    await api.switchUser(userId);
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
    setUserRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        activeMisconception,
        openMisconception,
        closeMisconception,
        selectedConceptId,
        setSelectedConceptId,
        startTargetedDrill,
        currentUser,
        allUsers,
        switchUser,
        userRefreshTrigger,
        triggerRefresh: () => setUserRefreshTrigger((prev) => prev + 1),
      }}
    >
      <div className={`min-h-screen transition-colors font-sans selection:bg-blue-600/30 selection:text-blue-200 ${
        theme === 'light' ? 'bg-app-bg text-app-text-primary' : 'bg-slate-950 text-slate-100'
      }`}>
        {/* Auth pages: no sidebar or header, just render children full-screen */}
        {isAuthPage ? (
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        ) : (
          <>
            {/* Sidebar Navigation */}
            <Sidebar
              mobileOpen={mobileOpen}
              onCloseMobile={() => setMobileOpen(false)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebar}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-[padding] duration-200 ease-in-out ${
              sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'
            }`}>
              <Header
                onOpenMobile={() => setMobileOpen(true)}
                theme={theme}
                onToggleTheme={toggleTheme}
              />

              <main className={`flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto transition-all duration-200 ${
                pathname === '/quiz' || pathname?.startsWith('/quiz/')
                  ? 'max-w-6xl'
                  : 'max-w-7xl'
              }`}>
                {children}
              </main>
            </div>
          </>
        )}

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
