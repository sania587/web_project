import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { useTheme } from '../../context/ThemeContext';
import { FaUserTie, FaStar, FaEnvelope, FaCalendarCheck, FaCertificate, FaSearch, FaClock } from 'react-icons/fa';

const FindTrainersPage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [existingRequests, setExistingRequests] = useState([]);
  const [bookingInProgress, setBookingInProgress] = useState(null);

  const userId = user?._id || user?.id;

  useEffect(() => {
    fetchTrainers();
    if (userId) {
      fetchExistingRequests();
    }
  }, [userId]);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/managetrainers');
      setTrainers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/session-requests/customer/${userId}`);
      setExistingRequests(response.data);
    } catch (error) {
      console.error('Error fetching existing requests:', error);
    }
  };

  // Check if user already has a pending/accepted request with this trainer
  const hasExistingRequest = (trainerId) => {
    return existingRequests.some(
      req => req.trainer?._id === trainerId && ['pending', 'accepted', 'scheduled'].includes(req.status)
    );
  };

  // Get request status for a trainer
  const getRequestStatus = (trainerId) => {
    const request = existingRequests.find(
      req => req.trainer?._id === trainerId && ['pending', 'accepted', 'scheduled'].includes(req.status)
    );
    return request?.status || null;
  };

  const handleBookTrainer = async (trainer) => {
    if (!userId) {
      setBookingMessage('Please log in to book a session');
      setTimeout(() => setBookingMessage(''), 3000);
      return;
    }

    if (hasExistingRequest(trainer._id)) {
      setBookingMessage('⚠️ You already have a pending request with this trainer');
      setTimeout(() => setBookingMessage(''), 3000);
      return;
    }

    setBookingInProgress(trainer._id);

    try {
      await axios.post('http://localhost:5000/api/session-requests/create', {
        customerId: userId,
        trainerId: trainer._id,
        message: `Session request from ${user?.name || 'Customer'}`
      });
      
      setBookingMessage(`✅ Session request sent to ${trainer.name}! They will respond soon.`);
      setTimeout(() => setBookingMessage(''), 5000);
      
      // Refresh existing requests to update button states
      fetchExistingRequests();
    } catch (error) {
      console.error('Error booking trainer:', error);
      setBookingMessage('❌ Failed to send request. Please try again.');
      setTimeout(() => setBookingMessage(''), 3000);
    } finally {
      setBookingInProgress(null);
    }
  };

  // Get unique specializations
  const specializations = [...new Set(trainers.flatMap(t => 
    t.profileDetails?.specializations || [t.specialization].filter(Boolean)
  ))];


  // Filter trainers
  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const trainerSpecs = trainer.profileDetails?.specializations || [trainer.specialization].filter(Boolean);
    const matchesSpec = !selectedSpecialization || trainerSpecs.includes(selectedSpecialization);
    return matchesSearch && matchesSpec;
  });

  return (
    <CustomerLayout>
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: theme.colors.text }}
          >
            <FaUserTie style={{ color: theme.colors.primary }} />
            Find Trainers
          </h2>
          <p 
            className="mt-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Browse and book sessions with our certified trainers
          </p>
        </div>

        {/* Success Message */}
        {bookingMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
            <FaCalendarCheck className="inline mr-2" />
            {bookingMessage}
          </div>
        )}

        {/* Search and Filter */}
        <div 
          className="rounded-2xl p-4 mb-6 shadow-sm border"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type="text"
                placeholder="Search trainers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              />
            </div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                borderColor: theme.colors.border,
                color: theme.colors.text
              }}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
            />
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div 
            className="text-center py-12 rounded-2xl border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <FaUserTie className="mx-auto text-6xl mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textSecondary }}>No trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <div 
                key={trainer._id}
                className="rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-lg hover:scale-[1.02]"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
              >
                {/* Trainer Header */}
                <div 
                  className="p-4 text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                      {trainer.profilePicture ? (
                        <img 
                          src={`http://localhost:5000${trainer.profilePicture}`} 
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserTie className="text-2xl text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{trainer.name}</h3>
                      <p className="text-sm opacity-80 flex items-center gap-1">
                        <FaEnvelope className="text-xs" />
                        {trainer.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trainer Details */}
                <div className="p-4 space-y-3">
                  {/* Specializations */}
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(trainer.profileDetails?.specializations || [trainer.specialization].filter(Boolean)).slice(0, 3).map((spec, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: isDark ? theme.colors.primary + '20' : '#e0e7ff',
                            color: theme.colors.primary
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                      {(trainer.profileDetails?.specializations?.length || 0) === 0 && !trainer.specialization && (
                        <span className="text-xs" style={{ color: theme.colors.textMuted }}>Not specified</span>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  {trainer.profileDetails?.certifications?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: theme.colors.textSecondary }}>
                        <FaCertificate /> Certifications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.profileDetails.certifications.slice(0, 2).map((cert, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: isDark ? '#22c55e20' : '#dcfce7',
                              color: '#16a34a'
                            }}
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {trainer.availability?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                        Available Slots
                      </p>
                      <p className="text-sm" style={{ color: theme.colors.text }}>
                        {trainer.availability.slice(0, 2).join(', ')}
                        {trainer.availability.length > 2 && ` +${trainer.availability.length - 2} more`}
                      </p>
                    </div>
                  )}

                  {/* Book Button */}
                  {hasExistingRequest(trainer._id) ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-semibold transition-all mt-4 cursor-not-allowed opacity-70 flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: getRequestStatus(trainer._id) === 'scheduled' ? '#22c55e' : '#f59e0b',
                        color: 'white'
                      }}
                    >
                      <FaClock />
                      {getRequestStatus(trainer._id) === 'pending' && 'Request Pending'}
                      {getRequestStatus(trainer._id) === 'accepted' && 'Request Accepted'}
                      {getRequestStatus(trainer._id) === 'scheduled' && 'Session Scheduled'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookTrainer(trainer)}
                      disabled={bookingInProgress === trainer._id}
                      className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` 
                      }}
                    >
                      {bookingInProgress === trainer._id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          <FaCalendarCheck className="inline mr-2" />
                          Book Session
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </CustomerLayout>
  );
};

export default FindTrainersPage;
