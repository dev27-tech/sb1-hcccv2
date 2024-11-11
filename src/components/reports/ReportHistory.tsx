import React, { useState } from 'react';
import { useReportStore } from '../../store/reportStore';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { BarChart2, TrendingUp, Calendar, Download, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportHistory() {
  const reports = useReportStore((state) => state.reports);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const monthlyReports = reports.filter(report => {
    const reportDate = parseISO(report.date);
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    return reportDate >= monthStart && reportDate <= monthEnd;
  });

  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date(),
  });

  const generateMonthlyReport = async () => {
    const reportContent = document.getElementById('monthly-report');
    if (!reportContent) return;

    try {
      const canvas = await html2canvas(reportContent);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`monthly-report-${format(selectedMonth, 'yyyy-MM')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const calculateStats = () => {
    const completed = monthlyReports.reduce((sum, report) => sum + report.completed.length, 0);
    const pending = monthlyReports.reduce((sum, report) => sum + report.pending.length, 0);
    const planned = monthlyReports.reduce((sum, report) => sum + report.nextDayPlan.length, 0);
    const total = completed + pending + planned;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return { completed, pending, planned, total, completionRate };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Report History</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth.toISOString()}
            onChange={(e) => setSelectedMonth(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map((month) => (
              <option key={month.toISOString()} value={month.toISOString()}>
                {format(month, 'MMMM yyyy')}
              </option>
            ))}
          </select>
          <button
            onClick={generateMonthlyReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div id="monthly-report" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm">Pending Tasks</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm">Planned Tasks</p>
                <p className="text-3xl font-bold text-blue-700">{stats.planned}</p>
              </div>
              <ListTodo className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-700">{stats.completionRate}%</p>
              </div>
              <BarChart2 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Reports</h3>
          <div className="space-y-4">
            {monthlyReports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <h4 className="font-medium text-gray-900">
                      {format(parseISO(report.date), 'MMMM d, yyyy')}
                    </h4>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(report.createdAt), 'h:mm a')}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {report.completed.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {report.pending.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Planned</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {report.nextDayPlan.length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}