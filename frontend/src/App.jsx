import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import Navbar from "./components/Navbar";
import "./index.css";

// Common Pages
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import AskRole from "./pages/AskRole"; // Keeping for safety vs deletion, though unused route
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";

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
import CustomerWorkoutsPage from "./pages/Customer/CustomerWorkoutsPage";
import CustomerDietPlansPage from "./pages/Customer/CustomerDietPlansPage";
import CustomerProgressPage from "./pages/Customer/CustomerProgressPage";
import CustomerSchedulePage from "./pages/Customer/CustomerSchedulePage";
import CustomerSubscriptionPage from "./pages/Customer/CustomerSubscriptionPage";
import CustomerNotificationsPage from "./pages/Customer/Notifications";
import FindTrainersPage from "./pages/Customer/FindTrainersPage";
import CustomerSessionsPage from "./pages/Customer/CustomerSessionsPage";

// Trainer Pages
import TrainerSignup from "./pages/Trainer/TrainerSignup";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard";
import TrainerWorkouts from "./pages/Trainer/TrainerWorkouts";
import ExerciseBrowser from "./pages/Trainer/ExerciseBrowser";
import ExerciseDetailPage from "./pages/Trainer/ExerciseDetailPage";
import DietPlansPage from "./pages/Trainer/DietPlansPage";
import TrainerSchedulePage from "./pages/Trainer/TrainerSchedulePage";
import TrainerClientsPage from "./pages/Trainer/TrainerClientsPage";
import TrainerNotificationsPage from "./pages/Trainer/TrainerNotificationsPage";
import { WorkoutsContextProvider } from "./components/Trainer/Workouts/WorkoutsContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

const AppContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  // List of routes where the global Navbar should be hidden (e.g., Admin pages)
  const hideNavbarRoutes = [
    '/AdminDashboard',
    '/manageTrainers',
    '/manageusers',
    '/reports',
    '/payment',
    '/manage-subscriptions',
    '/feedback',
    '/admin/notifications',
    '/trainer',
    '/dashboard',
    '/profile',
    '/customer'
  ];

  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <SubscriptionProvider>
      <WorkoutsContextProvider>
        {shouldShowNavbar && <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />

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
          <Route path="/customer/trainers" element={<FindTrainersPage />} />
          <Route path="/customer/sessions" element={<CustomerSessionsPage />} />
          <Route path="/customer/workouts" element={<CustomerWorkoutsPage />} />
          <Route path="/customer/diet-plans" element={<CustomerDietPlansPage />} />
          <Route path="/customer/progress" element={<CustomerProgressPage />} />
          <Route path="/customer/schedule" element={<CustomerSchedulePage />} />
          <Route path="/customer/subscription" element={<CustomerSubscriptionPage />} />
          <Route path="/customer/notifications" element={<CustomerNotificationsPage />} />

          {/* Trainer Routes */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/workouts" element={<TrainerWorkouts />} />
          <Route path="/trainer/exercises" element={<ExerciseBrowser />} />
          <Route path="/trainer/diet-plans" element={<DietPlansPage />} />
          <Route path="/trainer/schedule" element={<TrainerSchedulePage />} />
          <Route path="/trainer/clients" element={<TrainerClientsPage />} />
          <Route path="/trainer/notifications" element={<TrainerNotificationsPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
        </Routes>
      </WorkoutsContextProvider>
    </SubscriptionProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;