import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash, FaRedo, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const otpRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(newOtp);
      otpRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (response.data.success) {
        setStep(2);
        setCountdown(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpString });
      if (response.data.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp: otp.join(''),
        newPassword,
      });
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP();
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (newPassword.length >= 6) strength++;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
    const levels = [
      { label: 'Weak', color: '#EF4444' },
      { label: 'Fair', color: '#F59E0B' },
      { label: 'Good', color: '#EAB308' },
      { label: 'Strong', color: '#22C55E' },
      { label: 'Very Strong', color: '#10B981' },
    ];
    return { strength, ...levels[Math.min(strength - 1, 4)] };
  };

  // Success State
  if (success) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-4 px-4"
        style={{ background: theme.colors.background }}
      >
        <div 
          className="w-full max-w-md p-8 rounded-2xl shadow-2xl text-center"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ background: `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)` }}
          >
            <FaCheckCircle className="text-4xl text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: theme.colors.text }}>
            Password Reset Successful! 🎉
          </h2>
          <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
            You can now login with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-4 px-4"
      style={{ background: theme.colors.background }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl"
        style={{ backgroundColor: theme.colors.surface }}
      >
        {/* Back Link */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 mb-6 font-medium transition-all hover:gap-3"
          style={{ color: theme.colors.primary }}
        >
          <FaArrowLeft className="text-sm" />
          Back to Login
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
                  style={{
                    background: step >= s 
                      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                      : theme.colors.border,
                    color: step >= s ? 'white' : theme.colors.textSecondary,
                  }}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className="text-xs" style={{ color: step >= s ? theme.colors.primary : theme.colors.textSecondary }}>
                  {s === 1 ? 'Email' : s === 2 ? 'Verify' : 'Reset'}
                </span>
              </div>
              {i < 2 && (
                <div 
                  className="w-12 h-0.5 mb-5 rounded"
                  style={{ backgroundColor: theme.colors.border }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
              >
                <FaEnvelope className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                Forgot Password?
              </h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Enter your email and we'll send you a 6-digit OTP
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none"
                    style={{
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }}
                    required
                  />
                </div>
              </div>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm border-l-4"
                  style={{ backgroundColor: `${theme.colors.error}15`, borderColor: theme.colors.error, color: theme.colors.error }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
              >
                <FaKey className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                Enter OTP
              </h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                We've sent a code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-all focus:outline-none"
                    style={{
                      backgroundColor: digit ? `${theme.colors.primary}10` : (isDark ? theme.colors.surfaceHover : '#f8fafc'),
                      borderColor: digit ? theme.colors.primary : theme.colors.border,
                      color: theme.colors.text,
                    }}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm border-l-4"
                  style={{ backgroundColor: `${theme.colors.error}15`, borderColor: theme.colors.error, color: theme.colors.error }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="flex items-center gap-2 mx-auto text-sm font-medium"
                    style={{ color: theme.colors.primary }}
                  >
                    <FaRedo className="text-xs" /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)` }}
              >
                <FaLock className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                Set New Password
              </h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Create a strong password for your account
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                  New Password
                </label>
                <div className="relative">
                  <FaLock 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all focus:outline-none"
                    style={{
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {newPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded"
                          style={{
                            backgroundColor: level <= getPasswordStrength().strength 
                              ? getPasswordStrength().color 
                              : theme.colors.border
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: getPasswordStrength().color }}>
                      {getPasswordStrength().label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all focus:outline-none"
                    style={{
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className="text-xs mt-1 font-medium" style={{ color: newPassword === confirmPassword ? theme.colors.success : theme.colors.error }}>
                    {newPassword === confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm border-l-4"
                  style={{ backgroundColor: `${theme.colors.error}15`, borderColor: theme.colors.error, color: theme.colors.error }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || newPassword !== confirmPassword}
                className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: theme.colors.textSecondary }}>
          Remember your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold hover:underline"
            style={{ color: theme.colors.primary }}
          >
            Sign in
          </button>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
