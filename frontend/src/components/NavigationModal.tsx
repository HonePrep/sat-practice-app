import type { QuestionState } from '../types';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  currentIndex: number;
  questionStates: Map<string, QuestionState>;
  questionIds: string[];
  onNavigate: (index: number) => void;
  sectionName: string;
  moduleNumber: number;
}

export default function NavigationModal({
  isOpen,
  onClose,
  totalQuestions,
  currentIndex,
  questionStates,
  questionIds,
  onNavigate,
  sectionName,
  moduleNumber,
}: NavigationModalProps) {
  if (!isOpen) return null;

  const handleNavigate = (index: number) => {
    onNavigate(index);
    onClose();
  };

  const answered = questionIds.filter(id => questionStates.get(id)?.selectedChoice).length;
  const marked = questionIds.filter(id => questionStates.get(id)?.markedForReview).length;
  const unanswered = totalQuestions - answered;

  return (
    <div className="nav-modal-overlay" onClick={onClose}>
      <div className="nav-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{sectionName}</h2>
              <p className="text-gray-500 text-sm">Module {moduleNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-lucas-500"></span>
            <span className="text-gray-600">Answered: <strong>{answered}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-white border-2 border-gray-300"></span>
            <span className="text-gray-600">Unanswered: <strong>{unanswered}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-sat-marked"></span>
            <span className="text-gray-600">Marked: <strong>{marked}</strong></span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-9 gap-2">
            {questionIds.map((qId, idx) => {
              const state = questionStates.get(qId);
              const isAnswered = state?.selectedChoice != null;
              const isMarked = state?.markedForReview ?? false;
              const isCurrent = idx === currentIndex;

              let pillClass = 'nav-pill';
              if (isMarked) {
                pillClass += ' marked';
              } else if (isAnswered) {
                pillClass += ' answered';
              } else {
                pillClass += ' unanswered';
              }
              if (isCurrent) {
                pillClass += ' current';
              }

              return (
                <button
                  key={qId}
                  className={pillClass}
                  onClick={() => handleNavigate(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-lucas-500 text-white font-semibold rounded-xl hover:bg-lucas-600"
          >
            Return to Question {currentIndex + 1}
          </button>
        </div>
      </div>
    </div>
  );
}
