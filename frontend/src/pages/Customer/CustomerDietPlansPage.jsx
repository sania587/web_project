import React from "react";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { FaAppleAlt } from "react-icons/fa";

const CustomerDietPlansPage = () => {
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
          My Diet Plans
        </h1>
        
        <div 
          className="rounded-2xl p-8 border text-center"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <FaAppleAlt 
            className="mx-auto text-5xl mb-4" 
            style={{ color: "#10b981" }} 
          />
          <h2 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Your Nutrition Plans
          </h2>
          <p 
            className="mb-4"
            style={{ color: theme.colors.textSecondary }}
          >
            View your personalized diet plans and meal recommendations here.
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textMuted }}
          >
            No diet plan assigned yet. Contact your trainer for a custom plan!
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDietPlansPage;
