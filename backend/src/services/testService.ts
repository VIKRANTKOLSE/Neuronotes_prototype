import { PastTestSession, TestNote } from '../types/index.js';
import { UserService } from './userService.js';

export class TestService {
  /**
   * Get all completed tests for a user
   */
  static getTests(userId?: string): PastTestSession[] {
    const user = UserService.getUser(userId);
    return user.tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get a single test session by ID with its review questions and linked notes
   */
  static getTestById(testId: string, userId?: string): PastTestSession | null {
    const user = UserService.getUser(userId);
    const test = user.tests.find(t => t.id === testId);
    if (!test) return null;

    // Attach latest notes matching this test
    const linkedNotes = user.notes.filter(n => n.testId === testId);
    return {
      ...test,
      notes: linkedNotes
    };
  }

  /**
   * Record a new completed test session and update user mastery
   */
  static recordTestSession(
    testData: Omit<PastTestSession, 'id' | 'timestamp'>,
    userId?: string
  ): PastTestSession {
    const user = UserService.getUser(userId);
    const newId = `test-${Date.now().toString(36)}`;
    const newTest: PastTestSession = {
      ...testData,
      id: newId,
      userId: user.id,
      timestamp: new Date().toISOString(),
      notes: testData.notes || []
    };

    user.tests.unshift(newTest);
    user.itemsAnswered += newTest.totalQuestions;
    user.isNewUser = false;
    
    // Add any initial notes from the test into the global user notes pool
    if (newTest.notes && newTest.notes.length > 0) {
      newTest.notes.forEach(note => {
        if (!note.id) note.id = `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
        note.testId = newId;
        note.userId = user.id;
        user.notes.unshift(note);
      });
    }

    // Add activity log
    user.activities.unshift({
      id: `act-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      type: 'adaptive_probe',
      title: `Completed Test: ${newTest.title}`,
      description: `Scored ${newTest.score}% (${newTest.correctCount}/${newTest.totalQuestions} items). Latent ability shifted to θ = ${newTest.thetaEnd}.`,
      conceptName: newTest.topicsTested[0] || 'General Electrochemistry',
      deltaMetric: `Score: ${newTest.score}%`,
      statusBadge: newTest.score >= 75 ? 'strong' : newTest.score >= 50 ? 'developing' : 'weak'
    });

    return newTest;
  }

  /**
   * Retrieve notes with filtering
   */
  static getNotes(
    userId?: string,
    filter?: { testId?: string; conceptId?: string; search?: string }
  ): TestNote[] {
    const user = UserService.getUser(userId);
    let notes = [...user.notes];

    if (filter?.testId) {
      notes = notes.filter(n => n.testId === filter.testId);
    }

    if (filter?.conceptId) {
      notes = notes.filter(n => n.conceptId === filter.conceptId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      notes = notes.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Add a new note (associated with a test or standalone)
   */
  static createNote(
    noteData: {
      testId?: string;
      title: string;
      content: string;
      conceptId?: string;
      conceptName?: string;
      tags?: string[];
    },
    userId?: string
  ): TestNote {
    const user = UserService.getUser(userId);
    const newNote: TestNote = {
      id: `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      testId: noteData.testId,
      userId: user.id,
      title: noteData.title,
      content: noteData.content,
      conceptId: noteData.conceptId,
      conceptName: noteData.conceptName,
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    user.notes.unshift(newNote);

    // If linked to a test, also update that test's internal notes array
    if (newNote.testId) {
      const test = user.tests.find(t => t.id === newNote.testId);
      if (test) {
        if (!test.notes) test.notes = [];
        test.notes.unshift(newNote);
      }
    }

    return newNote;
  }

  /**
   * Update an existing note
   */
  static updateNote(
    noteId: string,
    updates: Partial<Pick<TestNote, 'title' | 'content' | 'tags' | 'conceptId' | 'conceptName'>>,
    userId?: string
  ): TestNote | null {
    const user = UserService.getUser(userId);
    const note = user.notes.find(n => n.id === noteId);
    if (!note) return null;

    if (updates.title !== undefined) note.title = updates.title;
    if (updates.content !== undefined) note.content = updates.content;
    if (updates.tags !== undefined) note.tags = updates.tags;
    if (updates.conceptId !== undefined) note.conceptId = updates.conceptId;
    if (updates.conceptName !== undefined) note.conceptName = updates.conceptName;
    note.updatedAt = new Date().toISOString();

    return note;
  }

  /**
   * Delete a note
   */
  static deleteNote(noteId: string, userId?: string): boolean {
    const user = UserService.getUser(userId);
    const initialLen = user.notes.length;
    user.notes = user.notes.filter(n => n.id !== noteId);
    
    // Also remove from any tests that held it
    user.tests.forEach(test => {
      if (test.notes) {
        test.notes = test.notes.filter(n => n.id !== noteId);
      }
    });

    return user.notes.length < initialLen;
  }
}
