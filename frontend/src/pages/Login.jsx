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
  const { addToast, loginUser } = useContext(CartContext);

  // Mode: "phone_otp" | "otp_verify" | "email"
  const [authMode, setAuthMode] = useState("phone_otp");

  // Phone / Country code state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const countryDropdownRef = useRef(null);
  const from = location.state?.from?.pathname || "/";

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (authMode === "otp_verify" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [authMode, otpTimer]);

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

  // 1. Request OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setAuthMode("otp_verify");
      setOtpDigits(["", "", "", ""]);
      setOtpTimer(30);
      setCanResendOtp(false);
      addToast(`OTP sent to ${selectedCountry.code} ${phoneNumber}! 📱`);
      // Auto focus first OTP digit
      setTimeout(() => otpInputRefs[0].current?.focus(), 100);
    }, 600);
  };

  // 2. Handle OTP digit input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Pasted multi-digit OTP
      const pasted = value.replace(/\D/g, "").slice(0, 4).split("");
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 4) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 4) {
        otpInputRefs[3].current?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (digit && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // 3. Verify OTP and sign in
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 4) {
      setErrors({ otp: "Please enter all 4 digits of the OTP" });
      return;
    }

    setLoading(true);
    setErrors({});
    const fullPhone = `${selectedCountry.code} ${phoneNumber}`;
    const syntheticEmail = `user_${phoneNumber.slice(-4)}@cartify.com`;

    const result = await signInUser(syntheticEmail, "otp_authenticated_session", `User ${phoneNumber.slice(-4)}`, fullPhone);
    setLoading(false);

    if (result.success) {
      loginUser({
        name: result.user?.name || `User (${phoneNumber.slice(-4)})`,
        email: result.user?.email || syntheticEmail,
        phone: fullPhone,
        token: result.user?.token || null,
      });

      setStatusMessage("✓ Sign-in Successful! Redirecting…");
      addToast("Signed in with OTP successfully! 👋");
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } else {
      setStatusMessage(result.message || "OTP verification failed. Please try again.");
    }
  };

  // 4. Resend OTP
  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setOtpTimer(30);
    setCanResendOtp(false);
    setOtpDigits(["", "", "", ""]);
    addToast(`New OTP sent to ${selectedCountry.code} ${phoneNumber}! 📩`);
    otpInputRefs[0].current?.focus();
  };

  // 5. Submit Email & Password login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setStatusMessage("");

    const result = await signInUser(email, password, "", "");
    setLoading(false);

    if (result.success) {
      loginUser({
        name: result.user?.name || email.split("@")[0],
        email: result.user?.email || email,
        token: result.user?.token || null,
      });

      setStatusMessage("✓ Sign-in Successful! Redirecting…");
      addToast("Signed in successfully! 👋");
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } else {
      setStatusMessage(result.message || "Sign-in failed. Please check your credentials.");
    }
  };

  // Social Auth Callback
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

      addToast(`Signed in via ${socialData.provider === "google" ? "Google" : "Apple"}! 📱`);
      setTimeout(() => navigate(from, { replace: true }), 1000);
    }
  };

  // Forgot password
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
      <main className="main-content uspa-auth-page">
        <div className="uspa-login-card">
          {/* Status Message */}
          {statusMessage && (
            <div className={`auth-success-alert${statusMessage.toLowerCase().includes("fail") || statusMessage.toLowerCase().includes("error") ? " auth-error-alert" : ""}`}>
              {statusMessage}
            </div>
          )}

          {/* ========================================================
              MODE 1: PHONE OTP REQUEST (Matching attached design)
             ======================================================== */}
          {authMode === "phone_otp" && (
            <>
              <div className="uspa-auth-header">
                <h2>Login with OTP</h2>
                <p>Enter your log in details</p>
              </div>

              <form onSubmit={handleRequestOtp} className="uspa-auth-form">
                {/* Phone Input with Flag & Country Picker */}
                <div className="uspa-phone-input-wrapper" ref={countryDropdownRef}>
                  <div
                    className="uspa-country-selector"
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  >
                    <span className="uspa-flag">{selectedCountry.flag}</span>
                    <span className="uspa-dropdown-arrow">▼</span>
                  </div>

                  {countryDropdownOpen && (
                    <div className="uspa-country-dropdown-list">
                      {COUNTRY_CODES.map((item, idx) => (
                        <div
                          key={idx}
                          className={`uspa-country-option ${selectedCountry.code === item.code && selectedCountry.country === item.country ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedCountry(item);
                            setCountryDropdownOpen(false);
                          }}
                        >
                          <span className="country-flag">{item.flag}</span>
                          <span className="country-name">{item.country}</span>
                          <span className="country-code-pill">{item.code}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="uspa-input-divider"></div>

                  <input
                    type="tel"
                    className={`uspa-phone-field ${errors.phone ? "input-error" : ""}`}
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phone) setErrors({});
                    }}
                    required
                    autoFocus
                  />
                </div>

                {errors.phone && (
                  <span className="uspa-validation-error">⚠️ {errors.phone}</span>
                )}

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="uspa-btn-primary"
                  disabled={loading}
                >
                  <span>{loading ? "Sending OTP…" : "Request OTP"}</span>
                  <span className="btn-arrow-icon">→</span>
                </button>
              </form>

              {/* Or Login Using Divider */}
              <div className="uspa-divider-wrap">
                <span>Or Login Using</span>
              </div>

              {/* Email Option Button */}
              <button
                type="button"
                className="uspa-btn-outlined"
                onClick={() => {
                  setAuthMode("email");
                  setErrors({});
                  setStatusMessage("");
                }}
              >
                <span className="btn-outline-icon">✉</span>
                <span>Email</span>
              </button>

              {/* Social Login Quick Row */}
              <div className="uspa-social-quick-row">
                <button
                  type="button"
                  className="uspa-social-icon-btn"
                  onClick={() => setActiveProvider("google")}
                  title="Sign in with Google"
                >
                  <span>🔴 Google</span>
                </button>
                <button
                  type="button"
                  className="uspa-social-icon-btn"
                  onClick={() => setActiveProvider("apple")}
                  title="Sign in with Apple"
                >
                  <span>🍏 Apple</span>
                </button>
              </div>

              {/* Terms & Conditions Notice */}
              <div className="uspa-terms-text">
                I accept that I have read &amp; understood <br />
                <a href="#privacy" onClick={(e) => { e.preventDefault(); addToast("Cartify Privacy Policy & Terms apply."); }}>
                  Privacy Policy and T&amp;Cs.
                </a>
              </div>
            </>
          )}

          {/* ========================================================
              MODE 2: OTP VERIFICATION SCREEN
             ======================================================== */}
          {authMode === "otp_verify" && (
            <div className="uspa-otp-verify-section">
              <div className="uspa-auth-header">
                <h2>Enter Verification Code</h2>
                <p>
                  OTP sent to <strong>{selectedCountry.code} {phoneNumber}</strong>
                  <button
                    type="button"
                    className="uspa-edit-phone-btn"
                    onClick={() => {
                      setAuthMode("phone_otp");
                      setErrors({});
                    }}
                  >
                    ✏️ Edit
                  </button>
                </p>
              </div>

              <div className="uspa-otp-demo-hint">
                💡 <em>Demo: Enter any 4-digit code (e.g. <strong>1 2 3 4</strong>) to sign in.</em>
              </div>

              <form onSubmit={handleVerifyOtp} className="uspa-auth-form">
                <div className="uspa-otp-boxes-group">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      className="uspa-otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <span className="uspa-validation-error center">⚠️ {errors.otp}</span>
                )}

                <div className="uspa-otp-timer-row">
                  {otpTimer > 0 ? (
                    <span className="otp-timer-count">Resend OTP in <strong>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</strong></span>
                  ) : (
                    <button
                      type="button"
                      className="uspa-resend-btn"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="uspa-btn-primary"
                  disabled={loading}
                >
                  <span>{loading ? "Verifying…" : "Verify & Sign In"}</span>
                  <span className="btn-arrow-icon">→</span>
                </button>

                <button
                  type="button"
                  className="uspa-back-text-btn"
                  onClick={() => {
                    setAuthMode("phone_otp");
                    setErrors({});
                  }}
                >
                  ← Back to Phone Number
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              MODE 3: EMAIL & PASSWORD LOGIN
             ======================================================== */}
          {authMode === "email" && (
            <>
              <div className="uspa-auth-header">
                <h2>Sign In with Email</h2>
                <p>Enter your email address &amp; password</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="uspa-auth-form">
                <div className="form-group uspa-form-group">
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
                    autoFocus
                  />
                  {errors.email && <span className="uspa-validation-error">⚠️ {errors.email}</span>}
                </div>

                <div className="form-group uspa-form-group">
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
                  {errors.password && <span className="uspa-validation-error">⚠️ {errors.password}</span>}
                </div>

                <div className="form-options margin-y-sm">
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
                  className="uspa-btn-primary"
                  disabled={loading}
                >
                  <span>{loading ? "Authenticating…" : "Sign In"}</span>
                  <span className="btn-arrow-icon">→</span>
                </button>
              </form>

              {/* Switch back to Phone OTP */}
              <div className="uspa-divider-wrap">
                <span>Or Login Using</span>
              </div>

              <button
                type="button"
                className="uspa-btn-outlined"
                onClick={() => {
                  setAuthMode("phone_otp");
                  setErrors({});
                  setStatusMessage("");
                }}
              >
                <span className="btn-outline-icon">📱</span>
                <span>Phone &amp; OTP</span>
              </button>

              <div className="uspa-terms-text">
                Don&apos;t have an account? <Link to="/register">Create Account</Link>
              </div>
            </>
          )}
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
                  className="uspa-btn-primary margin-top-sm"
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