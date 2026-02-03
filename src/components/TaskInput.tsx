import { useState } from 'react';
import { Task } from '../types';

interface TaskInputProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  variant?: 'minimal' | 'priority' | 'time' | 'gamified' | 'habit';
}

export function TaskInput({ onAddTask, variant = 'minimal' }: TaskInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueTime, setDueTime] = useState('');
  const [points, setPoints] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const task: Omit<Task, 'id' | 'createdAt'> = {
      text: text.trim(),
      completed: false,
    };

    if (variant === 'priority') {
      task.priority = priority;
    }
    if (variant === 'time') {
      task.dueTime = dueTime;
    }
    if (variant === 'gamified') {
      task.points = points;
    }
    if (variant === 'habit') {
      task.streak = 0;
      task.habitDays = [false, false, false, false, false, false, false];
    }

    onAddTask(task);
    setText('');
    setDueTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-in">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-input 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground
                     font-medium hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Add
          </button>
        </div>

        {variant === 'priority' && (
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${priority === p ? `priority-${p}` : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}

        {variant === 'time' && (
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="px-4 py-2 rounded-xl bg-card border border-input text-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring w-fit"
          />
        )}

        {variant === 'gamified' && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Points:</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="flex-1 max-w-xs"
            />
            <span className="points-badge">{points} pts</span>
          </div>
        )}
      </div>
    </form>
  );
}
