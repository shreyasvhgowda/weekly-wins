import { DayName, DAYS } from '../types';

interface HeaderProps {
  selectedDay: DayName | null;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ selectedDay, onBack, isDarkMode, onToggleDarkMode }: HeaderProps) {
  const dayInfo = selectedDay ? DAYS.find(d => d.name === selectedDay) : null;
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedDay && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {selectedDay ? (
                <span className="flex items-center gap-2">
                  <span>{dayInfo?.emoji}</span>
                  <span>{dayInfo?.label}</span>
                </span>
              ) : (
                'Weekly To-Do'
              )}
            </h1>
            {selectedDay && (
              <p className="text-sm text-muted-foreground">{dayInfo?.description}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={onToggleDarkMode}
          className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`}
          aria-label="Toggle dark mode"
        >
          <span className="sr-only">Toggle dark mode</span>
        </button>
      </div>
    </header>
  );
}
