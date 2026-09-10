import { useState, useEffect } from "react";
import "./PWAInstallPrompt.css";

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if app is already installed or in standalone display mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile =
      /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
    if (isAppleMobile) {
      setIsIOS(true);
    }

    // 3. Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user dismissed previously in this session
      const dismissed = sessionStorage.getItem("cartify_pwa_dismissed");
      if (!dismissed) {
        // Show after a brief delay for a smooth first experience
        setTimeout(() => {
          setIsVisible(true);
        }, 1500);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS and not dismissed, also show after 2 seconds
    if (isAppleMobile && isSafari) {
      const dismissed = sessionStorage.getItem("cartify_pwa_dismissed");
      if (!dismissed) {
        setTimeout(() => {
          setIsVisible(true);
        }, 2000);
      }
    }

    // Listen for custom trigger from Navbar or Footer "Download App" buttons
    const handleManualTrigger = () => {
      if (isAppleMobile) {
        setShowIOSModal(true);
      } else if (deferredPrompt) {
        triggerInstall();
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("open-cartify-install", handleManualTrigger);

    // Track app installation completion
    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      sessionStorage.setItem("cartify_pwa_dismissed", "true");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-cartify-install", handleManualTrigger);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [deferredPrompt]);

  const triggerInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // If browser doesn't support native prompt yet, open guidance
      setShowIOSModal(true);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("cartify_pwa_dismissed", "true");
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Mobile Install Bar */}
      {isVisible && (
        <aside className="pwa-install-banner" aria-label="Install Cartify Application">
          <div className="pwa-banner-content">
            <div className="pwa-app-badge">
              <img
                src="/icon-192.png"
                alt="Cartify Logo"
                className="pwa-app-logo"
                loading="eager"
              />
              <div className="pwa-badge-pulse" />
            </div>

            <div className="pwa-banner-text">
              <div className="pwa-app-title">
                <strong>Cartify Store</strong>
                <span className="pwa-official-tag">Official App</span>
              </div>
              <p className="pwa-app-tagline">
                Add to your phone for 1-tap fast checkout &amp; order tracking
              </p>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              className="pwa-install-btn"
              onClick={triggerInstall}
              type="button"
            >
              <span className="pwa-btn-icon">📲</span>
              <span>Install App</span>
            </button>
            <button
              className="pwa-dismiss-btn"
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
              title="Dismiss"
              type="button"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* iOS / Step-by-Step Installation Modal */}
      {showIOSModal && (
        <div className="pwa-modal-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="pwa-modal-close"
              onClick={() => setShowIOSModal(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="pwa-modal-header">
              <div className="pwa-modal-icon-wrap">
                <img
                  src="/icon-192.png"
                  alt="Cartify App Icon"
                  className="pwa-modal-app-icon"
                />
              </div>
              <h3>Install Cartify on Your Phone</h3>
              <p>Experience ultra-fast loading, full-screen shopping, and order tracking right from your home screen.</p>
            </div>

            <div className="pwa-steps-list">
              <div className="pwa-step-item">
                <div className="pwa-step-num">1</div>
                <div className="pwa-step-detail">
                  <strong>Tap the Share Button</strong>
                  <p>In Safari or Chrome bottom bar, tap the <strong>Share</strong> icon (<span>⎙</span> or <span>📤</span> / <span>⋮</span>).</p>
                </div>
              </div>

              <div className="pwa-step-item">
                <div className="pwa-step-num">2</div>
                <div className="pwa-step-detail">
                  <strong>Select "Add to Home Screen"</strong>
                  <p>Scroll down the menu and tap <strong>Add to Home Screen</strong> (<span>➕</span>).</p>
                </div>
              </div>

              <div className="pwa-step-item">
                <div className="pwa-step-num">3</div>
                <div className="pwa-step-detail">
                  <strong>Confirm &amp; Enjoy</strong>
                  <p>Tap <strong>Add</strong> at top right. Cartify with the professional logo will appear on your phone!</p>
                </div>
              </div>
            </div>

            <div className="pwa-modal-footer">
              <button
                type="button"
                className="pwa-modal-gotit-btn"
                onClick={() => setShowIOSModal(false)}
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PWAInstallPrompt;
