import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TrainerLayout from '../../components/Trainer/TrainerLayout';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaBell, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarAlt, 
  FaUser,
  FaClock,
  FaEnvelope
} from 'react-icons/fa';

const TrainerNotificationsPage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const trainerId = user?._id || user?.id;

  useEffect(() => {
    if (trainerId) {
      fetchSessionRequests();
      fetchNotifications();
    }
  }, [trainerId]);

  const fetchSessionRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/session-requests/trainer/${trainerId}`);
      setSessionRequests(response.data);
    } catch (error) {
      console.error('Error fetching session requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${trainerId}`);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/session-requests/${requestId}`, {
        status: 'accepted',
        trainerResponse: 'Request accepted! I will schedule your session soon.'
      });
      fetchSessionRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/session-requests/${requestId}`, {
        status: 'rejected',
        trainerResponse: 'Sorry, I am not available at this time.'
      });
      fetchSessionRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleModal || !scheduleDate || !scheduleTime) return;
    
    try {
      await axios.put(`http://localhost:5000/api/session-requests/${scheduleModal._id}`, {
        status: 'scheduled',
        scheduledDate: scheduleDate,
        scheduledTime: scheduleTime,
        trainerResponse: `Session scheduled for ${scheduleDate} at ${scheduleTime}`
      });
      setScheduleModal(null);
      setScheduleDate('');
      setScheduleTime('');
      fetchSessionRequests();
    } catch (error) {
      console.error('Error scheduling session:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'Pending' },
      accepted: { bg: '#dcfce7', color: '#16a34a', text: 'Accepted' },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Rejected' },
      scheduled: { bg: '#dbeafe', color: '#2563eb', text: 'Scheduled' },
      completed: { bg: '#e0e7ff', color: '#4f46e5', text: 'Completed' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: style.bg, color: style.color }}>
        {style.text}
      </span>
    );
  };

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
              <FaBell style={{ color: theme.colors.primary }} />
              Notifications & Requests
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Manage session requests from clients
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="rounded-2xl p-2 mb-6 border flex gap-2 flex-wrap"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-all`}
            style={{ 
              backgroundColor: activeTab === 'requests' ? theme.colors.primary : 'transparent',
              color: activeTab === 'requests' ? 'white' : theme.colors.textSecondary
            }}
          >
            Session Requests ({sessionRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all`}
            style={{ 
              backgroundColor: activeTab === 'all' ? theme.colors.primary : 'transparent',
              color: activeTab === 'all' ? 'white' : theme.colors.textSecondary
            }}
          >
            All Requests ({sessionRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg font-medium transition-all`}
            style={{ 
              backgroundColor: activeTab === 'notifications' ? theme.colors.primary : 'transparent',
              color: activeTab === 'notifications' ? 'white' : theme.colors.textSecondary
            }}
          >
            Notifications ({notifications.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            />
          </div>
        ) : activeTab === 'notifications' ? (
          /* Notifications List */
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div 
                className="rounded-2xl p-12 text-center border"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
              >
                <FaBell className="text-4xl mx-auto mb-4" style={{ color: theme.colors.textMuted }} />
                <p style={{ color: theme.colors.textSecondary }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-4 border flex items-start gap-4"
                  style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
                >
                  <FaBell style={{ color: theme.colors.primary }} className="mt-1" />
                  <p style={{ color: theme.colors.text }}>{notification}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Session Requests */
          <div className="space-y-4">
            {(activeTab === 'requests' 
              ? sessionRequests.filter(r => r.status === 'pending')
              : sessionRequests
            ).length === 0 ? (
              <div 
                className="rounded-2xl p-12 text-center border"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
              >
                <FaCalendarAlt className="text-4xl mx-auto mb-4" style={{ color: theme.colors.textMuted }} />
                <p style={{ color: theme.colors.textSecondary }}>
                  {activeTab === 'requests' ? 'No pending session requests' : 'No session requests yet'}
                </p>
              </div>
            ) : (
              (activeTab === 'requests' 
                ? sessionRequests.filter(r => r.status === 'pending')
                : sessionRequests
              ).map((request) => (
                <div 
                  key={request._id}
                  className="rounded-2xl border overflow-hidden"
                  style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
                >
                  {/* Request Header */}
                  <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: theme.colors.primary + '20' }}
                      >
                        {request.customer?.profilePicture ? (
                          <img 
                            src={`http://localhost:5000${request.customer.profilePicture}`}
                            alt={request.customer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser style={{ color: theme.colors.primary }} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: theme.colors.text }}>
                          {request.customer?.name || 'Customer'}
                        </h3>
                        <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                          <FaEnvelope className="text-xs" />
                          {request.customer?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}
                      <span className="text-sm" style={{ color: theme.colors.textMuted }}>
                        <FaClock className="inline mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Request Message */}
                  {request.message && (
                    <div className="px-4 pb-2">
                      <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc', color: theme.colors.text }}>
                        "{request.message}"
                      </p>
                    </div>
                  )}

                  {/* Scheduled Info */}
                  {request.status === 'scheduled' && (
                    <div className="px-4 pb-2">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()} at {request.scheduledTime}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.colors.border }}>
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="flex-1 py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        <FaCheckCircle /> Accept
                      </button>
                      <button
                        onClick={() => setScheduleModal(request)}
                        className="flex-1 py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <FaCalendarAlt /> Schedule
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex-1 py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ backgroundColor: '#ef4444' }}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="p-4 border-t" style={{ borderColor: theme.colors.border }}>
                      <button
                        onClick={() => setScheduleModal(request)}
                        className="w-full py-2 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
                      >
                        <FaCalendarAlt /> Schedule Session
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Schedule Modal */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="w-full max-w-md rounded-2xl shadow-2xl p-6"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Schedule Session with {scheduleModal.customer?.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full p-3 rounded-xl border"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-3 rounded-xl border"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setScheduleModal(null)}
                  className="flex-1 py-3 rounded-xl font-medium border"
                  style={{ borderColor: theme.colors.border, color: theme.colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedule}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TrainerLayout>
  );
};

export default TrainerNotificationsPage;
