import React from 'react';
import TrainerLayout from '../../components/Trainer/TrainerLayout';
import { useTheme } from '../../context/ThemeContext';
import { FaUserFriends, FaPlus, FaSearch, FaUsers } from 'react-icons/fa';

const TrainerClientsPage = () => {
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
              <FaUserFriends style={{ color: theme.colors.primary }} />
              My Clients
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Manage your client relationships and track their progress
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg transform hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            <FaPlus />
            Add Client
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Clients', value: '0', icon: FaUsers },
            { label: 'Active This Week', value: '0', icon: FaUserFriends },
            { label: 'New This Month', value: '0', icon: FaPlus },
          ].map((stat, index) => (
            <div 
              key={index}
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}20` }}
                >
                  <stat.icon style={{ color: theme.colors.primary }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: theme.colors.text }}>{stat.value}</p>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
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
              placeholder="Search clients..."
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
            <FaUserFriends className="text-4xl" style={{ color: theme.colors.primary }} />
          </div>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            No Clients Yet
          </h3>
          <p 
            className="mb-6 max-w-md mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Start building your client base. Add clients to track their fitness journey and provide personalized training.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            Add Your First Client
          </button>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerClientsPage;
