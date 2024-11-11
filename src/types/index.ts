export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
}

export interface Task {
  id: string;
  description: string;
  status: 'completed' | 'pending';
  date: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  completed: Task[];
  pending: Task[];
  nextDayPlan: Task[];
  createdAt: string;
  updatedAt: string;
  sharedWith: string[];
  status: 'draft' | 'submitted' | 'shared';
}