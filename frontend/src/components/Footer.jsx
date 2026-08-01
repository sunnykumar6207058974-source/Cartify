import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
        {/* Brand & Newsletter Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Cart<span>ify</span></span>
          </div>
          <p className="footer-desc">
            Your destination for premium shoes, luxury watches, high-tech electronics, and fashion accessories.
          </p>

          <div className="newsletter-box">
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
            <li><Link to="/">Home</Link></li>
            <li><a href="#featured-products">Featured Products</a></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/login">My Account</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            <li><a href="#featured-products">Running Shoes</a></li>
            <li><a href="#featured-products">Smart Electronics</a></li>
            <li><a href="#featured-products">Luxury Watches</a></li>
            <li><a href="#featured-products">Tech Backpacks</a></li>
            <li><a href="#featured-products">4K Cameras</a></li>
          </ul>
        </div>

        {/* Contact & Support Column */}
        <div className="footer-col">
          <h3>Customer Service</h3>
          <ul className="contact-list">
            <li>📧 support@cartify.com</li>
            <li>📞 +91 8340112045</li>
            <li>📍 Tech Hub Tower, Suite 400</li>
            <li>💳 Secure Payments via SSL</li>
          </ul>

          <div className="payment-badges">
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
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Shipping Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;