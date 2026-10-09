import {
  FileText,
  MapPinned,
  BarChart3,
  BellRing,
  UsersRound,
  ShieldCheck,
} from "lucide-react";

import "./Features.css";

const features = [
  {
    icon: FileText,
    title: "Easy Issue Reporting",
    description:
      "Report roads, garbage, water, street lights, and other civic problems through a simple complaint form.",
  },
  {
    icon: MapPinned,
    title: "Location Based",
    description:
      "Add the exact problem location so the responsible team can quickly understand where the issue exists.",
  },
  {
    icon: BarChart3,
    title: "Track Complaint Status",
    description:
      "Know what is happening with your complaint from submission and assignment to resolution.",
  },
  {
    icon: BellRing,
    title: "Status Updates",
    description:
      "Stay informed when your complaint is assigned, moved into progress, or marked as resolved.",
  },
  {
    icon: UsersRound,
    title: "Role Based Access",
    description:
      "Citizens, staff, and administrators get access to the features relevant to their responsibilities.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Authentication and protected access help keep citizen and complaint information secure.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">

        {/* Header */}
        <div className="features-header">
          <span className="features-badge">
            Platform Features
          </span>

          <h2>
            Everything You Need to
            <span> Stay Connected</span>
          </h2>

          <p>
            CivicConnect brings reporting, tracking, communication,
            and administration together in one simple platform.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card-header">
                  <div className="feature-icon">
                    <Icon size={23} strokeWidth={2} />
                  </div>

                  <span className="feature-arrow">↗</span>
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <div className="feature-line"></div>
              </article>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="features-bottom">
          <div className="features-bottom-dot"></div>

          <span>
            Designed to make civic problem reporting simple,
            transparent, and accessible.
          </span>
        </div>

      </div>
    </section>
  );
};

export default Features;