import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // 4 Rotating Hero Products Slideshow
  const heroSlides = [
    {
      id: 1,
      name: "Air Max Pro Stealth",
      category: "Sneakers",
      deal: "🔥 Hot Deal • 20% OFF",
      price: "$149.00",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      productId: 1,
    },
    {
      id: 2,
      name: "Apex Series Smartwatch 5",
      category: "Smart Tech",
      deal: "⭐ AMOLED Touch Display",
      price: "$199.00",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      productId: 2,
    },
    {
      id: 3,
      name: "SonicPro ANC Headphones",
      category: "Audio",
      deal: "🎧 40h Battery • Deep Bass",
      price: "$129.00",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      productId: 3,
    },
    {
      id: 4,
      name: "Vanguard Retro High Sneakers",
      category: "Footwear",
      deal: "👟 New Arrival • Ortholite Insole",
      price: "$119.00",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      productId: 7,
    },
  ];

  // Auto-rotate slides every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 20;
    const rotateY = (x / rect.width) * 20;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const activeProduct = heroSlides[currentSlide];

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Interactive Content */}
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
            <Link to="/products" className="btn-primary hero-btn btn-3d-effect">
              Explore Catalog 🚀
            </Link>
            <Link to={`/product/${activeProduct.productId}`} className="btn-secondary hero-btn btn-3d-effect">
              View Featured Item 🛒
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

        {/* Right Column: Auto-rotating Product Showcase with 3D Tilt */}
        <div className="hero-visual">
          {/* Slide Navigation Arrows (Positioned stably on outer container so 3D tilt never shifts them!) */}
          <button className="hero-slide-nav prev-slide" onClick={handlePrevSlide} title="Previous Image">
            ❮
          </button>
          <button className="hero-slide-nav next-slide" onClick={handleNextSlide} title="Next Image">
            ❯
          </button>

          <div
            className="hero-image-wrapper hero-3d-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            }}
          >
            {/* Rotating Hero Image */}
            <Link to={`/product/${activeProduct.productId}`}>
              <img
                key={activeProduct.id}
                src={activeProduct.image}
                alt={activeProduct.name}
                className="hero-main-img img-3d hero-slide-fade"
              />
            </Link>

            {/* Dynamic Floating Information Badges */}
            <div className="floating-card floating-card-1 card-3d-layer-1">
              <span className="float-icon">🔥</span>
              <div>
                <strong>{activeProduct.deal}</strong>
                <span>{activeProduct.name} ({activeProduct.price})</span>
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

          {/* Carousel Dot Indicators */}
          <div className="hero-dots-indicator">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                className={`hero-dot ${idx === currentSlide ? "active-dot" : ""}`}
                onClick={() => setCurrentSlide(idx)}
                title={`Go to ${slide.name}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
