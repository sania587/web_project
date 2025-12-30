import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { 
  FaUserTie, 
  FaSearch, 
  FaTrash, 
  FaBan, 
  FaEnvelope,
  FaStar,
  FaDumbbell,
  FaCheckCircle
} from 'react-icons/fa';

const TrainerManagementComponent = () => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/managetrainers/${id}`);
      setTrainers(trainers.filter(trainer => trainer._id !== id));
      setMessage({ type: 'success', text: 'Trainer deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting trainer' });
    }
  };

  const handleBlockTrainer = async (id) => {
    if (!window.confirm('Are you sure you want to block this trainer?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/managetrainers/block/${id}`);
      setTrainers(trainers.filter(trainer => trainer._id !== id));
      setMessage({ type: 'success', text: 'Trainer blocked successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error blocking trainer' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaUserTie className="text-indigo-600" />
            Manage Trainers
          </h2>
          <p className="text-slate-500 mt-1">View and manage all registered trainers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{trainers.length}</p>
              <p className="text-slate-500 text-sm">Active Trainers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaStar className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">4.8</p>
              <p className="text-slate-500 text-sm">Avg Rating</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search trainers by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading trainers...
          </div>
        ) : trainers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 shadow-sm border border-slate-100">
            <FaUserTie className="mx-auto text-4xl mb-2 opacity-50" />
            <p>No trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      {trainer.name?.charAt(0).toUpperCase() || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{trainer.name}</h3>
                      <p className="text-purple-200 text-sm">{trainer.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FaDumbbell className="text-indigo-500" />
                    <span className="text-sm">
                      {trainer.profileDetails?.specializations?.join(', ') || 'General Fitness'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FaStar className="text-amber-500" />
                    <span className="text-sm">Age: {trainer.profileDetails?.age || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteTrainer(trainer._id)}
                      className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                    >
                      <FaTrash />
                      <span className="text-sm">Delete</span>
                    </button>
                    <button
                      onClick={() => handleBlockTrainer(trainer._id)}
                      className="flex-1 py-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-all flex items-center justify-center gap-1"
                    >
                      <FaBan />
                      <span className="text-sm">Block</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrainerManagementComponent;
