import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function DoctorSignupPage() {
  const { doctorSignup } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: ""
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await doctorSignup(formData);
      showSuccess("Doctor account created successfully");
      navigate("/doctor-login");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-layout">
        <div className="auth-copy">
          <p className="tag">Doctor Registration</p>
          <h2>Join Our Team</h2>
          <p>
            Register as a doctor to manage appointments, prescribe treatments,
            and provide care to your patients seamlessly.
          </p>
          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Quick Setup</strong>
              <span>Register and start managing patients right away.</span>
            </div>
            <div className="auth-highlight">
              <strong>Full Control</strong>
              <span>Manage appointments, prescriptions, and patient records.</span>
            </div>
          </div>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-form-header">
            <span className="form-kicker">Doctor registration</span>
            <h3>Create Your Doctor Account</h3>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization (e.g., Cardiology)"
            value={formData.specialization}
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
            Create Account
          </button>
          <p className="small-text">
            Already registered? <Link to="/doctor-login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorSignupPage;
