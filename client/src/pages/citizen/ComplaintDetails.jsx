import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./ComplaintDetails.css";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const { token } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(
          `/complaints/${complaintId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaint(response.data.complaint);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load complaint details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token && complaintId) {
      fetchComplaint();
    }
  }, [token, complaintId]);

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStep = (status) => {
    if (status === "Pending") {
      return 1;
    }

    if (status === "Assigned") {
      return 2;
    }

    if (status === "In Progress") {
      return 3;
    }

    if (status === "Resolved") {
      return 4;
    }

    return 1;
  };

  const currentStep = complaint
    ? getStatusStep(complaint.status)
    : 1;

  if (isLoading) {
    return (
      <div className="complaint-details-page">
        <div className="complaint-details-state">
          <div className="complaint-details-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <h3>Loading complaint...</h3>

          <p>
            Please wait while we fetch the complaint details.
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !complaint) {
    return (
      <div className="complaint-details-page">
        <div className="complaint-details-state">

          <div className="complaint-details-error-icon">
            <FileText size={26} />
          </div>

          <h3>
            Unable to load complaint
          </h3>

          <p>
            {errorMessage ||
              "Complaint details could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/complaints")}
          >
            Back to My Complaints
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="complaint-details-page">

      {/* HEADER */}

      <header className="complaint-details-header">

        <button
          type="button"
          className="complaint-details-back"
          onClick={() => navigate("/complaints")}
        >
          <ArrowLeft size={19} />
          My Complaints
        </button>

        <div className="complaint-details-header-title">
          <span>Citizen Portal</span>
          <h1>Complaint Details</h1>
        </div>

      </header>

      {/* CONTENT */}

      <main className="complaint-details-content">

        <section className="complaint-details-main-card">

          <div className="complaint-details-title-row">

            <div className="complaint-details-icon">
              <FileText size={24} />
            </div>

            <div>
              <span className="complaint-details-category">
                {complaint.category}
              </span>

              <h2>
                {complaint.title}
              </h2>

              <p>
                Complaint ID:{" "}
                {complaint._id
                  .slice(-8)
                  .toUpperCase()}
              </p>
            </div>

          </div>

          <div
            className={`complaint-details-status status-${complaint.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {complaint.status}
          </div>

          <div className="complaint-details-description">

            <h3>Description</h3>

            <p>
              {complaint.description}
            </p>

          </div>

          <div className="complaint-details-info-grid">

            <div className="complaint-details-info-item">

              <MapPin size={18} />

              <div>
                <span>Location</span>

                <strong>
                  {complaint.location?.address ||
                    "Location unavailable"}
                </strong>
              </div>

            </div>

            <div className="complaint-details-info-item">

              <Clock3 size={18} />

              <div>
                <span>Reported On</span>

                <strong>
                  {formatDate(complaint.createdAt)}
                </strong>
              </div>

            </div>

            {complaint.assignedTo && (
              <div className="complaint-details-info-item">

                <UserRound size={18} />

                <div>
                  <span>Assigned Staff</span>

                  <strong>
                    Staff assigned
                  </strong>
                </div>

              </div>
            )}

          </div>

        </section>

        {/* STATUS TRACKING */}

        <section className="complaint-tracking-card">

          <div className="complaint-section-heading">
            <span>Progress</span>

            <h2>
              Complaint Status
            </h2>

            <p>
              Track the progress of your complaint.
            </p>
          </div>

          <div className="complaint-timeline">

            <div
              className={`timeline-line ${
                currentStep >= 2
                  ? "timeline-line-active"
                  : ""
              }`}
            ></div>

            <div
              className={`timeline-line-progress step-${currentStep}`}
            ></div>

            <div
              className={`timeline-item ${
                currentStep >= 1
                  ? "timeline-complete"
                  : ""
              }`}
            >
              <div className="timeline-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <h3>
                  Complaint Submitted
                </h3>

                <p>
                  Your complaint has been successfully
                  submitted.
                </p>
              </div>
            </div>

            <div
              className={`timeline-item ${
                currentStep >= 2
                  ? "timeline-complete"
                  : ""
              }`}
            >
              <div className="timeline-icon">
                <UserRound size={17} />
              </div>

              <div>
                <h3>
                  Assigned to Staff
                </h3>

                <p>
                  Your complaint will be assigned to
                  the appropriate staff member.
                </p>
              </div>
            </div>

            <div
              className={`timeline-item ${
                currentStep >= 3
                  ? "timeline-complete"
                  : ""
              }`}
            >
              <div className="timeline-icon">
                <Clock3 size={17} />
              </div>

              <div>
                <h3>
                  In Progress
                </h3>

                <p>
                  The issue is currently being worked on.
                </p>
              </div>
            </div>

            <div
              className={`timeline-item ${
                currentStep >= 4
                  ? "timeline-complete"
                  : ""
              }`}
            >
              <div className="timeline-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <h3>
                  Resolved
                </h3>

                <p>
                  The reported issue has been resolved.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* RESOLUTION */}

        {complaint.status === "Resolved" &&
          complaint.resolutionNote && (
            <section className="complaint-resolution-card">

              <div className="complaint-resolution-icon">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <span>
                  Resolution Note
                </span>

                <h2>
                  Issue Resolved
                </h2>

                <p>
                  {complaint.resolutionNote}
                </p>
              </div>

            </section>
          )}

      </main>

    </div>
  );
};

export default ComplaintDetails;