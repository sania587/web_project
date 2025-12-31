import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaDumbbell, 
  FaArrowRight, 
  FaArrowLeft, 
  FaCheck,
  FaChalkboardTeacher,
  FaRunning
} from "react-icons/fa";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer"); // "customer" or "trainer"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Customer specific
    age: "",
    gender: "",
    healthGoals: "",
    // Trainer specific
    expertise: "",
    experience: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === "customer") {
        const customerData = {
          ...formData,
          role: "customer",
          // Map fields if necessary, assuming backend accepts these directly
        };
        
        const resultAction = await dispatch(signup(customerData));
        
        if (resultAction.payload && resultAction.payload.token) {
          localStorage.setItem('token', resultAction.payload.token);
          navigate('/dashboard');
        } else {
          alert('Signup failed. Please try again.');
        }

      } else if (role === "trainer") {
        const trainerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          expertise: formData.expertise,
          experience: formData.experience,
          age: formData.age // Include age for trainer
        };

        await axios.post("http://localhost:5000/api/trainer/signup", trainerData);
        alert("Trainer Signup Successful! Please login.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      const msg = error.response?.data?.message || "An error occurred during signup.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 overflow-auto"
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
              : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        >
          {/* Decorative circles */}
          <div 
            className="absolute bottom-12 right-6 w-28 h-28 rounded-full opacity-10"
            style={{ background: theme.colors.primary }}
          />
          
          <div className="text-center z-10">
            <div 
              className="w-40 h-40 mx-auto  flex items-center justify-center mb-4"
            >
            <img src="/fithum_logo_.png" alt="" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Join FitHum
            </h1>
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

          <div className="mb-6 text-center">
            <h2 
              className="text-2xl font-bold mb-1"
              style={{ color: theme.colors.text }}
            >
              Create Account
            </h2>
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Step {step} of 2: {step === 1 ? "Basic Info & Role" : "Profile Details"}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
            
            {/* Step 1: Basic Info */}
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
                      style={{
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
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
                      style={{
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
                      required
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
                      style={{
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 mt-4 transition-all hover:shadow-lg transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  }}
                >
                  Next Step
                  <FaArrowRight className="text-sm" />
                </button>
              </>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <>
                <div className="space-y-3">
                  {role === "customer" ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Age */}
                        <input
                          name="age"
                          type="number"
                          placeholder="Age"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                          style={{
                            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          }}
                          required
                        />
                         {/* Gender */}
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                          style={{
                            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          }}
                          required
                        >
                          <option value="">Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Health Goals */}
                      <textarea
                        name="healthGoals"
                        placeholder="What are your health goals?"
                        value={formData.healthGoals}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none min-h-[100px]"
                        style={{
                          backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                          borderColor: theme.colors.border,
                          color: theme.colors.text,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {/* Trainer Fields */}
                      <div className="space-y-3">
                        <input
                          name="age"
                          type="number"
                          placeholder="Age"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                          style={{
                            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          }}
                          required
                        />
                         <input
                          name="expertise"
                          type="text"
                          placeholder="Expertise (e.g., Yoga, HIIT)"
                          value={formData.expertise}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                          style={{
                            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          }}
                          required
                        />
                        
                        <input
                          name="experience"
                          type="number"
                          placeholder="Years of Experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none"
                          style={{
                            backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                          }}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                 <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg transform hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                     {isLoading ? 'Creating Account...' : (
                       <>
                         Complete Signup
                         <FaCheck className="text-sm" />
                       </>
                     )}
                  </button>
                 </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p 
            className="text-center mt-6 text-sm"
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
        </div>
      </div>
    </div>
  );
};

export default Signup;
