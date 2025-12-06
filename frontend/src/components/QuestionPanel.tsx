import type { Question, Choice } from '../types';
import ChoiceOption from './ChoiceOption';

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
  selectedChoice: string | null;
  crossedOutChoices: string[];
  isMarkedForReview: boolean;
  onSelectChoice: (choice: string) => void;
  onToggleCrossOut: (choice: string) => void;
  onToggleMark: () => void;
  showResult?: boolean;
}

export default function QuestionPanel({
  question,
  questionNumber,
  selectedChoice,
  crossedOutChoices,
  isMarkedForReview,
  onSelectChoice,
  onToggleCrossOut,
  onToggleMark,
  showResult,
}: QuestionPanelProps) {
  const promptParagraphs = question.prompt.split('\n').filter(p => p.trim());
  
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Question header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-lucas-500 text-white flex items-center justify-center text-lg font-bold">
            {questionNumber}
          </span>
        </div>
        
        {!showResult && (
          <button
            onClick={onToggleMark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isMarkedForReview 
                ? 'bg-sat-marked text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <svg className="w-5 h-5" fill={isMarkedForReview ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
          </button>
        )}
      </div>
      
      {/* Question content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 passage-scroll">
        <div className="mb-6">
          {promptParagraphs.map((para, idx) => (
            <p key={idx} className="text-gray-800 mb-3 leading-relaxed text-[15px]">{para}</p>
          ))}
        </div>
        
        {/* Choices */}
        <div className="space-y-3">
          {question.choices.map((choice: Choice) => (
            <ChoiceOption
              key={choice.id}
              label={choice.label}
              text={choice.text}
              isSelected={selectedChoice === choice.label}
              isCrossedOut={crossedOutChoices.includes(choice.label)}
              isCorrect={choice.isCorrect}
              showResult={showResult}
              userSelected={selectedChoice === choice.label}
              onSelect={() => onSelectChoice(choice.label)}
              onToggleCrossOut={() => onToggleCrossOut(choice.label)}
            />
          ))}
        </div>
        
        {/* Explanation (review mode) */}
        {showResult && question.explanation && (
          <div className="mt-6 p-5 bg-lucas-50 rounded-xl border border-lucas-200">
            <h4 className="font-semibold text-lucas-700 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Explanation
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
