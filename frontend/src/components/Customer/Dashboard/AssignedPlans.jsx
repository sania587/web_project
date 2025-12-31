import { useTheme } from '../../../context/ThemeContext';

const AssignedPlans = ({ plans = { workoutPlan: null, dietPlan: null } }) => {
  const { theme, isDark } = useTheme();

  return (
    <div className="h-full">
      <h2 
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ color: theme.colors.text }}
      >
        Current Plans
      </h2>

      <div className="space-y-4">
        {/* Workout Plan Card */}
        <div 
          className="p-5 rounded-xl border transition-all hover:shadow-md"
          style={{ 
            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
            borderColor: theme.colors.border
          }}
        >
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: theme.colors.primary }}
          >
            Workout Plan
          </h3>
          <p 
            className="text-lg font-medium"
            style={{ color: theme.colors.text }}
          >
            {plans.workoutPlan || 'No workout plan assigned'}
          </p>
        </div>

        {/* Diet Plan Card */}
        <div 
          className="p-5 rounded-xl border transition-all hover:shadow-md"
          style={{ 
            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
            borderColor: theme.colors.border
          }}
        >
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: theme.colors.secondary }}
          >
            Diet Plan
          </h3>
          <p 
            className="text-lg font-medium"
            style={{ color: theme.colors.text }}
          >
            {plans.dietPlan || 'No diet plan assigned'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignedPlans;
