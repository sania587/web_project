import { useTheme } from '../../../context/ThemeContext';
import { FaChartLine, FaFire, FaBullseye } from 'react-icons/fa';

const ProgressReports = ({ reports = [], loading, error }) => {
  const { theme, isDark } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <h2 
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ color: theme.colors.text }}
      >
        Recent Progress And Reports
      </h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.colors.primary }}></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '400px' }}>
          {Array.isArray(reports) && reports.length > 0 ? (
            reports.map((report, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl border transition-all hover:translate-x-1"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}
                  >
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.text }}>
                    <FaBullseye className="text-xs" style={{ color: theme.colors.secondary }} />
                    <span className="font-medium">Goal:</span> {report.goals}
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
                    <FaChartLine className="text-xs" />
                    <span>{report.activities.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.colors.accent }}>
                    <FaFire className="text-xs" />
                    <span>{report.metrics.caloriesBurned} cal burned</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-8" style={{ color: theme.colors.textMuted }}>
              <p>No progress reports available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressReports;
