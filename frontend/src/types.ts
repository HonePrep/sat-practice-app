// Database entity types

export interface Choice {
  id: string;
  questionId: string;
  label: string; // A, B, C, D
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  moduleNumber: number;
  order: number;
  prompt: string;
  passageText: string | null;
  explanation: string | null;
  difficulty: string;
  tags: string;
  choices: Choice[];
}

export interface Section {
  id: string;
  testId: string;
  name: string; // "Reading and Writing" or "Math"
  order: number;
  timeLimitSeconds: number;
  questions: Question[];
  _count?: { questions: number };
}

export interface Test {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  totalTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  totalQuestions?: number;
}

export interface Answer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedChoice: string | null;
  isCorrect: boolean | null;
  markedForReview: boolean;
  crossedOutChoices: string[]; // ["A", "C"] etc
  question?: Question;
}

export interface Session {
  id: string;
  testId: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt: string | null;
  timeRemaining: number | null;
  totalCorrect: number | null;
  totalQuestions: number | null;
  scaledScore: number | null;
  percentageScore: number | null;
  currentModule: number;
  currentSection: string; // "rw" or "math"
  extraTimeEnabled: boolean;
  test: Test;
  answers: Answer[];
}

// Frontend state types

export interface QuestionState {
  questionId: string;
  selectedChoice: string | null;
  markedForReview: boolean;
  crossedOutChoices: string[];
}

export interface TestSessionState {
  sessionId: string;
  testId: string;
  currentQuestionIndex: number;
  currentModule: number;
  currentSection: 'rw' | 'math';
  questions: Question[];
  questionStates: Map<string, QuestionState>;
  timeRemaining: number;
  isTimerPaused: boolean;
  isTimerHidden: boolean;
  extraTimeEnabled: boolean;
}

// API response types

export interface TestListItem extends Test {
  totalQuestions: number;
}

export interface CreateSessionResponse extends Session {}

export interface UpdateSessionRequest {
  answers?: Array<{
    questionId: string;
    selectedChoice: string | null;
    markedForReview: boolean;
    crossedOutChoices: string[];
  }>;
  timeRemaining?: number;
  currentModule?: number;
  currentSection?: string;
  submit?: boolean;
}

// Question import schema
export interface ImportQuestion {
  id?: string;
  passage?: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ImportModule {
  moduleNumber: number;
  questions: ImportQuestion[];
}

export interface ImportTest {
  subject: 'RW' | 'Math';
  title?: string;
  modules: ImportModule[];
}
