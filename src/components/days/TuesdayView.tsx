import { Task } from '../../types';
import { TaskInput } from '../TaskInput';
import { TaskItem } from '../TaskItem';

interface TuesdayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  completionPercentage: number;
}

export function TuesdayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  completionPercentage,
}: TuesdayViewProps) {
  const highPriority = tasks.filter(t => t.priority === 'high');
  const mediumPriority = tasks.filter(t => t.priority === 'medium');
  const lowPriority = tasks.filter(t => t.priority === 'low');

  const PrioritySection = ({ 
    title, 
    emoji, 
    tasks, 
    colorClass 
  }: { 
    title: string; 
    emoji: string; 
    tasks: Task[]; 
    colorClass: string;
  }) => (
    <div className="mb-6">
      <h3 className={`flex items-center gap-2 text-lg font-semibold mb-3 ${colorClass}`}>
        <span>{emoji}</span>
        <span>{title}</span>
        <span className="text-sm font-normal text-muted-foreground">
          ({tasks.length})
        </span>
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
            onUpdate={(updates) => onUpdate(task.id, updates)}
            variant="priority"
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center bg-card rounded-xl border border-border">
            No {title.toLowerCase()} tasks
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="day-tuesday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Colorful header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            🌈 Priority Planning
          </h2>
          <p className="text-muted-foreground">
            Organize tasks by importance
          </p>
          
          {/* Priority stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--tuesday-priority-high))]" />
              <span className="text-sm text-muted-foreground">{highPriority.length} High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--tuesday-priority-medium))]" />
              <span className="text-sm text-muted-foreground">{mediumPriority.length} Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--tuesday-priority-low))]" />
              <span className="text-sm text-muted-foreground">{lowPriority.length} Low</span>
            </div>
          </div>
        </div>

        {/* Progress bar with colors */}
        <div className="mb-8 p-4 bg-card rounded-2xl border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium text-foreground">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            {highPriority.length > 0 && (
              <div 
                className="h-full bg-[hsl(var(--tuesday-priority-high))] transition-all duration-300"
                style={{ width: `${(highPriority.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            )}
            {mediumPriority.length > 0 && (
              <div 
                className="h-full bg-[hsl(var(--tuesday-priority-medium))] transition-all duration-300"
                style={{ width: `${(mediumPriority.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            )}
            {lowPriority.length > 0 && (
              <div 
                className="h-full bg-[hsl(var(--tuesday-priority-low))] transition-all duration-300"
                style={{ width: `${(lowPriority.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            )}
          </div>
        </div>

        {/* Task input */}
        <div className="mb-8">
          <TaskInput onAddTask={onAddTask} variant="priority" />
        </div>

        {/* Priority sections */}
        <PrioritySection 
          title="High Priority" 
          emoji="🔴" 
          tasks={highPriority}
          colorClass="text-[hsl(var(--tuesday-priority-high))]"
        />
        <PrioritySection 
          title="Medium Priority" 
          emoji="🟡" 
          tasks={mediumPriority}
          colorClass="text-[hsl(var(--tuesday-priority-medium))]"
        />
        <PrioritySection 
          title="Low Priority" 
          emoji="🟢" 
          tasks={lowPriority}
          colorClass="text-[hsl(var(--tuesday-priority-low))]"
        />
      </div>
    </div>
  );
}
