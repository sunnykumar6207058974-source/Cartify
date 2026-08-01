import { useState } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 25;
    const rotateY = (x / rect.width) * 25;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleExploreCollection = (e) => {
    e.preventDefault();
    const section = document.getElementById("featured-products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Interactive 3D Text Content */}
        <div className="hero-content">
          <div className="hero-tag">
            <span className="sparkle">✨</span> Summer Sale 2026 — Up to 50% Off
          </div>

          <h1 className="hero-title-3d">
            <span className="blink-word-3d">Discover</span>{" "}
            <span className="blink-word-3d">the</span>{" "}
            <span className="blink-word-3d">Future</span>{" "}
            <span className="blink-word-3d">of</span>{" "}
            <span className="gradient-text blink-word-3d">Premium</span>{" "}
            <span className="gradient-text blink-word-3d">Shopping</span>
          </h1>

          <p className="hero-description-3d">
            Explore top-tier sneakers, smart devices, audio tech & luxury accessories. Delivered directly to your door with 24-hour dispatch.
          </p>

          <div className="hero-buttons">
            <a
              href="#featured-products"
              onClick={handleExploreCollection}
              className="btn-primary hero-btn btn-3d-effect"
            >
              Explore Collection 🚀
            </a>
            <Link to="/cart" className="btn-secondary hero-btn btn-3d-effect">
              View Cart 🛒
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item stat-card-3d">
              <span className="stat-number">15k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item stat-card-3d">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating Standard</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item stat-card-3d">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Express Support</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic 3D Interactive Visual */}
        <div className="hero-visual">
          <div
            className="hero-image-wrapper hero-3d-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
              alt="Featured Sneaker"
              className="hero-main-img img-3d"
            />

            <div className="floating-card floating-card-1 card-3d-layer-1">
              <span className="float-icon">🔥</span>
              <div>
                <strong>Hot Deal</strong>
                <span>Air Max Pro Stealth</span>
              </div>
            </div>

            <div className="floating-card floating-card-2 card-3d-layer-2">
              <span className="float-icon">⚡</span>
              <div>
                <strong>Express Delivery</strong>
                <span>Free shipping over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;