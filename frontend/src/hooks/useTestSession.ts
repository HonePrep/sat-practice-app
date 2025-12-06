import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuestionState, Session } from '../types';
import { updateSession } from '../api';

const STORAGE_KEY_PREFIX = 'sat_session_';

interface UseTestSessionOptions {
  session: Session;
  extraTimeEnabled: boolean;
  onTimeUp: () => void;
}

export function useTestSession({ session, extraTimeEnabled, onTimeUp }: UseTestSessionOptions) {
  const questions = session.test.sections.flatMap(s => s.questions);
  
  const initialStates = new Map<string, QuestionState>();
  session.answers.forEach(answer => {
    initialStates.set(answer.questionId, {
      questionId: answer.questionId,
      selectedChoice: answer.selectedChoice,
      markedForReview: answer.markedForReview,
      crossedOutChoices: [],
    });
  });
  
  const storageKey = `${STORAGE_KEY_PREFIX}${session.id}`;
  const savedState = localStorage.getItem(storageKey);
  let initialIndex = 0;
  let baseTime = session.test.totalTimeSeconds;
  let initialTime = extraTimeEnabled ? Math.floor(baseTime * 1.5) : baseTime;
  
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      initialIndex = parsed.currentQuestionIndex ?? 0;
      initialTime = parsed.timeRemaining ?? initialTime;
      if (parsed.questionStates) {
        for (const [key, value] of Object.entries(parsed.questionStates)) {
          initialStates.set(key, value as QuestionState);
        }
      }
    } catch { /* ignore */ }
  }
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialIndex);
  const [questionStates, setQuestionStates] = useState(initialStates);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const autoSaveRef = useRef<number | null>(null);
  const hasTimedOut = useRef(false);
  
  useEffect(() => {
    const stateToSave = {
      currentQuestionIndex,
      timeRemaining,
      questionStates: Object.fromEntries(questionStates),
    };
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
  }, [currentQuestionIndex, timeRemaining, questionStates, storageKey]);
  
  useEffect(() => {
    if (session.status === 'completed') return;
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1 && !hasTimedOut.current) {
          hasTimedOut.current = true;
          onTimeUp();
          return 0;
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session.status, onTimeUp]);
  
  useEffect(() => {
    if (session.status === 'completed') return;
    autoSaveRef.current = window.setInterval(() => { saveProgress(); }, 30000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [session.status, questionStates, timeRemaining]);
  
  const saveProgress = useCallback(async () => {
    const answers = Array.from(questionStates.values()).map(state => ({
      questionId: state.questionId,
      selectedChoice: state.selectedChoice,
      markedForReview: state.markedForReview,
      crossedOutChoices: state.crossedOutChoices,
    }));
    try {
      await updateSession(session.id, { answers, timeRemaining });
    } catch (err) {
      console.error('Failed to save:', err);
    }
  }, [session.id, questionStates, timeRemaining]);
  
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) setCurrentQuestionIndex(index);
  }, [questions.length]);
  
  const goToNext = useCallback(() => goToQuestion(currentQuestionIndex + 1), [currentQuestionIndex, goToQuestion]);
  const goToPrevious = useCallback(() => goToQuestion(currentQuestionIndex - 1), [currentQuestionIndex, goToQuestion]);
  
  const selectChoice = useCallback((choice: string) => {
    if (!currentQuestion) return;
    setQuestionStates(prev => {
      const newStates = new Map(prev);
      const existing = newStates.get(currentQuestion.id);
      newStates.set(currentQuestion.id, {
        questionId: currentQuestion.id,
        selectedChoice: choice,
        markedForReview: existing?.markedForReview ?? false,
        crossedOutChoices: existing?.crossedOutChoices ?? [],
      });
      return newStates;
    });
  }, [currentQuestion]);
  
  const toggleCrossOut = useCallback((choice: string) => {
    if (!currentQuestion) return;
    setQuestionStates(prev => {
      const newStates = new Map(prev);
      const existing = newStates.get(currentQuestion.id);
      const crossed = existing?.crossedOutChoices ?? [];
      const newCrossed = crossed.includes(choice) ? crossed.filter(c => c !== choice) : [...crossed, choice];
      newStates.set(currentQuestion.id, {
        questionId: currentQuestion.id,
        selectedChoice: existing?.selectedChoice ?? null,
        markedForReview: existing?.markedForReview ?? false,
        crossedOutChoices: newCrossed,
      });
      return newStates;
    });
  }, [currentQuestion]);
  
  const toggleMarkForReview = useCallback(() => {
    if (!currentQuestion) return;
    setQuestionStates(prev => {
      const newStates = new Map(prev);
      const existing = newStates.get(currentQuestion.id);
      newStates.set(currentQuestion.id, {
        questionId: currentQuestion.id,
        selectedChoice: existing?.selectedChoice ?? null,
        markedForReview: !(existing?.markedForReview ?? false),
        crossedOutChoices: existing?.crossedOutChoices ?? [],
      });
      return newStates;
    });
  }, [currentQuestion]);
  
  const toggleTimerVisibility = useCallback(() => setIsTimerHidden(prev => !prev), []);
  
  const submitTest = useCallback(async (): Promise<Session> => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    const answers = Array.from(questionStates.values()).map(state => ({
      questionId: state.questionId,
      selectedChoice: state.selectedChoice,
      markedForReview: state.markedForReview,
      crossedOutChoices: state.crossedOutChoices,
    }));
    questions.forEach(q => {
      if (!questionStates.has(q.id)) {
        answers.push({ questionId: q.id, selectedChoice: null, markedForReview: false, crossedOutChoices: [] });
      }
    });
    const result = await updateSession(session.id, { answers, timeRemaining, submit: true });
    localStorage.removeItem(storageKey);
    return result;
  }, [session.id, questionStates, questions, timeRemaining, storageKey]);
  
  const saveAndExit = useCallback(async () => {
    await saveProgress();
  }, [saveProgress]);
  
  const answeredCount = Array.from(questionStates.values()).filter(s => s.selectedChoice).length;
  const markedCount = Array.from(questionStates.values()).filter(s => s.markedForReview).length;
  
  return {
    currentQuestionIndex,
    currentQuestion,
    questions,
    questionStates,
    timeRemaining,
    isTimerHidden,
    goToQuestion,
    goToNext,
    goToPrevious,
    selectChoice,
    toggleCrossOut,
    toggleMarkForReview,
    toggleTimerVisibility,
    submitTest,
    saveAndExit,
    answeredCount,
    markedCount,
  };
}
