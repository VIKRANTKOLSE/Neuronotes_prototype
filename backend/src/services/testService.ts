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
    
    // Ensure each session has strictly ONE notes summary
    let sessionSummaryNote: TestNote | undefined = newTest.notes?.[0];
    if (!sessionSummaryNote && newTest.questions && newTest.questions.length > 0) {
      const mistakeItems = newTest.questions.filter(q => !q.isCorrect);
      const correctItems = newTest.questions.filter(q => q.isCorrect);

      let summaryContent = `SESSION DIAGNOSTIC SUMMARY\n\nCorrect Concepts Evaluated (Normal Size):\n`;
      if (correctItems.length > 0) {
        correctItems.forEach(q => {
          summaryContent += `✓ ${q.conceptName}: ${q.explanation}\n`;
        });
      } else {
        summaryContent += `None recorded in this session.\n`;
      }

      if (mistakeItems.length > 0) {
        summaryContent += `\n[MISTAKES IDENTIFIED & ELONGATED REMEDIATION]\n`;
        mistakeItems.forEach((q, idx) => {
          summaryContent += `**[CRITICAL DIAGNOSTIC ERROR #${idx + 1} & REMEDIATION]**\n`;
          summaryContent += `**Concept with Mistake: ${q.conceptName}**\n`;
          summaryContent += `**Error Analysis: You selected "${q.selectedOptionText}".**\n`;
          summaryContent += `**Elongated Diagnostic Breakdown: ${q.explanation} Detailed psychometric tracing indicates this error stemmed from an active misconception. When evaluating this system, verify standard state boundary conditions and sign conventions.**\n`;
          summaryContent += `**Remediation Rule: Re-solve with correct state conventions: correct solution is "${q.correctOptionText}".**\n\n`;
        });
      } else {
        summaryContent += `\nDiagnostic Evaluation: Zero mistakes observed. All evaluated items solved correctly with high psychometric fidelity.\n`;
      }

      sessionSummaryNote = {
        id: `note-summary-${newId}`,
        testId: newId,
        userId: user.id,
        title: `Session Diagnostic Notes Summary: ${newTest.title}`,
        conceptName: newTest.topicsTested[0] || 'Adaptive Diagnostic',
        tags: ['Session Summary', ...newTest.topicsTested],
        content: summaryContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newTest.notes = [sessionSummaryNote];
    } else if (newTest.notes && newTest.notes.length > 1) {
      newTest.notes = [newTest.notes[0]];
    }

    // Keep single note in global pool
    if (newTest.notes && newTest.notes.length > 0) {
      user.notes = user.notes.filter(n => n.testId !== newId);
      user.notes.unshift(newTest.notes[0]);
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

    // If linked to a test, enforce that each session has strictly ONE notes summary
    if (newNote.testId) {
      user.notes = user.notes.filter(n => n.testId !== newNote.testId);
      user.notes.unshift(newNote);

      const test = user.tests.find(t => t.id === newNote.testId);
      if (test) {
        test.notes = [newNote];
      }
    } else {
      user.notes.unshift(newNote);
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
