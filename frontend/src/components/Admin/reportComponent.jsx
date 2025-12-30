import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie,
  FaDollarSign,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const ReportComponent = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalFeedback: 0,
    avgRating: 4.5
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [userRes, trainerRes, paymentRes, feedbackRes] = await Promise.all([
        axios.get('http://localhost:5000/api/counts/user-count'),
        axios.get('http://localhost:5000/api/counts/trainer-count'),
        axios.get('http://localhost:5000/api/payment'),
        axios.get('http://localhost:5000/api/feedback')
      ]);

      const payments = Array.isArray(paymentRes.data) ? paymentRes.data : [];
      const feedbacks = Array.isArray(feedbackRes.data) ? feedbackRes.data : [];
      
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avgRating = feedbacks.length > 0 
        ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
        : 0;

      setStats({
        totalUsers: userRes.data.userCount || 0,
        totalTrainers: trainerRes.data.trainerCount || 0,
        totalPayments: payments.length,
        totalRevenue,
        totalFeedback: feedbacks.length,
        avgRating
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: "Total Customers",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "bg-blue-500",
      bgLight: "bg-blue-100",
      textColor: "text-blue-600",
      change: "+12%",
      positive: true
    },
    {
      title: "Total Trainers",
      value: stats.totalTrainers,
      icon: FaUserTie,
      color: "bg-purple-500",
      bgLight: "bg-purple-100",
      textColor: "text-purple-600",
      change: "+8%",
      positive: true
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: "bg-green-500",
      bgLight: "bg-green-100",
      textColor: "text-green-600",
      change: "+23%",
      positive: true
    },
    {
      title: "Total Payments",
      value: stats.totalPayments,
      icon: FaChartBar,
      color: "bg-amber-500",
      bgLight: "bg-amber-100",
      textColor: "text-amber-600",
      change: "+15%",
      positive: true
    },
    {
      title: "Customer Feedback",
      value: stats.totalFeedback,
      icon: FaChartPie,
      color: "bg-pink-500",
      bgLight: "bg-pink-100",
      textColor: "text-pink-600",
      change: "+5%",
      positive: true
    },
    {
      title: "Average Rating",
      value: `${stats.avgRating}/5`,
      icon: FaChartLine,
      color: "bg-cyan-500",
      bgLight: "bg-cyan-100",
      textColor: "text-cyan-600",
      change: "+0.2",
      positive: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FaChartBar className="text-indigo-600" />
              Reports & Analytics
            </h2>
            <p className="text-slate-500 mt-1">Comprehensive business analytics and insights</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  dateRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                This {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading report data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reportCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                        <Icon className={`text-2xl ${card.textColor}`} />
                      </div>
                      <span className={`flex items-center text-sm font-medium ${
                        card.positive ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {card.positive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                        {card.change}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{card.value}</h3>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Overview</h3>
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <FaChartLine className="mx-auto text-4xl text-indigo-400 mb-2" />
                    <p className="text-slate-500">Revenue: ${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-slate-400 mt-1">From {stats.totalPayments} payments</p>
                  </div>
                </div>
              </div>

              {/* User Growth Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">User Growth</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <FaChartBar className="mx-auto text-4xl text-blue-400 mb-2" />
                    <p className="text-slate-500">{stats.totalUsers} Customers</p>
                    <p className="text-slate-500">{stats.totalTrainers} Trainers</p>
                    <p className="text-sm text-slate-400 mt-1">Total: {stats.totalUsers + stats.totalTrainers} members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Performance Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold">{stats.totalUsers + stats.totalTrainers}</p>
                  <p className="text-indigo-200 text-sm mt-1">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">${stats.totalRevenue}</p>
                  <p className="text-indigo-200 text-sm mt-1">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{stats.avgRating}</p>
                  <p className="text-indigo-200 text-sm mt-1">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">95%</p>
                  <p className="text-indigo-200 text-sm mt-1">Satisfaction</p>
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
