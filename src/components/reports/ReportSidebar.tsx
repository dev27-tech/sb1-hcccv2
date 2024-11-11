import React from 'react';
import { useReportStore } from '../../store/reportStore';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Clock, CheckCircle, ListTodo, History } from 'lucide-react';
import { Task } from '../../types';

interface ReportSidebarProps {
  onTaskSelect: (task: Task) => void;
}

export default function ReportSidebar({ onTaskSelect }: ReportSidebarProps) {
  const reports = useReportStore((state) => state.reports);
  
  // Get current month's reports
  const currentMonthReports = reports.filter(report => {
    const reportDate = parseISO(report.date);
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return reportDate >= monthStart && reportDate <= monthEnd;
  });

  // Aggregate all tasks
  const completedTasks = currentMonthReports.flatMap(r => r.completed);
  const pendingTasks = currentMonthReports.flatMap(r => r.pending);
  const plannedTasks = currentMonthReports.flatMap(r => r.nextDayPlan);

  const TaskList = ({ tasks, icon: Icon, title, color }: any) => (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task: Task) => (
          <button
            key={task.id}
            onClick={() => onTaskSelect(task)}
            className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600"
          >
            <div dangerouslySetInnerHTML={{ __html: task.description }} />
            <div className="text-xs text-gray-400 mt-1">
              {format(parseISO(task.date), 'MMM d, yyyy')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
      
      <TaskList
        tasks={completedTasks}
        icon={CheckCircle}
        title="Completed Tasks"
        color="text-green-500"
      />
      
      <TaskList
        tasks={pendingTasks}
        icon={Clock}
        title="Pending Tasks"
        color="text-yellow-500"
      />
      
      <TaskList
        tasks={plannedTasks}
        icon={ListTodo}
        title="Planned Tasks"
        color="text-blue-500"
      />

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Monthly Summary</h3>
          <History className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-medium text-gray-900">
              {Math.round((completedTasks.length / (completedTasks.length + pendingTasks.length)) * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tasks</span>
            <span className="font-medium text-gray-900">
              {completedTasks.length + pendingTasks.length + plannedTasks.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Reports Submitted</span>
            <span className="font-medium text-gray-900">
              {currentMonthReports.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}