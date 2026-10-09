import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Smart Civic Issue Management
          </div>

          <h1 className="hero-title">
            Report Issues.
            <br />
            <span>Improve Your Community.</span>
          </h1>

          <p className="hero-description">
            CivicConnect makes it simple for citizens to report civic
            problems, track their progress, and stay connected with
            the people working to resolve them.
          </p>

          <div className="hero-actions">
            <a href="/register" className="hero-btn hero-btn-primary">
              Report an Issue
              <ArrowRight size={18} />
            </a>

            <a href="#how-it-works" className="hero-btn hero-btn-secondary">
              How It Works
            </a>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <CheckCircle2 size={17} />
              Easy Reporting
            </div>

            <div className="hero-trust-item">
              <ShieldCheck size={17} />
              Secure Platform
            </div>

            <div className="hero-trust-item">
              <Users size={17} />
              Community Driven
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero-visual">

          {/* Main Dashboard Card */}
          <div className="hero-dashboard-card">

            <div className="hero-dashboard-header">
              <div>
                <span className="hero-small-label">
                  Civic Dashboard
                </span>

                <h3>Issue Overview</h3>
              </div>

              <div className="hero-status-dot"></div>
            </div>

            {/* Statistics */}
            <div className="hero-stats">

              <div className="hero-stat-card">
                <div className="hero-stat-icon blue">
                  <MapPin size={19} />
                </div>

                <div>
                  <strong>248</strong>
                  <span>Reported</span>
                </div>
              </div>

              <div className="hero-stat-card">
                <div className="hero-stat-icon green">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <strong>186</strong>
                  <span>Resolved</span>
                </div>
              </div>

            </div>

            {/* Issue List */}
            <div className="hero-issue-list">

              <div className="hero-issue">
                <div className="hero-issue-icon road">
                  <MapPin size={16} />
                </div>

                <div className="hero-issue-info">
                  <strong>Road Damage</strong>
                  <span>Anna Nagar • 10 min ago</span>
                </div>

                <span className="hero-issue-status progress">
                  In Progress
                </span>
              </div>

              <div className="hero-issue">
                <div className="hero-issue-icon light">
                  <MapPin size={16} />
                </div>

                <div className="hero-issue-info">
                  <strong>Street Light</strong>
                  <span>Velachery • 32 min ago</span>
                </div>

                <span className="hero-issue-status resolved">
                  Resolved
                </span>
              </div>

              <div className="hero-issue">
                <div className="hero-issue-icon water">
                  <MapPin size={16} />
                </div>

                <div className="hero-issue-info">
                  <strong>Water Leakage</strong>
                  <span>Adyar • 1 hr ago</span>
                </div>

                <span className="hero-issue-status pending">
                  Pending
                </span>
              </div>

            </div>
          </div>

          {/* Floating Card */}
          <div className="hero-floating-card">
            <div className="hero-floating-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <strong>Issue Resolved</strong>
              <span>Road repair completed</span>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>

        </div>
      </div>
    </section>
  );
};

export default Hero;