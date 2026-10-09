import {
  ArrowRight,
  CheckCircle2,
  MessageSquarePlus,
  ShieldCheck,
} from "lucide-react";

import "./CTA.css";

const CTA = () => {
  return (
    <section className="cta" id="contact">
      <div className="cta-container">

        {/* Main CTA */}
        <div className="cta-content">
          <span className="cta-badge">
            <span className="cta-badge-dot"></span>
            Make Your Community Better
          </span>

          <h2>
            Have a Civic Issue?
            <br />
            <span>Let’s Get It Resolved.</span>
          </h2>

          <p>
            Report a civic problem through CivicConnect and keep track of
            its progress from submission to resolution.
          </p>

          <div className="cta-actions">
            <a href="/register" className="cta-primary">
              Report an Issue
              <ArrowRight size={18} />
            </a>

            <a href="#home" className="cta-secondary">
              Explore CivicConnect
            </a>
          </div>
        </div>

        {/* Right Visual */}
        <div className="cta-visual">

          <div className="cta-main-icon">
            <MessageSquarePlus size={32} />
          </div>

          <div className="cta-ring cta-ring-one"></div>
          <div className="cta-ring cta-ring-two"></div>

          <div className="cta-mini-card cta-mini-card-one">
            <CheckCircle2 size={17} />
            <span>Easy Reporting</span>
          </div>

          <div className="cta-mini-card cta-mini-card-two">
            <ShieldCheck size={17} />
            <span>Secure Platform</span>
          </div>

        </div>
      </div>

      {/* Trust Points */}
      <div className="cta-trust">

        <div className="cta-trust-item">
          <CheckCircle2 size={17} />
          <span>Simple to use</span>
        </div>

        <div className="cta-trust-item">
          <ShieldCheck size={17} />
          <span>Secure access</span>
        </div>

        <div className="cta-trust-item">
          <MessageSquarePlus size={17} />
          <span>Transparent reporting</span>
        </div>

      </div>
    </section>
  );
};

export default CTA;