import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { useTheme } from '../../context/ThemeContext';
import { FaBell, FaTrash, FaCheckCircle } from 'react-icons/fa';

const CustomerNotificationsPage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user ID (handle both _id and id formats)
  const userId = user?._id || user?.id;

  useEffect(() => {
    console.log('User object:', user);
    console.log('User ID:', userId);
    fetchNotifications();
  }, [user, userId]);

  const fetchNotifications = async () => {
    if (!userId) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }
    try {
      console.log('Fetching notifications for user:', userId);
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      console.log('Notifications response:', response.data);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: theme.colors.text }}
          >
            <FaBell style={{ color: theme.colors.primary }} />
            My Notifications
          </h2>
          <p 
            className="mt-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Stay updated with important announcements
          </p>
        </div>

        {/* Notifications List */}
        <div 
          className="rounded-2xl p-6 shadow-sm border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
              />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="mx-auto text-6xl mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
              <p style={{ color: theme.colors.textSecondary }}>No notifications yet</p>
              <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                You'll see important updates and announcements here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl flex items-start gap-4 transition-all hover:scale-[1.01]"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` 
                    }}
                  >
                    <FaBell className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: theme.colors.text }}>{notification}</p>
                  </div>
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </CustomerLayout>
  );
};

export default CustomerNotificationsPage;
