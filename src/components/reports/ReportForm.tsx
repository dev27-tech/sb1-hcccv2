import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';
import { Task } from '../../types';
import { Plus, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import TaskInput from './TaskInput';

export default function ReportForm() {
  const user = useAuthStore((state) => state.user);
  const addReport = useReportStore((state) => state.addReport);
  
  const [completed, setCompleted] = useState<Task[]>([]);
  const [pending, setPending] = useState<Task[]>([]);
  const [nextDayPlan, setNextDayPlan] = useState<Task[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const addTask = (type: 'completed' | 'pending' | 'nextDayPlan') => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      description: '',
      status: type === 'completed' ? 'completed' : 'pending',
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    
    switch (type) {
      case 'completed':
        setCompleted([...completed, newTask]);
        break;
      case 'pending':
        setPending([...pending, newTask]);
        break;
      case 'nextDayPlan':
        setNextDayPlan([...nextDayPlan, newTask]);
        break;
    }
  };

  const removeTask = (id: string, type: 'completed' | 'pending' | 'nextDayPlan') => {
    switch (type) {
      case 'completed':
        setCompleted(completed.filter((task) => task.id !== id));
        break;
      case 'pending':
        setPending(pending.filter((task) => task.id !== id));
        break;
      case 'nextDayPlan':
        setNextDayPlan(nextDayPlan.filter((task) => task.id !== id));
        break;
    }
  };

  const updateTask = (
    id: string,
    description: string,
    type: 'completed' | 'pending' | 'nextDayPlan'
  ) => {
    switch (type) {
      case 'completed':
        setCompleted(
          completed.map((task) =>
            task.id === id ? { ...task, description } : task
          )
        );
        break;
      case 'pending':
        setPending(
          pending.map((task) =>
            task.id === id ? { ...task, description } : task
          )
        );
        break;
      case 'nextDayPlan':
        setNextDayPlan(
          nextDayPlan.map((task) =>
            task.id === id ? { ...task, description } : task
          )
        );
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (completed.length === 0 && pending.length === 0 && nextDayPlan.length === 0) {
      toast.error('Please add at least one task');
      return;
    }

    setIsSaving(true);
    try {
      // Save to local storage for persistence
      const report = {
        userId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        completed,
        pending,
        nextDayPlan,
      };

      addReport(report);
      
      // Log the report
      console.log('Report saved:', {
        timestamp: new Date().toISOString(),
        userId: user.id,
        reportId: crypto.randomUUID(),
        taskCount: {
          completed: completed.length,
          pending: pending.length,
          nextDayPlan: nextDayPlan.length,
        },
      });

      toast.success('Report submitted successfully!');
      setCompleted([]);
      setPending([]);
      setNextDayPlan([]);
    } catch (error) {
      toast.error('Failed to submit report');
      console.error('Error saving report:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const TaskList = ({ 
    tasks, 
    type,
    title 
  }: { 
    tasks: Task[]; 
    type: 'completed' | 'pending' | 'nextDayPlan';
    title: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => addTask(type)}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-2">
            <TaskInput
              value={task.description}
              onChange={(value) => updateTask(task.id, value, type)}
              onRemove={() => removeTask(task.id, type)}
            />
            <button
              type="button"
              onClick={() => removeTask(task.id, type)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <TaskList
          tasks={completed}
          type="completed"
          title="Completed Tasks"
        />
        <TaskList
          tasks={pending}
          type="pending"
          title="Pending Tasks"
        />
        <TaskList
          tasks={nextDayPlan}
          type="nextDayPlan"
          title="Tomorrow's Plan"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Submit Report'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}