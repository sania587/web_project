import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import Navbar from "./components/Navbar";
import "./index.css";

// Common Pages
import LoginPage from "./pages/LoginPage";
import AskRole from "./pages/AskRole";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages & Components
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminSignup from "./pages/Admin/AdminSignupPage";
import ManageCustomersPage from './pages/Admin/ManageCustomersPage';
import ManageTrainers from './pages/Admin/ManageTrainersPage';
import PaymentPage from './pages/Admin/PaymentPage';
import ReportPage from './pages/Admin/reportPage';
import FeedbackComponent from './components/Admin/FeedbackComponent';
import SubscriptionComponent from "./components/Admin/SubscriptionComponent";
import NotificationsComponent from "./components/Admin/NotificationsComponent";

// Customer Pages
import CustomerSignupPage from "./pages/Customer/CustomerSignupPage";
import CustomerDashboard from "./pages/Customer/dashboardPage";

// Trainer Pages
import TrainerSignup from "./pages/Trainer/TrainerSignup";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard";
import TrainerWorkouts from "./pages/Trainer/TrainerWorkouts";
import ExerciseBrowser from "./pages/Trainer/ExerciseBrowser";
import ExerciseDetailPage from "./pages/Trainer/ExerciseDetailPage";
import { WorkoutsContextProvider } from "./components/Trainer/Workouts/WorkoutsContext";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <WorkoutsContextProvider>
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/gym-img.jpg)' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                  <h1 className="text-5xl font-bold mb-4">Welcome to FitHum!</h1>
                  <p className="text-xl mb-6">Your journey to fitness starts here. Join us and unlock your potential!</p>
                  <Link to="/login">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ask-role" element={<AskRole />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Signup Routes */}
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/trainer" element={<TrainerSignup />} />
          <Route path="/signup/customer" element={<CustomerSignupPage />} />

          {/* Admin Routes */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/manageTrainers" element={<ManageTrainers />} />
          <Route path="/manageusers" element={<ManageCustomersPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/manage-subscriptions" element={<SubscriptionComponent />} />
          <Route path="/feedback" element={<FeedbackComponent />} />
          <Route path="/admin/notifications" element={<NotificationsComponent />} />

          {/* Customer Routes */}
          <Route path="/dashboard" element={<CustomerDashboard />} />

          {/* Trainer Routes */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/workouts" element={<TrainerWorkouts />} />
          <Route path="/trainer/exercises" element={<ExerciseBrowser />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
        </Routes>
      </WorkoutsContextProvider>
    </Router>
  );
};

export default App;