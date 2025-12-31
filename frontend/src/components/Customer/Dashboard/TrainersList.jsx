import { useTheme } from '../../../context/ThemeContext';
import { FaStar, FaClock, FaDumbbell } from 'react-icons/fa';

const TrainersList = ({ trainers = [], loading, filters, onFilterChange }) => {
  const { theme, isDark } = useTheme();

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 
          className="text-xl font-bold"
          style={{ color: theme.colors.text }}
        >
          Available Trainers
        </h2>
        
        {/* Compact Filters */}
        <div className="flex gap-2 w-full md:w-auto">
           <input
            name="rating"
            type="number"
            placeholder="Min Rating"
            value={filters.rating}
            onChange={onFilterChange}
            className="w-full md:w-24 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              '--tw-ring-color': theme.colors.primary
            }}
          />
          <input
            name="specialty"
            type="text"
            placeholder="Specialty"
            value={filters.specialty}
            onChange={onFilterChange}
            className="w-full md:w-32 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              '--tw-ring-color': theme.colors.primary
            }}
          />
        </div>
      </div>

      {loading ? (
         <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: theme.colors.primary }}></div>
         </div>
      ) : Array.isArray(trainers) && trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="p-5 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white uppercase"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                >
                  {trainer.name?.charAt(0) || 'T'}
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">
                  <FaStar className="text-yellow-500" />
                  {Number(trainer.rating || 0).toFixed(1)}
                </div>
              </div>

              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: theme.colors.text }}
              >
                {trainer.name}
              </h3>

              <div className="space-y-2 text-sm">
                 <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                   <FaDumbbell className="text-xs" />
                   <span className="truncate">{Array.isArray(trainer.specializations) ? trainer.specializations.join(', ') : 'General'}</span>
                 </div>
                 <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                   <FaClock className="text-xs" />
                   <span>{trainer.availability || 'Not specified'}</span>
                 </div>
              </div>

              <button 
                className="w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ 
                  backgroundColor: theme.colors.primary + '15', 
                  color: theme.colors.primary 
                }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8" style={{ color: theme.colors.textMuted }}>
           No trainers found.
        </div>
      )}
    </div>
  );
};

export default TrainersList;
