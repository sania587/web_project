import React, { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeSwitcher from "./common/ThemeSwitcher";
import axios from "axios";
import { 
  FaBars, 
  FaTimes, 
  FaDumbbell, 
  FaBell, 
  FaCalendarAlt, 
  FaSignInAlt, 
  FaUserPlus,
  FaSignOutAlt,
  FaHome,
  FaUser,
  FaCrown
} from "react-icons/fa";

const Navbar = ({ isAuthenticated, handleLogout, userId, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  
  const notifRef = useRef(null);
  const sessionRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (sessionRef.current && !sessionRef.current.contains(event.target)) {
        setShowSessions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications and sessions
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/notifications`);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(`/api/sessions/user/${userId}`);
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    if (isAuthenticated && userId) {
      fetchNotifications();
      fetchSessions();
    }
  }, [isAuthenticated, userId]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav 
      className="sticky top-0 z-50 shadow-lg backdrop-blur-md"
      style={{ 
        background: isDark 
          ? `linear-gradient(135deg, ${theme.colors.surface}ee 0%, ${theme.colors.background}ee 100%)`
          : `linear-gradient(135deg, ${theme.colors.surface} 5%, ${theme.colors.secondary} 100%)`,
        borderBottom: `1px solid ${isDark ? theme.colors.border : 'rgba(255,255,255,0.1)'}`
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
         
          >
           <img src="/fithum_logo_.png" alt="" />
          </div>
          <span 
            className="text-2xl font-bold"
            style={{ color: isDark ? theme.colors.text : theme.colors.primary }}
          >
            FitHum
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:bg-white/10"
                style={{ color: isDark ? theme.colors.text : 'white' }}
              >
                <FaHome className="text-sm" />
                Dashboard
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:bg-white/10"
                style={{ color: isDark ? theme.colors.text : 'white' }}
              >
                <FaUser className="text-sm" />
                Profile
              </Link>

              <Link 
                to="/subscription" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:bg-white/10"
                style={{ color: isDark ? theme.colors.text : 'white' }}
              >
                <FaCrown className="text-sm" />
                Subscription
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl transition-all hover:bg-white/10"
                  style={{ color: isDark ? theme.colors.text : 'white' }}
                >
                  <FaBell className="text-lg" />
                  {notifications.length > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: theme.colors.accent }}
                    >
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <div 
                      className="px-4 py-3 font-semibold border-b"
                      style={{ 
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                      }}
                    >
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p 
                          className="p-4 text-center"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          No new notifications
                        </p>
                      ) : (
                        notifications.map((notification, index) => (
                          <div 
                            key={index} 
                            className="px-4 py-3 border-b transition-colors hover:bg-opacity-50"
                            style={{ 
                              borderColor: theme.colors.borderLight,
                              color: theme.colors.text
                            }}
                          >
                            {notification}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sessions Dropdown */}
              <div className="relative" ref={sessionRef}>
                <button
                  onClick={() => setShowSessions(!showSessions)}
                  className="p-2 rounded-xl transition-all hover:bg-white/10"
                  style={{ color: isDark ? theme.colors.text : 'white' }}
                >
                  <FaCalendarAlt className="text-lg" />
                </button>
                
                {showSessions && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <div 
                      className="px-4 py-3 font-semibold border-b"
                      style={{ 
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                      }}
                    >
                      Upcoming Sessions
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {sessions.length === 0 ? (
                        <p 
                          className="p-4 text-center"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          No upcoming sessions
                        </p>
                      ) : (
                        sessions.map((session) => (
                          <div 
                            key={session._id} 
                            className="px-4 py-3 border-b"
                            style={{ borderColor: theme.colors.borderLight }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 
                                  className="font-medium"
                                  style={{ color: theme.colors.text }}
                                >
                                  {session.trainerId?.name || 'Trainer'}
                                </h4>
                                <p 
                                  className="text-sm"
                                  style={{ color: theme.colors.textSecondary }}
                                >
                                  {new Date(session.date).toLocaleString()}
                                </p>
                              </div>
                              <span 
                                className="px-3 py-1 text-xs rounded-full font-medium text-white"
                                style={{
                                  backgroundColor: session.status === "approved"
                                    ? theme.colors.success
                                    : session.status === "requested"
                                    ? theme.colors.warning
                                    : theme.colors.error
                                }}
                              >
                                {session.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Switcher */}
              <ThemeSwitcher inNavbar />

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ml-2"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: isDark ? '#f87171' : 'white'
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Theme Switcher for unauthenticated users */}
              <ThemeSwitcher inNavbar />
              
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:bg-white/10"
                style={{ color: isDark ? theme.colors.text : 'white' }}
              >
                <FaSignInAlt />
                Login
              </Link>
              
              <Link 
                to="/signup" 
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all"
                style={{ 
                  backgroundColor: isDark ? theme.colors.primary : 'white',
                  color: isDark ? 'white' : theme.colors.primary
                }}
              >
                <FaUserPlus />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden p-2 rounded-xl transition-all"
          onClick={toggleMenu}
          style={{ 
            color: isDark ? theme.colors.text : 'white',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}
        >
          {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden px-4 pb-4 space-y-2"
          style={{ backgroundColor: theme.colors.surface }}
        >
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                Dashboard
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser />
                Profile
              </Link>

              <Link 
                to="/subscription" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCrown />
                Subscription
              </Link>

              <Link 
                to="/notifications" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaBell />
                Notifications
              </Link>

              <Link 
                to="/sessions" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCalendarAlt />
                Sessions
              </Link>

              {isAdmin && (
                <Link 
                  to="/AdminDashboard" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{ 
                    color: theme.colors.primary,
                    backgroundColor: `${theme.colors.primary}20`
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCrown />
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                style={{ 
                  color: theme.colors.error,
                  backgroundColor: `${theme.colors.error}20`
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ color: theme.colors.text }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt />
                Login
              </Link>
              
              <Link 
                to="/signup" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserPlus />
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
