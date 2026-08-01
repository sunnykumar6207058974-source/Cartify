import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { addToast } = useContext(CartContext);
  const [email, setEmail] = useState("sunnykumar6207058974@gmail.com");
  const [phone, setPhone] = useState("+91 8340112045");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    const result = await signInUser(email, password, "", phone);
    setLoading(false);

    if (result.success) {
      const msg = `✓ Sign-in Successful! Email alert & SMS sent to ${phone} and ${email} 📱📧`;
      setStatusMessage(msg);
      addToast(`Email alert & SMS sent to ${phone}! 📱`);

      setTimeout(() => {
        navigate("/");
      }, 1800);
    }
  };

  const handleSocialSuccess = async (socialData) => {
    setActiveProvider(null);
    setLoading(true);

    const result = await signInUser(socialData.email, "social_auth_pass", socialData.name, phone);
    setLoading(false);

    if (result.success) {
      const msg = `✓ Signed in via ${socialData.provider === "google" ? "Google" : "Apple"} as ${socialData.name}! Email alert & SMS sent to ${phone} 📱📧`;
      setStatusMessage(msg);
      addToast(`Signed in via ${socialData.provider === "google" ? "Google" : "Apple"}! 📱`);

      setTimeout(() => {
        navigate("/");
      }, 1800);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back to Cartify</h2>
            <p>Sign in with your Email or Mobile Phone Number.</p>
          </div>

          {statusMessage && (
            <div className="auth-success-alert">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Phone Number (for SMS Alerts)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 8340112045"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span className="forgot-link">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Sending SMS & Email..." : "Sign In (Send Email & SMS Alerts) 🔑"}
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
      <Footer />

      {/* Google / Apple Authentication Modal */}
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

export default Login;