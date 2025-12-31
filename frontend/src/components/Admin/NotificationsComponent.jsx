import React, { useState, useEffect } from "react";
import AdminLayout from './AdminLayout';
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { 
  FaBell, 
  FaPaperPlane, 
  FaUsers, 
  FaUserTie, 
  FaTrash,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

const NotificationsComponent = () => {
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchTrainers();
    fetchNotificationHistory();
  }, []);

  const fetchNotificationHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications/history/all");
      setNotifications(response.data.map(n => ({
        id: n._id,
        message: n.message,
        sentTo: n.sentTo,
        recipientName: n.recipientName,
        time: new Date(n.createdAt).toLocaleString(),
        status: n.status
      })));
    } catch (err) {
      console.error("Error fetching notification history:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/manageusers");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/managetrainers");
      setTrainers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a notification message");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let recipientCount = 0;
      let recipientName = null;
      let recipientModel = null;
      let recipientId = null;

      if (sendingTo === "all") {
        // Send to all users and trainers
        const allRecipients = [...users, ...trainers];
        for (const recipient of allRecipients) {
          await axios.post(`http://localhost:5000/api/notifications/${recipient._id}`, { message });
        }
        recipientCount = allRecipients.length;
        setSuccess(`Notification sent to ${recipientCount} recipients!`);
      } else if (sendingTo === "users") {
        for (const user of users) {
          await axios.post(`http://localhost:5000/api/notifications/${user._id}`, { message });
        }
        recipientCount = users.length;
        setSuccess(`Notification sent to ${recipientCount} users!`);
      } else if (sendingTo === "trainers") {
        for (const trainer of trainers) {
          await axios.post(`http://localhost:5000/api/notifications/${trainer._id}`, { message });
        }
        recipientCount = trainers.length;
        setSuccess(`Notification sent to ${recipientCount} trainers!`);
      } else if (sendingTo === "individual" && selectedUserId) {
        await axios.post(`http://localhost:5000/api/notifications/${selectedUserId}`, { message });
        // Find the recipient details
        const user = users.find(u => u._id === selectedUserId);
        const trainer = trainers.find(t => t._id === selectedUserId);
        recipientCount = 1;
        recipientName = user?.name || trainer?.name || 'Unknown';
        recipientModel = user ? 'User' : 'Trainer';
        recipientId = selectedUserId;
        setSuccess("Notification sent successfully!");
      }

      // Save notification history to database
      await axios.post("http://localhost:5000/api/notifications/history/save", {
        message,
        sentTo: sendingTo,
        recipientCount,
        recipientId,
        recipientName,
        recipientModel
      });

      // Refresh notification history from database
      await fetchNotificationHistory();

      setMessage("");
    } catch (err) {
      setError("Failed to send notification. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const predefinedTemplates = [
    "🎉 New workout plans available! Check them out today.",
    "⏰ Reminder: Your subscription expires soon. Renew now!",
    "💪 New trainer joined our team. Book a session!",
    "🏋️ Gym maintenance scheduled for this weekend.",
    "🎁 Special discount on annual memberships - 20% OFF!"
  ];

  return (
    <AdminLayout>


      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3 transition-colors"
            style={{ color: theme.colors.text }}
          >
            <FaBell style={{ color: theme.colors.primary }} />
            Notification Center
          </h2>
          <p 
            className="mt-1 transition-colors"
            style={{ color: theme.colors.textSecondary }}
          >
            Send notifications to users and trainers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div 
            className="lg:col-span-2 rounded-2xl p-6 shadow-sm border transition-all"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-6"
              style={{ color: theme.colors.text }}
            >
              Send New Notification
            </h3>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSendNotification}>
              {/* Recipient Selection */}
              <div className="mb-6">
                <label 
                  className="block font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Send To
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "all", label: "All Members", icon: FaUsers },
                    { value: "users", label: "Customers Only", icon: FaUsers },
                    { value: "trainers", label: "Trainers Only", icon: FaUserTie },
                    { value: "individual", label: "Individual", icon: FaBell }
                  ].map((option) => {
                    const Icon = option.icon;
                    const isSelected = sendingTo === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setSendingTo(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2`}
                        style={{
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                          backgroundColor: isSelected ? `${theme.colors.primary}15` : 'transparent',
                          color: isSelected ? theme.colors.primary : theme.colors.textSecondary
                        }}
                      >
                        <Icon className="text-xl" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Selection */}
              {sendingTo === "individual" && (
                <div className="mb-6">
                  <label 
                    className="block font-medium mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    Select Recipient
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      outlineColor: theme.colors.primary
                    }}
                  >
                    <option value="">Select a user or trainer...</option>
                    <optgroup label="Customers">
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Trainers">
                      {trainers.map((trainer) => (
                        <option key={trainer._id} value={trainer._id}>
                          {trainer.name} ({trainer.email})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Message Input */}
              <div className="mb-6">
                <label 
                  className="block font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Notification Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your notification message here..."
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:outline-none resize-none transition-colors"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    outlineColor: theme.colors.primary
                  }}
                />
              </div>

              {/* Quick Templates */}
              <div className="mb-6">
                <label 
                  className="block font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTemplates.map((template, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setMessage(template)}
                      className="px-3 py-2 rounded-lg text-sm transition-all border"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f1f5f9',
                        color: theme.colors.textSecondary,
                        borderColor: theme.colors.border
                      }}
                    >
                      {template.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                }}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Notifications */}
          <div 
            className="rounded-2xl p-6 shadow-sm border transition-all"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Recent Notifications
            </h3>
            
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FaBell className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No notifications sent yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className="p-4 rounded-xl border transition-colors"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border
                    }}
                  >
                    <p 
                      className="text-sm"
                      style={{ color: theme.colors.text }}
                    >
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FaClock />
                        {notif.time}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {notif.sentTo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {users.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Customers
              </p>
            </div>
          </div>
          <div 
            className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaUserTie className="text-purple-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {trainers.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Trainers
              </p>
            </div>
          </div>
          <div 
            className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaBell className="text-green-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {notifications.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Sent Today
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default NotificationsComponent;
