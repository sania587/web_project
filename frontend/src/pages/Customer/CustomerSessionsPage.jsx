import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserTie, 
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass
} from 'react-icons/fa';

const CustomerSessionsPage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/session-requests/customer/${userId}`);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706', icon: FaHourglass, text: 'Pending' },
      accepted: { bg: '#dbeafe', color: '#2563eb', icon: FaCheckCircle, text: 'Accepted' },
      rejected: { bg: '#fee2e2', color: '#dc2626', icon: FaTimesCircle, text: 'Rejected' },
      scheduled: { bg: '#dcfce7', color: '#16a34a', icon: FaCalendarAlt, text: 'Scheduled' },
      completed: { bg: '#e0e7ff', color: '#4f46e5', icon: FaCheckCircle, text: 'Completed' },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', icon: FaTimesCircle, text: 'Cancelled' }
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        <Icon className="text-xs" /> {style.text}
      </span>
    );
  };

  const upcomingSessions = sessions.filter(s => ['pending', 'accepted', 'scheduled'].includes(s.status));
  const pastSessions = sessions.filter(s => ['completed', 'rejected', 'cancelled'].includes(s.status));

  const displaySessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

  return (
    <CustomerLayout>
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: theme.colors.text }}
          >
            <FaCalendarAlt style={{ color: theme.colors.primary }} />
            My Sessions
          </h2>
          <p 
            className="mt-1"
            style={{ color: theme.colors.textSecondary }}
          >
            View your training sessions with trainers
          </p>
        </div>

        {/* Tabs */}
        <div 
          className="rounded-2xl p-2 mb-6 border flex gap-2"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <button
            onClick={() => setActiveTab('upcoming')}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: activeTab === 'upcoming' ? theme.colors.primary : 'transparent',
              color: activeTab === 'upcoming' ? 'white' : theme.colors.textSecondary
            }}
          >
            Upcoming ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: activeTab === 'past' ? theme.colors.primary : 'transparent',
              color: activeTab === 'past' ? 'white' : theme.colors.textSecondary
            }}
          >
            Past ({pastSessions.length})
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            />
          </div>
        ) : displaySessions.length === 0 ? (
          <div 
            className="rounded-2xl p-12 text-center border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <FaCalendarAlt className="text-6xl mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textSecondary }}>
              {activeTab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
            </p>
            <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
              {activeTab === 'upcoming' && 'Book a session with a trainer to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displaySessions.map((session) => (
              <div 
                key={session._id}
                className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
              >
                {/* Trainer Info Header */}
                <div 
                  className="p-4 text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                      {session.trainer?.profilePicture ? (
                        <img 
                          src={`http://localhost:5000${session.trainer.profilePicture}`}
                          alt={session.trainer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserTie className="text-2xl text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{session.trainer?.name || 'Trainer'}</h3>
                      <p className="text-sm opacity-80 flex items-center gap-1">
                        <FaEnvelope className="text-xs" />
                        {session.trainer?.email}
                      </p>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                </div>

                {/* Session Details */}
                <div className="p-4 space-y-3">
                  {/* Scheduled Date/Time */}
                  {session.scheduledDate && (
                    <div 
                      className="p-4 rounded-xl flex items-center gap-4"
                      style={{ backgroundColor: isDark ? '#22c55e20' : '#dcfce7' }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        <FaCalendarAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-700">
                          {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-green-600 flex items-center gap-1">
                          <FaClock />
                          {session.scheduledTime || 'Time to be confirmed'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trainer Response */}
                  {session.trainerResponse && (
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc' }}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                        Trainer's Response
                      </p>
                      <p style={{ color: theme.colors.text }}>"{session.trainerResponse}"</p>
                    </div>
                  )}

                  {/* Request Date */}
                  <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                    <FaClock className="inline mr-1" />
                    Requested: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </CustomerLayout>
  );
};

export default CustomerSessionsPage;
