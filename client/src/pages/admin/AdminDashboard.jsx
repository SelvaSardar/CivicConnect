import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  LayoutDashboard,
  FileText,
  Users,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Eye,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import "./AdminDashboard.css";

/* =====================================================
   LEAFLET MARKER ICON
===================================================== */

const adminMarkerIcon = L.icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


/* =====================================================
   COMPLAINT LOCATION MAP
===================================================== */

const ComplaintLocationMap = ({
  latitude,
  longitude,
  complaintId,
}) => {
  const position = [latitude, longitude];

  return (
    <MapContainer
      key={`complaint-map-${complaintId}`}
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      dragging={true}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "240px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={position}
        icon={adminMarkerIcon}
      />
    </MapContainer>
  );
};


/* =====================================================
   COMPLAINT TABLE
===================================================== */

const ComplaintTable = ({
  complaints,
  searchTerm,
  setSelectedComplaint,
  setSelectedStaff,
}) => {
  const filteredComplaints = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    if (!value) {
      return complaints;
    }

    return complaints.filter((complaint) => {
      return (
        complaint.title?.toLowerCase().includes(value) ||
        complaint.category?.toLowerCase().includes(value) ||
        complaint.status?.toLowerCase().includes(value) ||
        complaint.location?.address
          ?.toLowerCase()
          .includes(value) ||
        complaint.reportedBy?.name
          ?.toLowerCase()
          .includes(value) ||
        complaint.reportedBy?.email
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [complaints, searchTerm]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";

      case "Assigned":
        return "assigned";

      case "In Progress":
        return "in-progress";

      case "Resolved":
        return "resolved";

      case "Rejected":
        return "rejected";

      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedStaff(
      complaint.assignedTo?._id ||
        complaint.assignedTo ||
        ""
    );
  };

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Complaint</th>
            <th>Category</th>
            <th>Citizen</th>
            <th>Status</th>
            <th>Assigned Staff</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="admin-empty-cell"
              >
                No complaints found.
              </td>
            </tr>
          ) : (
            filteredComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>
                  <div className="admin-complaint-cell">
                    <strong>
                      {complaint.title}
                    </strong>

                    <span>
                      {complaint.location?.address ||
                        "No location"}
                    </span>
                  </div>
                </td>

                <td>
                  <span className="admin-category">
                    {complaint.category}
                  </span>
                </td>

                <td>
                  <div className="admin-user-cell">
                    <div className="admin-user-avatar">
                      {complaint.reportedBy?.name
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <span>
                      {complaint.reportedBy?.name ||
                        "Unknown"}
                    </span>
                  </div>
                </td>

                <td>
                  <span
                    className={`admin-status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </td>

                <td>
                  {complaint.assignedTo ? (
                    <div className="admin-assigned-staff">
                      <span>
                        {complaint.assignedTo.name}
                      </span>
                    </div>
                  ) : (
                    <span className="admin-not-assigned">
                      Not Assigned
                    </span>
                  )}
                </td>

                <td>
                  {formatDate(complaint.createdAt)}
                </td>

                <td>
                  <div className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="View Complaint"
                      onClick={() =>
                        openComplaint(complaint)
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn primary"
                      title="Assign Staff"
                      onClick={() =>
                        openComplaint(complaint)
                      }
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [complaints, setComplaints] = useState([]);

  const [isLoadingComplaints, setIsLoadingComplaints] =
    useState(true);

  const [complaintError, setComplaintError] =
    useState("");

  const [staffUsers, setStaffUsers] = useState([]);

  const [isLoadingStaff, setIsLoadingStaff] =
    useState(false);

  const [users, setUsers] = useState([]);

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [selectedStaff, setSelectedStaff] =
    useState("");

  const [isAssigning, setIsAssigning] =
    useState(false);

  const [assignError, setAssignError] =
    useState("");

  const [assignSuccess, setAssignSuccess] =
    useState("");


  /* =====================================================
     FETCH COMPLAINTS
  ===================================================== */

  const fetchComplaints = async () => {
    try {
      setIsLoadingComplaints(true);
      setComplaintError("");

      const response = await api.get("/complaints");

      setComplaints(
        response.data.complaints || []
      );
    } catch (error) {
      console.error(
        "Fetch complaints error:",
        error
      );

      setComplaintError(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setIsLoadingComplaints(false);
    }
  };


  /* =====================================================
     FETCH STAFF
  ===================================================== */

  const fetchStaffUsers = async () => {
    try {
      setIsLoadingStaff(true);

      const response = await api.get(
        "/users/staff"
      );

      setStaffUsers(
        response.data.staff || []
      );
    } catch (error) {
      console.error(
        "Fetch staff error:",
        error
      );

      setStaffUsers([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };


  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);

      const response = await api.get("/users");

      setUsers(
        response.data.users || []
      );
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchComplaints();
    fetchStaffUsers();
    fetchUsers();
  }, []);


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
    setSearchTerm("");
  };


  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    await Promise.all([
      fetchComplaints(),
      fetchStaffUsers(),
      fetchUsers(),
    ]);
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeComplaintModal = () => {
    setSelectedComplaint(null);
    setSelectedStaff("");
    setAssignError("");
    setAssignSuccess("");
  };


  /* =====================================================
     ASSIGN STAFF
  ===================================================== */

  const handleAssignStaff = async () => {
    if (!selectedComplaint) {
      return;
    }

    if (!selectedStaff) {
      setAssignError(
        "Please select a staff member."
      );

      return;
    }

    try {
      setIsAssigning(true);
      setAssignError("");
      setAssignSuccess("");

      await api.put(
        `/complaints/${selectedComplaint._id}/assign`,
        {
          staffId: selectedStaff,
        }
      );

      setAssignSuccess(
        "Complaint assigned successfully."
      );

      await fetchComplaints();

      setTimeout(() => {
        closeComplaintModal();
      }, 800);
    } catch (error) {
      console.error(
        "Assign staff error:",
        error
      );

      setAssignError(
        error.response?.data?.message ||
          "Failed to assign complaint."
      );
    } finally {
      setIsAssigning(false);
    }
  };


  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    return {
      total: complaints.length,

      pending: complaints.filter(
        (complaint) =>
          complaint.status === "Pending"
      ).length,

      assigned: complaints.filter(
        (complaint) =>
          complaint.status === "Assigned"
      ).length,

      inProgress: complaints.filter(
        (complaint) =>
          complaint.status === "In Progress"
      ).length,

      resolved: complaints.filter(
        (complaint) =>
          complaint.status === "Resolved"
      ).length,
    };
  }, [complaints]);


  /* =====================================================
     STAFF WORKLOAD
  ===================================================== */

  const getStaffComplaintCount = (staffId) => {
    return complaints.filter(
      (complaint) =>
        complaint.assignedTo?._id === staffId
    ).length;
  };


  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =====================================================
     MAP COORDINATES
  ===================================================== */

  const latitude = Number(
    selectedComplaint?.location?.latitude
  );

  const longitude = Number(
    selectedComplaint?.location?.longitude
  );

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR OVERLAY */}

      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setIsSidebarOpen(false)
          }
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          isSidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >
        <div className="admin-sidebar-header">

          <div className="admin-brand">
            <div className="admin-brand-icon">
              CC
            </div>

            <div>
              <strong>CivicConnect</strong>
              <span>Administration</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() =>
              setIsSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>


        <nav className="admin-sidebar-nav">

          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation("dashboard")
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>


          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === "complaints"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation("complaints")
            }
          >
            <FileText size={19} />
            <span>Complaints</span>
          </button>


          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === "users"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation("users")
            }
          >
            <Users size={19} />
            <span>Users</span>
          </button>


          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === "staff"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation("staff")
            }
          >
            <UserCog size={19} />
            <span>Staff</span>
          </button>


          <button
            type="button"
            className={`admin-nav-item ${
              activeSection === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation("settings")
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

        </nav>


        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              type="button"
              className="admin-menu-btn"
              onClick={() =>
                setIsSidebarOpen(true)
              }
            >
              <Menu size={22} />
            </button>


            <div>
              <h1>
                {activeSection === "dashboard"
                  ? "Dashboard"
                  : activeSection ===
                    "complaints"
                  ? "Complaints"
                  : activeSection === "users"
                  ? "Users"
                  : activeSection === "staff"
                  ? "Staff Management"
                  : "Settings"}
              </h1>

              <p>
                Manage CivicConnect from one place.
              </p>
            </div>

          </div>


          <div className="admin-header-right">

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>


            <div className="admin-profile">

              <div className="admin-profile-avatar">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || "A"}
              </div>

              <div className="admin-profile-info">

                <strong>
                  {user?.name || "Admin"}
                </strong>

                <span>Administrator</span>

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="admin-content">

          {/* DASHBOARD */}

          {activeSection === "dashboard" && (
            <>

              <section className="admin-welcome-card">

                <div>
                  <span className="admin-welcome-label">
                    Welcome back 👋
                  </span>

                  <h2>
                    {user?.name || "Admin"}
                  </h2>

                  <p>
                    Here's what's happening
                    across CivicConnect today.
                  </p>
                </div>

              </section>


              <section className="admin-stats-grid">

                <div className="admin-stat-card">
                  <div className="admin-stat-icon blue">
                    <FileText size={22} />
                  </div>

                  <div>
                    <span>Total Complaints</span>
                    <strong>{stats.total}</strong>
                  </div>
                </div>


                <div className="admin-stat-card">
                  <div className="admin-stat-icon orange">
                    <AlertCircle size={22} />
                  </div>

                  <div>
                    <span>Pending</span>
                    <strong>{stats.pending}</strong>
                  </div>
                </div>


                <div className="admin-stat-card">
                  <div className="admin-stat-icon purple">
                    <Clock size={22} />
                  </div>

                  <div>
                    <span>In Progress</span>
                    <strong>{stats.inProgress}</strong>
                  </div>
                </div>


                <div className="admin-stat-card">
                  <div className="admin-stat-icon green">
                    <CheckCircle size={22} />
                  </div>

                  <div>
                    <span>Resolved</span>
                    <strong>{stats.resolved}</strong>
                  </div>
                </div>

              </section>


              <section className="admin-section">

                <div className="admin-section-header">

                  <div>
                    <h2>Recent Complaints</h2>

                    <p>
                      Latest complaints reported
                      by citizens.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      handleNavigation(
                        "complaints"
                      )
                    }
                  >
                    View All
                  </button>

                </div>


                {isLoadingComplaints ? (
                  <div className="admin-loading">
                    Loading complaints...
                  </div>
                ) : complaintError ? (
                  <div className="admin-error">
                    {complaintError}
                  </div>
                ) : (
                  <ComplaintTable
                    complaints={complaints.slice(
                      0,
                      5
                    )}
                    searchTerm=""
                    setSelectedComplaint={
                      setSelectedComplaint
                    }
                    setSelectedStaff={
                      setSelectedStaff
                    }
                  />
                )}

              </section>

            </>
          )}


          {/* COMPLAINTS */}

          {activeSection === "complaints" && (
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>
                    Complaint Management
                  </h2>

                  <p>
                    View and assign citizen
                    complaints.
                  </p>
                </div>

                <span className="admin-count-badge">
                  {complaints.length} Complaints
                </span>

              </div>


              <div className="admin-search-box">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>


              {isLoadingComplaints ? (
                <div className="admin-loading">
                  Loading complaints...
                </div>
              ) : complaintError ? (
                <div className="admin-error">
                  {complaintError}
                </div>
              ) : (
                <ComplaintTable
                  complaints={complaints}
                  searchTerm={searchTerm}
                  setSelectedComplaint={
                    setSelectedComplaint
                  }
                  setSelectedStaff={
                    setSelectedStaff
                  }
                />
              )}

            </section>
          )}


          {/* USERS */}

          {activeSection === "users" && (
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>User Management</h2>

                  <p>
                    View all registered
                    CivicConnect users.
                  </p>
                </div>

                <span className="admin-count-badge">
                  {users.length} Users
                </span>

              </div>


              {isLoadingUsers ? (
                <div className="admin-loading">
                  Loading users...
                </div>
              ) : (
                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                      </tr>
                    </thead>

                    <tbody>

                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="admin-empty-cell"
                          >
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map(
                          (currentUser) => (
                            <tr
                              key={
                                currentUser._id
                              }
                            >

                              <td>
                                <div className="admin-user-cell">

                                  <div className="admin-user-avatar">
                                    {currentUser.name
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <strong>
                                    {currentUser.name}
                                  </strong>

                                </div>
                              </td>

                              <td>
                                {currentUser.email}
                              </td>

                              <td>
                                {currentUser.phone ||
                                  "—"}
                              </td>

                              <td>
                                <span className="admin-role-badge">
                                  {currentUser.role}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={`admin-status-badge ${
                                    currentUser.isActive
                                      ? "active"
                                      : "inactive"
                                  }`}
                                >
                                  {currentUser.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td>
                                {formatDate(
                                  currentUser.createdAt
                                )}
                              </td>

                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </section>
          )}


          {/* STAFF */}

          {activeSection === "staff" && (
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>Staff Management</h2>

                  <p>
                    View active staff members
                    and their workload.
                  </p>
                </div>

                <span className="admin-count-badge">
                  {staffUsers.length} Staff
                </span>

              </div>


              {isLoadingStaff ? (
                <div className="admin-loading">
                  Loading staff...
                </div>
              ) : (
                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>
                          Assigned Complaints
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {staffUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="admin-empty-cell"
                          >
                            No staff members found.
                          </td>
                        </tr>
                      ) : (
                        staffUsers.map((staff) => {

                          const assignedCount =
                            getStaffComplaintCount(
                              staff._id
                            );

                          return (
                            <tr
                              key={staff._id}
                            >

                              <td>
                                <div className="admin-user-cell">

                                  <div className="admin-user-avatar">
                                    {staff.name
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <strong>
                                    {staff.name}
                                  </strong>

                                </div>
                              </td>

                              <td>
                                {staff.email}
                              </td>

                              <td>
                                {staff.phone ||
                                  "—"}
                              </td>

                              <td>
                                <span
                                  className={`admin-status-badge ${
                                    staff.isActive
                                      ? "active"
                                      : "inactive"
                                  }`}
                                >
                                  {staff.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td>
                                <span className="admin-assigned-count">
                                  {assignedCount}
                                </span>
                              </td>

                            </tr>
                          );
                        })
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </section>
          )}


          {/* SETTINGS */}

          {activeSection === "settings" && (
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>Settings</h2>

                  <p>
                    Manage administrator
                    preferences.
                  </p>
                </div>

              </div>


              <div className="admin-settings-card">

                <div>
                  <h3>Account</h3>

                  <p>
                    Logged in as{" "}
                    <strong>
                      {user?.email}
                    </strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>

            </section>
          )}

        </div>

      </main>


      {/* =====================================================
          COMPLAINT MODAL
      ===================================================== */}

      {selectedComplaint && (
        <div
          className="admin-modal-overlay"
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeComplaintModal();
            }
          }}
        >

          <div className="admin-modal">

            {/* HEADER */}

            <div className="admin-modal-header">

              <div>
                <span>Complaint Details</span>

                <h2>
                  {selectedComplaint.title}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeComplaintModal
                }
              >
                <X size={20} />
              </button>

            </div>


            {/* BODY */}

            <div className="admin-modal-body">

              {/* IMAGE */}

              <div className="admin-complaint-image-box">

                <span>
                  Complaint Image
                </span>

                {selectedComplaint.image ? (
                  <img
                    src={selectedComplaint.image}
                    alt="Complaint"
                    className="admin-complaint-image"
                  />
                ) : (
                  <div className="admin-no-image">
                    No image uploaded
                  </div>
                )}

              </div>


              {/* DETAILS */}

              <div className="admin-detail-grid">

                <div className="admin-detail-item">

                  <span>Category</span>

                  <strong>
                    {selectedComplaint.category}
                  </strong>

                </div>


                <div className="admin-detail-item">

                  <span>Status</span>

                  <strong>
                    {selectedComplaint.status}
                  </strong>

                </div>


                <div className="admin-detail-item">

                  <span>Reported By</span>

                  <strong>
                    {selectedComplaint.reportedBy
                      ?.name || "Unknown"}
                  </strong>

                </div>


                <div className="admin-detail-item">

                  <span>Date</span>

                  <strong>
                    {formatDate(
                      selectedComplaint.createdAt
                    )}
                  </strong>

                </div>

              </div>


              {/* CITIZEN CONTACT */}

              <div className="admin-detail-block">

                <span>
                  Citizen Contact
                </span>

                <div className="admin-citizen-contact">

                  <div className="admin-citizen-contact-item">

                    <Mail size={15} />

                    <div>
                      <span>Email</span>

                      <strong>
                        {selectedComplaint
                          .reportedBy?.email ||
                          "Not available"}
                      </strong>
                    </div>

                  </div>


                  <div className="admin-citizen-contact-item">

                    <Phone size={15} />

                    <div>
                      <span>Phone</span>

                      <strong>
                        {selectedComplaint
                          .reportedBy?.phone ||
                          "Not available"}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="admin-detail-block">

                <span>
                  Description
                </span>

                <p>
                  {selectedComplaint.description ||
                    "No description provided."}
                </p>

              </div>


              {/* LOCATION */}

              <div className="admin-location-box">

                <span>
                  Complaint Location
                </span>

                <div className="admin-location-address">

                  <MapPin size={16} />

                  <p>
                    {selectedComplaint
                      .location?.address ||
                      "No location provided"}
                  </p>

                </div>


                {hasCoordinates ? (
                  <>
                    <div className="admin-location-map">

                      <ComplaintLocationMap
                        key={
                          selectedComplaint._id
                        }
                        latitude={latitude}
                        longitude={longitude}
                        complaintId={
                          selectedComplaint._id
                        }
                      />

                    </div>


                    <div className="admin-location-coordinates">

                      <div className="admin-coordinate-item">

                        <span>
                          Latitude
                        </span>

                        <strong>
                          {latitude.toFixed(6)}
                        </strong>

                      </div>


                      <div className="admin-coordinate-item">

                        <span>
                          Longitude
                        </span>

                        <strong>
                          {longitude.toFixed(6)}
                        </strong>

                      </div>

                    </div>
                  </>
                ) : (
                  <div className="admin-no-location">

                    <MapPin size={18} />

                    <span>
                      GPS coordinates are not
                      available for this complaint.
                    </span>

                  </div>
                )}

              </div>


              {/* CURRENT STAFF */}

              <div className="admin-detail-block">

                <span>
                  Current Staff
                </span>

                <p>
                  {selectedComplaint
                    .assignedTo?.name ||
                    "Not assigned"}
                </p>

              </div>


              {/* ASSIGN */}

              <div className="admin-assign-box">

                <div className="admin-assign-heading">

                  <div>
                    <h3>
                      Assign Staff
                    </h3>

                    <p>
                      Select a staff member to
                      handle this complaint.
                    </p>
                  </div>

                  <UserPlus size={22} />

                </div>


                <select
                  value={selectedStaff}
                  onChange={(event) => {
                    setSelectedStaff(
                      event.target.value
                    );

                    setAssignError("");
                    setAssignSuccess("");
                  }}
                  disabled={isAssigning}
                >

                  <option value="">
                    Select Staff
                  </option>

                  {staffUsers.map((staff) => (
                    <option
                      key={staff._id}
                      value={staff._id}
                    >
                      {staff.name} —{" "}
                      {staff.email}
                    </option>
                  ))}

                </select>


                {staffUsers.length === 0 &&
                  !isLoadingStaff && (
                    <p className="admin-form-warning">
                      No active staff members
                      available.
                    </p>
                  )}


                {assignError && (
                  <div className="admin-form-error">
                    {assignError}
                  </div>
                )}


                {assignSuccess && (
                  <div className="admin-form-success">
                    {assignSuccess}
                  </div>
                )}


                <button
                  type="button"
                  className="btn btn-primary admin-assign-btn"
                  onClick={
                    handleAssignStaff
                  }
                  disabled={
                    isAssigning ||
                    !selectedStaff
                  }
                >
                  {isAssigning
                    ? "Assigning..."
                    : "Assign Complaint"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;