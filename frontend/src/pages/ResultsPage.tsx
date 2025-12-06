import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSession } from '../api';
import type { Answer } from '../types';
import PassagePanel from '../components/PassagePanel';
import QuestionPanel from '../components/QuestionPanel';

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sat-blue"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load results</p>
          <Link to="/" className="px-4 py-2 bg-sat-blue text-white rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Build answer map for easy lookup
  const answerMap = new Map<string, Answer>();
  session.answers.forEach(a => answerMap.set(a.questionId, a));

  // Flatten questions
  const questions = session.test.sections.flatMap(s => s.questions);

  if (reviewIndex !== null) {
    const question = questions[reviewIndex];
    const answer = answerMap.get(question.id);

    return (
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Review header */}
        <div className="bg-sat-blue text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="font-semibold text-lg">Review: Question {reviewIndex + 1}</h1>
            <button
              onClick={() => setReviewIndex(null)}
              className="text-sm text-blue-200 hover:text-white"
            >
              Back to Results
            </button>
          </div>
        </div>

        {/* Review content */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PassagePanel passageText={question.passageText} />
            <QuestionPanel
              question={question}
              questionNumber={reviewIndex + 1}
              selectedChoice={answer?.selectedChoice ?? null}
              crossedOutChoices={[]}
              isMarkedForReview={false}
              onSelectChoice={() => {}}
              onToggleCrossOut={() => {}}
              onToggleMark={() => {}}
              showResult={true}
            />
          </div>
        </div>

        {/* Review navigation */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-between">
            <button
              onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
              disabled={reviewIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setReviewIndex(Math.min(questions.length - 1, reviewIndex + 1))}
              disabled={reviewIndex === questions.length - 1}
              className="px-4 py-2 text-sm font-medium text-white bg-sat-blue rounded-lg hover:bg-sat-light-blue disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results summary view
  const percentage = session.percentageScore ?? 0;
  const totalCorrect = session.totalCorrect ?? 0;
  const totalQuestions = session.totalQuestions ?? questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-sat-blue text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Test Complete!</h1>
          <p className="mt-1 text-blue-200">{session.test.title}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Score card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-sat-blue mb-2">
              {session.scaledScore}
            </div>
            <div className="text-gray-500">Scaled Score</div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-semibold text-gray-900">{totalCorrect}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-gray-900">{totalQuestions - totalCorrect}</div>
              <div className="text-sm text-gray-500">Incorrect</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-gray-900">{percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Section breakdown */}
        {session.test.sections.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Section Breakdown</h2>
            <div className="space-y-4">
              {session.test.sections.map(section => {
                const sectionQuestions = section.questions;
                const sectionCorrect = sectionQuestions.filter(q => {
                  const ans = answerMap.get(q.id);
                  return ans?.isCorrect === true;
                }).length;

                return (
                  <div key={section.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{section.name}</span>
                    <span className="font-medium">
                      {sectionCorrect} / {sectionQuestions.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question review list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Questions</h2>
          <div className="space-y-2">
            {questions.map((question, idx) => {
              const answer = answerMap.get(question.id);
              const isCorrect = answer?.isCorrect === true;

              return (
                <button
                  key={question.id}
                  onClick={() => setReviewIndex(idx)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 text-sm truncate max-w-md">
                      {question.prompt.substring(0, 60)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-green-600 text-sm">✓ Correct</span>
                    ) : (
                      <span className="text-red-600 text-sm">✗ Incorrect</span>
                    )}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Home
          </Link>
          <Link
            to={`/test/${session.testId}`}
            className="px-6 py-3 text-sm font-medium text-white bg-sat-blue rounded-lg hover:bg-sat-light-blue"
          >
            Retake Test
          </Link>
        </div>
      </main>
    </div>
  );
}
