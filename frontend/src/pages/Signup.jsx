import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import ThemedDialog from "../components/common/ThemedDialog";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaDumbbell, 
  FaArrowRight, 
  FaArrowLeft, 
  FaCheck,
  FaChalkboardTeacher,
  FaRunning,
  FaPhone,
  FaRuler,
  FaWeight,
  FaHeartbeat,
  FaBriefcase,
  FaDollarSign,
  FaCertificate
} from "react-icons/fa";

// Google Signup Button Component
const GoogleSignupButton = ({ role, navigate, theme, showDialog }) => {
  const [loading, setLoading] = useState(false);
  
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const userInfoRes = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      
      const { email, name, picture, sub: googleId } = userInfoRes.data;
      
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: btoa(JSON.stringify({ email, name, picture, sub: googleId })).replace(/=/g, '').split('').reverse().join('') + '.' + 
                    btoa(JSON.stringify({ email, name, picture, sub: googleId })) + '.' + 'sig',
        role,
      });
      
      const { token, user, isNewUser, redirectUrl } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ user, token }));
      
      if (isNewUser) {
        navigate('/complete-profile');
      } else {
        showDialog('Welcome Back!', 'You already have an account. Logging you in...', 'success', () => navigate(redirectUrl || '/dashboard'));
      }
    } catch (error) {
      console.error('Google signup error:', error);
      showDialog('Google Sign-up Failed', error.response?.data?.message || 'Failed to sign up with Google', 'error');
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => showDialog('Google Sign-up Failed', 'Could not connect to Google', 'error'),
  });

  return (
    <button
      onClick={() => googleSignup()}
      disabled={loading}
      className="w-full py-2.5 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md text-sm disabled:opacity-50"
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
      {loading ? 'Signing up...' : 'Sign up with Google'}
    </button>
  );
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    // Basic (Step 1)
    name: "",
    email: "",
    password: "",
    phone: "",
    // Physical/Professional (Step 2)
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessLevel: "",
    // Trainer-specific
    yearsExperience: "",
    expertise: "",
    // Fitness Details (Step 3)
    healthGoals: "",
    healthConditions: "",
    preferredWorkoutTime: "",
    // Trainer Step 3
    bio: "",
    hourlyRate: "",
    certifications: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success', onClose: null });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  const showDialog = (title, message, type = 'success', onCloseAction = null) => {
    setDialog({ isOpen: true, title, message, type, onClose: onCloseAction });
  };

  const handleDialogClose = () => {
    const action = dialog.onClose;
    setDialog({ ...dialog, isOpen: false });
    if (action) action();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === "customer") {
        const customerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: "customer",
          age: parseInt(formData.age) || undefined,
          gender: formData.gender,
          height: parseFloat(formData.height) || undefined,
          weight: parseFloat(formData.weight) || undefined,
          fitnessLevel: formData.fitnessLevel,
          healthGoals: formData.healthGoals,
          healthConditions: formData.healthConditions,
          preferredWorkoutTime: formData.preferredWorkoutTime,
        };
        
        const resultAction = await dispatch(signup(customerData));
        
        if (resultAction.payload && resultAction.payload.token) {
          localStorage.setItem('token', resultAction.payload.token);
          showDialog('Welcome to FitHum! 🎉', 'Your account has been created successfully.', 'success', () => navigate('/dashboard'));
        } else {
          showDialog('Signup Failed', 'Please check your information and try again.', 'error');
        }

      } else if (role === "trainer") {
        const trainerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          age: parseInt(formData.age) || undefined,
          gender: formData.gender,
          yearsExperience: parseInt(formData.yearsExperience) || 0,
          expertise: formData.expertise,
          bio: formData.bio,
          hourlyRate: parseFloat(formData.hourlyRate) || undefined,
          certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        };

        await axios.post("http://localhost:5000/api/trainer/signup", trainerData);
        showDialog('Trainer Account Created! 🎉', 'Your trainer account has been created successfully. Please login to continue.', 'success', () => navigate('/login'));
      }
    } catch (error) {
      console.error("Error during signup:", error);
      const msg = error.response?.data?.message || "An error occurred during signup.";
      showDialog('Signup Error', msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 3;

  const inputStyle = {
    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 overflow-auto"
      style={{ background: theme.colors.loginGradient }}
    >
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Left Side - Branding */}
        <div 
          className="hidden lg:flex lg:w-5/12 flex-col justify-center items-center p-8 relative"
          style={{
            background: isDark 
              ? `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}20 100%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        >
          <div className="absolute bottom-12 right-6 w-28 h-28 rounded-full opacity-10"
            style={{ background: theme.colors.primary }}
          />
          
          <div className="text-center z-10">
            <div className="w-40 h-40 mx-auto flex items-center justify-center mb-4">
              <img src="/fithum_logo_.png" alt="" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Join FitHum</h1>
            <p className="text-sm text-white/80 mb-6">
              Start your fitness journey today.
            </p>

            <div className="flex flex-col gap-4 text-left w-full max-w-xs text-white/90 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <FaCheck className="text-green-400" />
                </div>
                <span>Personalized workout plans</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <FaCheck className="text-green-400" />
                </div>
                <span>Expert trainer guidance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <FaCheck className="text-green-400" />
                </div>
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div 
          className="w-full lg:w-7/12 p-6 md:p-8"
          style={{ backgroundColor: theme.colors.surface }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <div 
              className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
            >
              <FaDumbbell className="text-xl text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: theme.colors.text }}>FitHum</h1>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text }}>
              Create Account
            </h2>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Step {step} of {totalSteps}: {
                step === 1 ? "Basic Info" : 
                step === 2 ? (role === "customer" ? "Physical Details" : "Professional Info") : 
                (role === "customer" ? "Fitness Goals" : "Profile Details")
              }
            </p>
            
            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
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
          </div>

          <form onSubmit={step < totalSteps ? handleNext : handleSubmit} className="space-y-4">
            
            {/* Step 1: Basic Info & Role */}
            {step === 1 && (
              <>
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      role === "customer" ? "shadow-md transform scale-[1.02]" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: role === "customer" ? theme.colors.primary : theme.colors.border,
                      backgroundColor: role === "customer" ? (isDark ? `${theme.colors.primary}20` : '#f0f9ff') : 'transparent',
                      color: theme.colors.text
                    }}
                  >
                    <FaRunning className={`text-xl ${role === "customer" ? "text-blue-500" : ""}`} />
                    <span className="font-semibold text-sm">Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("trainer")}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      role === "trainer" ? "shadow-md transform scale-[1.02]" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: role === "trainer" ? theme.colors.primary : theme.colors.border,
                      backgroundColor: role === "trainer" ? (isDark ? `${theme.colors.primary}20` : '#fff7ed') : 'transparent',
                      color: theme.colors.text
                    }}
                  >
                    <FaChalkboardTeacher className={`text-xl ${role === "trainer" ? "text-orange-500" : ""}`} />
                    <span className="font-semibold text-sm">Trainer</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Name */}
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm transition-all focus:outline-none"
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm transition-all focus:outline-none"
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm transition-all focus:outline-none"
                      style={inputStyle}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm transition-all focus:outline-none"
                      style={inputStyle}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Physical Details (Customer) / Professional Info (Trainer) */}
            {step === 2 && role === "customer" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
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
                  
                  {/* Gender */}
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

                <div className="grid grid-cols-2 gap-3">
                  {/* Height */}
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
                      min="100"
                      max="250"
                    />
                  </div>
                  
                  {/* Weight */}
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
                      min="30"
                      max="300"
                    />
                  </div>
                </div>

                {/* Fitness Level */}
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
                    <option value="Beginner">Beginner - Just starting out</option>
                    <option value="Intermediate">Intermediate - Some experience</option>
                    <option value="Advanced">Advanced - Very experienced</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && role === "trainer" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                    required
                    min="18"
                    max="80"
                  />
                  
                  {/* Gender */}
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

                {/* Years Experience */}
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
                    min="0"
                    max="50"
                  />
                </div>

                {/* Expertise */}
                <div className="relative">
                  <FaDumbbell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="expertise"
                    type="text"
                    placeholder="Expertise (e.g., HIIT, Yoga, Weight Training)"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Fitness Goals (Customer) / Profile Details (Trainer) */}
            {step === 3 && role === "customer" && (
              <div className="space-y-3">
                {/* Health Goals */}
                <textarea
                  name="healthGoals"
                  placeholder="What are your fitness goals? (e.g., lose weight, build muscle, improve endurance)"
                  value={formData.healthGoals}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[80px] resize-none"
                  style={inputStyle}
                />

                {/* Health Conditions */}
                <textarea
                  name="healthConditions"
                  placeholder="Any health conditions, allergies, or injuries we should know about? (optional)"
                  value={formData.healthConditions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[60px] resize-none"
                  style={inputStyle}
                />

                {/* Preferred Workout Time */}
                <select
                  name="preferredWorkoutTime"
                  value={formData.preferredWorkoutTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                  style={inputStyle}
                >
                  <option value="">Preferred Workout Time</option>
                  <option value="Morning">Morning (6am - 12pm)</option>
                  <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="Evening">Evening (5pm - 10pm)</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            )}

            {step === 3 && role === "trainer" && (
              <div className="space-y-3">
                {/* Bio */}
                <textarea
                  name="bio"
                  placeholder="Tell clients about yourself and your training philosophy..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[80px] resize-none"
                  style={inputStyle}
                />

                {/* Hourly Rate */}
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
                    min="0"
                  />
                </div>

                {/* Certifications */}
                <div className="relative">
                  <FaCertificate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400" />
                  <input
                    name="certifications"
                    type="text"
                    placeholder="Certifications (comma-separated, e.g., ACE, NASM)"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                >
                  <FaArrowLeft className="text-sm" />
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`${step > 1 ? 'flex-[2]' : 'flex-1'} py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg transform hover:scale-[1.02]`}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Creating Account...' : (
                  step < totalSteps ? (
                    <>
                      Next Step
                      <FaArrowRight className="text-sm" />
                    </>
                  ) : (
                    <>
                      Complete Signup
                      <FaCheck className="text-sm" />
                    </>
                  )
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p 
            className="text-center mt-4 text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline inline-flex items-center gap-1"
              style={{ color: theme.colors.primary }}
            >
              Login here
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
            <span className="text-xs" style={{ color: theme.colors.textSecondary }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme.colors.border }} />
          </div>

          {/* Google Signup */}
          <GoogleSignupButton role={role} navigate={navigate} theme={theme} showDialog={showDialog} />
        </div>
      </div>

      {/* Success/Error Dialog */}
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

export default Signup;
