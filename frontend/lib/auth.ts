import { AuthUser } from '../types';

const STORAGE_KEY = 'neuronotes-auth';

function hashPassword(password: string): string {
  // Simple hash for demo purposes — not cryptographically secure
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36) + '_' + password.length;
}

export function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuthUser[];
  } catch {
    return [];
  }
}

export function saveUsers(users: AuthUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): AuthUser | undefined {
  return getStoredUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): AuthUser | undefined {
  return getStoredUsers().find(u => u.id === id);
}

export function createUser(name: string, email: string, password: string): AuthUser {
  const users = getStoredUsers();
  if (findUserByEmail(email)) {
    throw new Error('An account with this email already exists.');
  }
  const user: AuthUser = {
    id: 'user-' + Date.now(),
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    avatarInitials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function authenticateUser(email: string, password: string): AuthUser {
  const user = findUserByEmail(email);
  if (!user) throw new Error('No account found with this email.');
  if (user.passwordHash !== hashPassword(password)) throw new Error('Incorrect password.');
  return user;
}

export function getActiveUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('neuronotes-active-user');
}

export function setActiveUserId(id: string): void {
  localStorage.setItem('neuronotes-active-user', id);
}

export function getActiveUser(): AuthUser | null {
  const id = getActiveUserId();
  if (!id) return null;
  return findUserById(id) ?? null;
}
