import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Task, DayName } from '@/types';

export interface DayTasks {
  monday: Task[];
  tuesday: Task[];
  wednesday: Task[];
  thursday: Task[];
  friday: Task[];
  saturday: Task[];
  sunday: Task[];
}

const initialTasks: DayTasks = {
  monday: [], tuesday: [], wednesday: [], thursday: [],
  friday: [], saturday: [], sunday: [],
};

export function useDbTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DayTasks>(initialTasks);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) { setTasks(initialTasks); setLoading(false); return; }
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (error) { console.error('Error fetching tasks:', error); setLoading(false); return; }

    const grouped: DayTasks = { ...initialTasks };
    let points = 0;
    (data || []).forEach((row: any) => {
      const day = row.day as DayName;
      const task: Task = {
        id: row.id,
        text: row.text,
        completed: row.completed,
        createdAt: row.created_at,
        priority: row.priority || undefined,
        dueTime: row.due_time || undefined,
        points: row.points || 10,
        streak: row.streak || 0,
        habitDays: row.habit_days || undefined,
      };
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(task);
      if (day === 'friday' && task.completed) points += (task.points || 10);
    });
    setTasks(grouped);
    setTotalPoints(points);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (day: DayName, task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data, error } = await supabase.from('tasks').insert({
      user_id: user.id,
      day,
      text: task.text,
      completed: task.completed || false,
      priority: task.priority || null,
      due_time: task.dueTime || null,
      points: task.points || 10,
      streak: task.streak || 0,
      habit_days: task.habitDays || [false, false, false, false, false, false, false],
    }).select().single();

    if (error) { console.error('Error adding task:', error); return; }
    if (data) {
      const newTask: Task = {
        id: data.id, text: data.text, completed: data.completed,
        createdAt: data.created_at, priority: (data.priority as Task['priority']) || undefined,
        dueTime: data.due_time || undefined, points: data.points || 10,
        streak: data.streak || 0, habitDays: data.habit_days || undefined,
      };
      setTasks(prev => ({ ...prev, [day]: [...prev[day], newTask] }));
    }
  };

  const updateTask = async (day: DayName, taskId: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    if (updates.text !== undefined) dbUpdates.text = updates.text;
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.dueTime !== undefined) dbUpdates.due_time = updates.dueTime;
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.habitDays !== undefined) dbUpdates.habit_days = updates.habitDays;

    const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', taskId);
    if (error) { console.error('Error updating task:', error); return; }
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].map(t => t.id === taskId ? { ...t, ...updates } : t),
    }));
  };

  const deleteTask = async (day: DayName, taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) { console.error('Error deleting task:', error); return; }
    setTasks(prev => ({ ...prev, [day]: prev[day].filter(t => t.id !== taskId) }));
  };

  const toggleComplete = async (day: DayName, taskId: string) => {
    const task = tasks[day].find(t => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;
    await updateTask(day, taskId, { completed: newCompleted });
    if (day === 'friday') {
      if (newCompleted) setTotalPoints(p => p + (task.points || 10));
      else setTotalPoints(p => p - (task.points || 10));
    }
  };

  const reorderTasks = (_day: DayName, startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = [...prev[_day]];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, [_day]: result };
    });
  };

  const getCompletionPercentage = (day: DayName): number => {
    const dayTasks = tasks[day];
    if (dayTasks.length === 0) return 0;
    return Math.round((dayTasks.filter(t => t.completed).length / dayTasks.length) * 100);
  };

  const getWeeklySummary = () => {
    const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => ({
      day, total: tasks[day].length,
      completed: tasks[day].filter(t => t.completed).length,
      percentage: getCompletionPercentage(day),
    }));
  };

  return {
    tasks, addTask, updateTask, deleteTask, toggleComplete,
    reorderTasks, getCompletionPercentage, getWeeklySummary,
    totalPoints, loading,
  };
}
