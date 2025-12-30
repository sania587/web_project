import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
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
      const response = await axios.get('http://localhost:5000/api/feedback/search', {
        params: { [searchType]: searchQuery },
      });
      setFeedbackList(response.data);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaComments className="text-indigo-600" />
            Manage Feedback
          </h2>
          <p className="text-slate-500 mt-1">View and manage customer feedback and ratings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FaComments className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{feedbackList.length}</p>
              <p className="text-slate-500 text-sm">Total Feedback</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaStar className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{averageRating}</p>
              <p className="text-slate-500 text-sm">Average Rating</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaUserTie className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {[...new Set(feedbackList.map(f => f.trainerId?._id))].length}
              </p>
              <p className="text-slate-500 text-sm">Trainers Reviewed</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={searchType === 'trainer' ? 'Search by trainer name...' : 'Search by customer name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="trainer">By Trainer</option>
                <option value="customer">By Customer</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <FaFilter />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
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
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Trainer</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Customer</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Rating</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Message</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feedbackList.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaUserTie className="text-purple-600" />
                          </div>
                          <span className="font-medium text-slate-700">
                            {feedback.trainerId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-700">
                            {feedback.customerId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                          <span className="ml-2 text-slate-600 font-medium">{feedback.rating}/5</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-600 max-w-xs truncate">{feedback.message}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(feedback._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FeedbackComponent;
