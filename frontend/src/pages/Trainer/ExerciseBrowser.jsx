import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TrainerLayout from '../../components/Trainer/TrainerLayout';
import { useTheme } from '../../context/ThemeContext';
import { fetchData, exerciseOptions } from '../../utils/fetchData';
import { 
  FaSearch, 
  FaDumbbell, 
  FaArrowRight,
  FaFilter,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaTools,
  FaDatabase
} from 'react-icons/fa';

// Cache key prefix
const CACHE_PREFIX = 'exercise_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Helper functions for caching
const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
      localStorage.removeItem(CACHE_PREFIX + key); // Expired, remove it
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }
  return null;
};

const setToCache = (key, data) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Cache write error:', e);
  }
};

const ExerciseBrowser = () => {
  const { theme, isDark } = useTheme();
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [fromCache, setFromCache] = useState(false); // Track if data came from cache

  // Muscle groups for filter
  const muscleGroups = [
    'all', 'abdominals', 'biceps', 'chest', 'forearms', 'glutes', 
    'hamstrings', 'lats', 'quadriceps', 'shoulders', 'triceps'
  ];

  // Fetch exercises with caching
  const fetchExercises = useCallback(async (muscle) => {
    setLoading(true);
    setError(null);
    setFromCache(false);

    // Check cache first
    const cached = getFromCache(muscle);
    if (cached) {
      setExercises(cached);
      setFromCache(true);
      setLoading(false);
      return;
    }

    try {
      let url = 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises';
      
      if (muscle !== 'all') {
        url = `https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises/muscle/${muscle}`;
      }

      const data = await fetchData(url, exerciseOptions);
      
      if (data && Array.isArray(data)) {
        const exerciseList = data.slice(0, 20); // Limit to 20 exercises
        setExercises(exerciseList);
        setToCache(muscle, exerciseList); // Save to cache
      } else if (data && data.message) {
        setError(data.message);
      } else {
        setExercises([]);
      }
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on muscle change
  useEffect(() => {
    fetchExercises(selectedMuscle);
  }, [selectedMuscle, fetchExercises]);

  // Filter by search
  const filteredExercises = useMemo(() => {
    if (!Array.isArray(exercises)) return [];
    return exercises.filter(ex => {
      const matchesSearch = !searchTerm || 
        ex.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.primaryMuscles?.[0]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.equipment?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [exercises, searchTerm]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 6;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMuscle, searchTerm]);

  // Calculate current exercises
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const muscleColors = {
    'chest': { bg: 'bg-red-100', text: 'text-red-600' },
    'biceps': { bg: 'bg-blue-100', text: 'text-blue-600' },
    'triceps': { bg: 'bg-purple-100', text: 'text-purple-600' },
    'shoulders': { bg: 'bg-orange-100', text: 'text-orange-600' },
    'lats': { bg: 'bg-green-100', text: 'text-green-600' },
    'quadriceps': { bg: 'bg-teal-100', text: 'text-teal-600' },
    'hamstrings': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    'abdominals': { bg: 'bg-pink-100', text: 'text-pink-600' },
    'glutes': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    'forearms': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  };

  // Clear cache function
  const clearCache = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    fetchExercises(selectedMuscle);
  };

  return (
    <TrainerLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ color: theme.colors.text }}
            >
              <FaDumbbell style={{ color: theme.colors.primary }} />
              Exercise Library
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Browse exercises with detailed instructions
            </p>
          </div>
          {/* Clear Cache Button */}
          <button
            onClick={clearCache}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.textSecondary,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <FaDatabase />
            Refresh Data
          </button>
        </div>

        {/* Search Bar */}
        <div 
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        >
          <div className="relative">
            <FaSearch 
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }}
            />
          </div>
        </div>

        {/* Muscle Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <FaFilter style={{ color: theme.colors.textSecondary }} />
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-2 rounded-xl font-medium transition-all capitalize text-sm ${
                selectedMuscle === muscle ? 'text-white shadow-md' : ''
              }`}
              style={{
                backgroundColor: selectedMuscle === muscle 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                color: selectedMuscle === muscle ? 'white' : theme.colors.text,
                border: `1px solid ${selectedMuscle === muscle ? theme.colors.primary : theme.colors.border}`
              }}
            >
              {muscle}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div 
            className="flex flex-col items-center justify-center py-20 rounded-2xl border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <FaSpinner 
              className="text-5xl animate-spin mb-4" 
              style={{ color: theme.colors.primary }} 
            />
            <p style={{ color: theme.colors.textSecondary }}>Loading exercises...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div 
            className="rounded-2xl p-8 text-center border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchExercises(selectedMuscle)}
              className="px-4 py-2 rounded-xl font-medium text-white"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div 
            className="flex items-center justify-between"
          >
            <span 
              className="text-sm font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              Showing {indexOfFirstExercise + 1}-{Math.min(indexOfLastExercise, filteredExercises.length)} of {filteredExercises.length} exercises
              {selectedMuscle !== 'all' && ` for ${selectedMuscle}`}
            </span>
            {fromCache && (
              <span 
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ 
                  backgroundColor: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.1)',
                  color: '#22c55e'
                }}
              >
                <FaDatabase className="text-xs" />
                From cache (0 API calls)
              </span>
            )}
          </div>
        )}

        {/* Exercise Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentExercises.map((exercise, index) => {
                const primaryMuscle = exercise.primaryMuscles?.[0] || 'general';
                const colors = muscleColors[primaryMuscle] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                
                return (
                  <div
                    key={exercise.id || index}
                    className="rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
                    style={{ 
                      backgroundColor: theme.colors.surface, 
                      borderColor: theme.colors.border 
                    }}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    {/* Exercise Image with Fallback */}
                  <div 
                    className="aspect-square flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: isDark 
                        ? `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary || theme.colors.primary}25 100%)` 
                        : `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.secondary || theme.colors.primary}15 100%)`
                    }}
                  >
                    {/* Placeholder (Always rendered, hidden behind image if loaded) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center p-4">
                        <div 
                          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-3 shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || theme.colors.primary} 100%)`,
                          }}
                        >
                          <FaDumbbell className="text-4xl text-white" />
                        </div>
                        <p 
                          className="text-sm font-bold capitalize"
                          style={{ color: theme.colors.primary }}
                        >
                          {primaryMuscle}
                        </p>
                        <p 
                          className="text-xs capitalize mt-1"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {exercise.category || 'Exercise'}
                        </p>
                      </div>
                    </div>

                    {/* Actual Image */}
                    {exercise.images?.[0] && (
                       <img
                       src={exercise.images[0].startsWith('http') ? exercise.images[0] : `https://${exercise.images[0]}`}
                       alt={exercise.name}
                       loading="lazy"
                       className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 hover:scale-105"
                       onError={(e) => {
                         e.target.style.opacity = '0'; // Hide image on error to show placeholder
                       }}
                       onLoad={(e) => {
                         e.target.style.opacity = '1'; // Ensure visible on load
                       }}
                     />
                    )}
                    
                    {/* Level Badge (On top of everything) */}
                    {exercise.level && (
                      <span 
                        className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold capitalize z-20 ${
                          exercise.level === 'beginner' ? 'bg-green-500' :
                          exercise.level === 'intermediate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white shadow-md`}
                      >
                        {exercise.level}
                      </span>
                    )}
                  </div>

                    {/* Exercise Info */}
                    <div className="p-4">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span 
                          className={`px-2 py-1 rounded-lg text-xs font-bold capitalize ${colors.bg} ${colors.text}`}
                        >
                          {primaryMuscle}
                        </span>
                        {exercise.category && (
                          <span 
                            className="px-2 py-1 rounded-lg text-xs font-medium capitalize"
                            style={{ 
                              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              color: theme.colors.textSecondary
                            }}
                          >
                            {exercise.category}
                          </span>
                        )}
                      </div>
                      
                      <h3 
                        className="font-bold text-lg mb-2 capitalize line-clamp-2"
                        style={{ color: theme.colors.text }}
                      >
                        {exercise.name?.replace(/_/g, ' ')}
                      </h3>
                      
                      <p 
                        className="text-sm mb-4 capitalize"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        🏋️ {exercise.equipment || 'Body Only'}
                      </p>

                      <button
                        className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all w-full justify-center py-2 rounded-xl"
                        style={{ 
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary 
                        }}
                      >
                        View Details <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredExercises.length > exercisesPerPage && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all flex items-center justify-center`}
                    style={{ 
                      backgroundColor: currentPage === i + 1 ? theme.colors.primary : theme.colors.surface,
                      color: currentPage === i + 1 ? 'white' : theme.colors.text,
                      border: currentPage === i + 1 ? 'none' : `1px solid ${theme.colors.border}`,
                      boxShadow: currentPage === i + 1 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredExercises.length === 0 && (
          <div 
            className="rounded-2xl p-12 text-center border"
            style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
          >
            <FaSearch className="text-4xl mx-auto mb-4" style={{ color: theme.colors.primary }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.text }}>
              No Exercises Found
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Try a different search term or muscle filter
            </p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSelectedExercise(null)}
        >
          <div 
            className="rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.surface }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
              <h2 className="text-xl font-bold capitalize" style={{ color: theme.colors.text }}>
                {selectedExercise.name?.replace(/_/g, ' ')}
              </h2>
              <button 
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                style={{ color: theme.colors.textSecondary }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                >
                  <FaUser className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Level</p>
                  <p className="font-bold capitalize" style={{ color: theme.colors.text }}>{selectedExercise.level || 'N/A'}</p>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                >
                  <FaTools className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Equipment</p>
                  <p className="font-bold capitalize" style={{ color: theme.colors.text }}>{selectedExercise.equipment || 'Body Only'}</p>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                >
                  <FaDumbbell className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Category</p>
                  <p className="font-bold capitalize" style={{ color: theme.colors.text }}>{selectedExercise.category || 'N/A'}</p>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                >
                  <FaCheckCircle className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Mechanic</p>
                  <p className="font-bold capitalize" style={{ color: theme.colors.text }}>{selectedExercise.mechanic || 'N/A'}</p>
                </div>
              </div>

              {/* Muscles */}
              <div>
                <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.primaryMuscles?.map((muscle, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      {muscle}
                    </span>
                  ))}
                  {selectedExercise.secondaryMuscles?.map((muscle, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: theme.colors.textSecondary
                      }}
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {selectedExercise.instructions?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>Instructions</h3>
                  <ol className="space-y-3">
                    {selectedExercise.instructions.map((instruction, idx) => (
                      <li 
                        key={idx}
                        className="flex gap-3"
                      >
                        <span 
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: theme.colors.primary }}
                        >
                          {idx + 1}
                        </span>
                        <p style={{ color: theme.colors.text }}>{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </TrainerLayout>
  );
};

export default ExerciseBrowser;
