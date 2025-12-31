import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useTheme } from "../../context/ThemeContext";
import { 
  FaTags, 
  FaPlus, 
  FaTrash, 
  FaDollarSign,
  FaCalendarAlt,
  FaPercent,
  FaList,
  FaCheck,
  FaEdit,
  FaTimes
} from 'react-icons/fa';

// Predefined plan names (can be extended)
const DEFAULT_PLAN_NAMES = [
  'Basic Plan',
  'Standard Plan',
  'Premium Plan',
  'Pro Plan',
  'Enterprise Plan'
];

// Predefined features (can be extended)
const DEFAULT_FEATURES = [
  'Personal Trainer',
  'Diet Plans',
  'Workout Videos',
  '24/7 Support',
  'Progress Tracking',
  'Nutrition Guide',
  'Group Classes',
  'Home Workouts',
  'Gym Access',
  'One-on-One Sessions',
  'Custom Meal Plans',
  'Priority Support'
];

const SubscriptionComponent = () => {
  const { theme, isDark } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubscription, setEditSubscription] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Predefined lists
  const [planNames, setPlanNames] = useState(DEFAULT_PLAN_NAMES);
  const [availableFeatures, setAvailableFeatures] = useState(DEFAULT_FEATURES);
  
  // New plan name input
  const [showAddPlanName, setShowAddPlanName] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  
  // New feature input
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  
  // New subscription state (features as array of selected features)
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    duration: 'monthly',
    price: '',
    discount: '',
    selectedFeatures: [] // Array of selected feature names
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

  // Toggle feature selection
  const toggleFeature = (feature, isEdit = false) => {
    if (isEdit && editSubscription) {
      const selected = editSubscription.selectedFeatures || [];
      if (selected.includes(feature)) {
        setEditSubscription({
          ...editSubscription,
          selectedFeatures: selected.filter(f => f !== feature)
        });
      } else {
        setEditSubscription({
          ...editSubscription,
          selectedFeatures: [...selected, feature]
        });
      }
    } else {
      const selected = newSubscription.selectedFeatures || [];
      if (selected.includes(feature)) {
        setNewSubscription({
          ...newSubscription,
          selectedFeatures: selected.filter(f => f !== feature)
        });
      } else {
        setNewSubscription({
          ...newSubscription,
          selectedFeatures: [...selected, feature]
        });
      }
    }
  };

  // Add new plan name to dropdown
  const handleAddPlanName = () => {
    if (newPlanName.trim() && !planNames.includes(newPlanName.trim())) {
      setPlanNames([...planNames, newPlanName.trim()]);
      setNewSubscription({ ...newSubscription, name: newPlanName.trim() });
      setNewPlanName('');
      setShowAddPlanName(false);
    }
  };

  // Add new feature to the list
  const handleAddFeature = () => {
    if (newFeature.trim() && !availableFeatures.includes(newFeature.trim())) {
      setAvailableFeatures([...availableFeatures, newFeature.trim()]);
      setNewFeature('');
      setShowAddFeature(false);
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
        discount: Number(newSubscription.discount) || 0,
        features: newSubscription.selectedFeatures // Send selected features array
      });
      setSubscriptions([...subscriptions, response.data]);
      setNewSubscription({ name: '', duration: 'monthly', price: '', discount: '', selectedFeatures: [] });
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

  const handleEdit = (sub) => {
    setEditSubscription({
      ...sub,
      selectedFeatures: sub.features || [] // Use array directly
    });
    setShowEditModal(true);
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/Plan/subscriptions/${editSubscription._id}`, {
        name: editSubscription.name,
        duration: editSubscription.duration,
        price: Number(editSubscription.price),
        discount: Number(editSubscription.discount) || 0,
        features: editSubscription.selectedFeatures // Send array directly
      });
      setSubscriptions(subscriptions.map(sub => 
        sub._id === editSubscription._id ? response.data : sub
      ));
      setShowEditModal(false);
      setEditSubscription(null);
      setMessage({ type: 'success', text: 'Subscription updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update subscription' });
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
    <AdminLayout>


      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 
              className="text-3xl font-bold flex items-center gap-3 transition-colors"
              style={{ color: theme.colors.text }}
            >
              <FaTags style={{ color: theme.colors.primary }} />
              Subscription Plans
            </h2>
            <p 
              className="mt-1 transition-colors"
              style={{ color: theme.colors.textSecondary }}
            >
              Manage membership subscription plans
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            <FaPlus />
            {showForm ? 'Cancel' : 'Add New Plan'}
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
          <div 
            className="rounded-2xl p-6 shadow-sm border mb-6 transition-all"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Create New Subscription Plan
            </h3>
            <form onSubmit={handleAddSubscription} className="space-y-4">
              {/* Top row - Plan Name, Duration, Price, Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Plan Name Dropdown */}
                <div className={showAddPlanName ? 'md:col-span-2' : ''}>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Plan Name
                  </label>
                  {!showAddPlanName ? (
                    <div className="flex gap-2">
                      <select
                        value={newSubscription.name}
                        onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                        className="flex-1 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                        style={{ 
                          backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                          borderColor: theme.colors.border,
                          color: theme.colors.text
                        }}
                      >
                        <option value="">Select Plan</option>
                        {planNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowAddPlanName(true)}
                        className="p-3 rounded-xl transition-all flex-shrink-0"
                        style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                        title="Add New Plan Name"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter new plan name"
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        className="flex-1 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none border"
                        style={{ 
                          backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                          borderColor: theme.colors.border,
                          color: theme.colors.text
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddPlanName}
                        className="px-4 py-3 rounded-xl bg-green-500 text-white flex-shrink-0"
                        title="Add"
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddPlanName(false); setNewPlanName(''); }}
                        className="px-4 py-3 rounded-xl bg-red-500 text-white flex-shrink-0"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Duration */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Duration
                  </label>
                  <select
                    value={newSubscription.duration}
                    onChange={(e) => setNewSubscription({ ...newSubscription, duration: e.target.value })}
                    className="w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                {/* Price */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newSubscription.price}
                    onChange={(e) => setNewSubscription({ ...newSubscription, price: e.target.value })}
                    className="w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
                
                {/* Discount */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newSubscription.discount}
                    onChange={(e) => setNewSubscription({ ...newSubscription, discount: e.target.value })}
                    className="w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
              </div>
              
              {/* Features Checkbox Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label 
                    className="text-sm font-medium flex items-center gap-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <FaList /> Select Features
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddFeature(!showAddFeature)}
                    className="text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                  >
                    <FaPlus /> Add Feature
                  </button>
                </div>
                
                {/* Add New Feature Input */}
                {showAddFeature && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Enter new feature name"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 p-2 rounded-lg text-sm border focus:outline-none"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddFeature(false); setNewFeature(''); }}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {/* Checkbox Grid - 4 columns, max 3 rows */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableFeatures.slice(0, 12).map((feature) => {
                    const isSelected = newSubscription.selectedFeatures?.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                          isSelected ? 'ring-2' : ''
                        }`}
                        style={{ 
                          backgroundColor: isSelected 
                            ? (isDark ? '#22c55e20' : '#dcfce7')
                            : (isDark ? theme.colors.surfaceHover : '#f1f5f9'),
                          color: isSelected ? '#16a34a' : theme.colors.text,
                          ringColor: isSelected ? '#22c55e' : 'transparent'
                        }}
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: isSelected ? '#22c55e' : (isDark ? '#374151' : '#e2e8f0'),
                            color: isSelected ? 'white' : theme.colors.textMuted
                          }}
                        >
                          {isSelected ? <FaCheck /> : <FaTimes />}
                        </span>
                        <span className="truncate">{feature}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs" style={{ color: theme.colors.textMuted }}>
                  {newSubscription.selectedFeatures?.length || 0} features selected
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Create Plan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all border"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#e2e8f0',
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }}
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
            <div 
              className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            ></div>
            Loading subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div 
            className="rounded-2xl p-12 text-center shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textSecondary
            }}
          >
            <FaTags className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No subscription plans found</p>
            <p className="text-sm mt-2">Click "Add New Plan" to create your first subscription</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div 
                key={sub._id} 
                className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <div 
                  className="p-6 text-white"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{sub.name}</h3>
                    {getDurationBadge(sub.duration)}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rs.{sub.price}</span>
                    <span className="opacity-80">/{sub.duration}</span>
                  </div>
                  {sub.discount > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-emerald-300">
                      <FaPercent className="text-sm" />
                      <span className="text-sm font-medium">{sub.discount}% discount applied</span>
                    </div>
                  )}
                </div>
                <div 
                  className="p-4"
                  style={{ backgroundColor: isDark ? theme.colors.surface : 'white' }}
                >
                  {/* Features List */}
                  {sub.features && sub.features.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-2" style={{ color: theme.colors.textSecondary }}>Features:</p>
                      <ul className="space-y-1">
                        {sub.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs" style={{ color: theme.colors.text }}>
                            <FaCheck className="text-green-500" style={{ fontSize: '10px' }} />
                            {feature}
                          </li>
                        ))}
                        {sub.features.length > 3 && (
                          <li className="text-xs" style={{ color: theme.colors.textMuted }}>
                            +{sub.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
                      <FaCalendarAlt />
                      <span>{sub.duration === 'monthly' ? '30 days' : sub.duration === 'quarterly' ? '90 days' : '365 days'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                        title="Edit Plan"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        title="Delete Plan"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {showEditModal && editSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
            style={{ backgroundColor: theme.colors.surface, maxHeight: '90vh' }}
          >
            <div 
              className="px-6 py-4 text-white sticky top-0 z-10"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
            >
              <h3 className="text-xl font-bold">Edit Subscription Plan</h3>
              <p className="text-sm opacity-80">Update plan details and features</p>
            </div>
            
            <form onSubmit={handleUpdateSubscription} className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                  Plan Name
                </label>
                <select
                  value={editSubscription.name}
                  onChange={(e) => setEditSubscription({ ...editSubscription, name: e.target.value })}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                >
                  <option value="">Select Plan</option>
                  {planNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  {/* Include current name if not in list */}
                  {!planNames.includes(editSubscription.name) && editSubscription.name && (
                    <option value={editSubscription.name}>{editSubscription.name}</option>
                  )}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Duration
                  </label>
                  <select
                    value={editSubscription.duration}
                    onChange={(e) => setEditSubscription({ ...editSubscription, duration: e.target.value })}
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editSubscription.price}
                    onChange={(e) => setEditSubscription({ ...editSubscription, price: e.target.value })}
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={editSubscription.discount}
                  onChange={(e) => setEditSubscription({ ...editSubscription, discount: e.target.value })}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaList /> Select Features
                </label>
                {/* Checkbox Grid for Edit */}
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableFeatures.map((feature) => {
                    const isSelected = editSubscription.selectedFeatures?.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature, true)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                          isSelected ? 'ring-2' : ''
                        }`}
                        style={{ 
                          backgroundColor: isSelected 
                            ? (isDark ? '#22c55e20' : '#dcfce7')
                            : (isDark ? theme.colors.surfaceHover : '#f1f5f9'),
                          color: isSelected ? '#16a34a' : theme.colors.text,
                          ringColor: isSelected ? '#22c55e' : 'transparent'
                        }}
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: isSelected ? '#22c55e' : (isDark ? '#374151' : '#e2e8f0'),
                            color: isSelected ? 'white' : theme.colors.textMuted
                          }}
                        >
                          {isSelected ? <FaCheck /> : <FaTimes />}
                        </span>
                        <span className="truncate text-left">{feature}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs" style={{ color: theme.colors.textMuted }}>
                  {editSubscription.selectedFeatures?.length || 0} features selected
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditSubscription(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all border"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#e2e8f0',
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SubscriptionComponent;

