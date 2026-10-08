'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Check,
  ShieldCheck,
  Lock,
  Mail,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Activity,
  UserPlus,
  Users,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';
import { getStoredUsers, createUser, setActiveUserId } from '@/lib/auth';

export const LoginView: React.FC = () => {
  const router = useRouter();
  const { theme, switchUser, currentUser } = useApp();
  const isLight = theme === 'light';

  const [email, setEmail] = useState<string>('vikrant.kolse@university.edu');
  const [password, setPassword] = useState<string>('neuronotes123');
  const [name, setName] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickLogin = async (userId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await api.login({ userId });
      await switchUser(userId);
      setSuccessMessage(`Signed in successfully. Redirecting...`);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to authenticate user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!isLogin && !name.trim()) {
      setErrorMessage('Name is required for registration.');
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      // Accept any email — create an account on the fly if none exists yet
      let user = getStoredUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        const emailName = email.split('@')[0];
        const displayName = emailName
          .split(/[._-]/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        user = createUser(displayName, email, password);
      }
      await api.login({ userId: user.id });
      await switchUser(user.id);
      setSuccessMessage(`Signed in as ${user.name}. Redirecting...`);
      setTimeout(() => router.push('/'), 500);
    } else {
      try {
        const newUser = createUser(name.trim(), email.trim(), password);
        await api.login({ userId: newUser.id });
        await switchUser(newUser.id);
        setSuccessMessage(`Account created as ${newUser.name}. Redirecting...`);
        setTimeout(() => router.push('/'), 500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed.');
      }
    }
    setIsLoading(false);
  };

  const prefillUser = (target: 'elena' | 'vikrant' | string) => {
    if (target === 'elena') {
      setEmail('elena.rostova@university.edu');
      setPassword('neuronotes123');
      setName('Elena Rostova');
    } else {
      setEmail('vikrant.kolse@university.edu');
      setPassword('neuronotes123');
      setName('Vikrant Kolse');
    }
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* BRAND & HEADER */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Neuronotes Diagnostic Access</span>
        </div>
        <h1 className={`text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          Learner Authentication Portal
        </h1>
        <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Select one of the two calibrated research profiles below to enter the adaptive Item Response Theory (MIRT) environment.
        </p>
      </div>

      {/* QUICK 1-CLICK DUAL USER PICKER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Dual-User Profile Selector (1-Click Fast Login)
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Current Active: {currentUser?.name || 'Vikrant Kolse'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* USER 1 CARD: ELENA ROSTOVA */}
          <div className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
            currentUser?.id === 'user-new'
              ? (isLight ? 'bg-amber-50/70 border-amber-300 shadow-md ring-2 ring-amber-400/20' : 'bg-amber-950/20 border-amber-600 ring-2 ring-amber-500/20')
              : (isLight ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800')
          }`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center justify-center font-mono font-bold text-sm">
                    ER
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Elena Rostova
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      First-Year Physical Sciences
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-medium">
                  New Learner
                </span>
              </div>

              {/* Telemetry specs */}
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200/80 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Uncalibrated Baseline</span>
                </div>
                <div className="flex justify-between">
                  <span>Past Tests:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">0 completed</span>
                </div>
                <div className="flex justify-between">
                  <span>Prior Ability θ:</span>
                  <span>θ = 0.00, σ = 1.20</span>
                </div>
                <div className="flex justify-between">
                  <span>Mastery Score:</span>
                  <span>Withheld (0% penalized)</span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Ideal for testing <strong>cold-start</strong> behavior, baseline diagnostic probes, and fresh DAG unprobed states.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user-new')}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm flex items-center justify-center gap-1.5 font-mono"
              >
                <span>Sign In as Elena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => prefillUser('elena')}
                className={`px-2.5 py-2 rounded-lg text-xs font-mono border transition ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="Populate email & password into form"
              >
                Fill Form
              </button>
            </div>
          </div>

          {/* USER 2 CARD: VIKRANT KOLSE */}
          <div className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
            currentUser?.id === 'user-history'
              ? (isLight ? 'bg-blue-50/70 border-blue-300 shadow-md ring-2 ring-blue-400/20' : 'bg-blue-950/20 border-blue-600 ring-2 ring-blue-500/20')
              : (isLight ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800')
          }`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 flex items-center justify-center font-mono font-bold text-sm">
                    VK
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Vikrant Kolse
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Undergraduate Chemistry (Year 3)
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-medium">
                  Has History
                </span>
              </div>

              {/* Telemetry specs */}
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200/80 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Calibrated Model</span>
                </div>
                <div className="flex justify-between">
                  <span>Past Tests:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">3 tests (80%, 100%, 40%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Diagnostic Notes:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">5 recorded notes</span>
                </div>
                <div className="flex justify-between">
                  <span>Mastery Score:</span>
                  <span>71% (54 items evaluated)</span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Ideal for testing <strong>historical test reviews</strong>, student notes notebooks, and active misconception remediation.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user-history')}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center justify-center gap-1.5 font-mono"
              >
                <span>Sign In as Vikrant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => prefillUser('vikrant')}
                className={`px-2.5 py-2 rounded-lg text-xs font-mono border transition ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="Populate email & password into form"
              >
                Fill Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STANDARD CREDENTIALS FORM */}
      <div className={`p-6 rounded-2xl border max-w-xl mx-auto space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <h2 className={`text-sm font-semibold font-mono uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
            </h2>
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserPlus className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                  isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                }`}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                  isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none font-mono ${
                  isLight ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900' : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm font-mono flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 font-mono">
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => { setIsLogin(false); setErrorMessage(null); setSuccessMessage(null); }} className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">
                Create one here
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button onClick={() => { setIsLogin(true); setErrorMessage(null); setSuccessMessage(null); }} className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>

      {/* REGISTERED USERS LIST */}
      <div className={`p-6 rounded-2xl border max-w-xl mx-auto space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h2 className={`text-sm font-semibold font-mono uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Registered Learners
          </h2>
        </div>
        {getStoredUsers().length === 0 ? (
          <p className="text-xs text-slate-500 font-mono">No accounts registered yet.</p>
        ) : (
          <div className="space-y-2">
            {getStoredUsers().map((u) => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    u.id === 'user-new'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  }`}>
                    {u.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{u.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{u.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { prefillUser(u.id); setIsLogin(true); }}
                  className="text-[11px] font-mono px-2.5 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;
