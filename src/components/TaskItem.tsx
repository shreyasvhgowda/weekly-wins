import { useState } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  variant?: 'minimal' | 'priority' | 'time' | 'gamified' | 'habit';
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDraggable?: boolean;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  variant = 'minimal',
  onDragStart,
  onDragOver,
  onDrop,
  isDraggable = false,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate({ text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        group flex items-center gap-3 p-4 rounded-xl bg-card border border-border
        transition-all duration-200 animate-scale-in
        ${task.completed ? 'opacity-60' : ''}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-lg' : ''}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`
          w-6 h-6 rounded-lg border-2 flex items-center justify-center
          transition-all duration-200 flex-shrink-0
          ${task.completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground hover:border-primary'
          }
        `}
      >
        {task.completed && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          >
            <path d="M2 7l4 4 6-8" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-2 py-1 rounded bg-muted border border-input
                     text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        ) : (
          <p
            className={`text-foreground truncate ${task.completed ? 'task-complete' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.text}
          </p>
        )}

        {/* Extra info based on variant */}
        {variant === 'time' && task.dueTime && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {task.dueTime}
          </p>
        )}
      </div>

      {/* Priority badge */}
      {variant === 'priority' && task.priority && (
        <span className={`priority-${task.priority} text-xs px-2 py-1 rounded-full`}>
          {task.priority}
        </span>
      )}

      {/* Points badge */}
      {variant === 'gamified' && task.points && (
        <span className="points-badge text-sm">{task.points} pts</span>
      )}

      {/* Streak badge */}
      {variant === 'habit' && task.streak !== undefined && task.streak > 0 && (
        <span className="streak-badge text-sm">🔥 {task.streak}</span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
