import { Task } from '../../types';
import { TaskInput } from '../TaskInput';
import { TaskItem } from '../TaskItem';

interface FridayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  completionPercentage: number;
  totalPoints: number;
}

export function FridayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  completionPercentage,
  totalPoints,
}: FridayViewProps) {
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  const dailyPoints = tasks.reduce((sum, t) => sum + (t.completed ? (t.points || 10) : 0), 0);
  const potentialPoints = tasks.reduce((sum, t) => sum + (t.points || 10), 0);

  // Level calculation
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsInLevel = totalPoints % 100;

  return (
    <div className="day-friday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Gamified header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">
                🎮 Gamified Tasks
              </h2>
              <p className="text-muted-foreground">
                Earn points, level up!
              </p>
            </div>
            
            {/* Total points badge */}
            <div className="text-right">
              <div className="points-badge text-lg animate-pulse-soft">
                🏆 {totalPoints} pts
              </div>
            </div>
          </div>

          {/* Level progress */}
          <div className="p-4 bg-card rounded-2xl border border-border mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Level {level}</span>
              <span className="text-sm text-muted-foreground">{pointsInLevel}/100 XP</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[hsl(var(--friday-gradient-start))] to-[hsl(var(--friday-gradient-end))] progress-bar"
                style={{ width: `${pointsInLevel}%` }}
              />
            </div>
          </div>

          {/* Daily stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold text-[hsl(var(--friday-accent))]">{dailyPoints}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold text-[hsl(var(--friday-gold))]">{potentialPoints}</p>
              <p className="text-xs text-muted-foreground">Potential</p>
            </div>
          </div>
        </div>

        {/* Task input */}
        <div className="mb-8">
          <TaskInput onAddTask={onAddTask} variant="gamified" />
        </div>

        {/* Pending quests */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-foreground">
            <span>⚔️</span>
            <span>Active Quests</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({pendingTasks.length})
            </span>
          </h3>
          <div className="space-y-2">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border">
                <p className="text-muted-foreground text-lg mb-2">No active quests!</p>
                <p className="text-muted-foreground/60 text-sm">Add tasks to earn points</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onUpdate={(updates) => onUpdate(task.id, updates)}
                  variant="gamified"
                />
              ))
            )}
          </div>
        </div>

        {/* Completed quests */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-muted-foreground">
              <span>🏅</span>
              <span>Completed Quests</span>
              <span className="text-sm font-normal">({completedTasks.length})</span>
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onUpdate={(updates) => onUpdate(task.id, updates)}
                  variant="gamified"
                />
              ))}
            </div>
          </div>
        )}

        {/* Achievement unlocked */}
        {completionPercentage === 100 && tasks.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-[hsl(var(--friday-gradient-start))] to-[hsl(var(--friday-gradient-end))] rounded-2xl text-white text-center animate-scale-in">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-xl font-bold">Achievement Unlocked!</p>
            <p className="text-white/80">Friday Champion - All tasks complete!</p>
          </div>
        )}
      </div>
    </div>
  );
}
