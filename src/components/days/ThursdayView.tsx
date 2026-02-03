import { Task } from '../../types';
import { TaskInput } from '../TaskInput';
import { TaskItem } from '../TaskItem';

interface ThursdayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  completionPercentage: number;
}

export function ThursdayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  completionPercentage,
}: ThursdayViewProps) {
  // Sort tasks by due time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueTime && !b.dueTime) return 0;
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;
    return a.dueTime.localeCompare(b.dueTime);
  });

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const upcomingTasks = sortedTasks.filter(t => !t.completed && (!t.dueTime || t.dueTime >= currentTime));
  const overdueTasks = sortedTasks.filter(t => !t.completed && t.dueTime && t.dueTime < currentTime);
  const completedTasks = sortedTasks.filter(t => t.completed);

  return (
    <div className="day-thursday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header with clock */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--thursday-accent))] flex items-center justify-center text-white">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Time-Based Tasks
              </h2>
              <p className="text-muted-foreground">
                Schedule and track your day
              </p>
            </div>
          </div>
          
          {/* Current time */}
          <div className="p-4 bg-card rounded-2xl border border-border flex items-center justify-between">
            <span className="text-muted-foreground">Current Time</span>
            <span className="text-2xl font-mono font-semibold text-[hsl(var(--thursday-accent))]">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 p-4 bg-card rounded-2xl border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Day Progress</span>
            <span className="font-medium text-foreground">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--thursday-accent))] progress-bar"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Task input */}
        <div className="mb-8">
          <TaskInput onAddTask={onAddTask} variant="time" />
        </div>

        {/* Overdue section */}
        {overdueTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-destructive">
              <span>⏰</span>
              <span>Overdue</span>
              <span className="text-sm font-normal">({overdueTasks.length})</span>
            </h3>
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div key={task.id} className="border-l-4 border-destructive pl-2">
                  <TaskItem
                    task={task}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                    onUpdate={(updates) => onUpdate(task.id, updates)}
                    variant="time"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming section */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-foreground">
            <span>📋</span>
            <span>Upcoming</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({upcomingTasks.length})
            </span>
          </h3>
          <div className="space-y-2">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center bg-card rounded-xl border border-border">
                No upcoming tasks
              </p>
            ) : (
              upcomingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onUpdate={(updates) => onUpdate(task.id, updates)}
                  variant="time"
                />
              ))
            )}
          </div>
        </div>

        {/* Completed section */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-muted-foreground">
              <span>✅</span>
              <span>Completed</span>
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
                  variant="time"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
