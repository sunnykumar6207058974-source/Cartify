import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/Common/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { addToast, loginUser } = useContext(CartContext);
  const [email, setEmail] = useState("sunnykumar6207058974@gmail.com");
  const [phone, setPhone] = useState("+91 8340112045");
  const [password, setPassword] = useState("password123");
  
  // 4. Show/Hide Password State
  const [showPassword, setShowPassword] = useState(false);
  
  // 5. Validation Messages State
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  // 3. Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Real-time Validation Function
  const validateForm = () => {
    const newErrors = {};
    if (!email || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address (e.g., name@domain.com)";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!phone || phone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile phone number";
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
      loginUser({ name: "Sunny Kumar", email, phone });
      const msg = `✓ Sign-in Successful! Welcome back. SMS alert sent to ${phone} 📱📧`;
      setStatusMessage(msg);
      addToast(`Signed in successfully! SMS sent to ${phone} 📱`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const handleSocialSuccess = async (socialData) => {
    setActiveProvider(null);
    setLoading(true);

    const result = await signInUser(socialData.email, "social_auth_pass", socialData.name, phone);
    setLoading(false);

    if (result.success) {
      loginUser({ name: socialData.name, email: socialData.email, avatar: socialData.avatar });
      const msg = `✓ Signed in via ${socialData.provider === "google" ? "Google" : "Apple"} as ${socialData.name}! 📱📧`;
      setStatusMessage(msg);
      addToast(`Signed in via ${socialData.provider === "google" ? "Google" : "Apple"}! 📱`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  // 3. Handle Forgot Password Reset Request
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetStatus("Please enter a valid email address.");
      return;
    }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetStatus(`🎉 Password reset link & OTP code sent to ${resetEmail}! Check your inbox.`);
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
            <p>Sign in with your Email & Mobile Phone Number.</p>
          </div>

          {statusMessage && (
            <div className="auth-success-alert">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field with Validation */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
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

            {/* Phone Field with Validation */}
            <div className="form-group">
              <label>Mobile Phone Number (for SMS Alerts)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                placeholder="+91 8340112045"
                className={errors.phone ? "input-error" : ""}
                required
              />
              {errors.phone && <span className="validation-error-text">⚠️ {errors.phone}</span>}
            </div>

            {/* Password Field with 4. Show/Hide Password Toggle */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
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

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              {/* 3. Forgot Password Trigger Link */}
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
              {loading ? "Authenticating..." : "Sign In (Send Email & SMS Alerts) 🔑"}
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
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </main>

      {/* 3. Interactive Forgot Password Reset Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForgotModal(false)}>
              ✕
            </button>
            <div className="forgot-modal-container">
              <h3>Reset Your Password 🔒</h3>
              <p>Enter your registered email address to receive a password reset link and OTP verification code.</p>

              {resetStatus && (
                <div className="auth-success-alert margin-y-sm">
                  {resetStatus}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="auth-form margin-top-md">
                <div className="form-group">
                  <label>Registered Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="sunny@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary auth-submit-btn"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending Link..." : "Send Reset Link & OTP 📧"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Google / Apple Authentication Modal */}
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