import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { 
  FaDumbbell, 
  FaAppleAlt, 
  FaCalendarCheck, 
  FaUserTie,
  FaChartLine,
  FaFire,
  FaPlay,
  FaClipboardList,
  FaBell,
  FaPlus,
  FaArrowRight,
  FaLock,
  FaCrown
} from "react-icons/fa";

const Dashboard = () => {
  const { theme, isDark } = useTheme();
  const { user: reduxUser } = useSelector((state) => state.auth);
  const { hasFeature, isActive: hasActiveSubscription, planName, features } = useSubscription();
  
  // Get user from localStorage as fallback (for page refreshes)
  const getUser = () => {
    if (reduxUser?.name) return reduxUser;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || parsed;
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e);
    }
    return null;
  };
  
  const user = getUser();
  
  const [plans, setPlans] = useState({});
  const [progressData, setProgressData] = useState({ weeklyWorkouts: 0, totalWorkouts: 0, caloriesBurned: 0, streak: 0 });
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, progressRes, trainersRes] = await Promise.all([
          axios.get("/api/dashboard/plans"),
          axios.get("/api/dashboard/progress"),
          axios.get("/api/dashboard/trainers")
        ]);
        
        setPlans(plansRes.data || {});
        
        // Calculate progress stats from real data
        const reports = Array.isArray(progressRes.data) ? progressRes.data : [];
        const thisWeekReports = reports.filter(r => {
          const reportDate = new Date(r.date);
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reportDate >= weekAgo;
        });
        
        const totalCalories = reports.reduce((sum, r) => sum + (r.metrics?.caloriesBurned || 0), 0);
        
        setProgressData({
          weeklyWorkouts: thisWeekReports.length,
          totalWorkouts: reports.length,
          caloriesBurned: totalCalories,
          streak: Math.min(thisWeekReports.length, 7) // Simplified streak calculation
        });
        
        const trainersList = Array.isArray(trainersRes.data) ? trainersRes.data : [];
        setTrainers(trainersList);
        
      } catch (err) {
        console.error("Dashboard data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get current time greeting with varied messages
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: "Good morning", emoji: "☀️", message: "Rise and shine! Ready to crush your goals?" };
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good afternoon", emoji: "🌤️", message: "Keep the momentum going!" };
    } else if (hour >= 17 && hour < 21) {
      return { text: "Good evening", emoji: "🌆", message: "Great time for an evening workout!" };
    } else {
      return { text: "Good night", emoji: "🌙", message: "Rest well, champion!" };
    }
  };

  const greeting = getGreeting();

  // Get today's date formatted
  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get assigned trainer name
  const getAssignedTrainer = () => {
    if (trainers.length > 0) {
      return trainers[0].name; // Assuming first trainer is assigned
    }
    return "Not Assigned";
  };

  // Quick Stats Data - Using real data
  const quickStats = [
    {
      title: "Active Plan",
      value: loading ? "Loading..." : (plans.workoutPlan || "No Plan"),
      icon: FaDumbbell,
      color: theme.colors.primary,
      bgColor: theme.colors.primary + "15"
    },
    {
      title: "This Week",
      value: loading ? "--" : `${progressData.weeklyWorkouts} / 5`,
      subtitle: "Workouts",
      icon: FaFire,
      color: "#f59e0b",
      bgColor: "#f59e0b15"
    },
    {
      title: "My Trainer",
      value: loading ? "Loading..." : getAssignedTrainer(),
      icon: FaUserTie,
      color: theme.colors.secondary,
      bgColor: theme.colors.secondary + "15"
    },
    {
      title: "Next Session",
      value: "Schedule",
      subtitle: "View calendar",
      icon: FaCalendarCheck,
      color: "#10b981",
      bgColor: "#10b98115"
    }
  ];

  // Quick Action Buttons
  const quickActions = [
    { label: "Log Workout", icon: FaPlus, path: "/customer/workouts", color: theme.colors.primary },
    { label: "Track Meal", icon: FaAppleAlt, path: "/customer/diet-plans", color: "#10b981" },
    { label: "View Schedule", icon: FaCalendarCheck, path: "/customer/schedule", color: "#8b5cf6" },
    { label: "Messages", icon: FaBell, path: "/customer/notifications", color: "#f59e0b" }
  ];

  return (
    <CustomerLayout>
      <div 
        className="min-h-screen p-6 lg:p-8"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: theme.colors.text }}
              >
                {greeting.text}, {user?.name || "Member"}! {greeting.emoji}
              </h1>
              <p 
                className="text-sm md:text-base"
                style={{ color: theme.colors.textSecondary }}
              >
                {getTodayDate()} • {greeting.message}
              </p>
            </div>
            
            {/* Streak Badge */}
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-xl self-start"
              style={{ 
                backgroundColor: isDark ? theme.colors.surfaceHover : '#fef3c7',
                border: `1px solid ${isDark ? theme.colors.border : '#fcd34d'}`
              }}
            >
              <FaFire className="text-xl text-orange-500" />
              <div>
                <p className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                  Current Streak
                </p>
                <p className="text-lg font-bold text-orange-500">
                  {loading ? "--" : progressData.streak} Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status Banner */}
        {!hasActiveSubscription && (
          <div 
            className="mb-8 rounded-2xl p-5 border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
              borderColor: theme.colors.primary + '40'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
              >
                <FaCrown className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: theme.colors.text }}>
                  Unlock Premium Features
                </h3>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Get access to trainers, diet plans, progress tracking & more!
                </p>
              </div>
            </div>
            <Link
              to="/customer/subscription"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              <span>Upgrade Now</span>
              <FaArrowRight />
            </Link>
          </div>
        )}

        {/* Current Plan Badge (for subscribed users) */}
        {hasActiveSubscription && (
          <div 
            className="mb-8 rounded-2xl p-4 border flex items-center gap-4"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary + '20' }}
            >
              <FaCrown style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                Current Plan
              </p>
              <p className="font-bold" style={{ color: theme.colors.text }}>
                {planName}
              </p>
            </div>
            <div className="flex-1 flex flex-wrap gap-2 ml-4">
              {features.slice(0, 4).map((feature, i) => (
                <span 
                  key={i}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: theme.colors.primary + '15',
                    color: theme.colors.primary
                  }}
                >
                  {feature}
                </span>
              ))}
              {features.length > 4 && (
                <span className="text-xs px-2 py-1" style={{ color: theme.colors.textSecondary }}>
                  +{features.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="text-lg" style={{ color: stat.color }} />
                </div>
                <p 
                  className="text-xs font-medium mb-1 uppercase tracking-wider"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {stat.title}
                </p>
                <p 
                  className="text-lg font-bold truncate"
                  style={{ color: theme.colors.text }}
                >
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    {stat.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's Focus Section */}
        <div 
          className="rounded-2xl p-6 mb-8 border"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.secondary}10 100%)`,
            borderColor: theme.colors.border
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
              >
                <FaPlay className="text-white text-xl" />
              </div>
              <div>
                <h2 
                  className="text-lg font-bold mb-1"
                  style={{ color: theme.colors.text }}
                >
                  Today's Workout
                </h2>
                <p style={{ color: theme.colors.textSecondary }}>
                  {plans.workoutPlan ? `${plans.workoutPlan} - Day 3` : "No workout scheduled for today"}
                </p>
              </div>
            </div>
            <Link
              to="/customer/workouts"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              <span>Start Workout</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* My Progress Card */}
          <div 
            className="rounded-2xl p-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                <FaChartLine style={{ color: theme.colors.primary }} />
                My Progress
              </h3>
              <Link 
                to="/customer/progress" 
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                View All
              </Link>
            </div>
            
            {/* Progress Items */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                    Weekly Goal
                  </p>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    {loading ? "Loading..." : `${progressData.weeklyWorkouts} of 5 workouts completed`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                    {loading ? "--" : `${Math.min(Math.round((progressData.weeklyWorkouts / 5) * 100), 100)}%`}
                  </p>
                </div>
              </div>
              
              <div 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                    Calories Burned
                  </p>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    This week
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>
                    {loading ? "--" : progressData.caloriesBurned.toLocaleString()}
                  </p>
                </div>
              </div>

              <div 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                    Total Workouts
                  </p>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    All time
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: "#10b981" }}>
                    {loading ? "--" : progressData.totalWorkouts}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Card */}
          <div 
            className="rounded-2xl p-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                <FaCalendarCheck style={{ color: theme.colors.secondary }} />
                Upcoming Schedule
              </h3>
              <Link 
                to="/customer/schedule" 
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                View All
              </Link>
            </div>
            
            {/* Schedule Items */}
            <div className="space-y-3">
              {trainers.length > 0 ? (
                trainers.slice(0, 3).map((trainer, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:translate-x-1"
                    style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
                  >
                    <div 
                      className="w-12 text-center py-2 rounded-lg"
                      style={{ backgroundColor: theme.colors.primary + "15" }}
                    >
                      <p className="text-xs font-bold" style={{ color: theme.colors.primary }}>
                        Available
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                        {trainer.name}
                      </p>
                      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        {Array.isArray(trainer.specializations) ? trainer.specializations.join(', ') : 'General Fitness'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="text-center py-8 rounded-xl"
                  style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
                >
                  <FaCalendarCheck className="mx-auto text-3xl mb-2" style={{ color: theme.colors.textMuted }} />
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    No scheduled sessions yet
                  </p>
                  <Link 
                    to="/customer/schedule"
                    className="text-xs font-medium hover:underline mt-2 inline-block"
                    style={{ color: theme.colors.primary }}
                  >
                    Book a session
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="rounded-2xl p-6 border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h3 
            className="text-lg font-bold mb-5"
            style={{ color: theme.colors.text }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{ 
                    backgroundColor: action.color + "10",
                    border: `1px solid ${action.color}30`
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: action.color + "20" }}
                  >
                    <Icon className="text-lg" style={{ color: action.color }} />
                  </div>
                  <span 
                    className="text-sm font-semibold text-center"
                    style={{ color: action.color }}
                  >
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Dashboard;
