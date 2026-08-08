import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Modals for FAQ, Privacy Policy, Terms
  const [activeModal, setActiveModal] = useState(null); // 'faq', 'privacy', 'terms'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand & Newsletter & 6. Social Icons Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Cart<span>ify</span></span>
          </div>
          <p className="footer-desc">
            Your destination for premium shoes, luxury watches, high-tech electronics, and fashion accessories.
          </p>

          {/* 6. Interactive Social Icons */}
          <div className="footer-social-icons">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter / X" className="social-circle-btn">
              𝕏
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="social-circle-btn">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" className="social-circle-btn">
              📘
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="social-circle-btn">
              💼
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="social-circle-btn">
              ▶️
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub" className="social-circle-btn">
              🐙
            </a>
          </div>

          <div className="newsletter-box margin-top-md">
            <h4>Join our VIP Newsletter</h4>
            {subscribed ? (
              <p className="subscribed-msg">🎉 Thank you for subscribing! Check your inbox for 15% off.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/products">Shop Catalog</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
            <li><Link to="/orders">Order History & Tracking</Link></li>
            <li><Link to="/profile">Account Profile</Link></li>
          </ul>
        </div>

        {/* Product Categories Column */}
        <div className="footer-col">
          <h3>Product Categories</h3>
          <ul>
            <li><Link to="/category/shoes">Running Shoes</Link></li>
            <li><Link to="/category/electronics">Smart Electronics</Link></li>
            <li><Link to="/category/watches">Luxury Watches</Link></li>
            <li><Link to="/category/bags">Tech Backpacks</Link></li>
            <li><Link to="/category/camera">4K Cameras</Link></li>
          </ul>
        </div>

        {/* 1. About & 2. Contact & Company Info Column */}
        <div className="footer-col">
          <h3>Company & Help</h3>
          <ul>
            {/* 1. About */}
            <li><Link to="/about">About Cartify</Link></li>
            {/* 2. Contact */}
            <li><Link to="/contact">Contact Support (24/7)</Link></li>
            {/* 3. FAQ */}
            <li><button className="footer-modal-trigger" onClick={() => setActiveModal("faq")}>Frequently Asked Questions (FAQ)</button></li>
            {/* 4. Privacy Policy */}
            <li><button className="footer-modal-trigger" onClick={() => setActiveModal("privacy")}>Privacy Policy</button></li>
            {/* 5. Terms of Service */}
            <li><button className="footer-modal-trigger" onClick={() => setActiveModal("terms")}>Terms of Service</button></li>
          </ul>
          
          <div className="payment-badges margin-top-md">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MasterCard</span>
            <span className="pay-badge">Apple Pay</span>
            <span className="pay-badge">UPI</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Cartify E-Commerce Inc. All Rights Reserved.</p>
        <div className="footer-legal-links">
          <button className="footer-legal-btn" onClick={() => setActiveModal("privacy")}>Privacy Policy</button>
          <button className="footer-legal-btn" onClick={() => setActiveModal("terms")}>Terms & Conditions</button>
          <button className="footer-legal-btn" onClick={() => setActiveModal("faq")}>Help FAQ</button>
        </div>
      </div>

      {/* 3. FAQ Modal */}
      {activeModal === "faq" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <div className="forgot-modal-container">
              <h3>Frequently Asked Questions (FAQ) ❓</h3>
              <div className="faq-list-box text-left margin-top-md">
                <div className="faq-item">
                  <strong>Q: How fast is delivery?</strong>
                  <p>A: Standard shipping takes 3-5 business days. We also offer 24-Hour Express and Same-Day delivery options at checkout.</p>
                </div>
                <div className="faq-item margin-top-sm">
                  <strong>Q: What is your return policy?</strong>
                  <p>A: We offer a 30-day hassle-free full refund policy on all eligible purchases with free return pickup.</p>
                </div>
                <div className="faq-item margin-top-sm">
                  <strong>Q: How do I track my order?</strong>
                  <p>A: You can track real-time order status on the My Orders page using your order ID.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <div className="forgot-modal-container">
              <h3>Privacy Policy 🔒</h3>
              <div className="faq-list-box text-left margin-top-md">
                <p>At Cartify, your privacy is our top priority.</p>
                <p>1. We encrypt all transactions with industry-standard 256-Bit SSL security.</p>
                <p>2. Your personal details and address are never sold or shared with third parties.</p>
                <p>3. You can request deletion of your account data anytime via Support.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Terms of Service Modal */}
      {activeModal === "terms" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <div className="forgot-modal-container">
              <h3>Terms & Conditions 📜</h3>
              <div className="faq-list-box text-left margin-top-md">
                <p>Welcome to Cartify. By browsing or purchasing from our platform, you agree to:</p>
                <p>1. Provide accurate shipping & billing information.</p>
                <p>2. Adhere to our fair usage and promotional coupon policies.</p>
                <p>3. Enjoy our 2-Year Official Manufacturer Warranty on all items.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
