// ProfilePage.jsx - Comprehensive Profile with all fitness fields

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
  FaDumbbell,
  FaPhone,
  FaRuler,
  FaWeight,
  FaHeartbeat,
  FaClock,
  FaNotesMedical,
  FaUserFriends,
  FaBriefcase,
  FaDollarSign,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaYoutube
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
    phone: "",
    age: "",
    gender: "",
    // Customer fields
    height: "",
    weight: "",
    fitnessLevel: "",
    healthGoals: "",
    healthConditions: "",
    preferredWorkoutTime: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    // Trainer fields
    bio: "",
    hourlyRate: "",
    yearsExperience: "",
    specializations: "",
    certifications: "",
    languages: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    website: "",
  });

  const getToken = () => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) return parsed.token;
      }
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
        
        if (!token) {
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            const fallbackUser = parsed.user || parsed;
            setUserData(fallbackUser);
            populateFormData(fallbackUser);
            setIsLoading(false);
            return;
          }
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        populateFormData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const fallbackUser = parsed.user || parsed;
          setUserData(fallbackUser);
          populateFormData(fallbackUser);
          setIsLoading(false);
          setError("Could not refresh profile data. Showing cached data.");
        } else {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const populateFormData = (user) => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      age: user.profileDetails?.age || "",
      gender: user.profileDetails?.gender || "",
      // Customer fields
      height: user.profileDetails?.height || "",
      weight: user.profileDetails?.weight || "",
      fitnessLevel: user.profileDetails?.fitnessLevel || "",
      healthGoals: user.profileDetails?.healthGoals || "",
      healthConditions: user.profileDetails?.healthConditions || "",
      preferredWorkoutTime: user.profileDetails?.preferredWorkoutTime || "",
      emergencyContactName: user.emergencyContact?.name || "",
      emergencyContactPhone: user.emergencyContact?.phone || "",
      emergencyContactRelationship: user.emergencyContact?.relationship || "",
      // Trainer fields
      bio: user.bio || "",
      hourlyRate: user.hourlyRate || "",
      yearsExperience: user.yearsExperience || "",
      specializations: user.profileDetails?.specializations?.join(", ") || "",
      certifications: user.profileDetails?.certifications?.join(", ") || "",
      languages: user.languages?.join(", ") || "",
      instagram: user.socialLinks?.instagram || "",
      linkedin: user.socialLinks?.linkedin || "",
      youtube: user.socialLinks?.youtube || "",
      website: user.socialLinks?.website || "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError("");
      const token = getToken();
      
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        age: parseInt(formData.age) || undefined,
        gender: formData.gender,
        height: parseFloat(formData.height) || undefined,
        weight: parseFloat(formData.weight) || undefined,
        fitnessLevel: formData.fitnessLevel,
        healthGoals: formData.healthGoals,
        healthConditions: formData.healthConditions,
        preferredWorkoutTime: formData.preferredWorkoutTime,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        },
        // Trainer fields
        bio: formData.bio,
        hourlyRate: parseFloat(formData.hourlyRate) || undefined,
        yearsExperience: parseInt(formData.yearsExperience) || undefined,
        specializations: formData.specializations.split(",").map(s => s.trim()).filter(s => s),
        certifications: formData.certifications.split(",").map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(",").map(s => s.trim()).filter(s => s),
        socialLinks: {
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          youtube: formData.youtube,
          website: formData.website,
        }
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

  const inputStyle = {
    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
    borderColor: theme.colors.border,
    color: theme.colors.text
  };

  const FieldDisplay = ({ value, placeholder = "Not set" }) => (
    <p 
      className="p-3 rounded-xl"
      style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc', color: theme.colors.text }}
    >
      {value || placeholder}
    </p>
  );

  return (
    <LayoutWrapper>
      <div 
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 rounded-xl bg-green-100 text-green-800 border border-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl bg-red-100 text-red-800 border border-red-300">
            {error}
          </div>
        )}

        {/* Profile Header Card */}
        <div 
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
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
                  <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`, color: 'white' }}
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
              <input type="file" ref={fileInputRef} onChange={handlePictureUpload} accept="image/*" className="hidden" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text }}>{userData?.name}</h1>
              <p className="flex items-center justify-center sm:justify-start gap-2 mb-2" style={{ color: theme.colors.textSecondary }}>
                <FaEnvelope className="text-sm" /> {userData?.email}
              </p>
              {userData?.phone && (
                <p className="flex items-center justify-center sm:justify-start gap-2 mb-2" style={{ color: theme.colors.textSecondary }}>
                  <FaPhone className="text-sm" /> {userData.phone}
                </p>
              )}
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize"
                style={{ backgroundColor: theme.colors.primary + "20", color: theme.colors.primary }}
              >
                {userData?.role}
              </span>
            </div>

            {/* Edit Button */}
            <div className="flex gap-2">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                style={{ backgroundColor: isEditing ? "#10b981" : theme.colors.primary, color: 'white' }}
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? "Save" : "Edit"}
              </button>
              {isEditing && (
                <button
                  onClick={() => { setIsEditing(false); populateFormData(userData); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f1f5f9', color: theme.colors.text }}
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Details Card */}
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
            <FaUser style={{ color: theme.colors.primary }} /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Full Name</label>
              {isEditing ? (
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
              ) : <FieldDisplay value={userData?.name} />}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <FaPhone /> Phone
              </label>
              {isEditing ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
              ) : <FieldDisplay value={userData?.phone} />}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <FaBirthdayCake /> Age
              </label>
              {isEditing ? (
                <input type="number" name="age" value={formData.age} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
              ) : <FieldDisplay value={userData?.profileDetails?.age} />}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <FaVenusMars /> Gender
              </label>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border outline-none" style={inputStyle}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : <FieldDisplay value={userData?.profileDetails?.gender} />}
            </div>
          </div>
        </div>

        {/* Physical Details Card (Customer only) */}
        {userData?.role === 'customer' && (
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
              <FaHeartbeat style={{ color: theme.colors.primary }} /> Physical Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Height */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaRuler /> Height (cm)
                </label>
                {isEditing ? (
                  <input type="number" name="height" value={formData.height} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.height ? `${userData.profileDetails.height} cm` : null} />}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaWeight /> Weight (kg)
                </label>
                {isEditing ? (
                  <input type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.weight ? `${userData.profileDetails.weight} kg` : null} />}
              </div>

              {/* Fitness Level */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaDumbbell /> Fitness Level
                </label>
                {isEditing ? (
                  <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle}>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                ) : <FieldDisplay value={userData?.profileDetails?.fitnessLevel} />}
              </div>
            </div>
          </div>
        )}

        {/* Fitness Goals Card (Customer only) */}
        {userData?.role === 'customer' && (
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
              <FaBullseye style={{ color: theme.colors.primary }} /> Fitness Goals & Health
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Health Goals */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Health Goals</label>
                {isEditing ? (
                  <textarea name="healthGoals" value={formData.healthGoals} onChange={handleInputChange} rows="2"
                    className="w-full p-3 rounded-xl border outline-none resize-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.healthGoals} />}
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaNotesMedical /> Health Conditions / Notes
                </label>
                {isEditing ? (
                  <textarea name="healthConditions" value={formData.healthConditions} onChange={handleInputChange} rows="2"
                    className="w-full p-3 rounded-xl border outline-none resize-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.healthConditions} />}
              </div>

              {/* Preferred Workout Time */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaClock /> Preferred Workout Time
                </label>
                {isEditing ? (
                  <select name="preferredWorkoutTime" value={formData.preferredWorkoutTime} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle}>
                    <option value="">Select Time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                ) : <FieldDisplay value={userData?.profileDetails?.preferredWorkoutTime} />}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact Card (Customer only) */}
        {userData?.role === 'customer' && (
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
              <FaUserFriends style={{ color: theme.colors.primary }} /> Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Name</label>
                {isEditing ? (
                  <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.emergencyContact?.name} />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Phone</label>
                {isEditing ? (
                  <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.emergencyContact?.phone} />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Relationship</label>
                {isEditing ? (
                  <input type="text" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleInputChange}
                    placeholder="e.g., Spouse, Parent"
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.emergencyContact?.relationship} />}
              </div>
            </div>
          </div>
        )}

        {/* Professional Details Card (Trainer only) */}
        {userData?.role === 'trainer' && (
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
              <FaBriefcase style={{ color: theme.colors.primary }} /> Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Bio</label>
                {isEditing ? (
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3"
                    className="w-full p-3 rounded-xl border outline-none resize-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.bio} />}
              </div>

              {/* Years Experience */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Years of Experience</label>
                {isEditing ? (
                  <input type="number" name="yearsExperience" value={formData.yearsExperience} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.yearsExperience ? `${userData.yearsExperience} years` : null} />}
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaDollarSign /> Hourly Rate (PKR)
                </label>
                {isEditing ? (
                  <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.hourlyRate ? `PKR ${userData.hourlyRate}` : null} />}
              </div>

              {/* Specializations */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaDumbbell /> Specializations (comma-separated)
                </label>
                {isEditing ? (
                  <input type="text" name="specializations" value={formData.specializations} onChange={handleInputChange}
                    placeholder="e.g., HIIT, Weight Training, Yoga"
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.specializations?.join(", ")} />}
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaCertificate /> Certifications (comma-separated)
                </label>
                {isEditing ? (
                  <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange}
                    placeholder="e.g., ACE, NASM, CrossFit Level 1"
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.profileDetails?.certifications?.join(", ")} />}
              </div>

              {/* Languages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaGlobe /> Languages (comma-separated)
                </label>
                {isEditing ? (
                  <input type="text" name="languages" value={formData.languages} onChange={handleInputChange}
                    placeholder="e.g., English, Urdu, Punjabi"
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.languages?.join(", ")} />}
              </div>
            </div>
          </div>
        )}

        {/* Social Links Card (Trainer only) */}
        {userData?.role === 'trainer' && (
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: theme.colors.text }}>
              <FaGlobe style={{ color: theme.colors.primary }} /> Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaInstagram /> Instagram
                </label>
                {isEditing ? (
                  <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.socialLinks?.instagram} />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaLinkedin /> LinkedIn
                </label>
                {isEditing ? (
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.socialLinks?.linkedin} />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaYoutube /> YouTube
                </label>
                {isEditing ? (
                  <input type="url" name="youtube" value={formData.youtube} onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.socialLinks?.youtube} />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                  <FaGlobe /> Website
                </label>
                {isEditing ? (
                  <input type="url" name="website" value={formData.website} onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl border outline-none" style={inputStyle} />
                ) : <FieldDisplay value={userData?.socialLinks?.website} />}
              </div>
            </div>
          </div>
        )}

        {/* Account Actions Card */}
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>Account</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#ef444420', color: '#ef4444' }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
};

export default ProfilePage;
