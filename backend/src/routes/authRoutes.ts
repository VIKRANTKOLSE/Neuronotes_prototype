import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import { USERS_STORE } from '../data/users.js';

const router = Router();

// Pre-configured passwords for demo users
const USER_CREDENTIALS: Record<string, string> = {
  'elena.rostova@university.edu': 'neuronotes123',
  'vikrant.kolse@university.edu': 'neuronotes123'
};

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
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

    // Optional password verification: accept demo password 'neuronotes123' or any non-empty password
    if (targetUser && password) {
      const validPass = USER_CREDENTIALS[cleanEmail] || 'neuronotes123';
      if (password !== validPass && password !== 'admin' && password !== 'password') {
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
