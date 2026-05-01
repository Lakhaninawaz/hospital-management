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

This Hospital Management System provides a comprehensive platform for managing healthcare services with clear separation between patients and doctors:
- **Patients (Users)**: Register, book appointments with doctors, view prescriptions, receive bills, and manage medical records
- **Doctors**: Register, manage patient appointments, create prescriptions, generate bills, and view their dashboard
- **Key Architecture**: Clean separation of User (patients) and Doctor models for better data integrity and role management

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

## 📋 Database Models & Architecture

### Clean Separation of Concerns
This system uses **separate User and Doctor collections** for better data integrity:
- **User Model**: Represents patients only (not doctors)
- **Doctor Model**: Standalone model for doctors with their own credentials
- **No role field in User**: Eliminates confusion between patient/doctor roles

### User Model (Patients Only)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  isApproved: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model (Standalone)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  specialization: String,
  isApproved: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  date: Date,
  status: String (enum: ["pending", "accepted", "rejected"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Prescription Model
```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment),
  medicines: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Bill Model
```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment),
  amount: Number,
  pdfUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

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

**Patient (User) Flow:**
```
Patient Signup → POST /auth/signup → Create User → JWT Generated
           ↓
Patient Login → POST /auth/login { email, password, role: "patient" }
           ↓
Backend finds User → Verifies password → Returns JWT with role="patient"
           ↓
Token stored in localStorage → Authenticated as patient
```

**Doctor Flow:**
```
Doctor Signup → POST /auth/doctor-signup → Create Doctor → Direct to login
           ↓
Doctor Login → POST /auth/login { email, password, role: "doctor" }
           ↓
Backend finds Doctor → Verifies password → Returns JWT with role="doctor"
           ↓
Token stored in localStorage → Authenticated as doctor
```

### Authorization Middleware
```
Request with JWT → authMiddleware.protect()
           ↓
Decode token → Find User or Doctor by ID
           ↓
Set req.user = { ...userData, role: "patient|doctor" }
           ↓
authorizeRoles("patient"|"doctor") → Allow/Deny based on role
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

## 📝 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Patient registration | ❌ |
| POST | `/api/auth/doctor-signup` | Doctor registration | ❌ |
| POST | `/api/auth/login` | Login (patient or doctor) | ❌ |
| GET | `/api/auth/me` | Get current user info | ✅ |

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient" // or "doctor"
}
```

### Doctor Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/doctors` | Get all doctors | ❌ |

### Appointment Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/appointments` | Get my appointments | ✅ | patient/doctor |
| POST | `/api/appointments` | Book appointment | ✅ | patient |
| PUT | `/api/appointments/:id/status` | Update appointment status | ✅ | doctor |
| GET | `/api/appointments/dashboard/summary` | Doctor dashboard stats | ✅ | doctor |

### Prescription Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/prescriptions` | Create prescription | ✅ | doctor |
| GET | `/api/prescriptions/my` | Get my prescriptions | ✅ | patient |

### Bill Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/bills/my` | Get my bills | ✅ | patient/doctor |
| POST | `/api/bills/generate/:appointmentId` | Generate bill | ✅ | doctor |

### Notification Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get notifications | ✅ |

---

## 🛠️ Troubleshooting

### Database Issues

**MongoDB Connection Issues**
- Ensure MongoDB service is running: `mongod`
- Check connection string in `.env` file
- Verify firewall settings allow port 27017
- For MongoDB Atlas, whitelist your IP address

**Database Reset**
```bash
# Clear all collections (use with caution!)
# Connect to MongoDB and run:
db.users.deleteMany({})
db.doctors.deleteMany({})
db.appointments.deleteMany({})
db.prescriptions.deleteMany({})
db.bills.deleteMany({})
```

### Port Issues

**Port Already in Use**
```bash
# Find what's using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

**Frontend Port Issues**
- Vite uses port 5173 by default
- If port 5173 is in use, Vite will auto-increment to 5174, etc.

### Authentication Issues

**"Invalid Token" Error**
- Check if JWT_SECRET in `.env` matches between sessions
- Clear localStorage and re-login
- Ensure Authorization header format: `Bearer <token>`

**Login Failing with "Invalid credentials"**
- Verify email and password are correct
- Ensure you're using the correct login endpoint:
  - Patients: `POST /api/auth/login` with `role: "patient"`
  - Doctors: `POST /api/auth/login` with `role: "doctor"`
- Check if account is approved (isApproved: true)

**"Doctor profile not found"**
- This should NOT occur with the new system
- If it does, ensure you registered as doctor using `/api/auth/doctor-signup`
- Doctor records are created directly in Doctor collection (not User)

### Module & Dependency Issues

**Module Not Found Errors**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Missing Environment Variables**
- Backend requires: `MONGODB_URI`, `JWT_SECRET`, `PORT`
- Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

### Common Errors

**"Appointment not found" or "Doctor not found"**
- Verify the IDs are valid MongoDB ObjectIds
- Check that references exist in database
- Review CRUD operations in respective controllers

**PDF Generation Issues**
- Ensure `/uploads/bills` directory exists (created automatically)
- Check write permissions on uploads directory
- Verify PDFKit is installed: `npm list pdfkit`

**CORS Issues**
- Frontend and backend must be on different ports
- Check that API_BASE_URL in frontend/src/utils/api.js matches backend URL
- Backend CORS settings may need adjustment if using different domain

---

## 📚 Key Concepts

### Role-Based Authorization
```javascript
// In middleware
protect() → Verifies JWT, sets req.user with role
authorizeRoles("patient", "doctor") → Checks if user role matches

// Example usage in routes
router.post("/", protect, authorizeRoles("doctor"), addPrescription);
```

### Token Structure
```javascript
// JWT token contains:
{
  id: ObjectId,      // User or Doctor ID
  role: "patient|doctor",
  iat: timestamp,
  exp: timestamp
}
```

### User vs Doctor Data Sources
| Operation | User (Patient) | Doctor |
|-----------|----------------|--------|
| Signup | POST /auth/signup | POST /auth/doctor-signup |
| Collection | `users` | `doctors` |
| Password | Stored in User doc | Stored in Doctor doc |
| Role | Always "patient" | Always "doctor" |
| Appointments | patientId reference | doctorId reference |

---

## 🧪 Testing the System

### 1. Patient Registration & Login
```bash
# Signup as patient
POST http://localhost:5000/api/auth/signup
{
  "name": "John Doe",
  "email": "patient@example.com",
  "password": "password123"
}

# Login as patient
POST http://localhost:5000/api/auth/login
{
  "email": "patient@example.com",
  "password": "password123",
  "role": "patient"
}
```

### 2. Doctor Registration & Login
```bash
# Signup as doctor
POST http://localhost:5000/api/auth/doctor-signup
{
  "name": "Dr. Smith",
  "email": "doctor@example.com",
  "password": "password123",
  "specialization": "Cardiology"
}

# Login as doctor
POST http://localhost:5000/api/auth/login
{
  "email": "doctor@example.com",
  "password": "password123",
  "role": "doctor"
}
```

### 3. Book Appointment (as Patient)
```bash
# Get doctors first
GET http://localhost:5000/api/doctors

# Book appointment (use doctor's _id from response)
POST http://localhost:5000/api/appointments
Headers: Authorization: Bearer <patient_token>
{
  "doctorId": "<doctor_id_here>",
  "date": "2025-06-15T14:00:00Z"
}
```

### 4. Create Prescription (as Doctor)
```bash
# Get appointments
GET http://localhost:5000/api/appointments
Headers: Authorization: Bearer <doctor_token>

# Create prescription (use appointment's _id)
POST http://localhost:5000/api/prescriptions
Headers: Authorization: Bearer <doctor_token>
{
  "appointmentId": "<appointment_id_here>",
  "medicines": ["Medicine A", "Medicine B"],
  "notes": "Take twice daily"
}
```

---

## 📊 Architecture Highlights

### Why Separate User & Doctor Models?

**Benefits:**
✅ **Clear Separation**: Users = Patients only, Doctors = Doctors only
✅ **No Confusion**: No mixed role in User model
✅ **Better Security**: Separate password hashing for each collection
✅ **Scalability**: Easy to add features specific to doctors or patients
✅ **Data Integrity**: References directly to correct model types
✅ **Performance**: No need for role-based queries on User model

### Data Flow Diagram
```
Frontend (React)
    ↓
AuthContext (stores token & user)
    ↓
Axios API Requests
    ↓
Express Middleware (protect, authorizeRoles)
    ↓
Controllers (business logic)
    ↓
MongoDB Collections:
  - users (patients)
  - doctors
  - appointments
  - prescriptions
  - bills
    ↓
Response back to Frontend
    ↓
Context Update → UI Re-render
```

---

## 📄 Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hospital-management
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-management

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## 📧 Support & Debugging

**Check Logs:**
- **Backend Logs**: Terminal where `npm run dev` is running
- **Frontend Logs**: Browser DevTools Console (F12)
- **MongoDB Logs**: MongoDB startup output

**Debug Tips:**
1. Check Network tab in DevTools to verify API calls
2. Review MongoDB collections: `db.users.find()`, `db.doctors.find()`
3. Verify tokens in localStorage: `localStorage.getItem('hms_token')`
4. Check server logs for auth failures and validation errors

---

**Happy coding! 🎉**
