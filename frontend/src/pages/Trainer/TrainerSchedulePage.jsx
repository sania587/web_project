import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TrainerLayout from '../../components/Trainer/TrainerLayout';
import { useTheme } from '../../context/ThemeContext';
import { FaCalendarAlt, FaPlus, FaClock, FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TrainerSchedulePage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const trainerId = user?._id || user?.id;

  useEffect(() => {
    if (trainerId) {
      fetchScheduledSessions();
    }
  }, [trainerId]);

  const fetchScheduledSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/session-requests/trainer/${trainerId}`);
      // Filter only scheduled and accepted sessions
      const scheduled = response.data.filter(
        req => ['scheduled', 'accepted'].includes(req.status)
      );
      setScheduledSessions(scheduled);
    } catch (error) {
      console.error('Error fetching scheduled sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (sessionId) => {
    try {
      await axios.put(`http://localhost:5000/api/session-requests/${sessionId}`, {
        status: 'completed'
      });
      fetchScheduledSessions();
    } catch (error) {
      console.error('Error marking session complete:', error);
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await axios.put(`http://localhost:5000/api/session-requests/${sessionId}`, {
        status: 'cancelled',
        trainerResponse: 'Session cancelled by trainer'
      });
      fetchScheduledSessions();
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <TrainerLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ color: theme.colors.text }}
            >
              <FaCalendarAlt style={{ color: theme.colors.primary }} />
              My Schedule
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              View and manage your training sessions
            </p>
          </div>
        </div>

        {/* Week View Header */}
        <div 
          className="rounded-2xl p-4 mb-6 border grid grid-cols-7 gap-2"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          {weekDays.map((day) => (
            <div 
              key={day}
              className="text-center py-2 rounded-lg font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            />
          </div>
        ) : scheduledSessions.length === 0 ? (
          /* Empty State */
          <div 
            className="rounded-2xl p-12 text-center border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <FaClock className="text-4xl" style={{ color: theme.colors.primary }} />
            </div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              No Sessions Scheduled
            </h3>
            <p 
              className="mb-6 max-w-md mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              Your calendar is empty. Accept session requests from clients to see them here.
            </p>
          </div>
        ) : (
          /* Scheduled Sessions List */
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
              Upcoming Sessions ({scheduledSessions.length})
            </h3>
            {scheduledSessions.map((session) => (
              <div 
                key={session._id}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
              >
                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: theme.colors.primary + '20' }}
                    >
                      {session.customer?.profilePicture ? (
                        <img 
                          src={`http://localhost:5000${session.customer.profilePicture}`}
                          alt={session.customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser style={{ color: theme.colors.primary }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: theme.colors.text }}>
                        {session.customer?.name || 'Customer'}
                      </h3>
                      <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                        <FaEnvelope className="text-xs" />
                        {session.customer?.email}
                      </p>
                    </div>
                  </div>

                  {/* Session Date/Time */}
                  <div className="text-center md:text-right">
                    {session.scheduledDate ? (
                      <div 
                        className="px-4 py-2 rounded-xl inline-block"
                        style={{ backgroundColor: isDark ? '#22c55e20' : '#dcfce7' }}
                      >
                        <p className="font-bold text-green-600">
                          <FaCalendarAlt className="inline mr-2" />
                          {new Date(session.scheduledDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-green-500">
                          <FaClock className="inline mr-1" />
                          {session.scheduledTime || 'Time TBD'}
                        </p>
                      </div>
                    ) : (
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                      >
                        Pending Schedule
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div 
                  className="p-4 border-t flex flex-wrap gap-3"
                  style={{ borderColor: theme.colors.border }}
                >
                  <button
                    onClick={() => handleMarkComplete(session._id)}
                    className="flex-1 py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    <FaCheckCircle /> Mark Complete
                  </button>
                  <button
                    onClick={() => handleCancelSession(session._id)}
                    className="flex-1 py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#ef4444' }}
                  >
                    <FaTimesCircle /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TrainerLayout>
  );
};

export default TrainerSchedulePage;
