import React, { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import axios from "axios";
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
  }, []);

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
      if (sendingTo === "all") {
        // Send to all users and trainers
        const allRecipients = [...users, ...trainers];
        for (const recipient of allRecipients) {
          await axios.post(`http://localhost:5000/api/notifications/${recipient._id}`, { message });
        }
        setSuccess(`Notification sent to ${allRecipients.length} recipients!`);
      } else if (sendingTo === "users") {
        for (const user of users) {
          await axios.post(`http://localhost:5000/api/notifications/${user._id}`, { message });
        }
        setSuccess(`Notification sent to ${users.length} users!`);
      } else if (sendingTo === "trainers") {
        for (const trainer of trainers) {
          await axios.post(`http://localhost:5000/api/notifications/${trainer._id}`, { message });
        }
        setSuccess(`Notification sent to ${trainers.length} trainers!`);
      } else if (sendingTo === "individual" && selectedUserId) {
        await axios.post(`http://localhost:5000/api/notifications/${selectedUserId}`, { message });
        setSuccess("Notification sent successfully!");
      }

      // Add to local notifications list
      setNotifications([
        {
          id: Date.now(),
          message,
          sentTo: sendingTo,
          time: new Date().toLocaleString(),
          status: "sent"
        },
        ...notifications
      ]);

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
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaBell className="text-indigo-600" />
            Notification Center
          </h2>
          <p className="text-slate-500 mt-1">Send notifications to users and trainers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Send New Notification</h3>

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
                <label className="block text-slate-700 font-medium mb-2">Send To</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "all", label: "All Members", icon: FaUsers },
                    { value: "users", label: "Customers Only", icon: FaUsers },
                    { value: "trainers", label: "Trainers Only", icon: FaUserTie },
                    { value: "individual", label: "Individual", icon: FaBell }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setSendingTo(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          sendingTo === option.value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 hover:border-indigo-300"
                        }`}
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
                  <label className="block text-slate-700 font-medium mb-2">Select Recipient</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                <label className="block text-slate-700 font-medium mb-2">Notification Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your notification message here..."
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Quick Templates */}
              <div className="mb-6">
                <label className="block text-slate-700 font-medium mb-2">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTemplates.map((template, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setMessage(template)}
                      className="px-3 py-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded-lg text-sm transition-all"
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Notifications</h3>
            
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FaBell className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No notifications sent yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-slate-700 text-sm">{notif.message}</p>
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              <p className="text-slate-500 text-sm">Total Customers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaUserTie className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{trainers.length}</p>
              <p className="text-slate-500 text-sm">Total Trainers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaBell className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
              <p className="text-slate-500 text-sm">Sent Today</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsComponent;
