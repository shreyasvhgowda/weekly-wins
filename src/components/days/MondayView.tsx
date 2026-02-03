import { Task } from '../../types';
import { TaskInput } from '../TaskInput';
import { TaskItem } from '../TaskItem';

interface MondayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  completionPercentage: number;
}

export function MondayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  completionPercentage,
}: MondayViewProps) {
  return (
    <div className="day-monday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Minimalist header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-foreground tracking-tight mb-2">
            Focus
          </h2>
          <p className="text-muted-foreground">
            {tasks.length === 0 
              ? 'Start your week with clarity' 
              : `${tasks.filter(t => t.completed).length} of ${tasks.length} tasks complete`
            }
          </p>
        </div>

        {/* Progress line */}
        <div className="mb-10">
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground progress-bar"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Task input */}
        <div className="mb-8">
          <TaskInput onAddTask={onAddTask} variant="minimal" />
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No tasks yet</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Add your first task above
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggle(task.id)}
                onDelete={() => onDelete(task.id)}
                onUpdate={(updates) => onUpdate(task.id, updates)}
                variant="minimal"
              />
            ))
          )}
        </div>

        {/* Minimalist quote */}
        {tasks.length > 0 && completionPercentage === 100 && (
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-muted-foreground italic">
              "Simplicity is the ultimate sophistication."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
