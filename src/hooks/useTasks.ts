import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Clear localStorage on app startup (fresh start on server restart)
const SESSION_KEY = 'weekly-todo-session-active';
if (!sessionStorage.getItem(SESSION_KEY)) {
  // New session - clear previous data
  localStorage.removeItem('weekly-todo-tasks');
  localStorage.removeItem('weekly-todo-points');
  sessionStorage.setItem(SESSION_KEY, 'true');
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  // Tuesday specific
  priority?: 'high' | 'medium' | 'low';
  // Thursday specific
  dueTime?: string;
  // Friday specific
  points?: number;
  // Saturday specific
  streak?: number;
  habitDays?: boolean[];
}

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
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export type DayName = keyof DayTasks;

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<DayTasks>('weekly-todo-tasks', initialTasks);
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('weekly-todo-points', 0);

  const addTask = (day: DayName, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => ({
      ...prev,
      [day]: [...prev[day], newTask],
    }));
  };

  const updateTask = (day: DayName, taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  };

  const deleteTask = (day: DayName, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((task) => task.id !== taskId),
    }));
  };

  const toggleComplete = (day: DayName, taskId: string) => {
    setTasks((prev) => {
      const task = prev[day].find((t) => t.id === taskId);
      if (task && day === 'friday' && !task.completed) {
        const points = task.points || 10;
        setTotalPoints((p) => p + points);
      }
      return {
        ...prev,
        [day]: prev[day].map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });
  };

  const reorderTasks = (day: DayName, startIndex: number, endIndex: number) => {
    setTasks((prev) => {
      const result = [...prev[day]];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        ...prev,
        [day]: result,
      };
    });
  };

  const getCompletionPercentage = (day: DayName): number => {
    const dayTasks = tasks[day];
    if (dayTasks.length === 0) return 0;
    const completed = dayTasks.filter((t) => t.completed).length;
    return Math.round((completed / dayTasks.length) * 100);
  };

  const getWeeklySummary = () => {
    const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map((day) => ({
      day,
      total: tasks[day].length,
      completed: tasks[day].filter((t) => t.completed).length,
      percentage: getCompletionPercentage(day),
    }));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    getCompletionPercentage,
    getWeeklySummary,
    totalPoints,
  };
}
