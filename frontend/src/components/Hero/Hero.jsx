import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Curated 6 High-Performance Hero Product Slides across categories
  const heroSlides = [
    {
      id: 1,
      name: "Air Max Pro Stealth",
      category: "Shoes",
      brand: "Nike",
      deal: "🔥 Trending • 20% OFF",
      price: "$149.00",
      originalPrice: "$189.00",
      rating: 4.9,
      reviews: 128,
      tag: "Top Selling Sneaker",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      productId: 1,
      color: "from-rose-500/20 to-orange-500/20",
    },
    {
      id: 2,
      name: "Apple Watch Ultra 2 Titanium",
      category: "Watches",
      brand: "Apple",
      deal: "⭐ Titanium Aerospace Case",
      price: "$799.00",
      originalPrice: "$899.00",
      rating: 4.9,
      reviews: 480,
      tag: "Flagship Timepiece",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      productId: 24,
      color: "from-blue-500/20 to-indigo-500/20",
    },
    {
      id: 3,
      name: "SonicPro ANC Wireless Studio",
      category: "Electronics",
      brand: "Sony",
      deal: "🎧 40h Battery • Deep Bass",
      price: "$129.00",
      originalPrice: "$179.00",
      rating: 4.7,
      reviews: 210,
      tag: "Pro Audio Gear",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      productId: 3,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: 4,
      name: "Ray-Ban Aviator Classic Polarized",
      category: "Accessories",
      brand: "Ray-Ban",
      deal: "🕶️ UV400 Polarized Green G-15",
      price: "$165.00",
      originalPrice: "$210.00",
      rating: 4.9,
      reviews: 420,
      tag: "Iconic Eyewear",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      productId: 34,
      color: "from-amber-500/20 to-yellow-500/20",
    },
    {
      id: 5,
      name: "Lumix Pro 4K Mirrorless Camera",
      category: "Camera",
      brand: "Panasonic",
      deal: "📸 24.2MP • Dual IS 60fps",
      price: "$699.00",
      originalPrice: "$849.00",
      rating: 4.9,
      reviews: 154,
      tag: "Cinema 4K Sensor",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      productId: 6,
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      id: 6,
      name: "Nomad Travel Weekender Duffel",
      category: "Bags",
      brand: "Samsonite",
      deal: "🎒 Expandable 45L TSA Approved",
      price: "$129.00",
      originalPrice: "$160.00",
      rating: 4.8,
      reviews: 175,
      tag: "Premium Luggage",
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80",
      productId: 19,
      color: "from-cyan-500/20 to-blue-500/20",
    },
  ];

  // Auto-rotate slides every 4 seconds unless paused on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [heroSlides.length, isPaused]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
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

  const copyPromoCode = () => {
    navigator.clipboard.writeText("SAVE10");
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  return (
    <section className="hero-section hero-section-enhanced">
      {/* Background Ambient Glows */}
      <div className="hero-glow-blob glow-blob-1"></div>
      <div className="hero-glow-blob glow-blob-2"></div>

      <div className="hero-container">
        {/* Left Column: Headline, Category Tabs, Pricing, and CTAs */}
        <div className="hero-content">
          {/* Interactive Promo Announcement Pill */}
          <div className="hero-promo-pill" onClick={copyPromoCode} title="Click to copy coupon code">
            <span className="promo-sparkle">✨</span>
            <span className="promo-text">
              Special Offer: Use code <strong>SAVE10</strong> for 10% OFF
            </span>
            <span className="promo-copy-btn">
              {copiedPromo ? "Copied! ✓" : "Copy 📋"}
            </span>
          </div>

          <h1 className="hero-title-3d">
            <span className="blink-word-3d">The</span>{" "}
            <span className="blink-word-3d">Future</span>{" "}
            <span className="blink-word-3d">of</span> <br />
            <span className="gradient-text blink-word-3d">Luxury Shopping</span>{" "}
            <span className="blink-word-3d">is Here.</span>
          </h1>

          <p className="hero-description-3d">
            Handpicked authentic sneakers, luxury timepieces, pro electronics, and designer gear — backed by 24h express dispatch and guaranteed authenticity.
          </p>

          {/* Quick Slide Category Switchers */}
          <div className="hero-category-quicktabs">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-tab-pill ${idx === currentSlide ? "active-hero-tab" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              >
                {slide.category}
              </button>
            ))}
          </div>

          {/* Active Product Mini Bar */}
          <div className="hero-active-preview-card">
            <div className="preview-brand-tag">{activeProduct.brand} • {activeProduct.tag}</div>
            <div className="preview-row">
              <div className="preview-title-wrap">
                <Link to={`/product/${activeProduct.productId}`} className="preview-name-link">
                  {activeProduct.name}
                </Link>
                <div className="preview-rating">
                  <span className="stars">★</span>
                  <strong>{activeProduct.rating}</strong>
                  <span>({activeProduct.reviews} reviews)</span>
                </div>
              </div>
              <div className="preview-price-wrap">
                <span className="preview-current-price">{activeProduct.price}</span>
                <span className="preview-old-price">{activeProduct.originalPrice}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-buttons">
            <Link to="/#featured-products" className="btn-primary hero-btn btn-3d-effect">
              Shop Trending Items 🚀
            </Link>
            <Link to={`/product/${activeProduct.productId}`} className="btn-secondary hero-btn btn-3d-effect">
              Buy {activeProduct.name.split(" ")[0]} →
            </Link>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="hero-stats">
            <div className="stat-item stat-card-3d">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Happy Shoppers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item stat-card-3d">
              <span className="stat-number">100%</span>
              <span className="stat-label">Verified Authentic</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item stat-card-3d">
              <span className="stat-number">24h</span>
              <span className="stat-label">Express Dispatch</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Tilt Card Showcase with Floating Deal Chips */}
        <div
          className="hero-visual"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <button
            className="hero-slide-nav prev-slide"
            onClick={handlePrevSlide}
            aria-label="Previous Product"
          >
            ❮
          </button>
          <button
            className="hero-slide-nav next-slide"
            onClick={handleNextSlide}
            aria-label="Next Product"
          >
            ❯
          </button>

          {/* 3D Tilt Card Container */}
          <div
            className="hero-image-wrapper hero-3d-wrapper"
            onMouseMove={handleMouseMove}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            }}
          >
            <Link to={`/product/${activeProduct.productId}`} className="hero-img-link">
              <img
                key={activeProduct.id}
                src={activeProduct.image}
                alt={activeProduct.name}
                className="hero-main-img img-3d hero-slide-fade"
              />
              <div className="hero-img-overlay-gradient"></div>
            </Link>

            {/* Top Floating Badge: Deal Info */}
            <div className="floating-card floating-card-1 card-3d-layer-1">
              <span className="float-icon">🔥</span>
              <div>
                <strong>{activeProduct.deal}</strong>
                <span>{activeProduct.name} ({activeProduct.price})</span>
              </div>
            </div>

            {/* Bottom Floating Badge: Live Stock / Express Service */}
            <div className="floating-card floating-card-2 card-3d-layer-2">
              <span className="float-icon">⚡</span>
              <div>
                <strong>Guaranteed Express Delivery</strong>
                <span>Free 24h shipping on orders over $50</span>
              </div>
            </div>
          </div>

          {/* Slide Indicators & Auto Progress */}
          <div className="hero-dots-indicator">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                className={`hero-dot ${idx === currentSlide ? "active-dot" : ""}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}: ${slide.name}`}
              >
                <span className="dot-thumb-label">{slide.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
