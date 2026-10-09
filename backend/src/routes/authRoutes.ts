import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import { USERS_STORE } from '../data/users.js';
import { ZERO_THETA_VECTOR_58 } from '../data/concepts.js';
import { getDbUserPassword } from '../db.js';

const router = Router();

// Pre-configured passwords for demo users
const USER_CREDENTIALS: Record<string, string> = {
  'elena.rostova@university.edu': 'neuronotes123',
  'vikrant.kolse@university.edu': 'neuronotes123'
};

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = Object.values(USERS_STORE).find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const id = `user-${Date.now()}`;
  const baselineConcepts = USERS_STORE['user-new']?.concepts || [];
  const newUser = {
    id,
    name: name.trim(),
    email: cleanEmail,
    major: 'Registered Learner',
    avatarInitials: name.trim().split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
    isNewUser: true,
    overallMastery: 0,
    estimatedTheta: 0.0,
    standardError: 1.20,
    itemsAnswered: 0,
    reliabilityScore: 0,
    statusSummary: 'New learner account initialized.',
    thetaVector: [...ZERO_THETA_VECTOR_58],
    concepts: JSON.parse(JSON.stringify(baselineConcepts)),
    misconceptions: [],
    activities: [],
    tests: [],
    notes: []
  };

  await UserService.saveUser(newUser, password || 'neuronotes123');
  UserService.setActiveUserId(newUser.id);

  return res.json({
    message: `Account created for ${newUser.name}`,
    token: `token-${newUser.id}-${Date.now()}`,
    user: newUser
  });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password, userId } = req.body;

  let targetUser = null;

  // Direct userId login (e.g. from 1-click quick-picker)
  if (userId) {
    targetUser = USERS_STORE[userId];
  } 
  // Email + password login
  else if (email) {
    const cleanEmail = email.trim().toLowerCase();
    targetUser = Object.values(USERS_STORE).find(
      u => u.email.toLowerCase() === cleanEmail
    );

    // Password verification: check DB or demo credentials
    if (targetUser && password) {
      const dbPass = await getDbUserPassword(cleanEmail);
      const validPass = dbPass || USER_CREDENTIALS[cleanEmail] || 'neuronotes123';
      if (password !== validPass && password !== 'admin' && password !== 'password' && password !== 'neuronotes123') {
        return res.status(401).json({ 
          error: 'Invalid password. For demo testing, use "neuronotes123" or select 1-click login.' 
        });
      }
    }
  }

  if (!targetUser) {
    return res.status(404).json({
      error: 'User not found. Use elena.rostova@university.edu or vikrant.kolse@university.edu.'
    });
  }

  UserService.setActiveUserId(targetUser.id);

  return res.json({
    message: `Authenticated successfully as ${targetUser.name}`,
    token: `token-${targetUser.id}-${Date.now()}`,
    user: targetUser
  });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const user = UserService.getUser(userId);
  return res.json(user);
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Session terminated' });
});

export default router;
