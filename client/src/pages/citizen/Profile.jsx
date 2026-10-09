import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

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

  return (
    <div className="profile-page">

      <button
        className="profile-back-btn"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="profile-card">
        <h1>My Profile</h1>

        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <div>
            <span>Name</span>
            <strong>{user?.name || "—"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user?.email || "—"}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{user?.phone || "Not provided"}</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {user?.role
                ? user.role.charAt(0).toUpperCase() +
                user.role.slice(1)
                : "—"}
            </strong>
          </div>

          <div>
            <span>Account Status</span>
            <strong>
              {user?.isActive ? "Active" : "Inactive"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;