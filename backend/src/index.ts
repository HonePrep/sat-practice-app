import express from 'express';
import cors from 'cors';
import * as db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/tests', (_req, res) => {
  try {
    const tests = db.getAllTests();
    const result = tests.map((test: any) => {
      const sections = db.getSectionsByTestId(test.id);
      let totalQuestions = 0;
      const sectionsWithCount = sections.map((section: any) => {
        const questions = db.getQuestionsBySectionId(section.id);
        totalQuestions += questions.length;
        return { ...section, testId: section.test_id, timeLimitSeconds: section.time_limit_seconds, _count: { questions: questions.length } };
      });
      return { ...test, totalTimeSeconds: test.total_time_seconds, createdAt: test.created_at, updatedAt: test.updated_at, sections: sectionsWithCount, totalQuestions };
    });
    res.json(result);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/tests/:id', (req, res) => {
  try {
    const test = db.getTestWithDetails(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sessions', (req, res) => {
  try {
    const { testId } = req.body;
    if (!testId) return res.status(400).json({ error: 'testId required' });
    const test = db.getTestWithDetails(testId);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    const sessionId = db.generateId();
    db.insertSession(sessionId, testId);
    test.sections.forEach((s: any) => s.questions.forEach((q: any) => db.upsertAnswer(db.generateId(), sessionId, q.id, null, null, 0)));
    res.json(db.getSessionWithDetails(sessionId));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sessions/:id', (req, res) => {
  try {
    const session = db.getSessionWithDetails(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.put('/api/sessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeRemaining, submit } = req.body;
    const session = db.getSessionWithDetails(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'completed') return res.status(400).json({ error: 'Already completed' });

    const correctChoices = new Map<string, string>();
    session.test.sections.forEach((s: any) => s.questions.forEach((q: any) => {
      const correct = q.choices.find((c: any) => c.isCorrect);
      if (correct) correctChoices.set(q.id, correct.label);
    }));

    if (answers) for (const ans of answers) {
      const correctLabel = correctChoices.get(ans.questionId);
      const isCorrect = ans.selectedChoice ? (ans.selectedChoice === correctLabel ? 1 : 0) : null;
      db.upsertAnswer(db.generateId(), id, ans.questionId, ans.selectedChoice, isCorrect, ans.markedForReview ? 1 : 0);
    }

    if (submit) {
      const allAnswers = db.getAnswersBySessionId(id);
      const total = allAnswers.length;
      const correct = allAnswers.filter((a: any) => a.is_correct === 1).length;
      const pct = total > 0 ? (correct / total) * 100 : 0;
      const scaled = Math.round(200 + (correct / total) * 600);
      db.updateSession('completed', new Date().toISOString(), timeRemaining ?? 0, correct, total, scaled, pct, id);
    }
    res.json(db.getSessionWithDetails(id));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/admin/import-test', (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.sections) return res.status(400).json({ error: 'Invalid data' });
    const testId = db.generateId();
    db.insertTest(testId, data.title, data.description || null, data.difficulty || 'Medium', data.totalTimeSeconds || 1920);
    data.sections.forEach((s: any, si: number) => {
      const sId = db.generateId();
      db.insertSection(sId, testId, s.name, s.order ?? si, s.timeLimitSeconds || 1920);
      s.questions.forEach((q: any, qi: number) => {
        const qId = db.generateId();
        db.insertQuestion(qId, sId, q.order ?? qi, q.prompt, q.passageText || null, q.explanation || null, q.difficulty || 'Medium', JSON.stringify(q.tags || []));
        q.choices.forEach((c: any) => db.insertChoice(db.generateId(), qId, c.label, c.text, c.isCorrect ? 1 : 0));
      });
    });
    res.json({ success: true, test: db.getTestWithDetails(testId) });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/admin/tests/:id', (req, res) => {
  try { db.deleteTest(req.params.id); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ approved: false, message: 'Email required' });
    const approved = db.isEmailApproved(email);
    if (approved) {
      res.json({ approved: true });
    } else {
      res.json({ approved: false, message: 'This email is not approved. Make sure you use the same email you signed up with on Skool.' });
    }
  } catch (err: any) { res.status(500).json({ approved: false, message: err.message }); }
});

app.get('/api/auth/check', (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) return res.json({ approved: false });
    res.json({ approved: db.isEmailApproved(email) });
  } catch { res.json({ approved: false }); }
});

// ADMIN: Manage approved emails
app.get('/admin/emails', (_req, res) => {
  try {
    res.json({ emails: db.getAllApprovedEmails() });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/admin/emails', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    db.addApprovedEmail(email);
    res.json({ success: true, emails: db.getAllApprovedEmails() });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/admin/emails/:email', (req, res) => {
  try {
    db.removeApprovedEmail(req.params.email);
    res.json({ success: true, emails: db.getAllApprovedEmails() });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Bulk add emails
app.post('/admin/emails/bulk', (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) return res.status(400).json({ error: 'emails array required' });
    emails.forEach((email: string) => db.addApprovedEmail(email));
    res.json({ success: true, added: emails.length, emails: db.getAllApprovedEmails() });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

async function start() {
  await db.initDb();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch(console.error);
