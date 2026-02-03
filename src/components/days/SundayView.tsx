import { DayName, DAYS } from '../../types';

interface SundayViewProps {
  summary: {
    day: DayName;
    total: number;
    completed: number;
    percentage: number;
  }[];
  totalPoints: number;
}

export function SundayView({ summary, totalPoints }: SundayViewProps) {
  const totalTasks = summary.reduce((sum, d) => sum + d.total, 0);
  const totalCompleted = summary.reduce((sum, d) => sum + d.completed, 0);
  const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const bestDay = summary.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  , summary[0]);

  const getDayEmoji = (dayName: DayName) => 
    DAYS.find(d => d.name === dayName)?.emoji || '📅';

  const getDayLabel = (dayName: DayName) => 
    DAYS.find(d => d.name === dayName)?.label || dayName;

  return (
    <div className="day-sunday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            📊 Weekly Reflection
          </h2>
          <p className="text-muted-foreground">
            Review your productivity this week
          </p>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 bg-card rounded-2xl border border-border text-center">
            <p className="text-3xl font-bold text-foreground">{totalTasks}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <div className="p-4 bg-card rounded-2xl border border-border text-center">
            <p className="text-3xl font-bold text-[hsl(var(--sunday-accent))]">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="p-4 bg-card rounded-2xl border border-border text-center">
            <p className="text-3xl font-bold text-[hsl(var(--friday-gold))]">{totalPoints}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
        </div>

        {/* Overall progress ring */}
        <div className="reflection-card p-6 rounded-2xl mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--sunday-accent))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallPercentage * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{overallPercentage}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Weekly Completion</h3>
              <p className="text-muted-foreground">
                {totalCompleted} of {totalTasks} tasks completed
              </p>
              {overallPercentage >= 80 && (
                <p className="text-[hsl(var(--saturday-accent))] text-sm mt-2">
                  🎉 Outstanding week!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Breakdown</h3>
          <div className="space-y-3">
            {summary.map(({ day, total, completed, percentage }) => (
              <div
                key={day}
                className="p-4 bg-card rounded-xl border border-border animate-slide-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getDayEmoji(day)}</span>
                    <span className="font-medium text-foreground">{getDayLabel(day)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {completed}/{total} tasks
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full progress-bar ${
                      percentage === 100 
                        ? 'bg-[hsl(var(--saturday-accent))]' 
                        : 'bg-[hsl(var(--sunday-accent))]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best day highlight */}
        {bestDay && bestDay.total > 0 && (
          <div className="reflection-card p-6 rounded-2xl mb-8 text-center">
            <p className="text-4xl mb-2">{getDayEmoji(bestDay.day)}</p>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              Best Day: {getDayLabel(bestDay.day)}
            </h3>
            <p className="text-muted-foreground">
              {bestDay.percentage}% completion rate with {bestDay.completed} tasks done
            </p>
          </div>
        )}

        {/* Weekly insights */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">💡 Weekly Insights</h3>
          <ul className="space-y-3 text-muted-foreground">
            {totalTasks === 0 ? (
              <li className="flex items-start gap-2">
                <span>📝</span>
                <span>No tasks added this week. Start planning for next week!</span>
              </li>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span>📈</span>
                  <span>
                    You completed {overallPercentage}% of your weekly goals
                    {overallPercentage >= 70 ? ' - Great job!' : ' - Keep pushing!'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⭐</span>
                  <span>
                    {getDayLabel(bestDay.day)} was your most productive day
                  </span>
                </li>
                {totalPoints > 0 && (
                  <li className="flex items-start gap-2">
                    <span>🏆</span>
                    <span>You earned {totalPoints} points from gamified tasks</span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Motivational footer */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="italic">
            "The secret of getting ahead is getting started."
          </p>
          <p className="text-sm mt-1">— Mark Twain</p>
        </div>
      </div>
    </div>
  );
}
