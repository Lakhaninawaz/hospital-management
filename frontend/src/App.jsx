import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DoctorSignupPage from "./pages/DoctorSignupPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  const { user } = useAuth();

  return (
    <>
      {(!user || user.role === "patient") && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage role="patient" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/doctor-login" element={<LoginPage role="doctor" />} />
        <Route path="/doctor-signup" element={<DoctorSignupPage />} />
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <AdminLayout>
                <DoctorDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user?.role === "doctor" ? "/doctor" : "/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
