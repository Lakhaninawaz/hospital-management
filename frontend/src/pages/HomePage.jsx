import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="site-shell">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="tag">Smart healthcare made simple</p>
            <h1>Your Hospital, Your Appointments, Your Health</h1>
            <p className="hero-text">
              Say goodbye to long waiting lines and confusing paperwork. Book appointments 
              with your trusted doctors in minutes, manage your health records, and get prescriptions 
              and bills all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="primary-btn">
                Get Started
              </Link>
              <Link to="/login" className="secondary-btn">
                Sign In
              </Link>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <strong>Quick Booking</strong>
                <span>Find doctors, check availability, book in seconds</span>
              </div>
              <div className="metric-card">
                <strong>Easy Management</strong>
                <span>Appointments, prescriptions, bills in one dashboard</span>
              </div>
            </div>
            <div className="hero-strip">
              <div>
                <strong>24/7 Access</strong>
                <span>Book appointments anytime, anywhere</span>
              </div>
              <div>
                <strong>Instant Updates</strong>
                <span>Real-time notifications for your appointments</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="pulse-card">
              <span className="pulse-title">Patient First Design</span>
              <h3>Healthcare made for you, not against you</h3>
              <p>
                Simple navigation, secure login, instant confirmations, and 
                mobile-friendly design make managing your health effortless.
              </p>
            </div>
            <div className="mini-grid">
              <div className="mini-card">
                <h4>✓ Browse Doctors</h4>
                <p>Find specialists and check availability</p>
              </div>
              <div className="mini-card">
                <h4>✓ Book Appointments</h4>
                <p>Schedule visits in your preferred time slot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="container feature-grid">
          <div className="feature-card">
            <h3>Smart Booking</h3>
            <p>Browse doctors by specialty, check real-time availability, and book appointments instantly.</p>
          </div>
          <div className="feature-card">
            <h3>Health Records</h3>
            <p>Keep all your appointments, prescriptions, and medical documents in one secure place.</p>
          </div>
          <div className="feature-card">
            <h3>Secure & Private</h3>
            <p>Your health data is encrypted, protected, and only accessible to you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
