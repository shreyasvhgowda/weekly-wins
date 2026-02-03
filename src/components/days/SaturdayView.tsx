import { useState } from 'react';
import { Task } from '../../types';

interface SaturdayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  completionPercentage: number;
}

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function SaturdayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  completionPercentage,
}: SaturdayViewProps) {
  const [newHabit, setNewHabit] = useState('');

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    onAddTask({
      text: newHabit.trim(),
      completed: false,
      streak: 0,
      habitDays: [false, false, false, false, false, false, false],
    });
    setNewHabit('');
  };

  const toggleHabitDay = (taskId: string, dayIndex: number, currentDays: boolean[]) => {
    const newDays = [...currentDays];
    newDays[dayIndex] = !newDays[dayIndex];
    const streak = newDays.filter(Boolean).length;
    onUpdate(taskId, { habitDays: newDays, streak });
  };

  const totalStreaks = tasks.reduce((sum, t) => sum + (t.streak || 0), 0);
  const maxPossibleStreak = tasks.length * 7;

  return (
    <div className="day-saturday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--saturday-accent))] flex items-center justify-center text-white text-2xl">
              🔥
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Habit Tracker
              </h2>
              <p className="text-muted-foreground">
                Build your weekly streaks
              </p>
            </div>
          </div>

          {/* Streak stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-card rounded-2xl border border-border text-center">
              <p className="text-3xl font-bold text-[hsl(var(--saturday-accent))]">{totalStreaks}</p>
              <p className="text-sm text-muted-foreground">Total Days</p>
            </div>
            <div className="p-4 bg-card rounded-2xl border border-border text-center">
              <p className="text-3xl font-bold text-foreground">{tasks.length}</p>
              <p className="text-sm text-muted-foreground">Habits</p>
            </div>
          </div>

          {/* Overall progress */}
          {maxPossibleStreak > 0 && (
            <div className="mt-4 p-4 bg-card rounded-2xl border border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Weekly Progress</span>
                <span className="font-medium text-foreground">
                  {Math.round((totalStreaks / maxPossibleStreak) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--saturday-accent))] progress-bar"
                  style={{ width: `${(totalStreaks / maxPossibleStreak) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add habit input */}
        <form onSubmit={handleAddHabit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add a new habit..."
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-input 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[hsl(var(--saturday-accent))] text-white
                       font-medium hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
        </form>

        {/* Habits list */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <p className="text-4xl mb-4">🌱</p>
              <p className="text-muted-foreground text-lg">No habits yet</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Start building good habits today
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-card rounded-2xl border border-border animate-scale-in"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{task.text}</span>
                    {(task.streak || 0) > 0 && (
                      <span className="streak-badge text-sm">
                        🔥 {task.streak}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                {/* Week days grid */}
                <div className="flex gap-2">
                  {DAYS_OF_WEEK.map((day, index) => {
                    const isChecked = task.habitDays?.[index] || false;
                    return (
                      <button
                        key={index}
                        onClick={() => toggleHabitDay(task.id, index, task.habitDays || Array(7).fill(false))}
                        className={`
                          flex-1 aspect-square rounded-xl flex flex-col items-center justify-center
                          transition-all duration-200 text-sm font-medium
                          ${isChecked 
                            ? 'bg-[hsl(var(--saturday-accent))] text-white' 
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                          }
                        `}
                      >
                        <span className="text-xs opacity-70">{day}</span>
                        {isChecked && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Motivation message */}
        {totalStreaks >= 21 && (
          <div className="mt-8 p-6 bg-[hsl(var(--saturday-accent))] rounded-2xl text-white text-center animate-scale-in">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-xl font-bold">Habit Master!</p>
            <p className="text-white/80">You've completed 21+ habit days this week!</p>
          </div>
        )}
      </div>
    </div>
  );
}
