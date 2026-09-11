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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    try {
      const result = await signInUser(email, password, name);
      setLoading(false);

      if (result.success) {
        loginUser({
          name: result.user?.name || name,
          email: result.user?.email || email,
          phone: phone || null,
          avatar:
            result.user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          token: result.user?.token || null,
        });
        addToast(`Welcome to Cartify, ${name}! 🎉 Exclusive VIP member perks unlocked!`);
        navigate("/");
      } else {
        setErrors({ form: result.message || "Registration failed. Please try again." });
      }
    } catch {
      setLoading(false);
      loginUser({
        name,
        email,
        phone: phone || null,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      });
      addToast(`Welcome to Cartify, ${name}! 🎉`);
      navigate("/");
    }
  };

  const handleSocialSuccess = (userData) => {
    loginUser(userData);
    setActiveProvider(null);
    addToast(`Welcome to Cartify, ${userData.name}! 🎉`);
    navigate("/");
  };

  return (
    <div className="page-wrapper min-h-screen flex flex-col">
      <Navbar />

      <main className="pro-auth-page">
        <div className="pro-auth-container">
          
          {/* Left Side: Brand Showcase */}
          <div className="pro-auth-showcase">
            <div className="pro-showcase-badge">
              <span>✦</span> JOIN CARTIFY ELITE
            </div>

            <h1 className="pro-showcase-title">
              Start Your Luxury <span>Journey</span> Today.
            </h1>

            <p className="pro-showcase-desc">
              Create an account in seconds to unlock personalized shopping recommendations, early drops, flash sales, and complimentary VIP shipping.
            </p>

            <div className="pro-showcase-perks">
              <div className="pro-perk-card">
                <div className="pro-perk-icon">🎁</div>
                <div className="pro-perk-info">
                  <h4>$50 Welcome Voucher</h4>
                  <p>Applied automatically on your first order above $150.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">💎</div>
                <div className="pro-perk-info">
                  <h4>Tier-1 Member Perks</h4>
                  <p>Exclusive access to limited-edition sneaker & watch drops.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">⚡</div>
                <div className="pro-perk-info">
                  <h4>1-Click Fast Checkout</h4>
                  <p>Save shipping addresses & cards securely.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">🛡️</div>
                <div className="pro-perk-info">
                  <h4>Buyer Protection Plus</h4>
                  <p>Guaranteed authentic or 200% money-back warranty.</p>
                </div>
              </div>
            </div>

            <div className="pro-social-proof-bar">
              <div className="pro-avatars-group">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Customer" className="pro-avatar-img" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Customer" className="pro-avatar-img" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Customer" className="pro-avatar-img" />
              </div>
              <span className="pro-proof-text">
                Rated <strong>4.9/5</strong> by over 50,000+ satisfied shoppers.
              </span>
            </div>
          </div>

          {/* Right Side: Register Card */}
          <div className="pro-auth-card">
            <div className="pro-card-header">
              <h2>Create Account ✨</h2>
              <p>Join the Cartify community for exclusive access</p>
            </div>

            <form onSubmit={handleSubmit}>
              {errors.form && <div className="pro-otp-hint-banner" style={{ color: "#ef4444", marginBottom: "16px" }}>{errors.form}</div>}

              <div className="pro-input-group">
                <label className="pro-input-label">Full Name</label>
                <div className="pro-field-wrapper">
                  <span className="pro-field-icon">👤</span>
                  <input
                    type="text"
                    className="pro-text-field"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                {errors.name && <span className="pro-error-text">{errors.name}</span>}
              </div>

              <div className="pro-input-group">
                <label className="pro-input-label">Email Address</label>
                <div className="pro-field-wrapper">
                  <span className="pro-field-icon">✉️</span>
                  <input
                    type="email"
                    className="pro-text-field"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <span className="pro-error-text">{errors.email}</span>}
              </div>

              <div className="pro-input-group">
                <label className="pro-input-label">Password</label>
                <div className="pro-field-wrapper">
                  <span className="pro-field-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pro-text-field"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="pro-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                {errors.password && <span className="pro-error-text">{errors.password}</span>}
              </div>

              <div className="pro-input-group">
                <label className="pro-input-label">Mobile Number (Optional)</label>
                <div className="pro-field-wrapper">
                  <span className="pro-field-icon">📱</span>
                  <input
                    type="tel"
                    className="pro-text-field"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="pro-btn-submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account & Get $50 Perk →"}
              </button>
            </form>

            <div className="pro-divider">
              <span>Or Register With</span>
            </div>

            <div className="pro-social-grid">
              <button
                type="button"
                className="pro-social-button"
                onClick={() => setActiveProvider("Google")}
              >
                <svg className="pro-social-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="pro-social-button"
                onClick={() => setActiveProvider("Apple")}
              >
                <svg className="pro-social-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-0.98 2.95 1.07.08 2.15-.55 2.79-1.29z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="pro-card-footer">
              <p className="pro-register-cta">
                Already have an account? <Link to="/login">Sign In →</Link>
              </p>

              <div className="pro-security-badge">
                <span>🔒</span> 256-Bit SSL Encrypted • Your Information is 100% Safe
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Social Auth Modal */}
      {activeProvider && (
        <SocialAuthModal
          provider={activeProvider}
          onSuccess={handleSocialSuccess}
          onClose={() => setActiveProvider(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Register;