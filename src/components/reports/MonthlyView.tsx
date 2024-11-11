import React, { useState } from 'react';
import { useReportStore } from '../../store/reportStore';
import { format, startOfYear, eachMonthOfInterval } from 'date-fns';
import { BarChart2, Download, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function MonthlyView() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { generateMonthlyReport } = useReportStore();

  const months = eachMonthOfInterval({
    start: startOfYear(new Date(selectedYear, 0)),
    end: new Date(selectedYear, 11),
  });

  const exportMonthlyReport = async (month: number) => {
    const report = generateMonthlyReport(month, selectedYear);
    const reportElement = document.getElementById(`month-${month}`);
    
    if (reportElement) {
      const canvas = await html2canvas(reportElement);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`monthly-report-${format(new Date(selectedYear, month), 'yyyy-MM')}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Monthly Reports</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => {
          const monthlyReport = generateMonthlyReport(index, selectedYear);
          
          return (
            <div
              key={index}
              id={`month-${index}`}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">
                    {format(month, 'MMMM yyyy')}
                  </h3>
                </div>
                <button
                  onClick={() => exportMonthlyReport(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Completed Tasks</p>
                    <p className="text-2xl font-bold text-green-700">
                      {monthlyReport.completedTasks}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Pending Tasks</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {monthlyReport.pendingTasks}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {monthlyReport.totalReports}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {monthlyReport.totalReports ? 
                      Math.round((monthlyReport.completedTasks / (monthlyReport.completedTasks + monthlyReport.pendingTasks)) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}