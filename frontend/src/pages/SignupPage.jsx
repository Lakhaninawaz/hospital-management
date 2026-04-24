import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function SignupPage() {
  const { signup } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signup(formData);
      showSuccess("Account created successfully");
      navigate("/patient");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-layout">
        <div className="auth-copy">
          <p className="tag">New Patient</p>
          <h2>Create Your Account</h2>
          <p>
            Register once to book appointments, receive prescriptions, and download
            your bills anytime.
          </p>
          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Simple onboarding</strong>
              <span>Create your account quickly and start booking right away.</span>
            </div>
            <div className="auth-highlight">
              <strong>Care history</strong>
              <span>Keep appointments, prescriptions, and bills neatly organized.</span>
            </div>
          </div>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-form-header">
            <span className="form-kicker">Patient registration</span>
            <h3>Start your care journey</h3>
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
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
