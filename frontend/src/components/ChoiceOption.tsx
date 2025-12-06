interface ChoiceOptionProps {
  label: string;
  text: string;
  isSelected: boolean;
  isCrossedOut: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
  userSelected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  onToggleCrossOut: () => void;
}

export default function ChoiceOption({
  label,
  text,
  isSelected,
  isCrossedOut,
  isCorrect,
  showResult,
  userSelected,
  disabled,
  onSelect,
  onToggleCrossOut,
}: ChoiceOptionProps) {
  let className = 'choice-option flex items-start gap-3';
  
  if (showResult) {
    className += ' disabled';
    if (isCorrect) {
      className += ' correct';
    } else if (userSelected && !isCorrect) {
      className += ' incorrect';
    }
  } else if (isCrossedOut) {
    className += ' crossed-out';
  } else if (isSelected) {
    className += ' selected';
  }
  
  if (disabled) {
    className += ' disabled';
  }

  const handleClick = () => {
    if (!disabled && !showResult && !isCrossedOut) {
      onSelect();
    }
  };

  const handleCrossOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !showResult) {
      onToggleCrossOut();
    }
  };
  
  return (
    <div className={className} onClick={handleClick}>
      <span className={`
        w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-all
        ${isSelected && !showResult && !isCrossedOut ? 'bg-lucas-500 border-lucas-500 text-white' : ''}
        ${showResult && isCorrect ? 'bg-sat-correct border-sat-correct text-white' : ''}
        ${showResult && userSelected && !isCorrect ? 'bg-sat-incorrect border-sat-incorrect text-white' : ''}
        ${!isSelected && !showResult && !isCrossedOut ? 'border-gray-300 text-gray-600' : ''}
        ${isCrossedOut ? 'border-gray-300 text-gray-400' : ''}
      `}>
        {label}
      </span>
      
      <span className={`flex-1 text-left pt-1 ${isCrossedOut ? 'text-gray-400' : 'text-gray-800'}`}>
        {text}
      </span>
      
      {/* Cross-out button */}
      {!showResult && !disabled && (
        <button
          onClick={handleCrossOut}
          className={`cross-out-btn ${isCrossedOut ? 'bg-gray-400 text-white' : ''}`}
          title={isCrossedOut ? 'Undo cross-out' : 'Cross out this choice'}
        >
          {isCrossedOut ? '↩' : '✕'}
        </button>
      )}
      
      {/* Result indicators */}
      {showResult && isCorrect && (
        <span className="text-sat-correct text-sm font-medium flex-shrink-0 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Correct
        </span>
      )}
      {showResult && userSelected && !isCorrect && (
        <span className="text-sat-incorrect text-sm font-medium flex-shrink-0 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Your answer
        </span>
      )}
    </div>
  );
}
