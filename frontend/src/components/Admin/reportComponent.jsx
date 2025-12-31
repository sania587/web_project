import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import { FaUsers, FaUserTie, FaDollarSign, FaChartBar, FaChartPie, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axios from "axios";


const ReportComponent = () => {
  const { theme, isDark } = useTheme();
  const [allPayments, setAllPayments] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalFeedback: 0,
    avgRating: 0,
    pendingPayments: 0,
    approvedPayments: 0
  });
  
  const [loading, setLoading] = useState(true);

  // Date filtering state
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [userRes, trainerRes, paymentRes, feedbackRes] = await Promise.all([
        axios.get('http://localhost:5000/api/counts/user-count'),
        axios.get('http://localhost:5000/api/counts/trainer-count'),
        axios.get('http://localhost:5000/api/payment'),
        axios.get('http://localhost:5000/api/feedback')
      ]);

      let payments = Array.isArray(paymentRes.data) ? paymentRes.data : [];
      let feedbacks = Array.isArray(feedbackRes.data) ? feedbackRes.data : [];
      
      // Store all data for charts
      setAllPayments(payments);
      setAllFeedbacks(feedbacks);
      
      // Filter based on selected Month and Year for stats
      const filteredPayments = payments.filter(p => {
        const d = new Date(p.createdAt);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      });
      
      const filteredFeedbacks = feedbacks.filter(f => {
        const d = new Date(f.createdAt);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      });

      // Calculate Stats
      const approvedPayments = filteredPayments.filter(p => p.status === 'success');
      const totalRevenue = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avgRating = filteredFeedbacks.length > 0 
        ? (filteredFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / filteredFeedbacks.length).toFixed(1)
        : 0;

      setStats({
        totalUsers: userRes.data.userCount || 0,
        totalTrainers: trainerRes.data.trainerCount || 0,
        totalPayments: filteredPayments.length,
        totalRevenue,
        totalFeedback: filteredFeedbacks.length,
        avgRating,
        pendingPayments: filteredPayments.filter(p => p.status === 'pending').length,
        approvedPayments: approvedPayments.length
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const getMonthlyRevenueData = () => {
    const monthlyData = Array(12).fill(0);
    allPayments.filter(p => {
      const d = new Date(p.createdAt);
      return d.getFullYear() === selectedYear && p.status === 'success';
    }).forEach(p => {
      const month = new Date(p.createdAt).getMonth();
      monthlyData[month] += p.amount || 0;
    });
    return monthlyData;
  };

  const getFeedbackRatingData = () => {
    const ratingCounts = [0, 0, 0, 0, 0];
    allFeedbacks.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingCounts[f.rating - 1]++;
      }
    });
    return ratingCounts;
  };

  const getUserDistributionData = () => {
    return [stats.totalUsers, stats.totalTrainers];
  };

  const getPaymentStatusData = () => {
    const pending = allPayments.filter(p => p.status === 'pending').length;
    const approved = allPayments.filter(p => p.status === 'success').length;
    const rejected = allPayments.filter(p => p.status === 'failed').length;
    return [pending, approved, rejected];
  };

  const reportCards = [
    {
      title: "Total Customers",
      value: stats.totalUsers,
      icon: FaUsers,
      bgLight: "bg-blue-100",
      textColor: "text-blue-600",
      change: "+12%",
      positive: true
    },
    {
      title: "Total Trainers",
      value: stats.totalTrainers,
      icon: FaUserTie,
      bgLight: "bg-purple-100",
      textColor: "text-purple-600",
      change: "+8%",
      positive: true
    },
    {
      title: "Revenue",
      value: `Rs.${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      bgLight: "bg-green-100",
      textColor: "text-green-600",
      change: "+23%",
      positive: true
    },
    {
      title: "Avg Rating",
      value: `${stats.avgRating}/5`,
      icon: FaChartLine,
      bgLight: "bg-amber-100",
      textColor: "text-amber-600",
      change: "+0.2",
      positive: true
    }
  ];

  return (
    <div className="transition-colors duration-300">
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 
              className="text-3xl font-bold flex items-center gap-3 transition-colors"
              style={{ color: theme.colors.text }}
            >
              <FaChartBar style={{ color: theme.colors.primary }} />
              Reports & Analytics
            </h2>
            <p 
              className="mt-1 transition-colors"
              style={{ color: theme.colors.textSecondary }}
            >
              Comprehensive business analytics and insights
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
             <div 
              className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            ></div>
            Loading report data...
          </div>
        ) : (
          <>
            {/* Summary Stats - Compact Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {reportCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl p-4 shadow-sm border hover:shadow-md transition-all"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${card.bgLight} flex items-center justify-center`}>
                        <Icon className={`text-lg ${card.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: theme.colors.textSecondary }}>
                          {card.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold" style={{ color: theme.colors.text }}>
                            {card.value}
                          </h3>
                          <span className={`text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                            {card.positive ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
                            {card.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Monthly Revenue Chart - Takes 2 columns */}
              <div 
                className="lg:col-span-2 rounded-2xl p-6 shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <FaChartLine style={{ color: theme.colors.primary }} />
                  Monthly Revenue Trend ({selectedYear})
                </h3>
                <div className="h-72">
                   <Line
                      data={{
                        labels: months.map(m => m.slice(0, 3)),
                        datasets: [{
                          label: 'Revenue (Rs)',
                          data: getMonthlyRevenueData(),
                          borderColor: theme.colors.primary,
                          backgroundColor: `${theme.colors.primary}20`,
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: theme.colors.primary,
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointRadius: 4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: isDark ? '#1f2937' : '#fff',
                            titleColor: theme.colors.text,
                            bodyColor: theme.colors.text,
                            borderColor: theme.colors.border,
                            borderWidth: 1
                          }
                        },
                        scales: {
                           y: { 
                             beginAtZero: true,
                             grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }, 
                             ticks: { color: theme.colors.textSecondary } 
                           },
                           x: { 
                             grid: { display: false }, 
                             ticks: { color: theme.colors.textSecondary } 
                           }
                        }
                      }}
                   />
                </div>
              </div>

              {/* User Distribution Doughnut */}
              <div 
                className="rounded-2xl p-6 shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <FaUsers style={{ color: theme.colors.primary }} />
                  User Distribution
                </h3>
                <div className="h-56 flex items-center justify-center">
                   <Doughnut
                      data={{
                        labels: ['Customers', 'Trainers'],
                        datasets: [{
                          data: getUserDistributionData(),
                          backgroundColor: [theme.colors.primary, theme.colors.secondary],
                          borderWidth: 0,
                          cutout: '70%'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { 
                            position: 'bottom',
                            labels: { color: theme.colors.text, padding: 15, usePointStyle: true }
                          }
                        }
                      }}
                   />
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{stats.totalUsers}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: theme.colors.secondary }}>{stats.totalTrainers}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Trainers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Feedback Ratings Bar */}
              <div 
                className="rounded-2xl p-6 shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <FaChartBar style={{ color: theme.colors.primary }} />
                  Feedback Ratings Distribution
                </h3>
                <div className="h-64">
                   <Bar
                      data={{
                        labels: ['⭐ 1', '⭐ 2', '⭐ 3', '⭐ 4', '⭐ 5'],
                        datasets: [{
                          label: 'Reviews',
                          data: getFeedbackRatingData(),
                          backgroundColor: [
                            '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'
                          ],
                          borderRadius: 8,
                          maxBarThickness: 50
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                           y: { 
                             beginAtZero: true, 
                             grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }, 
                             ticks: { stepSize: 1, color: theme.colors.textSecondary } 
                           },
                           x: { grid: { display: false }, ticks: { color: theme.colors.textSecondary } }
                        }
                      }}
                   />
                </div>
              </div>

              {/* Payment Status Doughnut */}
              <div 
                className="rounded-2xl p-6 shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <FaChartPie style={{ color: theme.colors.primary }} />
                  Payment Status Overview
                </h3>
                <div className="h-56 flex items-center justify-center">
                   <Doughnut
                      data={{
                        labels: ['Pending', 'Approved', 'Rejected'],
                        datasets: [{
                          data: getPaymentStatusData(),
                          backgroundColor: ['#f59e0b', '#22c55e', '#ef4444'],
                          borderWidth: 0,
                          cutout: '65%'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { 
                            position: 'bottom',
                            labels: { color: theme.colors.text, padding: 15, usePointStyle: true }
                          }
                        }
                      }}
                   />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-amber-500">{getPaymentStatusData()[0]}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Pending</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-500">{getPaymentStatusData()[1]}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Approved</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-500">{getPaymentStatusData()[2]}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div 
              className="rounded-2xl p-8 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
              }}
            >
              <h3 className="text-xl font-bold mb-6">Performance Summary for {months[selectedMonth]} {selectedYear}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.totalUsers + stats.totalTrainers}</p>
                  <p className="opacity-80 text-sm mt-1">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">Rs.{stats.totalRevenue.toLocaleString()}</p>
                  <p className="opacity-80 text-sm mt-1">Monthly Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.totalPayments}</p>
                  <p className="opacity-80 text-sm mt-1">Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.avgRating}/5</p>
                  <p className="opacity-80 text-sm mt-1">Avg Rating</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReportComponent;
