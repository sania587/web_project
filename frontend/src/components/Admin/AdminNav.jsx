import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { 
  FaHome, 
  FaChartBar, 
  FaUsers, 
  FaUserTie, 
  FaCreditCard, 
  FaTags, 
  FaComments,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/AdminDashboard", label: "Dashboard", icon: FaHome },
    { path: "/reports", label: "Reports & Analytics", icon: FaChartBar },
    { path: "/manageTrainers", label: "Trainers", icon: FaUserTie },
    { path: "/manageusers", label: "Customers", icon: FaUsers },
    { path: "/payment", label: "Payments", icon: FaCreditCard },
    { path: "/manage-subscriptions", label: "Subscriptions", icon: FaTags },
    { path: "/feedback", label: "Feedback", icon: FaComments },
    { path: "/admin/notifications", label: "Notifications", icon: FaBell },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">FitHum Admin</h1>
              <p className="text-xs text-indigo-200">Management Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-white/20 text-white shadow-inner"
                      : "text-indigo-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button 
              onClick={() => navigate("/admin/notifications")}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              <FaBell className="text-lg" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-xs flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500 rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden px-4 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-white/20 text-white"
                      : "text-indigo-100 hover:bg-white/10"
                  }`}
                >
                  <Icon />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
};

export default AdminNav;
