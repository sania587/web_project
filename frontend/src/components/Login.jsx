import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaDumbbell } from "react-icons/fa";
import ThemedDialog from "./common/ThemedDialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, title: '', message: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  const showError = (title, message) => {
    setErrorDialog({ isOpen: true, title, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        // Role-based redirect
        if (user?.role === 'admin') {
          navigate("/AdminDashboard");
        } else if (user?.role === 'trainer') {
          navigate("/trainer/dashboard");
        } else {
          navigate("/dashboard"); // Default for customers
        }
      } else {
        const errorMessage = resultAction.payload || "Login failed";
        const isBlocked = errorMessage.toLowerCase().includes('blocked');
        showError(
          isBlocked ? 'Account Blocked' : 'Login Failed', 
          errorMessage
        );
      }
    } catch (error) {
      console.error("Error logging in:", error);
      showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-4 px-4 overflow-auto"
      style={{ 
        background: theme.colors.loginGradient
      }}
    >
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Left Side - Branding */}
        <div 
          className="hidden lg:flex lg:w-5/12 flex-col justify-center items-center p-8 relative"
          style={{
            background: isDark 
              ? `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}20 100%)`
              : `linear-gradient(135deg, ${theme.colors.surface} 10%, ${theme.colors.secondary} 100%)`,
          }}
        >
          {/* Decorative circles */}
        
          <div 
            className="absolute bottom-12 right-6 w-28 h-28 rounded-full opacity-10"
            style={{ background: theme.colors.primary }}
          />
          
          <div className="text-center z-10">
            <div 
              className="w-22 h-22 mx-auto flex items-center justify-center mb"
            >
              <img src="/fithum_logo_.png" alt="" />
            </div>
            <h1 className={`text-4xl font-bold ${theme.colors.text} mb-2`}>
              FitHum
            </h1>
            <p className={`text-sm ${theme.colors.textSecondary} mb-4`}>
              Your Fitness Journey Starts Here
            </p>
            <div className="flex gap-3 justify-center text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-white">500+</div>
                <div className="text-white/60 text-xs">Users</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl font-bold text-white">50+</div>
                <div className="text-white/60 text-xs">Trainers</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl font-bold text-white">100+</div>
                <div className="text-white/60 text-xs">Plans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div 
          className="w-full lg:w-7/12 p-6 md:p-8"
          style={{ 
            backgroundColor: theme.colors.surface,
          }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <div 
              className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
              }}
            >
              <FaDumbbell className="text-xl text-white" />
            </div>
            <h1 
              className="text-xl font-bold"
              style={{ color: theme.colors.text }}
            >
              FitHum
            </h1>
          </div>

          <div className="mb-4">
            <h2 
              className="text-2xl font-bold mb-1"
              style={{ color: theme.colors.text }}
            >
              Welcome Back! 👋
            </h2>
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Sign in to continue your fitness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.text }}
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm"
                  style={{ color: theme.colors.textSecondary }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm"
                  style={{
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.text }}
              >
                Password
              </label>
              <div className="relative">
                <FaLock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm"
                  style={{ color: theme.colors.textSecondary }}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm"
                  style={{
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }}
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span style={{ color: theme.colors.textSecondary }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-medium hover:underline transition-all"
                style={{ color: theme.colors.primary }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
            <span 
              className="text-xs"
              style={{ color: theme.colors.textSecondary }}
            >
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
          </div>

          {/* Social Login */}
          <button
            className="w-full py-2.5 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md text-sm"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.surface
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p 
            className="text-center mt-4 text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold hover:underline inline-flex items-center gap-1"
              style={{ color: theme.colors.primary }}
            >
              <FaUserPlus className="text-xs" />
              Create Account
            </button>
          </p>
        </div>
      </div>
      
      {/* Error Dialog */}
      <ThemedDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        type={errorDialog.title === 'Account Blocked' ? 'error' : 'warning'}
      />
    </div>
  );
};

export default Login;
