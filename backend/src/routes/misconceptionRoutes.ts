import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET all misconceptions for user
router.get('/', (req: Request, res: Response) => {
  const user = UserService.getUser(getUserId(req));
  res.json(user.misconceptions);
});

export default router;
