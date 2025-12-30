import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { 
  FaTags, 
  FaPlus, 
  FaTrash, 
  FaDollarSign,
  FaCalendarAlt,
  FaPercent
} from 'react-icons/fa';

const SubscriptionComponent = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    duration: 'monthly',
    price: '',
    discount: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/Plan/subscriptions');
      setSubscriptions(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch subscriptions' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (!newSubscription.name || !newSubscription.price) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/Plan/subscriptions', {
        ...newSubscription,
        price: Number(newSubscription.price),
        discount: Number(newSubscription.discount) || 0
      });
      setSubscriptions([...subscriptions, response.data]);
      setNewSubscription({ name: '', duration: 'monthly', price: '', discount: '' });
      setShowForm(false);
      setMessage({ type: 'success', text: 'Subscription plan added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add subscription' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/Plan/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
      setMessage({ type: 'success', text: 'Subscription deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete subscription' });
    }
  };

  const getDurationBadge = (duration) => {
    const styles = {
      monthly: 'bg-blue-100 text-blue-700',
      quarterly: 'bg-purple-100 text-purple-700',
      yearly: 'bg-green-100 text-green-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[duration] || styles.monthly}`}>
        {duration?.charAt(0).toUpperCase() + duration?.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FaTags className="text-indigo-600" />
              Subscription Plans
            </h2>
            <p className="text-slate-500 mt-1">Manage membership subscription plans</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <FaPlus />
            Add New Plan
          </button>
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

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Subscription Plan</h3>
            <form onSubmit={handleAddSubscription} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g., Premium Plan"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                <select
                  value={newSubscription.duration}
                  onChange={(e) => setNewSubscription({ ...newSubscription, duration: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({ ...newSubscription, price: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newSubscription.discount}
                  onChange={(e) => setNewSubscription({ ...newSubscription, discount: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                >
                  Create Plan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subscription Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 shadow-sm border border-slate-100">
            <FaTags className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No subscription plans found</p>
            <p className="text-sm mt-2">Click "Add New Plan" to create your first subscription</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{sub.name}</h3>
                    {getDurationBadge(sub.duration)}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${sub.price}</span>
                    <span className="text-indigo-200">/{sub.duration}</span>
                  </div>
                  {sub.discount > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-emerald-300">
                      <FaPercent className="text-sm" />
                      <span className="text-sm font-medium">{sub.discount}% discount applied</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <FaCalendarAlt />
                    <span>{sub.duration === 'monthly' ? '30 days' : sub.duration === 'quarterly' ? '90 days' : '365 days'}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionComponent;
