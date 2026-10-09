import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  MapPin,
  Menu,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints");

      if (response.data?.success) {
        setComplaints(response.data.complaints || []);
      } else {
        setError("Unable to fetch complaints");
      }
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to fetch complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const assignedComplaints = useMemo(() => {
    const currentUserId = user?.id || user?._id;

    return complaints.filter((complaint) => {
      const assignedId =
        complaint.assignedTo?._id || complaint.assignedTo;

      return assignedId?.toString() === currentUserId?.toString();
    });
  }, [complaints, user]);

  const stats = useMemo(() => {
    return {
      total: assignedComplaints.length,

      assigned: assignedComplaints.filter(
        (complaint) => complaint.status === "Assigned"
      ).length,

      inProgress: assignedComplaints.filter(
        (complaint) => complaint.status === "In Progress"
      ).length,

      resolved: assignedComplaints.filter(
        (complaint) => complaint.status === "Resolved"
      ).length,
    };
  }, [assignedComplaints]);

  const handleOpenComplaint = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedStatus(
      complaint.status === "Assigned"
        ? "In Progress"
        : complaint.status
    );

    setResolutionNote(complaint.resolutionNote || "");
    setUpdateMessage("");
  };

  const handleCloseModal = () => {
    if (isUpdating) return;

    setSelectedComplaint(null);
    setSelectedStatus("");
    setResolutionNote("");
    setUpdateMessage("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;

    if (!selectedStatus) {
      setUpdateMessage("Please select a status.");
      return;
    }

    if (
      selectedStatus === "Resolved" &&
      !resolutionNote.trim()
    ) {
      setUpdateMessage(
        "Please enter a resolution note before resolving."
      );
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateMessage("");

      const response = await api.put(
        `/complaints/${selectedComplaint._id}/status`,
        {
          status: selectedStatus,
          resolutionNote: resolutionNote.trim(),
        }
      );

      if (response.data?.success) {
        const updatedComplaint = response.data.complaint;

        setComplaints((currentComplaints) =>
          currentComplaints.map((complaint) =>
            complaint._id === updatedComplaint._id
              ? {
                  ...complaint,
                  ...updatedComplaint,
                }
              : complaint
          )
        );

        setSelectedComplaint(updatedComplaint);

        setUpdateMessage(
          "Complaint status updated successfully."
        );
      } else {
        setUpdateMessage(
          response.data?.message ||
            "Unable to update complaint."
        );
      }
    } catch (err) {
      console.error("Update status error:", err);

      setUpdateMessage(
        err.response?.data?.message ||
          "Unable to update complaint."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status-resolved";

      case "In Progress":
        return "status-progress";

      case "Assigned":
        return "status-assigned";

      case "Pending":
        return "status-pending";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCitizenName = (complaint) => {
    return complaint.reportedBy?.name || "Unknown Citizen";
  };

  const getCitizenEmail = (complaint) => {
    return complaint.reportedBy?.email || "No email available";
  };

  const getCitizenPhone = (complaint) => {
    return complaint.reportedBy?.phone || "No phone available";
  };

  return (
    <div className="staff-dashboard">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="staff-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`staff-sidebar ${
          sidebarOpen ? "staff-sidebar-open" : ""
        }`}
      >
        <div className="staff-sidebar-top">
          <div className="staff-brand">
            <div className="staff-brand-icon">
              <FileText size={21} />
            </div>

            <div>
              <h2>CivicConnect</h2>
              <span>Staff Portal</span>
            </div>
          </div>

          <button
            className="staff-mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={21} />
          </button>
        </div>

        <nav className="staff-sidebar-nav">
          <div className="staff-nav-item active">
            <FileText size={19} />
            <span>Complaints</span>
          </div>
        </nav>

        <div className="staff-sidebar-bottom">
          <div className="staff-user-card">
            <div className="staff-user-avatar">
              <UserRound size={20} />
            </div>

            <div className="staff-user-info">
              <strong>{user?.name || "Staff Member"}</strong>
              <span>Staff</span>
            </div>
          </div>

          <button
            className="staff-logout-btn"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="staff-main">
        {/* HEADER */}
        <header className="staff-header">
          <div className="staff-header-left">
            <button
              className="staff-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>Staff Dashboard</h1>
              <p>
                Manage and resolve complaints assigned to you.
              </p>
            </div>
          </div>

          <button
            className="staff-refresh-btn"
            onClick={fetchComplaints}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "staff-spin" : ""}
            />
            <span>Refresh</span>
          </button>
        </header>

        {/* CONTENT */}
        <div className="staff-content">
          {/* STATS */}
          <section className="staff-stats-grid">
            <div className="staff-stat-card">
              <div className="staff-stat-icon total">
                <FileText size={21} />
              </div>

              <div>
                <span>Total Assigned</span>
                <strong>{stats.total}</strong>
              </div>
            </div>

            <div className="staff-stat-card">
              <div className="staff-stat-icon assigned">
                <Clock3 size={21} />
              </div>

              <div>
                <span>Assigned</span>
                <strong>{stats.assigned}</strong>
              </div>
            </div>

            <div className="staff-stat-card">
              <div className="staff-stat-icon progress">
                <RefreshCw size={21} />
              </div>

              <div>
                <span>In Progress</span>
                <strong>{stats.inProgress}</strong>
              </div>
            </div>

            <div className="staff-stat-card">
              <div className="staff-stat-icon resolved">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <span>Resolved</span>
                <strong>{stats.resolved}</strong>
              </div>
            </div>
          </section>

          {/* COMPLAINTS */}
          <section className="staff-complaints-section">
            <div className="staff-section-heading">
              <div>
                <h2>My Assigned Complaints</h2>
                <p>
                  Complaints currently assigned to you.
                </p>
              </div>

              <span className="staff-count-badge">
                {assignedComplaints.length}
              </span>
            </div>

            {loading ? (
              <div className="staff-empty-state">
                <RefreshCw
                  size={28}
                  className="staff-spin"
                />
                <p>Loading complaints...</p>
              </div>
            ) : error ? (
              <div className="staff-error-state">
                <p>{error}</p>

                <button onClick={fetchComplaints}>
                  Try Again
                </button>
              </div>
            ) : assignedComplaints.length === 0 ? (
              <div className="staff-empty-state">
                <div className="staff-empty-icon">
                  <CheckCircle2 size={30} />
                </div>

                <h3>No complaints assigned</h3>

                <p>
                  You don't have any complaints assigned to
                  you right now.
                </p>
              </div>
            ) : (
              <div className="staff-table-wrapper">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Complaint</th>
                      <th>Category</th>
                      <th>Citizen</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignedComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>
                          <div className="staff-complaint-title">
                            <strong>{complaint.title}</strong>

                            <span>
                              ID:{" "}
                              {complaint._id
                                ?.slice(-6)
                                .toUpperCase()}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="staff-category">
                            {complaint.category}
                          </span>
                        </td>

                        <td>
                          <div className="staff-citizen">
                            <strong>
                              {getCitizenName(complaint)}
                            </strong>

                            <span>
                              {getCitizenEmail(complaint)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="staff-location">
                            <MapPin size={15} />

                            <span>
                              {complaint.location?.address ||
                                "Location unavailable"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {formatDate(complaint.createdAt)}
                        </td>

                        <td>
                          <span
                            className={`staff-status ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="staff-view-btn"
                            onClick={() =>
                              handleOpenComplaint(complaint)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MOBILE CARDS */}
            {!loading &&
              !error &&
              assignedComplaints.length > 0 && (
                <div className="staff-mobile-list">
                  {assignedComplaints.map((complaint) => (
                    <article
                      className="staff-mobile-card"
                      key={complaint._id}
                    >
                      <div className="staff-mobile-card-top">
                        <div>
                          <h3>{complaint.title}</h3>

                          <span>
                            ID:{" "}
                            {complaint._id
                              ?.slice(-6)
                              .toUpperCase()}
                          </span>
                        </div>

                        <span
                          className={`staff-status ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </div>

                      <div className="staff-mobile-info">
                        <div>
                          <span>Category</span>
                          <strong>{complaint.category}</strong>
                        </div>

                        <div>
                          <span>Citizen</span>
                          <strong>
                            {getCitizenName(complaint)}
                          </strong>
                        </div>

                        <div>
                          <span>Date</span>
                          <strong>
                            {formatDate(complaint.createdAt)}
                          </strong>
                        </div>

                        <div>
                          <span>Location</span>
                          <strong>
                            {complaint.location?.address ||
                              "Unavailable"}
                          </strong>
                        </div>
                      </div>

                      <button
                        className="staff-mobile-view-btn"
                        onClick={() =>
                          handleOpenComplaint(complaint)
                        }
                      >
                        View Complaint
                      </button>
                    </article>
                  ))}
                </div>
              )}
          </section>
        </div>
      </main>

      {/* COMPLAINT MODAL */}
      {selectedComplaint && (
        <div className="staff-modal-overlay">
          <div className="staff-modal">
            <div className="staff-modal-header">
              <div>
                <span className="staff-modal-label">
                  Complaint Details
                </span>

                <h2>{selectedComplaint.title}</h2>
              </div>

              <button
                className="staff-modal-close"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                <X size={21} />
              </button>
            </div>

            <div className="staff-modal-body">
              {/* IMAGE */}
              {selectedComplaint.image && (
                <div className="staff-detail-image-wrapper">
                  <img
                    src={selectedComplaint.image}
                    alt={selectedComplaint.title}
                    className="staff-detail-image"
                  />
                </div>
              )}

              {/* BASIC DETAILS */}
              <div className="staff-detail-grid">
                <div className="staff-detail-item">
                  <span>Category</span>
                  <strong>
                    {selectedComplaint.category}
                  </strong>
                </div>

                <div className="staff-detail-item">
                  <span>Reported Date</span>
                  <strong>
                    {formatDateTime(
                      selectedComplaint.createdAt
                    )}
                  </strong>
                </div>

                <div className="staff-detail-item">
                  <span>Current Status</span>

                  <strong>
                    <span
                      className={`staff-status ${getStatusClass(
                        selectedComplaint.status
                      )}`}
                    >
                      {selectedComplaint.status}
                    </span>
                  </strong>
                </div>

                <div className="staff-detail-item">
                  <span>Complaint ID</span>
                  <strong>
                    {selectedComplaint._id}
                  </strong>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="staff-detail-block">
                <h3>Description</h3>

                <p>
                  {selectedComplaint.description ||
                    "No description provided."}
                </p>
              </div>

              {/* CITIZEN */}
              <div className="staff-detail-block">
                <h3>Citizen Details</h3>

                <div className="staff-citizen-detail">
                  <div className="staff-citizen-detail-item">
                    <UserRound size={17} />

                    <div>
                      <span>Name</span>
                      <strong>
                        {getCitizenName(selectedComplaint)}
                      </strong>
                    </div>
                  </div>

                  <div className="staff-citizen-detail-item">
                    <div className="staff-citizen-letter">
                      @
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>
                        {getCitizenEmail(
                          selectedComplaint
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="staff-citizen-detail-item">
                    <div className="staff-citizen-letter">
                      ☎
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {getCitizenPhone(
                          selectedComplaint
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="staff-detail-block">
                <h3>Location</h3>

                <div className="staff-location-box">
                  <MapPin size={18} />

                  <div>
                    <strong>
                      {selectedComplaint.location?.address ||
                        "Location unavailable"}
                    </strong>

                    {selectedComplaint.location
                      ?.latitude &&
                      selectedComplaint.location
                        ?.longitude && (
                        <span>
                          Latitude:{" "}
                          {
                            selectedComplaint.location
                              .latitude
                          }
                          {"  "} | {"  "}
                          Longitude:{" "}
                          {
                            selectedComplaint.location
                              .longitude
                          }
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* UPDATE STATUS */}
              <div className="staff-update-section">
                <h3>Update Complaint</h3>

                <label>
                  Status
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value)
                    }
                    disabled={isUpdating}
                  >
                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>
                </label>

                <label>
                  Resolution Note
                  <textarea
                    value={resolutionNote}
                    onChange={(e) =>
                      setResolutionNote(e.target.value)
                    }
                    placeholder="Enter details about the work completed..."
                    rows={4}
                    disabled={isUpdating}
                  />
                </label>

                {updateMessage && (
                  <div
                    className={`staff-update-message ${
                      updateMessage.includes("successfully")
                        ? "success"
                        : "error"
                    }`}
                  >
                    {updateMessage}
                  </div>
                )}
              </div>
            </div>

            <div className="staff-modal-footer">
              <button
                className="staff-cancel-btn"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                Close
              </button>

              <button
                className="staff-update-btn"
                onClick={handleUpdateStatus}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="staff-spin"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;