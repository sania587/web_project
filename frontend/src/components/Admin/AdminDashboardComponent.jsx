import React, { useEffect, useState } from "react";

import { useTheme } from "../../context/ThemeContext";
import { 
  FaUsers, 
  FaUserTie, 
  FaComments, 
  FaDollarSign,
  FaTags,
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown,
  FaChartLine
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminDashboardComponent = () => {
  const { theme, isDark } = useTheme();
  
  const [stats, setStats] = useState({
    userCount: 0,
    trainerCount: 0,
    feedbackCount: 0,
    paymentCount: 0,
    subscriptionCount: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("http://localhost:5000/api/counts/stats");
      const data = await response.json();

      setStats({
        userCount: data.activeUsers || 0,
        trainerCount: data.activeTrainers || 0,
        feedbackCount: data.feedbackCount || 0,
        paymentCount: data.paymentCount || 0,
        subscriptionCount: data.subscriptionCount || 0,
        totalRevenue: data.revenue || 0
      });

      // Format recent activity
      if (Array.isArray(data.recentActivity)) {
        const formattedActivity = data.recentActivity.map(activity => ({
          type: activity.type,
          message: activity.message,
          time: new Date(activity.time).toLocaleDateString()
        }));
        setRecentActivity(formattedActivity);
      }

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.userCount,
      icon: FaUsers,
      gradient: "from-blue-500 to-blue-600",
      change: "+12%",
      positive: true
    },
    {
      title: "Total Trainers",
      value: stats.trainerCount,
      icon: FaUserTie,
      gradient: "from-purple-500 to-purple-600",
      change: "+8%",
      positive: true
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      gradient: "from-green-500 to-green-600",
      change: "+23%",
      positive: true
    },
    {
      title: "Active Subscriptions",
      value: stats.subscriptionCount,
      icon: FaTags,
      gradient: "from-amber-500 to-orange-500",
      change: "+5%",
      positive: true
    },
    {
      title: "Total Payments",
      value: stats.paymentCount,
      icon: FaCalendarCheck,
      gradient: "from-pink-500 to-rose-500",
      change: "+15%",
      positive: true
    },
    {
      title: "Total Feedback",
      value: stats.feedbackCount,
      icon: FaComments,
      gradient: "from-cyan-500 to-teal-500",
      change: "-2%",
      positive: false
    }
  ];

  const quickActions = [
    { label: "Add Trainer", path: "/signup/trainer", bg: theme.colors.primary },
    { label: "View Reports", path: "/reports", bg: theme.colors.secondary },
    { label: "Manage Plans", path: "/manage-subscriptions", bg: theme.colors.accent },
    { label: "Notifications", path: "/admin/notifications", bg: theme.colors.success }
  ];

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.colors.background }}
    >


      <main className="p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 
            className="text-3xl font-bold mb-2 transition-colors duration-300"
            style={{ color: theme.colors.text }}
          >
            Welcome back, Admin!
          </h2>
          <p 
            className="transition-colors duration-300"
            style={{ color: theme.colors.textSecondary }}
          >
            Here's what's happening with your fitness center today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border backdrop-blur-sm"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="text-white text-xl" />
                </div>
                <p 
                  className="text-sm font-medium mb-1 min-h-[40px] flex items-center"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {card.title}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <h3 
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.text }}
                  >
                    {loading ? "..." : card.value}
                  </h3>
                  <span className={`flex items-center text-xs font-medium ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {card.positive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {card.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div 
            className="rounded-2xl p-6 shadow-sm border h-full flex flex-col"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme.colors.text }}
            >
              <FaChartLine style={{ color: theme.colors.primary }} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="text-white text-sm font-medium py-4 px-4 rounded-xl text-center transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center w-full min-h-[80px]"
                  style={{ backgroundColor: action.bg }}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="lg:col-span-2 rounded-2xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <>
              <div className="space-y-3">
                {recentActivity.slice(0, showAllActivities ? recentActivity.length : 3).map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: isDark ? theme.colors.surfaceHover : theme.colors.background }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ 
                        backgroundColor: activity.type === 'payment' ? theme.colors.success : theme.colors.primary 
                      }}
                    >
                      {activity.type === 'payment' ? <FaDollarSign /> : <FaUsers />}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="font-medium"
                        style={{ color: theme.colors.text }}
                      >
                        {activity.message}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {recentActivity.length > 2 && (
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="mt-4 w-full py-2 text-sm font-medium text-center rounded-lg transition-colors hover:bg-opacity-10"
                  style={{ 
                    color: theme.colors.primary, 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {showAllActivities ? 'View Less' : 'View All Recent Activity'}
                </button>
              )}
              </>
            ) : (
              <div 
                className="text-center py-8"
                style={{ color: theme.colors.textMuted }}
              >
                <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          {/* Revenue Chart */}
          <div 
            className="rounded-2xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Revenue Analytics
            </h3>
            <div className="h-64">
              <Line 
                data={{
                  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [
                    {
                      label: 'Revenue',
                      data: [65, 59, 80, 81, 56, stats.totalRevenue || 0],
                      fill: true,
                      backgroundColor: isDark ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)',
                      borderColor: theme.colors.primary,
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      },
                      ticks: {
                        color: theme.colors.textSecondary
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: theme.colors.textSecondary
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Member Distribution Chart */}
          <div 
            className="rounded-2xl p-6 shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Member Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <div className="w-64">
                <Doughnut 
                  data={{
                    labels: ['Customers', 'Trainers'],
                    datasets: [
                      {
                        data: [stats.userCount, stats.trainerCount],
                        backgroundColor: [
                          theme.colors.primary,
                          theme.colors.secondary
                        ],
                        borderColor: theme.colors.surface,
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: theme.colors.text
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardComponent;