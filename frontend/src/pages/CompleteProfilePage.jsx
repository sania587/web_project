// CompleteProfilePage.jsx - For new Google users to complete their profile

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { 
  FaUser, 
  FaCheck, 
  FaArrowRight,
  FaChalkboardTeacher,
  FaRunning,
  FaRuler,
  FaWeight,
  FaHeartbeat,
  FaBriefcase,
  FaDollarSign,
  FaCertificate,
  FaDumbbell,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import ThemedDialog from "../components/common/ThemedDialog";

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    role: "customer",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    phone: "",
    // Customer fields
    height: "",
    weight: "",
    fitnessLevel: "",
    healthGoals: "",
    // Trainer fields
    yearsExperience: "",
    expertise: "",
    bio: "",
    hourlyRate: "",
    certifications: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserData(parsed.user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password && formData.password !== formData.confirmPassword) {
      setDialog({
        isOpen: true,
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please try again.',
        type: 'error'
      });
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      setDialog({
        isOpen: true,
        title: 'Password Too Short',
        message: 'Password must be at least 6 characters.',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        phone: formData.phone,
        age: parseInt(formData.age),
        gender: formData.gender,
        ...(formData.password ? { newPassword: formData.password } : {}),
        ...(formData.role === 'customer' ? {
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          fitnessLevel: formData.fitnessLevel,
          healthGoals: formData.healthGoals,
        } : {
          bio: formData.bio,
          hourlyRate: parseFloat(formData.hourlyRate),
          yearsExperience: parseInt(formData.yearsExperience),
          specializations: formData.expertise ? [formData.expertise] : [],
          certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        })
      };

      await axios.put('http://localhost:5000/api/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDialog({
        isOpen: true,
        title: 'Profile Complete! 🎉',
        message: 'Your profile has been set up successfully.',
        type: 'success'
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      setDialog({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialog({ ...dialog, isOpen: false });
    if (dialog.type === 'success') {
      const role = userData?.role || formData.role;
      if (role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const inputStyle = {
    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: theme.colors.loginGradient }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-xl"
        style={{ backgroundColor: theme.colors.surface }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 overflow-hidden"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            {userData?.profilePicture ? (
              <img src={userData.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-2xl" style={{ color: theme.colors.primary }} />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text }}>
            Complete Your Profile
          </h1>
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            Welcome {userData?.name?.split(' ')[0]}! Tell us a bit more about yourself.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-2 rounded-full transition-all"
              style={{
                width: step === s ? '2rem' : '0.5rem',
                backgroundColor: step >= s ? theme.colors.primary : theme.colors.border,
              }}
            />
          ))}
        </div>

        <form onSubmit={step < 2 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}>
          
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Role Selection - Only show if role is not already set */}
              {!userData?.role && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "customer" })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.role === "customer" ? "shadow-md" : "opacity-60"
                    }`}
                    style={{
                      borderColor: formData.role === "customer" ? theme.colors.primary : theme.colors.border,
                      backgroundColor: formData.role === "customer" ? `${theme.colors.primary}10` : 'transparent',
                      color: theme.colors.text
                    }}
                  >
                    <FaRunning className="text-xl" />
                    <span className="font-semibold text-sm">Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "trainer" })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.role === "trainer" ? "shadow-md" : "opacity-60"
                    }`}
                    style={{
                      borderColor: formData.role === "trainer" ? theme.colors.primary : theme.colors.border,
                      backgroundColor: formData.role === "trainer" ? `${theme.colors.primary}10` : 'transparent',
                      color: theme.colors.text
                    }}
                  >
                    <FaChalkboardTeacher className="text-xl" />
                    <span className="font-semibold text-sm">Trainer</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                  required
                  min="13"
                  max="100"
                />
                
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                  required
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                style={inputStyle}
              />

              {/* Password Setup */}
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                <p className="text-sm font-medium mb-3" style={{ color: theme.colors.text }}>
                  Set a password (optional) - lets you login with email too
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password (min 6 chars)"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border-2 text-sm focus:outline-none"
                      style={inputStyle}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                      <input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                        style={{
                          ...inputStyle,
                          borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword 
                            ? '#ef4444' 
                            : (formData.confirmPassword && formData.password === formData.confirmPassword ? '#10b981' : inputStyle.borderColor)
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role-specific Details */}
          {step === 2 && (userData?.role === 'customer' || formData.role === 'customer') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FaRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="height"
                    type="number"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
                
                <div className="relative">
                  <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="weight"
                    type="number"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="relative">
                <FaHeartbeat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                >
                  <option value="">Fitness Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <textarea
                name="healthGoals"
                placeholder="What are your fitness goals?"
                value={formData.healthGoals}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[80px] resize-none"
                style={inputStyle}
              />
            </div>
          )}

          {step === 2 && (userData?.role === 'trainer' || formData.role === 'trainer') && (
            <div className="space-y-4">
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                <input
                  name="yearsExperience"
                  type="number"
                  placeholder="Years of Experience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                  required
                />
              </div>

              <div className="relative">
                <FaDumbbell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                <input
                  name="expertise"
                  type="text"
                  placeholder="Expertise (e.g., HIIT, Yoga)"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                  required
                />
              </div>

              <textarea
                name="bio"
                placeholder="Tell clients about yourself..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[80px] resize-none"
                style={inputStyle}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="hourlyRate"
                    type="number"
                    placeholder="Hourly Rate (PKR)"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
                
                <div className="relative">
                  <FaCertificate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="certifications"
                    type="text"
                    placeholder="Certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all"
                style={{ borderColor: theme.colors.border, color: theme.colors.text }}
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`${step > 1 ? 'flex-[2]' : 'w-full'} py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg`}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Saving...' : step < 2 ? (
                <>Next <FaArrowRight className="text-sm" /></>
              ) : (
                <>Complete <FaCheck className="text-sm" /></>
              )}
            </button>
          </div>
        </form>
      </div>

      <ThemedDialog
        isOpen={dialog.isOpen}
        onClose={handleDialogClose}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </div>
  );
};

export default CompleteProfilePage;
