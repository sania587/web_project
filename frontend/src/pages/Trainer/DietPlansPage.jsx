import React from 'react';
import TrainerLayout from '../../components/Trainer/TrainerLayout';
import { useTheme } from '../../context/ThemeContext';
import { FaAppleAlt, FaPlus, FaSearch } from 'react-icons/fa';

const DietPlansPage = () => {
  const { theme } = useTheme();

  return (
    <TrainerLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ color: theme.colors.text }}
            >
              <FaAppleAlt style={{ color: theme.colors.primary }} />
              Diet Plans
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Create and manage customized diet plans for your clients
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg transform hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            <FaPlus />
            Create New Plan
          </button>
        </div>

        {/* Search */}
        <div 
          className="rounded-2xl p-4 mb-6 border"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <div className="relative">
            <FaSearch 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search diet plans..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }}
            />
          </div>
        </div>

        {/* Empty State */}
        <div 
          className="rounded-2xl p-12 text-center border"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <FaAppleAlt className="text-4xl" style={{ color: theme.colors.primary }} />
          </div>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            No Diet Plans Yet
          </h3>
          <p 
            className="mb-6 max-w-md mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Start creating personalized diet plans for your clients. Track their nutrition goals and meal schedules.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            Create Your First Plan
          </button>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default DietPlansPage;
