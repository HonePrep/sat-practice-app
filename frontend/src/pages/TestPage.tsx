import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSession, getSession } from '../api';
import { useTestSession } from '../hooks/useTestSession';
import type { Session } from '../types';
import TimerBar from '../components/TimerBar';
import PassagePanel from '../components/PassagePanel';
import QuestionPanel from '../components/QuestionPanel';
import QuestionNavigator from '../components/QuestionNavigator';
import NavigationModal from '../components/NavigationModal';
import SubmitModal from '../components/SubmitModal';

const STORAGE_KEY_PREFIX = 'sat_session_id_';

export default function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [extraTimeEnabled, setExtraTimeEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) return;
    const extraTimePref = localStorage.getItem(`extraTime_${testId}`);
    setExtraTimeEnabled(extraTimePref === 'true');

    const loadOrCreateSession = async () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${testId}`;
      const existingSessionId = localStorage.getItem(storageKey);
      try {
        if (existingSessionId) {
          const existingSession = await getSession(existingSessionId);
          if (existingSession.status === 'in_progress') {
            setSession(existingSession);
            return;
          }
          localStorage.removeItem(storageKey);
        }
        const newSession = await createSession(testId);
        localStorage.setItem(storageKey, newSession.id);
        setSession(newSession);
      } catch (err) {
        setError('Failed to load test. Please try again.');
      }
    };
    loadOrCreateSession();
  }, [testId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-lucas-500 text-white rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lucas-500"></div>
      </div>
    );
  }

  return <TestSessionView session={session} extraTimeEnabled={extraTimeEnabled} />;
}

function TestSessionView({ session: initialSession, extraTimeEnabled }: { session: Session; extraTimeEnabled: boolean }) {
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeUp = useCallback(() => setShowSubmitModal(true), []);

  const {
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
  } = useTestSession({ session: initialSession, extraTimeEnabled, onTimeUp: handleTimeUp });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const currentState = currentQuestion ? questionStates.get(currentQuestion.id) : null;
      const crossedOut = currentState?.crossedOutChoices || [];
      
      switch (e.key) {
        case '1': case 'a': case 'A': if (!crossedOut.includes('A')) selectChoice('A'); break;
        case '2': case 'b': case 'B': if (!crossedOut.includes('B')) selectChoice('B'); break;
        case '3': case 'c': case 'C': if (!crossedOut.includes('C')) selectChoice('C'); break;
        case '4': case 'd': case 'D': if (!crossedOut.includes('D')) selectChoice('D'); break;
        case 'ArrowLeft': case 'j': case 'J': goToPrevious(); break;
        case 'ArrowRight': case 'k': case 'K': goToNext(); break;
        case 'm': case 'M': toggleMarkForReview(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectChoice, goToPrevious, goToNext, toggleMarkForReview, currentQuestion, questionStates]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitTest();
      navigate(`/results/${result.id}`);
    } catch (err) {
      console.error('Submit failed:', err);
      setIsSubmitting(false);
    }
  };

  const handleSaveExit = async () => {
    await saveAndExit();
    navigate('/dashboard');
  };

  const sectionName = initialSession.test.sections[0]?.name || 'Practice Test';
  const moduleNumber = 1;
  const currentState = currentQuestion ? questionStates.get(currentQuestion.id) : undefined;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TimerBar
        sectionName={sectionName}
        moduleNumber={moduleNumber}
        timeRemaining={timeRemaining}
        isHidden={isTimerHidden}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onToggleVisibility={toggleTimerVisibility}
        onOpenNavigation={() => setShowNavModal(true)}
        onSaveExit={handleSaveExit}
      />

      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PassagePanel passageText={currentQuestion?.passageText ?? null} />
          {currentQuestion && (
            <QuestionPanel
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedChoice={currentState?.selectedChoice ?? null}
              crossedOutChoices={currentState?.crossedOutChoices ?? []}
              isMarkedForReview={currentState?.markedForReview ?? false}
              onSelectChoice={selectChoice}
              onToggleCrossOut={toggleCrossOut}
              onToggleMark={toggleMarkForReview}
            />
          )}
        </div>
      </div>

      <QuestionNavigator
        totalQuestions={questions.length}
        currentIndex={currentQuestionIndex}
        questionStates={questionStates}
        questionIds={questions.map(q => q.id)}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onSubmit={() => setShowSubmitModal(true)}
        onOpenNavigation={() => setShowNavModal(true)}
      />

      <NavigationModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        totalQuestions={questions.length}
        currentIndex={currentQuestionIndex}
        questionStates={questionStates}
        questionIds={questions.map(q => q.id)}
        onNavigate={goToQuestion}
        sectionName={sectionName}
        moduleNumber={moduleNumber}
      />

      {showSubmitModal && (
        <SubmitModal
          answeredCount={answeredCount}
          totalQuestions={questions.length}
          markedCount={markedCount}
          isSubmitting={isSubmitting}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
