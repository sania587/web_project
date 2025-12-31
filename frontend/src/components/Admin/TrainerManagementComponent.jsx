import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useTheme } from "../../context/ThemeContext";
import { 
  FaUserTie, 
  FaSearch, 
  FaTrash, 
  FaBan, 
  FaEnvelope,
  FaStar,
  FaDumbbell,
  FaCheckCircle,
  FaUnlock
} from 'react-icons/fa';
import ThemedDialog from '../common/ThemedDialog';

const TrainerManagementComponent = () => {
  const { theme, isDark } = useTheme();
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Dialog states
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/managetrainers');
      setTrainers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching trainers', err);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchTrainers();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/managetrainers/search?name=${search}`);
      setTrainers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error searching trainers', err);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = (id) => {
    setDialog({
      isOpen: true,
      type: 'error',
      title: 'Delete Trainer',
      message: 'Are you sure you want to delete this trainer? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/managetrainers/${id}`);
          setTrainers(trainers.filter(trainer => trainer._id !== id));
          setMessage({ type: 'success', text: 'Trainer deleted successfully' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Error deleting trainer' });
        }
      }
    });
  };

  const handleToggleBlock = (id, currentlyBlocked) => {
    const action = currentlyBlocked ? 'unblock' : 'block';
    setDialog({
      isOpen: true,
      type: currentlyBlocked ? 'info' : 'warning',
      title: currentlyBlocked ? 'Unblock Trainer' : 'Block Trainer',
      message: `Are you sure you want to ${action} this trainer?${!currentlyBlocked ? ' They will not be able to login until unblocked.' : ''}`,
      onConfirm: async () => {
        try {
          const response = await axios.put(`http://localhost:5000/api/managetrainers/block/${id}`);
          setTrainers(trainers.map(t => t._id === id ? { ...t, blocked: response.data.blocked } : t));
          setMessage({ type: 'success', text: `Trainer ${action}ed successfully` });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: `Error ${action}ing trainer` });
        }
      }
    });
  };

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.colors.background }}
    >


      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3 transition-colors"
            style={{ color: theme.colors.text }}
          >
            <FaUserTie style={{ color: theme.colors.primary }} />
            Manage Trainers
          </h2>
          <p 
            className="mt-1 transition-colors"
            style={{ color: theme.colors.textSecondary }}
          >
            View and manage all registered trainers
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
              <FaCheckCircle className="text-green-600 text-xl" />
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
                Active Trainers
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
                4.8
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Avg Rating
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

        {/* Search */}
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
                placeholder="Search trainers by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 text-white rounded-xl transition-all hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div 
              className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            ></div>
            Loading trainers...
          </div>
        ) : trainers.length === 0 ? (
          <div 
            className="rounded-2xl p-12 text-center text-slate-400 shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <FaUserTie className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div 
                key={trainer._id} 
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
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                      {trainer.name?.charAt(0).toUpperCase() || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{trainer.name}</h3>
                      <p className="opacity-80 text-sm">{trainer.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                    <FaDumbbell style={{ color: theme.colors.primary }} />
                    <span className="text-sm">
                      {trainer.profileDetails?.specializations?.join(', ') || 'General Fitness'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                    <FaStar className="text-amber-500" />
                    <span className="text-sm">Age: {trainer.profileDetails?.age || 'N/A'}</span>
                    {trainer.blocked && (
                      <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Blocked</span>
                    )}
                  </div>
                  <div 
                    className="flex gap-2 pt-2 border-t"
                    style={{ borderColor: theme.colors.border }}
                  >
                    <button
                      onClick={() => handleDeleteTrainer(trainer._id)}
                      className="flex-1 py-1 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => handleToggleBlock(trainer._id, trainer.blocked)}
                      className={`flex-1 py-1 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-sm font-medium ${
                        trainer.blocked 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                    >
                      {trainer.blocked ? <FaUnlock /> : <FaBan />}
                      <span>{trainer.blocked ? 'Unblock' : 'Block'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Themed Dialog */}
      <ThemedDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.type === 'error' ? 'Delete' : dialog.type === 'info' ? 'Unblock' : 'Block'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default TrainerManagementComponent;
