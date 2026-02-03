export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
  dueTime?: string;
  points?: number;
  streak?: number;
  habitDays?: boolean[];
}

export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayInfo {
  name: DayName;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export const DAYS: DayInfo[] = [
  { name: 'monday', label: 'Monday', emoji: '🎯', description: 'Minimalist Focus', color: 'monday' },
  { name: 'tuesday', label: 'Tuesday', emoji: '🌈', description: 'Priority Colors', color: 'tuesday' },
  { name: 'wednesday', label: 'Wednesday', emoji: '✨', description: 'Drag & Drop', color: 'wednesday' },
  { name: 'thursday', label: 'Thursday', emoji: '⏰', description: 'Time-Based', color: 'thursday' },
  { name: 'friday', label: 'Friday', emoji: '🎮', description: 'Gamified', color: 'friday' },
  { name: 'saturday', label: 'Saturday', emoji: '🔥', description: 'Habit Streaks', color: 'saturday' },
  { name: 'sunday', label: 'Sunday', emoji: '📊', description: 'Weekly Review', color: 'sunday' },
];
