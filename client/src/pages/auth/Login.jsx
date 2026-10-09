import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../../services/api";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      login({ token, user });

      const loggedInUser = response.data.user;

      if (loggedInUser.role === "staff") {
        navigate("/staff-dashboard");
      } else if (loggedInUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }


    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* Left Information Section */}
        <section className="login-info">

          <a href="/" className="login-logo">
            <span className="login-logo-icon">
              C
            </span>

            <span className="login-logo-text">
              Civic<span>Connect</span>
            </span>
          </a>

          <div className="login-info-content">

            <span className="login-badge">
              <span></span>
              Secure Civic Platform
            </span>

            <h1>
              Welcome back to
              <span> CivicConnect.</span>
            </h1>

            <p>
              Sign in to report civic issues, track your
              complaints, and stay connected with the people
              working to resolve them.
            </p>

            <div className="login-benefits">

              <div className="login-benefit">
                <div className="login-benefit-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>
                    Track Your Complaints
                  </strong>

                  <span>
                    Follow every issue from report to
                    resolution.
                  </span>
                </div>
              </div>

              <div className="login-benefit">
                <div className="login-benefit-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>
                    Secure Access
                  </strong>

                  <span>
                    Your account and complaint data stay
                    protected.
                  </span>
                </div>
              </div>

            </div>
          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} CivicConnect
          </p>

        </section>

        {/* Login Card */}
        <section className="login-card-wrapper">

          <div className="login-card">

            <div className="login-card-header">

              <div className="login-card-icon">
                <LockKeyhole size={21} />
              </div>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your details to continue to
                CivicConnect.
              </p>

            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              {/* Email */}
              <div className="login-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="login-field">

                <div className="login-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <a href="#forgot-password">
                    Forgot password?
                  </a>

                </div>

                <div className="login-input-wrapper">

                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <label className="login-remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

              {/* Error */}
              {error && (
                <p className="login-message login-error">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Signing In..."
                  : "Sign In"}

                {!isLoading && (
                  <ArrowRight size={18} />
                )}
              </button>

            </form>

            <div className="login-divider">
              <span>
                New to CivicConnect?
              </span>
            </div>

            <a
              href="/register"
              className="login-register"
            >
              Create an account
            </a>

            <div className="login-security">

              <ShieldCheck size={15} />

              <span>
                Protected with secure authentication
              </span>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Login;