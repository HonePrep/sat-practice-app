import type { QuestionState } from '../types';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  questionStates: Map<string, QuestionState>;
  questionIds: string[];
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  showSubmit?: boolean;
  onOpenNavigation: () => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  questionStates,
  questionIds,
  onPrevious,
  onNext,
  onSubmit,
  showSubmit = true,
  onOpenNavigation,
}: QuestionNavigatorProps) {

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          {/* Center: Mini nav + status */}
          <div className="flex items-center gap-6">
            {/* Quick nav pills */}
            <div className="hidden md:flex items-center gap-1">
              {questionIds.slice(Math.max(0, currentIndex - 3), Math.min(questionIds.length, currentIndex + 4)).map((qId, i) => {
                const actualIdx = Math.max(0, currentIndex - 3) + i;
                const state = questionStates.get(qId);
                const isAnswered = state?.selectedChoice != null;
                const isMarked = state?.markedForReview ?? false;
                const isCurrent = actualIdx === currentIndex;

                return (
                  <div
                    key={qId}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium
                      ${isCurrent ? 'ring-2 ring-lucas-400 ring-offset-1' : ''}
                      ${isMarked ? 'bg-sat-marked text-white' : isAnswered ? 'bg-lucas-500 text-white' : 'bg-gray-200 text-gray-600'}
                    `}
                  >
                    {actualIdx + 1}
                  </div>
                );
              })}
            </div>

            {/* Open full navigation */}
            <button
              onClick={onOpenNavigation}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All Questions
            </button>
          </div>
          
          {/* Next / Submit */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-lucas-500 rounded-xl hover:bg-lucas-600 transition-colors"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : showSubmit && onSubmit ? (
            <button
              onClick={onSubmit}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-lucas-600 rounded-xl hover:bg-lucas-700 transition-colors"
            >
              Submit Test
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
