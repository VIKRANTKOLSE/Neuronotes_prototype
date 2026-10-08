'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '../../types';
import { getActiveUser, setActiveUserId, getStoredUsers, createUser, authenticateUser } from '../../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  allUsers: AuthUser[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const allUsers = getStoredUsers();

  useEffect(() => {
    const active = getActiveUser();
    setUser(active);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authUser = authenticateUser(email, password);
      setActiveUserId(authUser.id);
      setUser(authUser);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const newUser = createUser(name, email, password);
      setActiveUserId(newUser.id);
      setUser(newUser);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = () => {
    setActiveUserId('');
    setUser(null);
    router.push('/login');
  };

  const switchUser = (userId: string) => {
    setActiveUserId(userId);
    const target = getStoredUsers().find(u => u.id === userId) ?? null;
    setUser(target);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, switchUser, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
