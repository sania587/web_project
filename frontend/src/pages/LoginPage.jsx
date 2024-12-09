import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = (response) => {
    // You would send the response credential to your backend to process the login/signup
    console.log(response);
  };
  
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID" className="bg-slate-100">
      <div className="container mx-auto py-10 flex flex-col md:flex-row justify-center items-center space-x-4">
        {/* Left Column - Image with Text Overlay */}
        <div className="relative w-full h-full md:w-1/2 px-4 mt-10 ml-20 md:mt-0">
          <img
            src="/fitness-logo.jpg"
            alt="Fitness Gym"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          {/* Text Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gray opacity-50 flex-end">
            <h2 className="text-red-900 text-4xl font-bold text-center px-4">
              Get Fit with FitHum
            </h2>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full md:w-1/2 px-4">
          {/* Social Media Login */}
          <div className="flex flex-col space-y-4 mb-6 w-3/4 mx-auto justify-between">
            {/* Google Login button with reduced width */}
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={(error) => console.log('Google Login Failed:', error)}
              useOneTap
              className="w-30% mx-auto"  // Reduced width to 75% and centered it
            />
            {/* Add other social buttons like Facebook here */}
          </div>

          {/* Login Form */}
          <Login />

          {/* Forgot Password Link */}
          <div className="text-sm text-center text-gray-600 mt-6">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;