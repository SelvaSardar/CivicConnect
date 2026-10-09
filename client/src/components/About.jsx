import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Gauge,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

import "./About.css";

const benefits = [
  {
    icon: Eye,
    title: "Better Transparency",
    description:
      "Citizens can clearly see what happens to their reported issues.",
  },
  {
    icon: Gauge,
    title: "Faster Resolution",
    description:
      "Complaints reach the responsible staff through a structured workflow.",
  },
  {
    icon: HeartHandshake,
    title: "Connected Community",
    description:
      "Citizens and civic teams work together toward cleaner and safer communities.",
  },
];

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">

        {/* Left Content */}
        <div className="about-content">
          <span className="about-badge">
            About CivicConnect
          </span>

          <h2>
            Turning Civic Problems Into
            <span> Action</span>
          </h2>

          <p className="about-description">
            CivicConnect is a digital platform designed to make civic
            issue reporting more organized, transparent, and accessible.
            Citizens can report problems, while responsible teams can
            manage, track, and resolve them through one connected system.
          </p>

          <p className="about-description secondary">
            From the first report to the final resolution, every step
            follows a structured process so that everyone involved has
            better visibility.
          </p>

          <a href="#features" className="about-link">
            Explore Platform
            <ArrowUpRight size={18} />
          </a>
        </div>

        {/* Right Content */}
        <div className="about-visual">

          <div className="about-visual-card">

            <div className="about-visual-header">
              <div>
                <span>Platform Goal</span>
                <h3>Better Civic Services</h3>
              </div>

              <div className="about-check">
                <CheckCircle2 size={21} />
              </div>
            </div>

            <div className="about-progress-section">
              <div className="about-progress-label">
                <span>Complaint Journey</span>
                <strong>Complete</strong>
              </div>

              <div className="about-progress">
                <span></span>
              </div>
            </div>

            <div className="about-flow">

              <div className="about-flow-item active">
                <div className="about-flow-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>Reported</strong>
                  <span>Citizen submitted an issue</span>
                </div>
              </div>

              <div className="about-flow-line"></div>

              <div className="about-flow-item active">
                <div className="about-flow-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>Assigned</strong>
                  <span>Responsible staff assigned</span>
                </div>
              </div>

              <div className="about-flow-line"></div>

              <div className="about-flow-item active">
                <div className="about-flow-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>Resolved</strong>
                  <span>Issue successfully completed</span>
                </div>
              </div>

            </div>
          </div>

          <div className="about-security">
            <ShieldCheck size={18} />
            <span>Secure & role-based platform</span>
          </div>

        </div>
      </div>

      {/* Benefits */}
      <div className="about-benefits">

        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div className="about-benefit" key={benefit.title}>
              <div className="about-benefit-icon">
                <Icon size={21} />
              </div>

              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default About;