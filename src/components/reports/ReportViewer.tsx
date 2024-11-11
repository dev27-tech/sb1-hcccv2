import React, { useState } from 'react';
import { DailyReport, Task } from '../../types';
import { format, parseISO } from 'date-fns';
import { FileText, Download, Share2, Calendar, CheckCircle, Clock, ListTodo, Edit2, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';
import toast from 'react-hot-toast';
import TaskInput from './TaskInput';

interface ReportViewerProps {
  report: DailyReport;
  onClose: () => void;
}

export default function ReportViewer({ report: initialReport, onClose }: ReportViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [report, setReport] = useState(initialReport);
  const user = useAuthStore((state) => state.user);
  const { shareReport, updateReport } = useReportStore();
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handleTaskUpdate = (taskId: string, description: string, type: 'completed' | 'pending' | 'nextDayPlan') => {
    const updatedReport = { ...report };
    const taskList = updatedReport[type];
    const taskIndex = taskList.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      taskList[taskIndex] = { ...taskList[taskIndex], description };
      setReport(updatedReport);
    }
  };

  const handleSaveChanges = () => {
    try {
      updateReport(report);
      toast.success('Report updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update report');
    }
  };

  // Rest of the existing code remains the same...

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-4 sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Daily Report</h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-1"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSaveChanges}
                className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
            {/* Existing buttons... */}
          </div>
        </div>

        <div className="p-6" ref={reportRef}>
          {/* Existing header content... */}

          <div className="space-y-8">
            {['completed', 'pending', 'nextDayPlan'].map((type) => (
              <section key={type}>
                <div className="flex items-center space-x-2 mb-4">
                  {type === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {type === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
                  {type === 'nextDayPlan' && <ListTodo className="w-5 h-5 text-blue-500" />}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {type === 'completed' ? 'Completed Tasks' :
                     type === 'pending' ? 'Pending Tasks' : 
                     "Tomorrow's Plan"}
                  </h3>
                </div>
                <div className="space-y-2 pl-7">
                  {report[type].map((task) => (
                    <div key={task.id}>
                      {isEditing ? (
                        <TaskInput
                          value={task.description}
                          onChange={(value) => handleTaskUpdate(task.id, value, type as any)}
                          onRemove={() => {/* Add remove functionality */}}
                        />
                      ) : (
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: task.description }} />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}