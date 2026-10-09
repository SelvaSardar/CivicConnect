import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  FileText,
  Home,
  LogOut,
  MapPin,
  Menu,
  PlusCircle,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./CitizenDashboard.css";

const CitizenDashboard = () => {
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/complaints/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(response.data.complaints || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load complaints."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchComplaints();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const handleLogout = () => {
    logout();
  };

  const getStatusClass = (status) => {
    return `status-${status
      .toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  return (
    <div className="citizen-dashboard">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`dashboard-sidebar ${isSidebarOpen ? "sidebar-open" : ""
          }`}
      >

        <div className="dashboard-logo">

          <div className="dashboard-logo-icon">
            C
          </div>

          <div className="dashboard-logo-text">
            Civic<span>Connect</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>

        </div>

        <nav className="dashboard-nav">

          <p className="dashboard-nav-title">
            MENU
          </p>

          <a
            href="#dashboard"
            className="dashboard-nav-item active"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </a>

          <a
            href="/complaints"
            className="dashboard-nav-item"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileText size={19} />
            <span>My Complaints</span>
          </a>

          <a
            href="/report"
            className="dashboard-nav-item"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PlusCircle size={19} />
            <span>Report Issue</span>
          </a>

          <p className="dashboard-nav-title dashboard-nav-space">
            ACCOUNT
          </p>

          <a
            href="/profile"
            className="dashboard-nav-item"
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserRound size={19} />
            <span>Profile</span>
          </a>

          <a
            href="/settings"
            className="dashboard-nav-item"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings size={19} />
            <span>Settings</span>
          </a>
          
        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <button
            type="button"
            className="dashboard-menu-button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="dashboard-header-left">

            <div>
              <p className="dashboard-page-label">
                Citizen Dashboard
              </p>

              <h1>
                Welcome back, {user?.name || "Citizen"} 👋
              </h1>
            </div>

          </div>

          <div className="dashboard-header-right">

            <button
              type="button"
              className="dashboard-notification"
              aria-label="Notifications"
            >
              <Bell size={20} />

              <span className="notification-dot"></span>
            </button>

            <div className="dashboard-user">

              <div className="dashboard-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || "C"}
              </div>

              <div className="dashboard-user-info">

                <strong>
                  {user?.name || "Citizen"}
                </strong>

                <span>
                  Citizen
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =========================
            DASHBOARD CONTENT
        ========================= */}

        <main className="dashboard-content">

          {/* Welcome Banner */}
          <section className="dashboard-welcome">

            <div>

              <span className="dashboard-welcome-badge">
                Community Portal
              </span>

              <h2>
                Make your community better.
              </h2>

              <p>
                Report civic issues, track your complaints,
                and stay updated on their progress.
              </p>

            </div>

            <button
              type="button"
              className="dashboard-report-button"
              onClick={() => navigate("/report")}
            >
              <PlusCircle size={19} />
              Report an Issue
            </button>

          </section>

          {/* =========================
              STATISTICS
          ========================= */}

          <section className="dashboard-stats">

            {/* Total */}
            <article className="dashboard-stat-card">

              <div className="dashboard-stat-icon total">
                <FileText size={21} />
              </div>

              <div>
                <span>
                  Total Complaints
                </span>

                <strong>
                  {totalComplaints}
                </strong>
              </div>

            </article>

            {/* Pending */}
            <article className="dashboard-stat-card">

              <div className="dashboard-stat-icon pending">
                <Bell size={21} />
              </div>

              <div>
                <span>
                  Pending
                </span>

                <strong>
                  {pendingComplaints}
                </strong>
              </div>

            </article>

            {/* In Progress */}
            <article className="dashboard-stat-card">

              <div className="dashboard-stat-icon progress">
                <MapPin size={21} />
              </div>

              <div>
                <span>
                  In Progress
                </span>

                <strong>
                  {inProgressComplaints}
                </strong>
              </div>

            </article>

            {/* Resolved */}
            <article className="dashboard-stat-card">

              <div className="dashboard-stat-icon resolved">
                <FileText size={21} />
              </div>

              <div>
                <span>
                  Resolved
                </span>

                <strong>
                  {resolvedComplaints}
                </strong>
              </div>

            </article>

          </section>

          {/* =========================
              RECENT COMPLAINTS
          ========================= */}

          <section
            className="dashboard-section"
            id="complaints"
          >

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-section-label">
                  Activity
                </span>

                <h2>
                  Recent Complaints
                </h2>

              </div>

              <a href="#complaints">
                View All
              </a>

            </div>

            {/* Loading */}
            {isLoading && (
              <div className="dashboard-empty">

                <div className="dashboard-loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <h3>
                  Loading complaints...
                </h3>

                <p>
                  Please wait while we fetch your complaints.
                </p>

              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="dashboard-empty">

                <div className="dashboard-empty-icon error-icon">
                  <FileText size={26} />
                </div>

                <h3>
                  Unable to load complaints
                </h3>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* No Complaints */}
            {!isLoading &&
              !error &&
              complaints.length === 0 && (
                <div className="dashboard-empty">

                  <div className="dashboard-empty-icon">
                    <FileText size={26} />
                  </div>

                  <h3>
                    No complaints yet
                  </h3>

                  <p>
                    You haven't reported any civic issues yet.
                    Start by reporting your first issue.
                  </p>

                  <button
                    type="button"
                    className="dashboard-empty-button"
                    onClick={() => navigate("/report")}
                  >
                    <PlusCircle size={18} />
                    Report Your First Issue
                  </button>

                </div>
              )}

            {/* Complaints */}
            {!isLoading &&
              !error &&
              complaints.length > 0 && (
                <div className="dashboard-complaint-list">

                  {complaints
                    .slice(0, 5)
                    .map((complaint) => (
                      <article
                        className="dashboard-complaint-item"
                        key={complaint._id}
                      >

                        <div className="dashboard-complaint-icon">
                          <FileText size={19} />
                        </div>

                        <div className="dashboard-complaint-info">

                          <h3>
                            {complaint.title}
                          </h3>

                          <p>
                            {complaint.category} •{" "}
                            {complaint.location?.address ||
                              "Location not available"}
                          </p>

                        </div>

                        <span
                          className={`dashboard-status ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>

                      </article>
                    ))}

                </div>
              )}

          </section>

        </main>

      </div>

    </div>
  );
};

export default CitizenDashboard;