import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/Common/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { addToast, loginUser } = useContext(CartContext);

  // Blank defaults — no hardcoded PII
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!name || name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters long";
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setEmailStatus("");

    const result = await signInUser(email, password, name);
    setLoading(false);

    if (result.success) {
      loginUser({
        name: result.user?.name || name,
        email: result.user?.email || email,
        token: result.user?.token || null,
      });
      setEmailStatus(`✓ Account created! Welcome email sent to ${email} 📧`);
      addToast(`Welcome to Cartify, ${name}! 🎉`);
      setTimeout(() => navigate("/"), 1500);
    } else {
      setEmailStatus(result.message || "Registration failed. Please try again.");
    }
  };

  const handleSocialSuccess = async (socialData) => {
    setActiveProvider(null);
    setLoading(true);

    const result = await signInUser(socialData.email, "social_auth_pass", socialData.name);
    setLoading(false);

    if (result.success) {
      loginUser({
        name: result.user?.name || socialData.name,
        email: result.user?.email || socialData.email,
        avatar: socialData.avatar,
        token: result.user?.token || null,
      });
      addToast(`Registered via ${socialData.provider === "google" ? "Google" : "Apple"}! 🎉`);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Join Cartify today and unlock 15% off your first purchase.</p>
          </div>

          {emailStatus && (
            <div className={`auth-success-alert${emailStatus.toLowerCase().includes("fail") ? " auth-error-alert" : ""}`}>
              {emailStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                className={errors.name ? "input-error" : ""}
                required
              />
              {errors.name && <span className="validation-error-text">⚠️ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className={errors.email ? "input-error" : ""}
                required
              />
              {errors.email && <span className="validation-error-text">⚠️ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={errors.password ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="validation-error-text">⚠️ {errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account 🚀"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or create account with</span>
          </div>

          <div className="social-auth-buttons">
            <button
              className="social-btn google-btn"
              onClick={() => setActiveProvider("google")}
              type="button"
            >
              <span className="social-icon">🔴</span> Google
            </button>
            <button
              className="social-btn apple-btn"
              onClick={() => setActiveProvider("apple")}
              type="button"
            >
              <span className="social-icon">🍏</span> Apple
            </button>
          </div>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </main>
      <Footer />

      {activeProvider && (
        <SocialAuthModal
          provider={activeProvider}
          onClose={() => setActiveProvider(null)}
          onSuccess={handleSocialSuccess}
        />
      )}
    </div>
  );
}

export default Register;