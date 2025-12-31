import React from "react";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { FaChartLine } from "react-icons/fa";

const CustomerProgressPage = () => {
  const { theme, isDark } = useTheme();

  return (
    <CustomerLayout>
      <div 
        className="min-h-screen p-6 lg:p-8"
        style={{ backgroundColor: theme.colors.background }}
      >
        <h1 
          className="text-2xl md:text-3xl font-bold mb-6"
          style={{ color: theme.colors.text }}
        >
          My Progress
        </h1>
        
        <div 
          className="rounded-2xl p-8 border text-center"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <FaChartLine 
            className="mx-auto text-5xl mb-4" 
            style={{ color: theme.colors.primary }} 
          />
          <h2 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Track Your Journey
          </h2>
          <p 
            className="mb-4"
            style={{ color: theme.colors.textSecondary }}
          >
            View your fitness progress, achievements, and milestones here.
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textMuted }}
          >
            Start logging workouts to see your progress!
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProgressPage;
