import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./MyComplaints.css";

const MyComplaints = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get("/complaints/my");

      console.log("My complaints response:", response.data);

      setComplaints(response.data.complaints || []);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to load your complaints."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token]);

  const getStatusClass = (status) => {
    return `my-complaints-status-${status
      .toLowerCase()
      .replaceAll(" ", "-")}`;
  };

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

  return (
    <div className="my-complaints-page">

      {/* HEADER */}

      <header className="my-complaints-header">

        <button
          type="button"
          className="my-complaints-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          Dashboard
        </button>

        <div className="my-complaints-header-title">
          <span>Citizen Portal</span>
          <h1>My Complaints</h1>
        </div>

      </header>

      {/* CONTENT */}

      <main className="my-complaints-content">

        <section className="my-complaints-intro">

          <div>
            <span className="my-complaints-label">
              Complaint History
            </span>

            <h2>
              Track your reported issues.
            </h2>

            <p>
              View all the civic issues you have reported
              and monitor their current status.
            </p>
          </div>

          <div className="my-complaints-count">
            <FileText size={21} />

            <div>
              <span>Total Complaints</span>
              <strong>{complaints.length}</strong>
            </div>
          </div>

        </section>

        {/* LOADING */}

        {isLoading && (
          <section className="my-complaints-state">

            <div className="my-complaints-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <h3>Loading complaints...</h3>

            <p>
              Please wait while we fetch your complaint history.
            </p>

          </section>
        )}

        {/* ERROR */}

        {!isLoading && errorMessage && (
          <section className="my-complaints-state">

            <div className="my-complaints-state-icon error">
              <FileText size={25} />
            </div>

            <h3>
              Unable to load complaints
            </h3>

            <p>
              {errorMessage}
            </p>

            <button
              type="button"
              className="my-complaints-retry"
              onClick={fetchComplaints}
            >
              <RefreshCw size={17} />
              Try Again
            </button>

          </section>
        )}

        {/* EMPTY */}

        {!isLoading &&
          !errorMessage &&
          complaints.length === 0 && (
            <section className="my-complaints-state">

              <div className="my-complaints-state-icon">
                <FileText size={25} />
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                You haven't reported any civic issues.
                Report your first issue to get started.
              </p>

              <button
                type="button"
                className="my-complaints-primary-button"
                onClick={() => navigate("/report")}
              >
                Report an Issue
              </button>

            </section>
          )}

        {/* COMPLAINT LIST */}

        {!isLoading &&
          !errorMessage &&
          complaints.length > 0 && (
            <section className="my-complaints-list">

              {complaints.map((complaint) => (
                <article
                  className="my-complaint-card"
                  key={complaint._id}
                >

                  <div className="my-complaint-top">

                    <div className="my-complaint-icon">
                      <FileText size={20} />
                    </div>

                    <div className="my-complaint-main">

                      <div className="my-complaint-title-row">

                        <h3>
                          {complaint.title}
                        </h3>

                        <span
                          className={`my-complaints-status ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>

                      </div>

                      <p className="my-complaint-category">
                        {complaint.category}
                      </p>

                    </div>

                  </div>

                  <p className="my-complaint-description">
                    {complaint.description}
                  </p>

                  <div className="my-complaint-details">

                    <div className="my-complaint-location">
                      <MapPin size={16} />

                      <span>
                        {complaint.location?.address ||
                          "Location unavailable"}
                      </span>
                    </div>

                    <span className="my-complaint-date">
                      Reported on{" "}
                      {formatDate(complaint.createdAt)}
                    </span>

                  </div>

                  <div className="my-complaint-footer">

                    <span>
                      Complaint ID:{" "}
                      {complaint._id.slice(-8).toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/complaints/${complaint._id}`
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>
              ))}

            </section>
          )}

      </main>

    </div>
  );
};

export default MyComplaints;