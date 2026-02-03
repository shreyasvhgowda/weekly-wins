import { DayName, DayInfo, DAYS } from '../types';

interface DaySelectorProps {
  selectedDay: DayName | null;
  onSelectDay: (day: DayName) => void;
  completionPercentages: Record<DayName, number>;
}

export function DaySelector({ selectedDay, onSelectDay, completionPercentages }: DaySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 p-4">
      {DAYS.map((day) => (
        <DayCard
          key={day.name}
          day={day}
          isSelected={selectedDay === day.name}
          onClick={() => onSelectDay(day.name)}
          completionPercentage={completionPercentages[day.name]}
        />
      ))}
    </div>
  );
}

interface DayCardProps {
  day: DayInfo;
  isSelected: boolean;
  onClick: () => void;
  completionPercentage: number;
}

function DayCard({ day, isSelected, onClick, completionPercentage }: DayCardProps) {
  const shadowVar = `var(--shadow-${day.color})`;
  
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${isSelected ? 'ring-2 ring-primary scale-[1.02]' : ''}
        day-${day.color}
      `}
      style={{
        boxShadow: isSelected ? shadowVar : 'var(--shadow-md)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl sm:text-3xl">{day.emoji}</span>
        <h3 className="font-semibold text-foreground text-sm sm:text-base">{day.label}</h3>
        <p className="text-xs text-muted-foreground hidden sm:block">{day.description}</p>
        
        {/* Progress indicator */}
        <div className="w-full mt-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full progress-bar"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {completionPercentage}% done
          </p>
        </div>
      </div>
    </button>
  );
}
