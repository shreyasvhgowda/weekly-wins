import { useState } from 'react';
import { DayName } from '../types';
import { useDbTasks } from '../hooks/useDbTasks';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { DaySelector } from './DaySelector';
import { MondayView } from './days/MondayView';
import { TuesdayView } from './days/TuesdayView';
import { WednesdayView } from './days/WednesdayView';
import { ThursdayView } from './days/ThursdayView';
import { FridayView } from './days/FridayView';
import { SaturdayView } from './days/SaturdayView';
import { SundayView } from './days/SundayView';
import { Button } from './ui/button';

export function WeeklyTodoApp() {
  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const { user, signOut } = useAuth();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    getCompletionPercentage,
    getWeeklySummary,
    totalPoints,
    loading,
  } = useDbTasks();

  const completionPercentages = {
    monday: getCompletionPercentage('monday'),
    tuesday: getCompletionPercentage('tuesday'),
    wednesday: getCompletionPercentage('wednesday'),
    thursday: getCompletionPercentage('thursday'),
    friday: getCompletionPercentage('friday'),
    saturday: getCompletionPercentage('saturday'),
    sunday: getCompletionPercentage('sunday'),
  };

  const renderDayView = () => {
    switch (selectedDay) {
      case 'monday':
        return (
          <MondayView
            tasks={tasks.monday}
            onAddTask={(task) => addTask('monday', task)}
            onToggle={(id) => toggleComplete('monday', id)}
            onDelete={(id) => deleteTask('monday', id)}
            onUpdate={(id, updates) => updateTask('monday', id, updates)}
            completionPercentage={completionPercentages.monday}
          />
        );
      case 'tuesday':
        return (
          <TuesdayView
            tasks={tasks.tuesday}
            onAddTask={(task) => addTask('tuesday', task)}
            onToggle={(id) => toggleComplete('tuesday', id)}
            onDelete={(id) => deleteTask('tuesday', id)}
            onUpdate={(id, updates) => updateTask('tuesday', id, updates)}
            completionPercentage={completionPercentages.tuesday}
          />
        );
      case 'wednesday':
        return (
          <WednesdayView
            tasks={tasks.wednesday}
            onAddTask={(task) => addTask('wednesday', task)}
            onToggle={(id) => toggleComplete('wednesday', id)}
            onDelete={(id) => deleteTask('wednesday', id)}
            onUpdate={(id, updates) => updateTask('wednesday', id, updates)}
            onReorder={(start, end) => reorderTasks('wednesday', start, end)}
            completionPercentage={completionPercentages.wednesday}
          />
        );
      case 'thursday':
        return (
          <ThursdayView
            tasks={tasks.thursday}
            onAddTask={(task) => addTask('thursday', task)}
            onToggle={(id) => toggleComplete('thursday', id)}
            onDelete={(id) => deleteTask('thursday', id)}
            onUpdate={(id, updates) => updateTask('thursday', id, updates)}
            completionPercentage={completionPercentages.thursday}
          />
        );
      case 'friday':
        return (
          <FridayView
            tasks={tasks.friday}
            onAddTask={(task) => addTask('friday', task)}
            onToggle={(id) => toggleComplete('friday', id)}
            onDelete={(id) => deleteTask('friday', id)}
            onUpdate={(id, updates) => updateTask('friday', id, updates)}
            completionPercentage={completionPercentages.friday}
            totalPoints={totalPoints}
          />
        );
      case 'saturday':
        return (
          <SaturdayView
            tasks={tasks.saturday}
            onAddTask={(task) => addTask('saturday', task)}
            onToggle={(id) => toggleComplete('saturday', id)}
            onDelete={(id) => deleteTask('saturday', id)}
            onUpdate={(id, updates) => updateTask('saturday', id, updates)}
            completionPercentage={completionPercentages.saturday}
          />
        );
      case 'sunday':
        return (
          <SundayView
            summary={getWeeklySummary()}
            totalPoints={totalPoints}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedDay={selectedDay}
        onBack={() => setSelectedDay(null)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        userName={user?.user_metadata?.display_name || user?.email || ''}
        onSignOut={signOut}
      />

      {selectedDay ? (
        <main className="animate-fade-in">
          {renderDayView()}
        </main>
      ) : (
        <main className="container mx-auto py-8">
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Plan Your Week
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Each day has its own unique challenge. Click a day to start planning.
            </p>
          </div>

          <DaySelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            completionPercentages={completionPercentages}
          />

          <div className="mt-8 px-4 max-w-md mx-auto">
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-semibold text-foreground mb-4 text-center">
                Weekly Overview
              </h3>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {Object.entries(completionPercentages).map(([day, percentage]) => (
                  <div key={day} className="text-center">
                    <div
                      className="h-16 rounded-lg bg-muted relative overflow-hidden"
                      style={{
                        background: `linear-gradient(to top, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`,
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {day.slice(0, 2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Total Points: <span className="font-semibold text-foreground">{totalPoints}</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
