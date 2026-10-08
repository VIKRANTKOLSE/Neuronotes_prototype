import { Router, Request, Response } from 'express';
import { TestService } from '../services/testService.js';

const router = Router();

function getUserId(req: Request): string | undefined {
  return (req.headers['x-user-id'] as string) || (req.query.userId as string);
}

// GET all notes for user (with optional filters)
router.get('/', (req: Request, res: Response) => {
  const { testId, conceptId, search } = req.query;
  const notes = TestService.getNotes(getUserId(req), {
    testId: testId as string,
    conceptId: conceptId as string,
    search: search as string
  });
  res.json(notes);
});

// GET all notes for specific user ID (with optional filters)
router.get('/user/:userId', (req: Request, res: Response) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const { testId, conceptId, search } = req.query;
  const notes = TestService.getNotes(userId, {
    testId: testId as string,
    conceptId: conceptId as string,
    search: search as string
  });
  res.json(notes);
});

// POST create a note
router.post('/', (req: Request, res: Response) => {
  const { testId, title, content, conceptId, conceptName, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const note = TestService.createNote({
    testId,
    title,
    content,
    conceptId,
    conceptName,
    tags
  }, getUserId(req));

  return res.status(201).json(note);
});

// PUT update a note
router.put('/:id', (req: Request, res: Response) => {
  const noteId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = TestService.updateNote(noteId, req.body, getUserId(req));
  if (!updated) {
    return res.status(404).json({ error: `Note "${noteId}" not found` });
  }
  return res.json(updated);
});

// DELETE a note
router.delete('/:id', (req: Request, res: Response) => {
  const noteId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const success = TestService.deleteNote(noteId, getUserId(req));
  if (!success) {
    return res.status(404).json({ error: `Note "${noteId}" not found` });
  }
  return res.json({ message: 'Note deleted successfully', id: noteId });
});

export default router;
