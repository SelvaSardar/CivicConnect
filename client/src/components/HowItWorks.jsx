import {
  FilePlus2,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: FilePlus2,
    title: "Report an Issue",
    description:
      "Describe the civic problem, select its category, and add the location so it can be easily identified.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Track Progress",
    description:
      "Follow your complaint from submission to assignment and stay updated on its current status.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Get It Resolved",
    description:
      "Once the responsible team completes the work, the complaint is marked as resolved with a clear update.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-container">

        {/* Section Header */}
        <div className="how-header">
          <span className="how-badge">
            Simple Process
          </span>

          <h2>
            From Report to
            <span> Resolution</span>
          </h2>

          <p>
            CivicConnect keeps the entire complaint journey simple,
            transparent, and easy to follow.
          </p>
        </div>

        {/* Steps */}
        <div className="how-steps">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="how-step-wrapper" key={step.number}>

                <article className="how-card">

                  <div className="how-card-top">
                    <span className="how-number">
                      {step.number}
                    </span>

                    <div className="how-icon">
                      <Icon size={25} strokeWidth={2} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  <div className="how-card-line"></div>

                </article>

                {/* Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="how-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Bottom Highlight */}
        <div className="how-highlight">
          <div className="how-highlight-icon">
            <CheckCircle2 size={22} />
          </div>

          <div className="how-highlight-content">
            <strong>
              One platform. Complete visibility.
            </strong>

            <span>
              Citizens, staff, and administrators can work
              together through one connected system.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;