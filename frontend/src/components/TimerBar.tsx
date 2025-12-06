interface TimerBarProps {
  sectionName: string;
  moduleNumber: number;
  timeRemaining: number;
  isHidden: boolean;
  currentQuestion: number;
  totalQuestions: number;
  onToggleVisibility: () => void;
  onOpenNavigation: () => void;
  onSaveExit: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TimerBar({
  sectionName,
  moduleNumber,
  timeRemaining,
  isHidden,
  currentQuestion,
  totalQuestions,
  onToggleVisibility,
  onOpenNavigation,
  onSaveExit,
}: TimerBarProps) {
  const isWarning = timeRemaining <= 300 && timeRemaining > 60;
  const isDanger = timeRemaining <= 60;
  
  let timerClass = 'timer-display';
  if (isWarning) timerClass += ' warning';
  if (isDanger) timerClass += ' danger';
  
  return (
    <div className="bg-sat-blue text-white sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-sat-blue/90 border-b border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold">{sectionName}</span>
            <span className="text-white/60">Module {moduleNumber}</span>
          </div>
          
          <div className="px-4 py-1 bg-white/10 rounded-full text-sm">
            THIS IS A PRACTICE TEST
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onSaveExit}
              className="text-sm text-white/80 hover:text-white flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main timer bar */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Question counter */}
          <button
            onClick={onOpenNavigation}
            className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <span className="text-lg font-bold">{currentQuestion}</span>
            <span className="text-white/60">of {totalQuestions}</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          
          {/* Center: Timer */}
          <div className="flex items-center gap-3">
            {!isHidden ? (
              <span className={timerClass}>{formatTime(timeRemaining)}</span>
            ) : (
              <span className="text-white/60 text-sm">Timer hidden</span>
            )}
            
            <button
              onClick={onToggleVisibility}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={isHidden ? 'Show timer' : 'Hide timer'}
            >
              {isHidden ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Right: Directions */}
          <button className="px-4 py-2 text-sm text-white/80 hover:text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Directions
          </button>
        </div>
      </div>
    </div>
  );
}
