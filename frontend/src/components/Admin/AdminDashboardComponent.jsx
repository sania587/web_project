import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
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

const AdminDashboardComponent = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    trainerCount: 0,
    feedbackCount: 0,
    paymentCount: 0,
    subscriptionCount: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all counts in parallel
      const [userRes, trainerRes, feedbackRes, paymentRes, subscriptionRes] = await Promise.all([
        fetch("http://localhost:5000/api/counts/user-count"),
        fetch("http://localhost:5000/api/counts/trainer-count"),
        fetch("http://localhost:5000/api/counts/feedback-count"),
        fetch("http://localhost:5000/api/payment"),
        fetch("http://localhost:5000/api/Plan/subscriptions")
      ]);

      const userData = await userRes.json();
      const trainerData = await trainerRes.json();
      const feedbackData = await feedbackRes.json();
      const paymentData = await paymentRes.json();
      const subscriptionData = await subscriptionRes.json();

      // Calculate total revenue from payments
      const totalRevenue = Array.isArray(paymentData) 
        ? paymentData.reduce((sum, p) => sum + (p.amount || 0), 0)
        : 0;

      setStats({
        userCount: userData.userCount || 0,
        trainerCount: trainerData.trainerCount || 0,
        feedbackCount: feedbackData.feedbackCount || 0,
        paymentCount: Array.isArray(paymentData) ? paymentData.length : 0,
        subscriptionCount: Array.isArray(subscriptionData) ? subscriptionData.length : 0,
        totalRevenue
      });

      // Create recent activity from latest data
      const activities = [];
      if (Array.isArray(paymentData) && paymentData.length > 0) {
        paymentData.slice(0, 3).forEach(p => {
          activities.push({
            type: 'payment',
            message: `Payment of $${p.amount} received`,
            time: new Date(p.createdAt).toLocaleDateString()
          });
        });
      }
      setRecentActivity(activities);

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
    { label: "Add Trainer", path: "/signup/trainer", color: "bg-purple-600 hover:bg-purple-700" },
    { label: "View Reports", path: "/reports", color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Manage Plans", path: "/manage-subscriptions", color: "bg-amber-600 hover:bg-amber-700" },
    { label: "Send Notification", path: "/admin/notifications", color: "bg-green-600 hover:bg-green-700" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Welcome back, Admin!</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your fitness center today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-xl" />
                </div>
                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                <div className="flex items-end justify-between mt-1">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : card.value}
                  </h3>
                  <span className={`flex items-center text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-indigo-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.path}
                  className={`${action.color} text-white text-sm font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 hover:scale-105`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'payment' ? <FaDollarSign /> : <FaUsers />}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 font-medium">{activity.message}</p>
                      <p className="text-slate-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Fitness Center Performance</h3>
              <p className="text-indigo-200">Your gym is growing! Keep up the great work.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold">{stats.userCount + stats.trainerCount}</p>
                <p className="text-indigo-200 text-sm">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">95%</p>
                <p className="text-indigo-200 text-sm">Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">${stats.totalRevenue}</p>
                <p className="text-indigo-200 text-sm">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardComponent;