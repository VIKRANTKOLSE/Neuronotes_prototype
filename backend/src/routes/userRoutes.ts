import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService.js';

const router = Router();

// GET all available users
router.get('/', (_req: Request, res: Response) => {
  const users = UserService.getAllUsers();
  res.json(users);
});

// GET current active user
router.get('/current', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const user = UserService.getUser(userId);
  res.json(user);
});

// POST switch active user
router.post('/current', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const success = UserService.setActiveUserId(userId);
  if (!success) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  const user = UserService.getUser(userId);
  return res.json({ message: 'Active user switched', activeUser: user });
});

// GET specific user by ID
router.get('/:id', (req: Request, res: Response) => {
  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const user = UserService.getUser(paramId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
});

export default router;
