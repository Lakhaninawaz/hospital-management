# Hospital Management System

A comprehensive MERN (MongoDB, Express, React, Node.js) stack Hospital Management System designed for managing appointments, doctors, patients, prescriptions, and billing.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Flow](#project-flow)
- [Features](#features)
- [Default Credentials](#default-credentials)

---

## 🎯 Project Overview

This Hospital Management System provides a platform for:
- **Patients**: Book appointments, view prescriptions, and manage their medical records
- **Doctors**: Manage patient appointments, create prescriptions, and view patient details
- **Admins**: Manage system data including doctor profiles and billing information

---

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: PDFKit

### Frontend
- **Framework**: React with Vite
- **Styling**: CSS
- **API Communication**: Axios
- **State Management**: React Context API

---

## 📁 Project Structure

```
hospital-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/              # Request handlers
│   │   │   ├── appointmentController.js
│   │   │   ├── authController.js
│   │   │   ├── billController.js
│   │   │   ├── doctorController.js
│   │   │   ├── notificationController.js
│   │   │   └── prescriptionController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT verification
│   │   ├── models/                   # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Appointment.js
│   │   │   ├── Prescription.js
│   │   │   └── Bill.js
│   │   ├── routes/                   # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   ├── prescriptionRoutes.js
│   │   │   ├── billRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── services/
│   │   │   └── billService.js
│   │   └── utils/
│   │       ├── createBillPdf.js
│   │       └── generateToken.js
│   ├── uploads/                      # Stored bills
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SectionCard.jsx
│   │   ├── context/                  # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DoctorSignupPage.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── DoctorDashboard.jsx
│   │   ├── utils/
│   │   │   └── api.js                # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 📦 Prerequisites

Before running the project, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or MongoDB Atlas account)
- A code editor (VS Code recommended)

---

## 🚀 Installation & Setup

### 1. Clone/Extract the Repository
```bash
cd hospital-management
```

### 2. Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure secret key for JWT
# - PORT: Server port (default: 5000)
```

#### Step 4: Start MongoDB
```bash
# Option 1: Local MongoDB
mongod

# Option 2: MongoDB Atlas (update .env with your connection string)
```

#### Step 5: Start Backend Server
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Step 1: Navigate to Frontend Directory (in a new terminal)
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 🎮 Running the Application

1. **Ensure MongoDB is running** (check with `mongod`)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev` (in another terminal)
4. **Open Browser**: Navigate to `http://localhost:5173`

---

## 🔄 Project Flow

### Authentication Flow
```
User Input → Signup/Login Page → Backend Auth Controller 
→ JWT Token Generation → Store in Context/LocalStorage 
→ Authenticated Requests → ProtectedRoute Component
```

### Appointment Booking Flow
```
Patient Dashboard → Select Doctor & Time → Send Request to Backend 
→ Create Appointment Record in MongoDB 
→ Update Doctor's Appointment List 
→ Send Notification to Doctor 
→ Display Confirmation to Patient
```

### Prescription Flow
```
Doctor Dashboard → View Appointments → Create Prescription 
→ Store in Database → Send Notification to Patient 
→ Patient Views Prescription in Dashboard
```

### Billing & PDF Generation Flow
```
Bill Creation Request → Bill Service Processes Data 
→ PDF Generated using PDFKit → File Stored in /uploads/bills 
→ Bill Record Saved in MongoDB 
→ Link Sent to Patient for Download
```

### Data Flow Between Frontend & Backend
```
Frontend (React) 
    ↓
Axios API Calls (api.js) 
    ↓
Express Routes & Middleware 
    ↓
Controllers (Business Logic) 
    ↓
MongoDB Models & Database 
    ↓
Response back to Frontend 
    ↓
Context API State Update 
    ↓
UI Re-render
```

---

## ✨ Features

### Patient Features
- ✅ User Registration & Login
- ✅ View Available Doctors
- ✅ Book Appointments
- ✅ View Booked Appointments
- ✅ View Prescriptions from Doctors
- ✅ View Bills & Download Receipts (PDF)
- ✅ Receive Notifications

### Doctor Features
- ✅ Doctor Registration & Login
- ✅ View Appointments
- ✅ Create Prescriptions for Patients
- ✅ Manage Profile
- ✅ Receive Appointment Notifications

### Admin Features
- ✅ Manage Doctor Profiles
- ✅ View System Statistics
- ✅ Manage Bills & Billing
- ✅ System Overview

---

---

## 📝 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor profile

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription

### Bills
- `GET /api/bills` - Get bills
- `POST /api/bills` - Create bill
- `GET /api/bills/download/:id` - Download bill PDF

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify firewall settings

### Port Already in Use
```bash
# Change PORT in .env for backend (default 5000)
# Vite frontend uses 5173 by default
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📧 Support & Questions

For issues or questions, please check:
- Backend logs in terminal
- Browser console for frontend errors
- MongoDB logs for database issues

---

**Happy coding! 🎉**
