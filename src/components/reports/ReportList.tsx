import React, { useState, useMemo } from 'react';
import { useReportStore } from '../../store/reportStore';
import { useAuthStore } from '../../store/authStore';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { FileText, ChevronRight, Share2, Calendar, ChevronDown } from 'lucide-react';
import ReportViewer from './ReportViewer';
import { DailyReport } from '../../types';

interface ReportListProps {
  view: 'daily' | 'monthly' | 'yearly';
}

interface GroupedReports {
  [key: string]: DailyReport[];
}

export default function ReportList({ view }: ReportListProps) {
  const user = useAuthStore((state) => state.user);
  const { getAllReports, getReportsByUserId, getSharedReports } = useReportStore();
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  const reports = useMemo(() => {
    if (!user) return [];
    
    let userReports = [];
    if (user.role === 'manager') {
      userReports = [...getAllReports(), ...getSharedReports(user.id)];
    } else {
      userReports = [...getReportsByUserId(user.id), ...getSharedReports(user.id)];
    }

    // Remove duplicates
    return Array.from(new Map(userReports.map(report => [report.id, report])).values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user, getAllReports, getReportsByUserId, getSharedReports]);

  const groupedReports = useMemo(() => {
    return reports.reduce((groups: GroupedReports, report) => {
      let groupKey;
      if (view === 'daily') {
        groupKey = format(parseISO(report.date), 'MMMM d, yyyy');
      } else if (view === 'monthly') {
        groupKey = format(parseISO(report.date), 'MMMM yyyy');
      } else {
        groupKey = format(parseISO(report.date), 'yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(report);
      return groups;
    }, {});
  }, [reports, view]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey)
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedReports).map(([groupKey, groupReports]) => (
        <div key={groupKey} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleGroup(groupKey)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">{groupKey}</h3>
              <span className="text-sm text-gray-500">
                ({groupReports.length} report{groupReports.length !== 1 ? 's' : ''})
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedGroups.includes(groupKey) ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedGroups.includes(groupKey) && (
            <div className="divide-y">
              {groupReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Daily Report - {format(parseISO(report.date), 'MMMM d, yyyy')}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500">
                            {format(parseISO(report.createdAt), 'h:mm a')}
                          </p>
                          {report.status === 'shared' && (
                            <div className="flex items-center space-x-1 text-blue-600">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm">Shared</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Completed Tasks
                      </h5>
                      <p className="text-sm text-gray-600">
                        {report.completed.length} tasks
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Pending Tasks
                      </h5>
                      <p className="text-sm text-gray-600">
                        {report.pending.length} tasks
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Tomorrow's Plan
                      </h5>
                      <p className="text-sm text-gray-600">
                        {report.nextDayPlan.length} tasks
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {reports.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports yet
          </h3>
          <p className="text-gray-600">
            Create your first daily report to get started
          </p>
        </div>
      )}

      {selectedReport && (
        <ReportViewer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}