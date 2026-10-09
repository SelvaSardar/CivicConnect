import { ArrowLeft, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

import "./Settings.css";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "staff") {
      navigate("/staff-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="settings-page">
      
       <button
          className="settings-back-btn"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

      <div className="settings-card">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your CivicConnect preferences.</p>
        </div>

        <div className="settings-item">
          <div className="settings-item-info">
            {theme === "light" ? (
              <Sun size={22} />
            ) : (
              <Moon size={22} />
            )}

            <div>
              <h3>Appearance</h3>
              <p>
                Switch between light and dark mode.
              </p>
            </div>
          </div>

          <button
            className="settings-toggle"
            onClick={toggleTheme}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <div className="settings-item logout-item">
          <div className="settings-item-info">
            <LogOut size={22} />

            <div>
              <h3>Logout</h3>
              <p>Sign out from your CivicConnect account.</p>
            </div>
          </div>

          <button
            className="settings-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;