import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TrainerLayout from '../../components/Trainer/TrainerLayout'
import { useTheme } from '../../context/ThemeContext'
import { 
  FaDumbbell, 
  FaAppleAlt, 
  FaCalendarAlt, 
  FaChartLine, 
  FaUserEdit, 
  FaBell,
  FaUsers,
  FaStar,
  FaFire,
  FaArrowRight,
  FaClock,
  FaTrophy
} from 'react-icons/fa'

const TrainerDashboard = () => {
  const user = useSelector((state) => state.auth.user)
  const { theme, isDark } = useTheme()

  const quickActions = [
    {
      title: 'Workouts',
      description: 'Manage plans',
      link: '/trainer/workouts',
      icon: FaDumbbell,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Diet Plans',
      description: 'Nutrition guides',
      link: '/trainer/diet-plans',
      icon: FaAppleAlt,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Schedule',
      description: 'View sessions',
      link: '/trainer/schedule',
      icon: FaCalendarAlt,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Clients',
      description: 'Manage members',
      link: '/trainer/clients',
      icon: FaUsers,
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { label: 'Active Clients', value: '0', icon: FaUsers, change: '+0%', positive: true },
    { label: 'Sessions This Week', value: '0', icon: FaCalendarAlt, change: '0', positive: true },
    { label: 'Avg Rating', value: '4.8', icon: FaStar, change: '+0.2', positive: true },
    { label: 'Workout Plans', value: '0', icon: FaDumbbell, change: '+0', positive: true },
  ]

  const recentActivities = [
    // Placeholder data structure for future
  ]

  return (
    <TrainerLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Welcome Header */}
        <div 
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaFire className="text-yellow-300 text-xl" />
                <span className="text-white/80 text-sm font-medium">Dashboard</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Welcome back, {user?.name || 'Trainer'}! 👋
              </h1>
              <p className="text-white/80 text-lg max-w-lg">
                Ready to inspire and transform lives? Here's your training overview.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                to="/trainer/clients"
                className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium flex items-center gap-2 hover:bg-white/30 transition-all border border-white/20"
              >
                <FaUsers />
                View Clients
              </Link>
              <Link 
                to="/trainer/schedule"
                className="px-5 py-3 bg-white rounded-xl font-medium flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg"
                style={{ color: theme.colors.primary }}
              >
                <FaCalendarAlt />
                Today's Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.primary}15` }}
                  >
                    <Icon className="text-lg" style={{ color: theme.colors.primary }} />
                  </div>
                  <span 
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p 
                  className="text-2xl font-bold mb-1"
                  style={{ color: theme.colors.text }}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: theme.colors.text }}>
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link 
                  to={action.link} 
                  key={index}
                  className="group"
                >
                  <div 
                    className={`rounded-2xl p-5 bg-gradient-to-br ${action.gradient} text-white relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1`}
                  >
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                    <Icon className="text-3xl mb-3 relative z-10" />
                    <h3 className="font-bold text-lg mb-1 relative z-10">{action.title}</h3>
                    <p className="text-white/80 text-sm relative z-10">{action.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-white/90 group-hover:translate-x-1 transition-transform">
                      Open <FaArrowRight className="text-xs" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div 
            className="lg:col-span-2 rounded-2xl p-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.colors.text }}>
                <FaClock style={{ color: theme.colors.primary }} />
                Recent Activity
              </h3>
              <Link 
                to="/trainer/notifications"
                className="text-sm font-medium hover:underline" 
                style={{ color: theme.colors.primary }}
              >
                View All
              </Link>
            </div>
            
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <FaBell className="text-2xl" style={{ color: theme.colors.primary }} />
                </div>
                <p className="font-medium mb-1" style={{ color: theme.colors.text }}>No recent activity</p>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Your training activities will appear here
                </p>
              </div>
            ) : null}
          </div>

          {/* Performance Card */}
          <div 
            className="rounded-2xl p-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.colors.text }}>
                <FaTrophy style={{ color: theme.colors.primary }} />
                Performance
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Rating */}
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Your Rating</span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold" style={{ color: theme.colors.text }}>4.8</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-2 rounded-full"
                    style={{ width: '96%', background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                  />
                </div>
              </div>

              {/* Completion Rate */}
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Session Completion</span>
                  <span className="font-bold" style={{ color: theme.colors.text }}>100%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Goals */}
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Monthly Goal</span>
                  <span className="font-bold" style={{ color: theme.colors.text }}>0/10 sessions</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}

export default TrainerDashboard
