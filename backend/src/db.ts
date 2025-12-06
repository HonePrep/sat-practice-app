import initSqlJs, { Database } from 'sql.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

let db: Database;
const dbPath = path.join(process.cwd(), 'data', 'sat-practice.db');

export async function initDb() {
  const SQL = await initSqlJs();
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS tests (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, difficulty TEXT DEFAULT 'Medium', total_time_seconds INTEGER DEFAULT 1920, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, test_id TEXT NOT NULL, name TEXT NOT NULL, sort_order INTEGER DEFAULT 0, time_limit_seconds INTEGER DEFAULT 1920);
    CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, section_id TEXT NOT NULL, sort_order INTEGER DEFAULT 0, prompt TEXT NOT NULL, passage_text TEXT, explanation TEXT, difficulty TEXT DEFAULT 'Medium', tags TEXT DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS choices (id TEXT PRIMARY KEY, question_id TEXT NOT NULL, label TEXT NOT NULL, text TEXT NOT NULL, is_correct INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, test_id TEXT NOT NULL, status TEXT DEFAULT 'in_progress', started_at TEXT DEFAULT CURRENT_TIMESTAMP, completed_at TEXT, time_remaining INTEGER, total_correct INTEGER, total_questions INTEGER, scaled_score INTEGER, percentage_score REAL);
    CREATE TABLE IF NOT EXISTS answers (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, question_id TEXT NOT NULL, selected_choice TEXT, is_correct INTEGER, marked_for_review INTEGER DEFAULT 0, UNIQUE(session_id, question_id));
    CREATE TABLE IF NOT EXISTS approved_emails (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, added_at TEXT DEFAULT CURRENT_TIMESTAMP);
  `);
  saveDb();
}

export function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function generateId(): string { return uuidv4(); }

function queryAll(sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function queryOne(sql: string, params: any[] = []): any {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function run(sql: string, params: any[] = []) {
  db.run(sql, params);
  saveDb();
}

export function getAllTests() { return queryAll('SELECT * FROM tests ORDER BY created_at DESC'); }
export function getTestById(id: string) { return queryOne('SELECT * FROM tests WHERE id = ?', [id]); }
export function insertTest(id: string, title: string, desc: string | null, diff: string, time: number) { run('INSERT INTO tests (id, title, description, difficulty, total_time_seconds) VALUES (?, ?, ?, ?, ?)', [id, title, desc, diff, time]); }
export function deleteTest(id: string) { run('DELETE FROM tests WHERE id = ?', [id]); }
export function getSectionsByTestId(testId: string) { return queryAll('SELECT * FROM sections WHERE test_id = ? ORDER BY sort_order', [testId]); }
export function insertSection(id: string, testId: string, name: string, order: number, time: number) { run('INSERT INTO sections (id, test_id, name, sort_order, time_limit_seconds) VALUES (?, ?, ?, ?, ?)', [id, testId, name, order, time]); }
export function getQuestionsBySectionId(sectionId: string) { return queryAll('SELECT * FROM questions WHERE section_id = ? ORDER BY sort_order', [sectionId]); }
export function getQuestionById(id: string) { return queryOne('SELECT * FROM questions WHERE id = ?', [id]); }
export function insertQuestion(id: string, sectionId: string, order: number, prompt: string, passage: string | null, explanation: string | null, diff: string, tags: string) { run('INSERT INTO questions (id, section_id, sort_order, prompt, passage_text, explanation, difficulty, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, sectionId, order, prompt, passage, explanation, diff, tags]); }
export function getChoicesByQuestionId(questionId: string) { return queryAll('SELECT * FROM choices WHERE question_id = ? ORDER BY label', [questionId]); }
export function insertChoice(id: string, questionId: string, label: string, text: string, isCorrect: number) { run('INSERT INTO choices (id, question_id, label, text, is_correct) VALUES (?, ?, ?, ?, ?)', [id, questionId, label, text, isCorrect]); }
export function getSessionById(id: string) { return queryOne('SELECT * FROM sessions WHERE id = ?', [id]); }
export function insertSession(id: string, testId: string) { run("INSERT INTO sessions (id, test_id, status) VALUES (?, ?, 'in_progress')", [id, testId]); }
export function updateSession(status: string, completedAt: string | null, timeRemaining: number, totalCorrect: number, totalQuestions: number, scaledScore: number, percentageScore: number, id: string) { run('UPDATE sessions SET status = ?, completed_at = ?, time_remaining = ?, total_correct = ?, total_questions = ?, scaled_score = ?, percentage_score = ? WHERE id = ?', [status, completedAt, timeRemaining, totalCorrect, totalQuestions, scaledScore, percentageScore, id]); }
export function getAnswersBySessionId(sessionId: string) { return queryAll('SELECT * FROM answers WHERE session_id = ?', [sessionId]); }
export function upsertAnswer(id: string, sessionId: string, questionId: string, selectedChoice: string | null, isCorrect: number | null, markedForReview: number) {
  const existing = queryOne('SELECT id FROM answers WHERE session_id = ? AND question_id = ?', [sessionId, questionId]);
  if (existing) {
    run('UPDATE answers SET selected_choice = ?, is_correct = ?, marked_for_review = ? WHERE session_id = ? AND question_id = ?', [selectedChoice, isCorrect, markedForReview, sessionId, questionId]);
  } else {
    run('INSERT INTO answers (id, session_id, question_id, selected_choice, is_correct, marked_for_review) VALUES (?, ?, ?, ?, ?, ?)', [id, sessionId, questionId, selectedChoice, isCorrect, markedForReview]);
  }
}
export function clearAllData() { run('DELETE FROM answers'); run('DELETE FROM sessions'); run('DELETE FROM choices'); run('DELETE FROM questions'); run('DELETE FROM sections'); run('DELETE FROM tests'); }

export function getTestWithDetails(testId: string) {
  const test = getTestById(testId); if (!test) return null;
  const sections = getSectionsByTestId(testId).map((section: any) => {
    const questions = getQuestionsBySectionId(section.id).map((question: any) => {
      const choices = getChoicesByQuestionId(question.id);
      return { ...question, passageText: question.passage_text, choices: choices.map((c: any) => ({ ...c, questionId: c.question_id, isCorrect: Boolean(c.is_correct) })) };
    });
    return { ...section, testId: section.test_id, order: section.sort_order, timeLimitSeconds: section.time_limit_seconds, questions, _count: { questions: questions.length } };
  });
  return { ...test, totalTimeSeconds: test.total_time_seconds, createdAt: test.created_at, updatedAt: test.updated_at, sections, totalQuestions: sections.reduce((sum: number, s: any) => sum + s.questions.length, 0) };
}

export function getSessionWithDetails(sessionId: string) {
  const session = getSessionById(sessionId); if (!session) return null;
  const test = getTestWithDetails(session.test_id); if (!test) return null;
  const answers = getAnswersBySessionId(sessionId).map((a: any) => {
    const question = getQuestionById(a.question_id);
    const choices = question ? getChoicesByQuestionId(question.id) : [];
    return { ...a, sessionId: a.session_id, questionId: a.question_id, selectedChoice: a.selected_choice, isCorrect: a.is_correct === null ? null : Boolean(a.is_correct), markedForReview: Boolean(a.marked_for_review), question: question ? { ...question, passageText: question.passage_text, choices: choices.map((c: any) => ({ ...c, questionId: c.question_id, isCorrect: Boolean(c.is_correct) })) } : undefined };
  });
  return { ...session, testId: session.test_id, startedAt: session.started_at, completedAt: session.completed_at, timeRemaining: session.time_remaining, totalCorrect: session.total_correct, totalQuestions: session.total_questions, scaledScore: session.scaled_score, percentageScore: session.percentage_score, test, answers };
}

// Email authentication functions
export function isEmailApproved(email: string): boolean {
  const result = queryOne('SELECT id FROM approved_emails WHERE email = ?', [email.toLowerCase()]);
  return result !== null;
}

export function addApprovedEmail(email: string) {
  const exists = isEmailApproved(email);
  if (!exists) {
    run('INSERT INTO approved_emails (id, email) VALUES (?, ?)', [generateId(), email.toLowerCase()]);
  }
}

export function removeApprovedEmail(email: string) {
  run('DELETE FROM approved_emails WHERE email = ?', [email.toLowerCase()]);
}

export function getAllApprovedEmails(): string[] {
  return queryAll('SELECT email FROM approved_emails ORDER BY added_at DESC').map((r: any) => r.email);
}
