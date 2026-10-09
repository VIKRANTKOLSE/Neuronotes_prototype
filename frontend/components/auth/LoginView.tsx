'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Check,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  UserPlus,
  Users,
  Brain,
} from 'lucide-react';
import { useApp } from '@/components/layout/ClientLayout';
import { api } from '@/services/api';
import { getStoredUsers, createUser } from '@/lib/auth';

export const LoginView: React.FC = () => {
  const router = useRouter();
  const { theme, switchUser } = useApp();
  const isLight = theme === 'light';

  const [email, setEmail] = useState<string>('vikrant.kolse@university.edu');
  const [password, setPassword] = useState<string>('neuronotes123');
  const [name, setName] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
      try {
        const res = await api.login({ email: email.trim(), password });
        if (res?.user) {
          await switchUser(res.user.id);
          localStorage.setItem('neuronotes-authenticated', '1');
          setSuccessMessage(`Signed in as ${res.user.name}. Redirecting...`);
          setTimeout(() => router.push('/'), 500);
          return;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Login failed. Please check credentials or register.');
      }
    } else {
      try {
        const newUser = createUser(name.trim(), email.trim(), password);
        await api.login({ userId: newUser.id });
        await switchUser(newUser.id);
        localStorage.setItem('neuronotes-authenticated', '1');
        setSuccessMessage(`Account created as ${newUser.name}. Redirecting...`);
        setTimeout(() => router.push('/'), 500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed.');
      }
    }
    setIsLoading(false);
  };

  const prefillUser = (target: string) => {
    const stored = getStoredUsers().find(u => u.id === target);
    if (stored) {
      setEmail(stored.email);
      setPassword('neuronotes123');
    }
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'bg-[#F1F5F9]' : 'bg-slate-950'}`}>

      {/* ── TOP NAVBAR ──────────────────────────────────────────────────── */}
      <nav className={`w-full border-b px-6 py-0 flex items-center justify-between h-14 shrink-0 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-base ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Neuronotes
            </span>
            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
              isLight
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              MIRT
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-medium">
          {['About', 'Methodology', 'Documentation'].map(label => (
            <span
              key={label}
              className={`cursor-default transition ${
                isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right badge */}
        <div className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${
          isLight
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          <Brain className="w-3.5 h-3.5" />
          <span>Psychometric Engine</span>
        </div>
      </nav>
      {/* ────────────────────────────────────────────────────────────────── */}

      {/* ── PAGE BODY ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono mb-2 ${
              isLight
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Learner Authentication Portal</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Access the adaptive Item Response Theory (MIRT) learning environment.
            </p>
          </div>

          {/* Form card */}
          <div className={`rounded-2xl border p-6 space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>

            {/* Register: name field */}
            {!isLogin && (
              <div className="space-y-1">
                <label className={`block text-xs font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                        : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Alerts */}
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

            {/* Credentials form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className={`block text-xs font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                        : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block text-xs font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900'
                        : 'bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition shadow-sm flex items-center justify-center gap-2"
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

            {/* Toggle sign-in / register */}
            <p className={`text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => { setIsLogin(false); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create one here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setIsLogin(true); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Registered users list (only when mounted and there are stored users) */}
          {mounted && getStoredUsers().length > 0 && (
            <div className={`rounded-2xl border p-5 space-y-3 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <h2 className={`text-xs font-semibold font-mono uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Registered Learners
                </h2>
              </div>
              <div className="space-y-2">
                {getStoredUsers().map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300`}>
                        {u.avatarInitials}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{u.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{u.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { prefillUser(u.id); setIsLogin(true); }}
                      className="text-[11px] font-mono px-2.5 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition flex items-center gap-1"
                    >
                      <ArrowRight className="w-3 h-3" />
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ────────────────────────────────────────────────────────────────── */}
    </div>
  );
};

export default LoginView;
