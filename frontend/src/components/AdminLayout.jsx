import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/doctor-login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`admin-shell ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-badge dark">DR</span>
          <div>
            <h2>Doctor Panel</h2>
            <p>CarePoint Admin</p>
          </div>
        </div>
        <div className="sidebar-group">
          <span className="sidebar-label">Navigation</span>
          <a href="#dashboard" onClick={closeSidebar}>Overview</a>
          <a href="#appointments" onClick={closeSidebar}>Appointments</a>
          <a href="#prescription" onClick={closeSidebar}>Prescriptions</a>
          <a href="#pharmacy" onClick={closeSidebar}>Pharmacy</a>
        </div>
        <div className="sidebar-footer">
          <span>Logged in as</span>
          <strong>{user?.name}</strong>
        </div>
      </aside>
      <button
        className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
        aria-label="Close menu"
      />
      <div className="admin-main">
        <header className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-identity" aria-label="Doctor profile">
            <div className="topbar-avatar">
              {user?.name?.slice(0, 2)?.toUpperCase() || "DR"}
            </div>
            <span className="topbar-title">Doctor Panel</span>
          </div>
          <button
            className="topbar-icon-button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <span className="logout-icon" aria-hidden="true">
              ↗
            </span>
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
