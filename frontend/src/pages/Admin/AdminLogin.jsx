import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { adminLoginUser } from "../../services/api";

function AdminLogin() {
  const { adminLogin, addToast, darkMode, toggleDarkMode } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@cartify.com");
  const [password, setPassword] = useState("admin123");
  const [phone, setPhone] = useState("+91 8340112045");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  const handleFillDemo = () => {
    setEmail("admin@cartify.com");
    setPassword("admin123");
    setPhone("+91 8340112045");
    setErrorMsg("");
    addToast("Demo Super Admin credentials loaded! ✨");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both admin email and password.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await adminLoginUser(email, password, phone);
      setLoading(false);

      if (res.success && res.admin) {
        adminLogin({
          ...res.admin,
          token: res.token,
        });
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message || "Invalid admin credentials. Try admin@cartify.com / admin123");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error connecting to Admin auth service.");
    }
  };

  return (
    <div className={`admin-login-page-wrapper ${darkMode ? "dark-theme" : ""}`}>
      {/* Top Floating Bar */}
      <div className="admin-login-topbar">
        <Link to="/" className="admin-back-store-btn">
          ← Return to Store
        </Link>
        <button
          className="admin-theme-btn"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="admin-login-card-container">
        {/* Glow ambient background element */}
        <div className="admin-glow-halo"></div>

        <div className="admin-login-frost-card">
          <div className="admin-login-header">
            <div className="admin-login-icon-box">⚡</div>
            <h2>Cartify Control Console</h2>
            <p className="admin-login-subtitle">
              Secure Apple Pro Administrator Gateway. Authenticate to manage inventory, fulfill customer orders, and view live store telemetry.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="admin-demo-pill-banner" onClick={handleFillDemo} title="Click to autofill">
            <span className="demo-badge">DEMO ACCESS</span>
            <span>
              <strong>admin@cartify.com</strong> • <strong>admin123</strong>
            </span>
            <span className="demo-apply-arrow">Auto-Fill ↵</span>
          </div>

          {errorMsg && (
            <div className="admin-auth-error-banner">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="admin-email">Admin Email or Username</label>
              <div className="admin-input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="admin-email"
                  type="text"
                  placeholder="admin@cartify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-pass">Secret Admin Key / Password</label>
              <div className="admin-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-phone">SMS Security Dispatch (Twilio Alert)</label>
              <div className="admin-input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  id="admin-phone"
                  type="tel"
                  placeholder="+91 8340112045"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <small className="admin-input-hint">Receives live cellular security SMS upon admin login</small>
            </div>

            <button
              type="submit"
              className="btn-admin-login-submit"
              disabled={loading}
            >
              {loading ? "Verifying Credentials…" : "Authenticate & Launch Console ⚡"}
            </button>
          </form>

          <div className="admin-login-card-footer">
            <span>🔒 256-bit End-to-End Encrypted Session</span>
            <Link to="/" className="store-link">Back to Cartify Storefront ↗</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
