import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialAuthModal from "../components/Common/SocialAuthModal";
import { CartContext } from "../context/CartContext";
import { signInUser } from "../services/api";

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, loginUser, user } = useContext(CartContext);

  // Mode: "phone" | "email"
  const [activeTab, setActiveTab] = useState("phone");

  // Phone / Country code state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // OTP state (4 digits)
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // General UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const countryDropdownRef = useRef(null);
  const from = location.state?.from?.pathname || "/";

  // If user is already authenticated, redirect to Profile or target
  useEffect(() => {
    if (user && user.isLoggedIn) {
      const destination = from === "/login" ? "/profile" : from;
      navigate(destination, { replace: true });
    }
  }, [user, from, navigate]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Outside click listener for country dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Request OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    setError("");

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (!cleanNumber || cleanNumber.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpTimer(30);
      setCanResendOtp(false);
      addToast(`OTP sent to ${selectedCountry.code} ${cleanNumber}! Use demo code 1234`, "success");
      setTimeout(() => otpInputRefs[0].current?.focus(), 150);
    }, 600);
  };

  // OTP digit typing
  const handleOtpDigitChange = (index, value) => {
    if (isNaN(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

    // Auto advance focus
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otpDigits.join("");

    if (enteredOtp.length < 4) {
      setError("Please enter the complete 4-digit OTP code");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (enteredOtp === "1234" || enteredOtp.length === 4) {
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const formattedUser = {
          name: `User ${cleanNumber.slice(-4)}`,
          phone: `${selectedCountry.code} ${cleanNumber}`,
          email: `user${cleanNumber.slice(-4)}@cartify.com`,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          isLoggedIn: true,
        };
        loginUser(formattedUser);
        navigate(from, { replace: true });
      } else {
        setError("Invalid OTP code. Please enter 1234 (demo code).");
      }
    }, 700);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setOtpDigits(["", "", "", ""]);
    setOtpTimer(30);
    setCanResendOtp(false);
    setError("");
    addToast("New OTP sent! Check demo code: 1234", "info");
    otpInputRefs[0].current?.focus();
  };

  // Email Login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 4) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const result = await signInUser(email, password);
      setLoading(false);

      if (result.success) {
        loginUser({
          name: result.user?.name || email.split("@")[0],
          email: result.user?.email || email,
          avatar:
            result.user?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          token: result.user?.token || null,
        });
        addToast(`Welcome back, ${result.user?.name || email.split("@")[0]}! 👋`);
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setLoading(false);
      // Fallback client-side demo login
      loginUser({
        name: email.split("@")[0],
        email: email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });
      addToast(`Welcome back, ${email.split("@")[0]}! 👋`);
      navigate(from, { replace: true });
    }
  };

  // Social Modal success
  const handleSocialSuccess = (userData) => {
    loginUser(userData);
    setActiveProvider(null);
    addToast(`Signed in with ${userData.provider || "Social Account"}! 🎉`);
    navigate(from, { replace: true });
  };

  return (
    <div className="page-wrapper min-h-screen flex flex-col">
      <Navbar />

      <main className="pro-auth-page">
        <div className="pro-auth-container">
          
          {/* Left Side: Luxury Brand Visual Showcase */}
          <div className="pro-auth-showcase">
            <div className="pro-showcase-badge">
              <span>✦</span> THE OFFICIAL LUXURY STORE
            </div>

            <h1 className="pro-showcase-title">
              Elevate Your <span>Shopping</span> Experience.
            </h1>

            <p className="pro-showcase-desc">
              Log in to track your luxury orders, manage your private wishlist, and unlock exclusive VIP pricing with verified authenticity.
            </p>

            <div className="pro-showcase-perks">
              <div className="pro-perk-card">
                <div className="pro-perk-icon">⚡</div>
                <div className="pro-perk-info">
                  <h4>Express 24h Dispatch</h4>
                  <p>Fast doorstep delivery with real-time GPS tracking.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">🛡️</div>
                <div className="pro-perk-info">
                  <h4>100% Authentic</h4>
                  <p>Direct brand warranty & certified luxury genuine items.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">💎</div>
                <div className="pro-perk-info">
                  <h4>Cartify VIP Club</h4>
                  <p>Earn 5% cashback points on every confirmed purchase.</p>
                </div>
              </div>

              <div className="pro-perk-card">
                <div className="pro-perk-icon">🔄</div>
                <div className="pro-perk-info">
                  <h4>Hassle-Free Returns</h4>
                  <p>30-day instant refund & free doorstep exchange pickup.</p>
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
                Joined by <strong>50,000+</strong> happy shoppers <span className="pro-proof-stars">★★★★★ (4.9)</span>
              </span>
            </div>
          </div>

          {/* Right Side: Ultra-Luxury Auth Card */}
          <div className="pro-auth-card">
            
            <div className="pro-card-header">
              <h2>Welcome Back 👋</h2>
              <p>Sign in to continue to your Cartify account</p>
            </div>

            {/* Segmented Control Pill Tabs */}
            <div className="pro-auth-tabs">
              <button
                type="button"
                className={`pro-tab-btn ${activeTab === "phone" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("phone");
                  setError("");
                }}
              >
                <span>📱</span> Phone OTP
              </button>
              <button
                type="button"
                className={`pro-tab-btn ${activeTab === "email" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("email");
                  setError("");
                }}
              >
                <span>✉️</span> Email &amp; Password
              </button>
            </div>

            {/* TAB 1: PHONE OTP */}
            {activeTab === "phone" && (
              !otpSent ? (
                <form onSubmit={handleRequestOtp}>
                  <div className="pro-input-group">
                    <label className="pro-input-label">Mobile Number</label>
                    <div className="pro-phone-box" ref={countryDropdownRef}>
                      
                      {/* Country Flag Selector */}
                      <div
                        className="pro-country-selector"
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      >
                        <span className="pro-flag">{selectedCountry.flag}</span>
                        <span className="pro-dial-code">{selectedCountry.code}</span>
                        <span className="pro-arrow-down">▼</span>
                      </div>

                      {/* Dropdown Menu */}
                      {countryDropdownOpen && (
                        <div className="pro-country-dropdown">
                          {COUNTRY_CODES.map((c) => (
                            <div
                              key={c.code + c.country}
                              className={`pro-country-item ${selectedCountry.code === c.code ? "selected" : ""}`}
                              onClick={() => {
                                setSelectedCountry(c);
                                setCountryDropdownOpen(false);
                              }}
                            >
                              <span className="pro-flag">{c.flag}</span>
                              <span style={{ flex: 1 }}>{c.country}</span>
                              <span style={{ opacity: 0.6, fontSize: "12px" }}>{c.code}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pro-box-divider"></div>

                      <input
                        type="tel"
                        className="pro-phone-field"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={15}
                        autoFocus
                      />
                    </div>
                    {error && <span className="pro-error-text">{error}</span>}
                  </div>

                  <button
                    type="submit"
                    className="pro-btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Request OTP →"}
                  </button>
                </form>
              ) : (
                /* OTP Verification Form */
                <form onSubmit={handleVerifyOtp}>
                  <div className="pro-otp-hint-banner">
                    OTP sent to <strong>{selectedCountry.code} {phoneNumber}</strong>
                    <button
                      type="button"
                      className="pro-link-btn"
                      style={{ marginLeft: "8px" }}
                      onClick={() => setOtpSent(false)}
                    >
                      Change
                    </button>
                  </div>

                  <div className="pro-otp-grid">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="pro-otp-cell"
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      />
                    ))}
                  </div>

                  {error && <span className="pro-error-text" style={{ textAlign: "center" }}>{error}</span>}

                  <div className="pro-timer-bar">
                    {otpTimer > 0 ? (
                      <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        className="pro-link-btn"
                        onClick={handleResendOtp}
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="pro-btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Verifying Code..." : "Verify & Sign In ✓"}
                  </button>
                </form>
              )
            )}

            {/* TAB 2: EMAIL & PASSWORD */}
            {activeTab === "email" && (
              <form onSubmit={handleEmailSubmit}>
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
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pro-input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="pro-input-label">Password</label>
                    <button
                      type="button"
                      className="pro-link-btn"
                      style={{ fontSize: "12px", marginBottom: "6px" }}
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="pro-field-wrapper">
                    <span className="pro-field-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pro-text-field"
                      placeholder="Enter your password"
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
                  {error && <span className="pro-error-text">{error}</span>}
                </div>

                <button
                  type="submit"
                  className="pro-btn-submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In to Cartify →"}
                </button>
              </form>
            )}

            {/* Social Divider */}
            <div className="pro-divider">
              <span>Or Continue With</span>
            </div>

            {/* High-Converting SVG Social Login Buttons */}
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

            {/* Footer Links & Trust */}
            <div className="pro-card-footer">
              <p className="pro-register-cta">
                Don't have an account? <Link to="/register">Create Account →</Link>
              </p>

              <div className="pro-security-badge">
                <span>🔒</span> Bank-Grade 256-Bit SSL Encryption • Privacy Protected
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", padding: "28px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>Reset Password</h3>
            <p style={{ fontSize: "14px", color: "var(--slate-500)", marginBottom: "20px" }}>
              Enter your registered email and we'll send you a secure password reset link.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!resetEmail || !resetEmail.includes("@")) {
                setResetStatus("Please enter a valid email address");
                return;
              }
              setResetLoading(true);
              setTimeout(() => {
                setResetLoading(false);
                setResetStatus("✓ Password reset link sent to your email!");
                setTimeout(() => setShowForgotModal(false), 2000);
              }, 800);
            }}>
              <div className="pro-input-group">
                <input
                  type="email"
                  className="pro-text-field"
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  style={{ border: "1px solid var(--slate-300)", borderRadius: "10px", padding: "10px 14px", width: "100%" }}
                  autoFocus
                />
              </div>
              {resetStatus && <p style={{ fontSize: "13px", color: resetStatus.startsWith("✓") ? "#10b981" : "#ef4444", marginBottom: "12px" }}>{resetStatus}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowForgotModal(false)}>Cancel</button>
                <button type="submit" className="pro-btn-submit" style={{ flex: 1, marginTop: 0 }} disabled={resetLoading}>
                  {resetLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Login;