import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useTheme } from "../../context/ThemeContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { 
  FaHome, 
  FaDumbbell, 
  FaAppleAlt, 
  FaChartLine, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCrown,
  FaBell,
  FaUserTie,
  FaCalendarAlt,
  FaLock
} from "react-icons/fa";

const CustomerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const { canAccessPath, getRequiredFeature, isActive: hasActiveSubscription, planName } = useSubscription();

  // Nav links with required features
  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: FaHome, requiredFeature: null },
    { path: "/customer/trainers", label: "Find Trainers", icon: FaUserTie, requiredFeature: "Personal Trainer" },
    { path: "/customer/sessions", label: "My Sessions", icon: FaCalendarAlt, requiredFeature: "One-on-One Sessions" },
    { path: "/customer/workouts", label: "My Workouts", icon: FaDumbbell, requiredFeature: "Workout Videos" },
    { path: "/customer/diet-plans", label: "My Diet", icon: FaAppleAlt, requiredFeature: "Diet Plans" },
    { path: "/customer/progress", label: "My Progress", icon: FaChartLine, requiredFeature: "Progress Tracking" },
    { path: "/customer/subscription", label: "Subscription", icon: FaCrown, requiredFeature: null },
    { path: "/customer/notifications", label: "Notifications", icon: FaBell, requiredFeature: null },
    { path: "/profile", label: "Profile", icon: FaUser, requiredFeature: null },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: theme.colors.background }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'} shadow-xl overflow-x-hidden sidebar-scrollbar`}
        style={{ 
          background: theme.colors.sidebarGradient,
          borderRight: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="h-full flex flex-col">

    {/* Desktop Toggle */}
           <div className="hidden lg:flex justify-end px-4 mb-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: theme.colors.textSecondary }}
            >
              {isCollapsed ? <FaBars className="text-sm" /> : <FaTimes className="text-sm" />}
            </button>
           </div>

          {/* Logo Area */}
          <div className="p-4 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
               
              >
              <img src="/fithum_logo_.png" alt="" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold" style={{ color: theme.colors.text }}>FitHum</h1>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Customer Portal</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActivePath(link.path);
              const hasAccess = canAccessPath(link.path);
              const isLocked = link.requiredFeature && !hasAccess;
              
              return (
                <Link
                  key={link.path}
                  to={isLocked ? "/customer/subscription" : link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    active ? 'shadow-md translate-x-1' : 'hover:translate-x-1'
                  } ${isCollapsed ? 'justify-center' : ''} ${isLocked ? 'opacity-60' : ''}`}
                  style={{
                    backgroundColor: active ? theme.colors.primary : 'transparent',
                    color: active ? 'white' : theme.colors.textSecondary
                  }}
                  title={isCollapsed ? link.label : (isLocked ? `Upgrade to unlock ${link.label}` : '')}
                  onMouseEnter={(e) => {
                     if (!active) e.currentTarget.style.background = theme.colors.navHoverGradient;
                  }}
                  onMouseLeave={(e) => {
                     if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon className={`text-xl flex-shrink-0 ${active ? 'text-white' : ''}`} style={{ color: active ? 'white' : theme.colors.primary }} />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap flex-1">{link.label}</span>
                  )}
                  {!isCollapsed && isLocked && (
                    <FaLock className="text-xs" style={{ color: theme.colors.textSecondary }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-3" style={{ borderColor: theme.colors.border }}>
             {/* Theme Switcher */}
             <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl border transition-all`}
                  style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
               {!isCollapsed && <span className="font-medium text-sm" style={{ color: theme.colors.textSecondary }}>Theme</span>}
               <ThemeSwitcher isCollapsed={isCollapsed} />
             </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} px-4 py-3 rounded-xl transition-all hover:bg-red-50 text-red-600 font-medium whitespace-nowrap`}
              style={{ 
                border: `1px solid ${theme.colors.border}`
              }}
              title="Logout"
            >
              <FaSignOutAlt />
              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <header 
          className="lg:hidden p-4 flex items-center justify-between shadow-sm"
          style={{ backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }}
        >
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: theme.colors.text }}
          >
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold" style={{ color: theme.colors.text }}>Customer Portal</span>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
