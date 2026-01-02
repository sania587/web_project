# FitHum - Fitness Management Platform 🏋️‍♂️

A comprehensive fitness management web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects fitness enthusiasts with professional trainers.

![FitHum Logo](frontend/public/fithum_logo_.png)

## 🚀 Features

### Authentication & Security
- **Email/Password Authentication** - Traditional signup and login
- **Google Sign-In** - One-click authentication with Google OAuth 2.0
- **Forgot Password** - Secure OTP-based password reset via email
- **Role-Based Access** - Separate dashboards for Customers, Trainers, and Admins

### User Profiles
- **Comprehensive Profile System** - Collect detailed user information
- **Customer Profiles**: Height, weight, fitness level, health goals, health conditions, preferred workout time, emergency contacts
- **Trainer Profiles**: Bio, hourly rate, years of experience, certifications, languages, social links (Instagram, LinkedIn, YouTube, Website)
- **Profile Picture Upload** - Custom profile images

### Customer Features
- **Personalized Dashboard** - Track fitness progress and goals
- **Workout Plans** - Access customized workout routines
- **Exercise Library** - Browse 1300+ exercises by body part
- **Trainer Booking** - Find and book sessions with trainers
- **Subscription Plans** - Access premium features

### Trainer Features
- **Trainer Dashboard** - Manage clients and sessions
- **Client Management** - Track client progress
- **Workout Plan Creation** - Design custom workout plans
- **Availability Management** - Set availability for bookings
- **Performance Stats** - View ratings and session completion rates

### Admin Features
- **Admin Dashboard** - Platform overview and analytics
- **User Management** - Manage customers and trainers
- **Subscription Management** - Create and manage plans
- **Payment Tracking** - Monitor transactions
- **Reports & Analytics** - Platform performance insights

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Icons** for UI icons
- **@react-oauth/google** for Google Sign-In

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Multer** for file uploads

## 📁 Project Structure

```
web_project/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── Admin/        # Admin pages
│   │   │   ├── Customer/     # Customer pages
│   │   │   └── Trainer/      # Trainer pages
│   │   ├── context/          # React contexts (Theme)
│   │   ├── redux/            # Redux store & slices
│   │   └── App.jsx           # Main app component
│   └── package.json
│
├── backend/                  # Express backend
│   ├── controllers/          # Route controllers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   ├── uploads/              # File uploads
│   └── server.js             # Entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email services)
- Google Cloud Console project (for Google Sign-In)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sania587/web_project.git
   cd web_project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Start the development servers**

   Backend (from `/backend`):
   ```bash
   npm start
   ```

   Frontend (from `/frontend`):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password (16 characters) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

## 📱 Theme Support

FitHum supports 6 beautiful themes:
- Midnight Purple (default dark)
- Ocean Blue (dark)
- Forest Green (dark)
- Light Lavender (light)
- Light Sky (light)
- Light Mint (light)

## 👥 User Roles

| Role | Access |
|------|--------|
| **Customer** | Dashboard, Workouts, Trainers, Profile, Subscriptions |
| **Trainer** | Dashboard, Clients, Plans, Availability, Profile |
| **Admin** | All management features, Reports, Analytics |

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

**Taimoor Raza Asif** - [GitHub](https://github.com/Taimoor-Raza-Asif)

---

Made with ❤️ for fitness enthusiasts
