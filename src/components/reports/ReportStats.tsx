import React from 'react';
import { useReportStore } from '../../store/reportStore';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { BarChart2, TrendingUp, Calendar } from 'lucide-react';

export default function ReportStats() {
  const reports = useReportStore((state) => state.reports);

  const getMonthlyStats = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= monthStart && reportDate <= monthEnd;
    });
  };

  const getYearlyStats = () => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= yearStart && reportDate <= yearEnd;
    });
  };

  const monthlyReports = getMonthlyStats();
  const yearlyReports = getYearlyStats();

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Today's Reports"
        value={reports.filter(r => r.date === format(new Date(), 'yyyy-MM-dd')).length}
        icon={Calendar}
        color="bg-blue-500"
      />
      <StatCard
        title="Monthly Reports"
        value={monthlyReports.length}
        icon={TrendingUp}
        color="bg-green-500"
      />
      <StatCard
        title="Yearly Reports"
        value={yearlyReports.length}
        icon={BarChart2}
        color="bg-purple-500"
      />
    </div>
  );
}