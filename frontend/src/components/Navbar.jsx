import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDoctorDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDoctorDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDoctorDropdown = () => {
    setIsDoctorDropdownOpen((prev) => !prev);
  };

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDoctorDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDoctorDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <div className="brand-wrap">
          <span className="brand-badge">CP</span>
          <div>
            <Link to="/" className="brand">
              CarePoint Hospital
            </Link>
            <p className="brand-subtitle">Digital care for patients and doctors</p>
          </div>
        </div>
        <button
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>
          {user?.role === "patient" ? (
            <>
              <Link
                to="/patient"
                className={location.pathname === "/patient" ? "active" : ""}
              >
                Dashboard
              </Link>
              <button className="link-button nav-cta" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : user?.role === "doctor" ? (
            <>
              <Link
                to="/doctor"
                className={location.pathname === "/doctor" ? "active" : ""}
              >
                Dashboard
              </Link>
              <button className="link-button nav-cta" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Patient Login
              </Link>
              <Link
                to="/signup"
                className={location.pathname === "/signup" ? "active" : ""}
              >
                Patient Signup
              </Link>
              <div
                ref={dropdownRef}
                className={`doctor-dropdown ${isDoctorDropdownOpen ? "open" : ""}`}
                onMouseEnter={handleMouseEnterDropdown}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button 
                  className="doctor-dropdown-toggle"
                  onClick={toggleDoctorDropdown}
                >
                  Doctor
                </button>
                {isDoctorDropdownOpen && (
                  <div className="doctor-dropdown-menu">
                    <Link
                      to="/doctor-login"
                      className={location.pathname === "/doctor-login" ? "active" : ""}
                    >
                      Doctor Login
                    </Link>
                    <Link
                      to="/doctor-signup"
                      className={location.pathname === "/doctor-signup" ? "active" : ""}
                    >
                      Doctor Signup
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
