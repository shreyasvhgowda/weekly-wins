import { useState } from 'react';
import { Task } from '../../types';
import { TaskInput } from '../TaskInput';
import { TaskItem } from '../TaskItem';

interface WednesdayViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  completionPercentage: number;
}

export function WednesdayView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
  completionPercentage,
}: WednesdayViewProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="day-wednesday min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            ✨ Drag & Drop
          </h2>
          <p className="text-muted-foreground">
            Reorder your tasks by dragging them
          </p>
          
          {/* Progress */}
          <div className="mt-4 p-4 bg-card rounded-2xl border border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--wednesday-accent))] progress-bar"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task input */}
        <div className="mb-8">
          <TaskInput onAddTask={onAddTask} variant="minimal" />
        </div>

        {/* Drag instructions */}
        {tasks.length > 1 && (
          <div className="mb-4 p-3 bg-[hsl(var(--wednesday-drag))] rounded-xl text-sm text-center text-muted-foreground">
            💡 Drag tasks to reorder them
          </div>
        )}

        {/* Task list with drag and drop */}
        <div className="space-y-2" onDragEnd={handleDragEnd}>
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground text-lg">No tasks yet</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Add tasks to start organizing
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={`
                  transition-all duration-200
                  ${draggedIndex === index ? 'opacity-50 scale-105' : ''}
                  ${dragOverIndex === index ? 'translate-y-2' : ''}
                `}
              >
                <TaskItem
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onUpdate={(updates) => onUpdate(task.id, updates)}
                  variant="minimal"
                  isDraggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                />
              </div>
            ))
          )}
        </div>

        {/* Position indicator */}
        {tasks.length > 0 && (
          <div className="mt-6 flex justify-center gap-1">
            {tasks.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  draggedIndex === index 
                    ? 'bg-[hsl(var(--wednesday-accent))] scale-150' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
