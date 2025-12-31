import React from "react";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { FaDumbbell, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

const CustomerWorkoutsPage = () => {
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
          My Workouts
        </h1>
        
        <div 
          className="rounded-2xl p-8 border text-center"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <FaDumbbell 
            className="mx-auto text-5xl mb-4" 
            style={{ color: theme.colors.primary }} 
          />
          <h2 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Your Workout Plans
          </h2>
          <p 
            className="mb-4"
            style={{ color: theme.colors.textSecondary }}
          >
            View your assigned workout plans and track your progress here.
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textMuted }}
          >
            No workouts assigned yet. Contact your trainer to get started!
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerWorkoutsPage;
