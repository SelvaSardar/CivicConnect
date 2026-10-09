import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <span className="footer-logo-icon">C</span>

              <span className="footer-logo-text">
                Civic<span>Connect</span>
              </span>
            </a>

            <p>
              A smart civic issue management platform that connects
              citizens, staff, and administrators to build better
              communities.
            </p>

            <div className="footer-location">
              <MapPin size={16} />
              <span>Serving Communities</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>

            <a href="#home">Home</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>

          {/* Platform */}
          <div className="footer-column">
            <h3>Platform</h3>

            <a href="/register">
              Report an Issue
              <ArrowUpRight size={14} />
            </a>

            <a href="/login">Login</a>
            <a href="/contact">Contact</a>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <h3>Contact</h3>

            <a href="mailto:selva77085427@gmail.com">
              <Mail size={15} />
              selva77085427@gmail.com
            </a>

            <a href="tel:+916374807176">
              <Phone size={15} />
              +91 63748 07176
            </a>

            <div className="footer-contact-item">
              <MapPin size={15} />
              <span>India</span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} CivicConnect. All rights
            reserved.
          </p>

          <div className="footer-bottom-links">
            <a href="#home">Privacy</a>
            <a href="#home">Terms</a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;