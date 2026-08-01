import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { addToast } = useContext(CartContext);
  const [name, setName] = useState("Sunny Kumar");
  const [email, setEmail] = useState("sunnykumar6207058974@gmail.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailStatus("");

    const result = await signInUser(email, password, name);
    setLoading(false);

    if (result.success) {
      const msg = `✓ Account created! Welcome email sent to ${email} 📧`;
      setEmailStatus(msg);
      addToast(`Welcome email sent to ${email}! 📧`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const handleSocialSuccess = async (socialData) => {
    setActiveProvider(null);
    setLoading(true);

    const result = await signInUser(socialData.email, "social_auth_pass", socialData.name);
    setLoading(false);

    if (result.success) {
      const msg = `✓ Account registered via ${socialData.provider === "google" ? "Google" : "Apple"} as ${socialData.name}! Confirmation email sent to ${socialData.email} 📧`;
      setEmailStatus(msg);
      addToast(`Registered via ${socialData.provider === "google" ? "Google" : "Apple"}! 📧`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
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
            <div className="auth-success-alert">
              {emailStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Sunny Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="sunny@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account & Send Email 🚀"}
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

export default Register;