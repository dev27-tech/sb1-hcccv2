// Add these functions to the existing reportStore.ts

interface ReportState {
  // ... existing interface properties ...
  updateReport: (report: DailyReport) => void;
  generateMonthlyReport: (month: number, year: number) => MonthlyReport;
  generateYearlyReport: (year: number) => YearlyReport;
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      // ... existing store properties ...
      
      updateReport: (updatedReport) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === updatedReport.id ? {
              ...updatedReport,
              updatedAt: new Date().toISOString()
            } : report
          ),
        }));
      },

      generateMonthlyReport: (month, year) => {
        const reports = get().reports.filter((report) => {
          const date = new Date(report.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });

        return {
          month,
          year,
          totalReports: reports.length,
          completedTasks: reports.reduce((sum, r) => sum + r.completed.length, 0),
          pendingTasks: reports.reduce((sum, r) => sum + r.pending.length, 0),
          plannedTasks: reports.reduce((sum, r) => sum + r.nextDayPlan.length, 0),
          reports
        };
      },

      generateYearlyReport: (year) => {
        const reports = get().reports.filter((report) => {
          const date = new Date(report.date);
          return date.getFullYear() === year;
        });

        const monthlyStats = Array.from({ length: 12 }, (_, month) => 
          get().generateMonthlyReport(month, year)
        );

        return {
          year,
          monthlyStats,
          totalReports: reports.length,
          completedTasks: reports.reduce((sum, r) => sum + r.completed.length, 0),
          pendingTasks: reports.reduce((sum, r) => sum + r.pending.length, 0),
          plannedTasks: reports.reduce((sum, r) => sum + r.nextDayPlan.length, 0),
        };
      },
    }),
    {
      name: 'daily-reports-storage',
      version: 1,
    }
  )
);