import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/Common/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, loginUser } = useContext(CartContext);

  // Blank defaults — no hardcoded PII
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Where to redirect after login (if coming from a protected route)
  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const newErrors = {};
    if (!email || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address (e.g., name@domain.com)";
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
    setStatusMessage("");

    const result = await signInUser(email, password, "", phone);
    setLoading(false);

    if (result.success) {
      // Pass the full user object including JWT token to context
      loginUser({
        name: result.user?.name || email.split("@")[0],
        email: result.user?.email || email,
        phone: result.user?.phone || phone || null,
        token: result.user?.token || null,
      });

      setStatusMessage("✓ Sign-in Successful! Redirecting…");
      addToast("Signed in successfully! 👋");
      setTimeout(() => navigate(from, { replace: true }), 1200);
    } else {
      setStatusMessage(result.message || "Sign-in failed. Please try again.");
    }
  };

  const handleSocialSuccess = async (socialData) => {
    setActiveProvider(null);
    setLoading(true);

    const result = await signInUser(socialData.email, "social_auth_pass", socialData.name, phone);
    setLoading(false);

    if (result.success) {
      loginUser({
        name: result.user?.name || socialData.name,
        email: result.user?.email || socialData.email,
        avatar: socialData.avatar,
        token: result.user?.token || null,
      });

      addToast(`Signed in via ${socialData.provider === "google" ? "Google" : "Apple"}! 📱`);
      setTimeout(() => navigate(from, { replace: true }), 1200);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetStatus("Please enter a valid email address.");
      return;
    }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetStatus(`🎉 Password reset link sent to ${resetEmail}! Check your inbox.`);
      addToast(`Reset link sent to ${resetEmail}! 📧`);
    }, 1200);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back to Cartify</h2>
            <p>Sign in with your Email &amp; Password.</p>
          </div>

          {statusMessage && (
            <div className={`auth-success-alert${statusMessage.toLowerCase().includes("fail") || statusMessage.toLowerCase().includes("error") ? " auth-error-alert" : ""}`}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
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
              <label>Mobile Phone (optional — for SMS alerts)</label>
              <input
                type="tel"
                value={phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
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

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span
                className="forgot-link"
                onClick={() => {
                  setShowForgotModal(true);
                  setResetEmail(email);
                  setResetStatus("");
                }}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Authenticating…" : "Sign In 🔑"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign in with</span>
          </div>

          <div className="social-auth-buttons">
            <button
              className="social-btn google-btn"
              onClick={() => setActiveProvider("google")}
              type="button"
            >
              <span className="social-icon">🔴</span> Continue with Google
            </button>
            <button
              className="social-btn apple-btn"
              onClick={() => setActiveProvider("apple")}
              type="button"
            >
              <span className="social-icon">🍏</span> Continue with Apple
            </button>
          </div>

          <div className="auth-footer-link">
            Don&apos;t have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForgotModal(false)}>✕</button>
            <div className="forgot-modal-container">
              <h3>Reset Your Password 🔒</h3>
              <p>Enter your registered email address to receive a password reset link.</p>

              {resetStatus && (
                <div className="auth-success-alert margin-y-sm">{resetStatus}</div>
              )}

              <form onSubmit={handleForgotSubmit} className="auth-form margin-top-md">
                <div className="form-group">
                  <label>Registered Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary auth-submit-btn"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending…" : "Send Reset Link 📧"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Social Auth Modal */}
      {activeProvider && (
        <SocialAuthModal
          provider={activeProvider}
          onClose={() => setActiveProvider(null)}
          onSuccess={handleSocialSuccess}
        />
      )}

      <Footer />
    </div>
  );
}

export default Login;