import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TrainerDashboard = () => {
  const user = useSelector((state) => state.auth.user)

  const dashboardCards = [
    {
      title: 'Manage Workouts',
      description: 'Create and manage workout plans for your clients',
      link: '/trainer/workouts',
      icon: '💪',
      color: 'bg-indigo-500'
    },
    {
      title: 'Diet Plans',
      description: 'Create customized diet plans',
      link: '/trainer/diet-plans',
      icon: '🥗',
      color: 'bg-green-500'
    },
    {
      title: 'My Schedule',
      description: 'View and manage your training sessions',
      link: '/trainer/schedule',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      title: 'Client Progress',
      description: 'Track your clients\' progress',
      link: '/trainer/progress',
      icon: '📊',
      color: 'bg-purple-500'
    },
    {
      title: 'Profile',
      description: 'Update your profile and certifications',
      link: '/profile',
      icon: '👤',
      color: 'bg-gray-500'
    },
    {
      title: 'Notifications',
      description: 'View session requests and updates',
      link: '/trainer/notifications',
      icon: '🔔',
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Welcome, {user?.name || 'Trainer'}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your training sessions and clients from here.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Link to={card.link} key={index}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
                <p className="text-gray-600 mt-2">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">0</p>
            <p className="text-gray-600">Active Clients</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-gray-600">Workout Plans</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-gray-600">Sessions This Week</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">4.8</p>
            <p className="text-gray-600">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerDashboard
