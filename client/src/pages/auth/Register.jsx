import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../../services/api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Name, email and password are required."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">

        {/* Left Information Section */}
        <section className="register-info">

          <a href="/" className="register-logo">
            <span className="register-logo-icon">
              C
            </span>

            <span className="register-logo-text">
              Civic<span>Connect</span>
            </span>
          </a>

          <div className="register-info-content">

            <span className="register-badge">
              <span></span>
              Join CivicConnect
            </span>

            <h1>
              Make Your Community
              <span> Better.</span>
            </h1>

            <p>
              Create your CivicConnect account and start
              reporting, tracking, and following civic issues
              in your community.
            </p>

            <div className="register-benefits">

              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>
                    Report Civic Issues
                  </strong>

                  <span>
                    Submit problems with details and
                    location.
                  </span>
                </div>
              </div>

              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>
                    Track Progress
                  </strong>

                  <span>
                    Follow your complaints until
                    resolution.
                  </span>
                </div>
              </div>

            </div>
          </div>

          <p className="register-copyright">
            © {new Date().getFullYear()} CivicConnect
          </p>

        </section>

        {/* Register Card */}
        <section className="register-card-wrapper">

          <div className="register-card">

            <div className="register-card-header">

              <div className="register-card-icon">
                <UserRound size={21} />
              </div>

              <h2>
                Create your account
              </h2>

              <p>
                Join CivicConnect and start making a
                difference.
              </p>

            </div>

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}
              <div className="register-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="register-input-wrapper">

                  <UserRound size={18} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* Email */}
              <div className="register-field">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <Mail size={18} />

                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Phone */}
              <div className="register-field">

                <label htmlFor="phone">
                  Phone Number
                  <span>Optional</span>
                </label>

                <div className="register-input-wrapper">

                  <Phone size={18} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                </div>

              </div>

              {/* Password */}
<div className="register-field">

  <label htmlFor="register-password">
    Password
  </label>

  <div className="register-input-wrapper">

    <LockKeyhole size={18} />

    <input
      id="register-password"
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Create a password"
      value={formData.password}
      onChange={handleChange}
      autoComplete="new-password"
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>

  </div>

</div>

              {/* Terms */}
              <label className="register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the CivicConnect terms and
                  privacy policy.
                </span>

              </label>

              {/* Error */}
              {error && (
                <p className="register-message register-error">
                  {error}
                </p>
              )}

              {/* Success */}
              {message && (
                <p className="register-message register-success">
                  {message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="register-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Account..."
                  : "Create Account"}

                {!isLoading && (
                  <ArrowRight size={18} />
                )}
              </button>

            </form>

            <div className="register-divider">
              <span>
                Already have an account?
              </span>
            </div>

            <a
              href="/login"
              className="register-login"
            >
              Sign in to CivicConnect
            </a>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Register;