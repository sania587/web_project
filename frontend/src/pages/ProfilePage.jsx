// ProfilePage.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import CustomerLayout from "../components/Customer/CustomerLayout";
import TrainerLayout from "../components/Trainer/TrainerLayout";
import AdminLayout from "../components/Admin/AdminLayout";
import { 
  FaUser, 
  FaCamera, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaSignOutAlt,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaBullseye,
  FaCertificate,
  FaDumbbell
} from "react-icons/fa";

const ProfilePage = () => {
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    healthGoals: "",
    specializations: "",
    certifications: ""
  });

  const getToken = () => {
    try {
      // Try getting from 'user' object first
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) return parsed.token;
      }
      // Also try getting standalone 'token' 
      const standaloneToken = localStorage.getItem('token');
      if (standaloneToken) return standaloneToken;
    } catch (e) {
      console.error('Error getting token:', e);
    }
    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        console.log("Token retrieved:", token ? "Found" : "Not found");
        
        if (!token) {
          console.log("No token, using localStorage data as fallback");
          // Try to use data from localStorage as fallback
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            const fallbackUser = parsed.user || parsed;
            console.log("Fallback user data:", fallbackUser);
            setUserData(fallbackUser);
            setFormData({
              name: fallbackUser.name || "",
              age: fallbackUser.profileDetails?.age || "",
              gender: fallbackUser.profileDetails?.gender || "",
              healthGoals: fallbackUser.profileDetails?.healthGoals || "",
              specializations: fallbackUser.profileDetails?.specializations?.join(", ") || "",
              certifications: fallbackUser.profileDetails?.certifications?.join(", ") || ""
            });
            setIsLoading(false);
            return;
          }
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile API response:", response.data);
        setUserData(response.data);
        setFormData({
          name: response.data.name || "",
          age: response.data.profileDetails?.age || "",
          gender: response.data.profileDetails?.gender || "",
          healthGoals: response.data.profileDetails?.healthGoals || "",
          specializations: response.data.profileDetails?.specializations?.join(", ") || "",
          certifications: response.data.profileDetails?.certifications?.join(", ") || ""
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        // Try fallback to localStorage
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const fallbackUser = parsed.user || parsed;
          console.log("Using fallback user data after error:", fallbackUser);
          setUserData(fallbackUser);
          setFormData({
            name: fallbackUser.name || "",
            age: fallbackUser.profileDetails?.age || "",
            gender: fallbackUser.profileDetails?.gender || "",
            healthGoals: fallbackUser.profileDetails?.healthGoals || "",
            specializations: fallbackUser.profileDetails?.specializations?.join(", ") || "",
            certifications: fallbackUser.profileDetails?.certifications?.join(", ") || ""
          });
          setIsLoading(false);
          setError("Could not refresh profile data. Showing cached data.");
        } else {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError("");
      const token = getToken();
      
      const updateData = {
        name: formData.name,
        age: parseInt(formData.age) || undefined,
        gender: formData.gender,
        healthGoals: formData.healthGoals,
        specializations: formData.specializations.split(",").map(s => s.trim()).filter(s => s),
        certifications: formData.certifications.split(",").map(s => s.trim()).filter(s => s)
      };

      const response = await axios.put("/api/users/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData({ ...userData, ...response.data.user });
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploadingPicture(true);
    try {
      const token = getToken();
      const response = await axios.post("/api/users/profile/picture", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUserData({ ...userData, profilePicture: response.data.profilePicture });
      setSuccess("Profile picture updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error uploading picture:", error);
      setError("Failed to upload picture. Please try again.");
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
             style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const apiUrl = import.meta.env.VITE_API_URL || '';
  const profilePicUrl = userData?.profilePicture ? `${apiUrl}${userData.profilePicture}` : null;

  // Layout wrapper based on role
  const LayoutWrapper = ({ children }) => {
    switch (userData?.role) {
      case 'admin':
        return <AdminLayout>{children}</AdminLayout>;
      case 'trainer':
        return <TrainerLayout>{children}</TrainerLayout>;
      case 'customer':
      default:
        return <CustomerLayout>{children}</CustomerLayout>;
    }
  };

  return (
    <LayoutWrapper>
      <div 
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-2xl mx-auto">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-100 text-green-800 border border-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-800 border border-red-300">
            {error}
          </div>
        )}

        {/* Profile Header Card */}
        <div 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div 
                className="w-28 h-28 rounded-full overflow-hidden border-4 cursor-pointer group"
                style={{ borderColor: theme.colors.primary }}
                onClick={handlePictureClick}
              >
                {profilePicUrl ? (
                  <img 
                    src={profilePicUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      color: 'white'
                    }}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || <FaUser />}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>
              {uploadingPicture && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePictureUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 
                className="text-2xl font-bold mb-1"
                style={{ color: theme.colors.text }}
              >
                {userData?.name}
              </h1>
              <p 
                className="flex items-center justify-center sm:justify-start gap-2 mb-2"
                style={{ color: theme.colors.textSecondary }}
              >
                <FaEnvelope className="text-sm" />
                {userData?.email}
              </p>
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize"
                style={{ 
                  backgroundColor: theme.colors.primary + "20",
                  color: theme.colors.primary
                }}
              >
                {userData?.role}
              </span>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: isEditing ? "#10b981" : theme.colors.primary,
                color: 'white'
              }}
            >
              {isEditing ? <FaSave /> : <FaEdit />}
              {isEditing ? "Save" : "Edit"}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f1f5f9',
                  color: theme.colors.text
                }}
              >
                <FaTimes />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Card */}
        <div 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h2 
            className="text-lg font-bold mb-5 flex items-center gap-2"
            style={{ color: theme.colors.text }}
          >
            <FaUser style={{ color: theme.colors.primary }} />
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.textSecondary }}
              >
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                />
              ) : (
                <p 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    color: theme.colors.text
                  }}
                >
                  {userData?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label 
                className="block text-sm font-medium mb-1 flex items-center gap-2"
                style={{ color: theme.colors.textSecondary }}
              >
                <FaBirthdayCake /> Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                />
              ) : (
                <p 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    color: theme.colors.text
                  }}
                >
                  {userData?.profileDetails?.age || "Not set"}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label 
                className="block text-sm font-medium mb-1 flex items-center gap-2"
                style={{ color: theme.colors.textSecondary }}
              >
                <FaVenusMars /> Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    color: theme.colors.text
                  }}
                >
                  {userData?.profileDetails?.gender || "Not set"}
                </p>
              )}
            </div>

            {/* Health Goals (Customer only) */}
            {userData?.role === 'customer' && (
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-1 flex items-center gap-2"
                  style={{ color: theme.colors.textSecondary }}
                >
                  <FaBullseye /> Health Goals
                </label>
                {isEditing ? (
                  <textarea
                    name="healthGoals"
                    value={formData.healthGoals}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2 resize-none"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                ) : (
                  <p 
                    className="p-3 rounded-xl"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      color: theme.colors.text
                    }}
                  >
                    {userData?.profileDetails?.healthGoals || "Not set"}
                  </p>
                )}
              </div>
            )}

            {/* Specializations (Trainer only) */}
            {userData?.role === 'trainer' && (
              <>
                <div className="md:col-span-2">
                  <label 
                    className="block text-sm font-medium mb-1 flex items-center gap-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <FaDumbbell /> Specializations (comma-separated)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleInputChange}
                      placeholder="e.g., Weight Training, Cardio, Yoga"
                      className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      }}
                    />
                  ) : (
                    <p 
                      className="p-3 rounded-xl"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        color: theme.colors.text
                      }}
                    >
                      {userData?.profileDetails?.specializations?.join(", ") || "Not set"}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label 
                    className="block text-sm font-medium mb-1 flex items-center gap-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <FaCertificate /> Certifications (comma-separated)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      placeholder="e.g., ACE, NASM, CrossFit Level 1"
                      className="w-full p-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      }}
                    />
                  ) : (
                    <p 
                      className="p-3 rounded-xl"
                      style={{ 
                        backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                        color: theme.colors.text
                      }}
                    >
                      {userData?.profileDetails?.certifications?.join(", ") || "Not set"}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account Actions Card */}
        <div 
          className="rounded-2xl p-6 border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h2 
            className="text-lg font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105"
            style={{ 
              backgroundColor: '#ef444420',
              color: '#ef4444'
            }}
          >
          <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
};

export default ProfilePage;
