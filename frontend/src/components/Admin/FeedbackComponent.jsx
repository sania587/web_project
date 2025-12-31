import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useTheme } from "../../context/ThemeContext";
import { 
  FaComments, 
  FaStar, 
  FaSearch, 
  FaTrash, 
  FaUser, 
  FaUserTie,
  FaFilter
} from 'react-icons/fa';

const FeedbackComponent = () => {
  const { theme, isDark } = useTheme();
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('trainer');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/feedback');
      setFeedbackList(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch feedback' });
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchFeedback();
      return;
    }
    try {
      setLoading(true);
      const params = { searchType };
      if (searchType === 'trainer') {
        params.trainerUsername = searchQuery;
      } else {
        params.customerUsername = searchQuery;
      }

      const response = await axios.get('http://localhost:5000/api/feedback/search', { params });
      setFeedbackList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error searching feedback' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      setFeedbackList(feedbackList.filter(feedback => feedback._id !== id));
      setMessage({ type: 'success', text: 'Feedback deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting feedback' });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-amber-400' : 'text-slate-200'} />
    ));
  };

  const averageRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackList.length).toFixed(1)
    : 0;

  // Modal State
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const FeedbackModal = ({ feedback, onClose }) => {
    if (!feedback) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div 
          className="w-full max-w-lg rounded-2xl shadow-2xl transform transition-all"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <div className="p-6 border-b" style={{ borderColor: theme.colors.border }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: theme.colors.text }}>Feedback Details</h3>
              <button 
                onClick={onClose}
                className="text-2xl hover:opacity-70 transition-opacity"
                style={{ color: theme.colors.textSecondary }}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex text-sm" style={{ color: theme.colors.textSecondary }}>
              <div className="w-1/2">
                <span className="block opacity-70 mb-1">Trainer</span>
                <span className="font-medium text-base" style={{ color: theme.colors.text }}>{feedback.trainerId?.name || 'N/A'}</span>
              </div>
              <div className="w-1/2">
                <span className="block opacity-70 mb-1">Customer</span>
                <span className="font-medium text-base" style={{ color: theme.colors.text }}>{feedback.customerId?.name || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="block text-sm opacity-70 mb-2" style={{ color: theme.colors.textSecondary }}>Rating</span>
              <div className="flex gap-1 text-lg">
                {renderStars(feedback.rating)}
                <span className="ml-2 font-medium text-base" style={{ color: theme.colors.text }}>{feedback.rating}/5</span>
              </div>
            </div>
            <div>
              <span className="block text-sm opacity-70 mb-2" style={{ color: theme.colors.textSecondary }}>Review Message</span>
              <div 
                className="p-4 rounded-xl text-base leading-relaxed"
                style={{ backgroundColor: isDark ? theme.colors.background : '#f1f5f9', color: theme.colors.text }}
              >
                {feedback.message}
              </div>
            </div>
            <div className="text-xs mt-4 opacity-50 text-right" style={{ color: theme.colors.textSecondary }}>
               ID: {feedback._id}
            </div>
          </div>
          <div className="p-6 pt-0 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-medium transition-colors"
                style={{ backgroundColor: theme.colors.primary, color: '#fff' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3 transition-colors"
            style={{ color: theme.colors.text }}
          >
            <FaComments style={{ color: theme.colors.primary }} />
            Manage Feedback
          </h2>
          <p 
            className="mt-1 transition-colors"
            style={{ color: theme.colors.textSecondary }}
          >
            View and manage customer feedback and ratings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FaComments className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {feedbackList.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Feedback
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
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaStar className="text-amber-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {averageRating}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Average Rating
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
              <FaUserTie className="text-green-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {[...new Set(feedbackList.map(f => f.trainerId?._id))].length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Trainers Reviewed
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search Bar */}
        <div 
          className="rounded-2xl p-6 shadow-sm border mb-6"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={searchType === 'trainer' ? 'Search by trainer name...' : 'Search by customer name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              >
                <option value="trainer">By Trainer</option>
                <option value="customer">By Customer</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-3 text-white rounded-xl transition-all hover:shadow-lg flex items-center gap-2"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <FaFilter />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div 
          className="rounded-2xl shadow-sm border overflow-hidden"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div 
                className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
                style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
              ></div>
              Loading feedback...
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FaComments className="mx-auto text-4xl mb-2 opacity-50" />
              <p>No feedback found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead 
                  className="border-b"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border
                  }}
                >
                  <tr>
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Trainer
                    </th>
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Customer
                    </th>
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Rating
                    </th>
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Message
                    </th>
                    <th 
                      className="py-4 px-6 text-center text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: theme.colors.border }}>
                  {feedbackList.map((feedback) => (
                    <tr 
                      key={feedback._id} 
                      className="transition-colors hover:bg-opacity-50"
                      style={{ 
                        borderBottomColor: theme.colors.border
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? theme.colors.surfaceHover : '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaUserTie className="text-purple-600" />
                          </div>
                          <span 
                            className="font-medium"
                            style={{ color: theme.colors.text }}
                          >
                            {feedback.trainerId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <span 
                            className="font-medium"
                            style={{ color: theme.colors.text }}
                          >
                            {feedback.customerId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                          <span 
                            className="ml-2 font-medium"
                            style={{ color: theme.colors.textSecondary }}
                          >
                            {feedback.rating}/5
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p 
                          className="max-w-xs truncate"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {feedback.message}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedFeedback(feedback)}
                            className="p-2 border rounded-lg hover:bg-opacity-80 transition-all font-medium text-xs px-3"
                            style={{ 
                              borderColor: theme.colors.border,
                              color: theme.colors.primary, 
                              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(feedback._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal Render */}
      {selectedFeedback && (
        <FeedbackModal 
          feedback={selectedFeedback} 
          onClose={() => setSelectedFeedback(null)} 
        />
      )}
    </AdminLayout>
  );
};

export default FeedbackComponent;
