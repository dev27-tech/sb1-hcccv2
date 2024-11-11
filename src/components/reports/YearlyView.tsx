import React from 'react';
import { useReportStore } from '../../store/reportStore';
import { BarChart2, Download, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function YearlyView() {
  const { generateYearlyReport } = useReportStore();
  const currentYear = new Date().getFullYear();
  const yearlyReport = generateYearlyReport(currentYear);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: yearlyReport.monthlyStats.map(m => m.completedTasks),
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      },
      {
        label: 'Pending Tasks',
        data: yearlyReport.monthlyStats.map(m => m.pendingTasks),
        borderColor: 'rgb(234, 179, 8)',
        tension: 0.1
      }
    ]
  };

  const exportYearlyReport = async () => {
    const reportElement = document.getElementById('yearly-report');
    if (reportElement) {
      const canvas = await html2canvas(reportElement);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`yearly-report-${currentYear}.pdf`);
    }
  };

  return (
    <div className="space-y-6" id="yearly-report">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Yearly Report {currentYear}</h2>
        <button
          onClick={exportYearlyReport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Total Reports</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{yearlyReport.totalReports}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {yearlyReport.totalReports ? 
              Math.round((yearlyReport.completedTasks / (yearlyReport.completedTasks + yearlyReport.pendingTasks)) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {yearlyReport.completedTasks + yearlyReport.pendingTasks + yearlyReport.plannedTasks}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Task Completion Trends</h3>
        <div className="h-96">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}