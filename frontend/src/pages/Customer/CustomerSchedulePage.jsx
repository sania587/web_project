import React from "react";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { FaCalendarAlt } from "react-icons/fa";

const CustomerSchedulePage = () => {
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
          My Schedule
        </h1>
        
        <div 
          className="rounded-2xl p-8 border text-center"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <FaCalendarAlt 
            className="mx-auto text-5xl mb-4" 
            style={{ color: "#8b5cf6" }} 
          />
          <h2 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Your Training Schedule
          </h2>
          <p 
            className="mb-4"
            style={{ color: theme.colors.textSecondary }}
          >
            View and manage your upcoming training sessions here.
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textMuted }}
          >
            No sessions scheduled. Book a session with a trainer!
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerSchedulePage;
