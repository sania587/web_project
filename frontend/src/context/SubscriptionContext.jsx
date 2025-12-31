import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Create context
const SubscriptionContext = createContext();

// Feature constants - maps subscription features to nav paths
export const FEATURE_MAP = {
  'Personal Trainer': '/customer/trainers',
  'One-on-One Sessions': '/customer/sessions',
  'Workout Videos': '/customer/workouts',
  'Diet Plans': '/customer/diet-plans',
  'Progress Tracking': '/customer/progress',
  'Nutrition Guide': '/customer/diet-plans',
  'Gym Access': null, // Not a nav feature
  '24/7 Support': null // Not a nav feature
};

// Features available for free (no subscription)
export const FREE_FEATURES = ['Workout Videos'];

// Always available paths (no subscription required)
export const ALWAYS_AVAILABLE_PATHS = [
  '/dashboard',
  '/customer/subscription',
  '/customer/notifications',
  '/profile'
];

// Subscription Provider
export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchSubscription = async () => {
    try {
      // First check if subscription info is already in user object from login
      if (user?.subscription) {
        setSubscription(user.subscription);
        const planFeatures = user.subscription?.plan?.features || [];
        setFeatures(user.subscription.status === 'active' ? planFeatures : FREE_FEATURES);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      const response = await axios.get(`http://localhost:5000/api/users/subscription?userId=${user.id}`);
      const subData = response.data.subscription;
      
      if (subData && subData.plan) {
        const isActive = subData.status === 'active' && 
                        subData.endDate && 
                        new Date(subData.endDate) > new Date();
        
        setSubscription({
          status: isActive ? 'active' : subData.status,
          plan: subData.plan,
          endDate: subData.endDate
        });
        setFeatures(isActive ? (subData.plan.features || []) : FREE_FEATURES);
      } else {
        setSubscription({ status: 'none', plan: null });
        setFeatures(FREE_FEATURES);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ status: 'none', plan: null });
      setFeatures(FREE_FEATURES);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has access to a specific feature
  const hasFeature = (featureName) => {
    return features.includes(featureName);
  };

  // Check if user can access a specific path
  const canAccessPath = (path) => {
    // Always available paths
    if (ALWAYS_AVAILABLE_PATHS.some(p => path.startsWith(p))) {
      return true;
    }

    // Check if path requires a feature
    for (const [feature, featurePath] of Object.entries(FEATURE_MAP)) {
      if (featurePath && path.startsWith(featurePath)) {
        return hasFeature(feature);
      }
    }

    return true; // Unknown paths are allowed by default
  };

  // Get required feature for a path
  const getRequiredFeature = (path) => {
    for (const [feature, featurePath] of Object.entries(FEATURE_MAP)) {
      if (featurePath && path.startsWith(featurePath)) {
        return feature;
      }
    }
    return null;
  };

  // Refresh subscription data
  const refreshSubscription = () => {
    fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      features,
      loading,
      hasFeature,
      canAccessPath,
      getRequiredFeature,
      refreshSubscription,
      isActive: subscription?.status === 'active',
      planName: subscription?.plan?.name || 'Free'
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
