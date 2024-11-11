import React from 'react';
import { useReportStore } from '../../store/reportStore';
import { format, parseISO } from 'date-fns';
import { History, Edit, Share2, FileText } from 'lucide-react';

export default function ActivityLog() {
  const reports = useReportStore((state) => state.reports);
  
  // Create activity log from reports
  const activities = reports.flatMap(report => [
    {
      id: `${report.id}-created`,
      type: 'created',
      date: report.createdAt,
      reportId: report.id,
      reportDate: report.date,
    },
    ...(report.updatedAt !== report.createdAt ? [{
      id: `${report.id}-updated`,
      type: 'updated',
      date: report.updatedAt,
      reportId: report.id,
      reportDate: report.date,
    }] : []),
    ...(report.status === 'shared' ? [{
      id: `${report.id}-shared`,
      type: 'shared',
      date: report.updatedAt,
      reportId: report.id,
      reportDate: report.date,
    }] : []),
  ]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'updated':
        return <Edit className="h-5 w-5 text-yellow-500" />;
      case 'shared':
        return <Share2 className="h-5 w-5 text-blue-500" />;
      default:
        return <History className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'created':
        return 'Created a new report';
      case 'updated':
        return 'Updated report';
      case 'shared':
        return 'Shared report with manager';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <History className="h-6 w-6 text-gray-400" />
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {getActivityText(activity.type)}
              </p>
              <p className="text-sm text-gray-500">
                Report date: {format(parseISO(activity.reportDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex-shrink-0 text-sm text-gray-500">
              {format(parseISO(activity.date), 'MMM d, h:mm a')}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activities yet</p>
          </div>
        )}
      </div>
    </div>
  );
}