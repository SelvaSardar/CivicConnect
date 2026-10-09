import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">C</span>

          <span className="navbar-logo-text">
            Civic<span>Connect</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <a href="#home" className="navbar-link active">
            Home
          </a>

          <a href="#how-it-works" className="navbar-link">
            How It Works
          </a>

          <a href="#about" className="navbar-link">
            About
          </a>

          <a href="#contact" className="navbar-link">
            Contact
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>

          <a href="/login" className="navbar-login">
            Login
          </a>

          <a href="/register" className="navbar-register">
            Get Started
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="navbar-mobile-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <nav className="mobile-menu-links">
          <a href="#home" className="mobile-menu-link" onClick={closeMenu}>
            Home
          </a>

          <a
            href="#how-it-works"
            className="mobile-menu-link"
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a href="#about" className="mobile-menu-link" onClick={closeMenu}>
            About
          </a>

          <a
            href="#contact"
            className="mobile-menu-link"
            onClick={closeMenu}
          >
            Contact
          </a>

          <div className="mobile-menu-actions">
            <a
              href="/login"
              className="mobile-login"
              onClick={closeMenu}
            >
              Login
            </a>

            <a
              href="#register"
              className="mobile-register"
              onClick={closeMenu}
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;