import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function LoginPage({ role }) {
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await login({ ...formData, role });
      showSuccess(
        role === "doctor" ? "Doctor login successful" : "Patient login successful"
      );
      navigate(user.role === "doctor" ? "/doctor" : "/patient");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-layout">
        <div className="auth-copy">
          <p className="tag">{role === "doctor" ? "Doctor Access" : "Patient Access"}</p>
          <h2>{role === "doctor" ? "Doctor Login" : "Patient Login"}</h2>
          <p>
            {role === "doctor"
              ? "Access the admin dashboard to manage appointments and prescriptions."
              : "Login to book appointments, track prescriptions, and download bills."}
          </p>
          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>{role === "doctor" ? "Daily overview" : "Quick booking"}</strong>
              <span>
                {role === "doctor"
                  ? "Review patient requests and stay on top of your queue."
                  : "Find doctors and reserve appointments with less friction."}
              </span>
            </div>
            <div className="auth-highlight">
              <strong>{role === "doctor" ? "Prescriptions" : "All records together"}</strong>
              <span>
                {role === "doctor"
                  ? "Create prescriptions and generate bills from the same workflow."
                  : "See appointments, prescriptions, notifications, and bills in one place."}
              </span>
            </div>
          </div>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-form-header">
            <span className="form-kicker">Secure sign in</span>
            <h3>{role === "doctor" ? "Welcome back, doctor" : "Welcome back"}</h3>
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="primary-btn full-width">
            Login
          </button>
          {role === "patient" && (
            <p className="small-text">
              New patient? <Link to="/signup">Create account</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
