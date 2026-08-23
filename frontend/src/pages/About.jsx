import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials/Testimonials";

function About() {
  useEffect(() => {
    document.title = "About Cartify — Modern E-Commerce Engineered for Speed & Luxury";
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Active Happy Shoppers", value: "50,000+", icon: "👥" },
    { label: "Curated Global Brands", value: "50+ Brands", icon: "🏷️" },
    { label: "On-Time Dispatch Rate", value: "99.8%", icon: "⚡" },
    { label: "Verified 5-Star Reviews", value: "12,500+", icon: "⭐" },
  ];

  const pillars = [
    {
      icon: "🛡️",
      title: "100% Authentic Products",
      desc: "We partner directly with certified global manufacturers and authorized dealers to guarantee authentic luxury goods without counterfeits.",
    },
    {
      icon: "🚀",
      title: "Ultra-Fast 24H Dispatch",
      desc: "Our automated fulfillment network packages and hands off your orders to express carriers within 24 hours of checkout.",
    },
    {
      icon: "💎",
      title: "Handpicked Premium Catalog",
      desc: "Every single sneaker, watch, tech gadget, and bag undergoes rigorous quality curation before listing on our marketplace.",
    },
    {
      icon: "🔒",
      title: "Bank-Grade SSL Security",
      desc: "End-to-end 256-bit encrypted checkout with zero-liability fraud protection and instant automated tax invoicing.",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Genesis",
      desc: "Cartify was founded with a singular vision: eliminate clunky e-commerce interfaces and deliver blisteringly fast, verified shopping.",
    },
    {
      year: "2025",
      title: "Global Brand Expansion",
      desc: "Expanded brand partnerships to over 50 top-tier brands including Nike, Apple, Rolex, Ray-Ban, and Samsonite across 35 countries.",
    },
    {
      year: "2026",
      title: "Cartify 2.0 Revolution",
      desc: "Launched our responsive mobile 2-pair grid layout, multi-address book, and sub-millisecond search engine.",
    },
  ];

  const team = [
    {
      name: "Sunny Kumar",
      role: "Founder & Lead Engineer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Passionate about full-stack engineering, performance optimization, and crafting fluid consumer web applications.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Product & Experience",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bio: "Spearheading user-centric UX architectures and seamless mobile checkout flows.",
    },
    {
      name: "Marcus Vance",
      role: "VP of Global Supply Chain",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Managing international fulfillment centers ensuring same-day dispatch and climate-neutral packaging.",
    },
    {
      name: "Elena Rostova",
      role: "Chief Brand Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Curating luxury fashion lines and forging direct tier-1 relationships with global luxury houses.",
    },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content about-page-enhanced">
        {/* 1. Hero Showcase Section */}
        <section className="about-hero-section">
          <div className="container">
            <div className="about-hero-badge">
              <span>⚡ REDEFINING MODERN E-COMMERCE</span>
            </div>
            <h1 className="about-hero-title">
              Crafted for Quality. <br />
              <span className="gradient-text">Engineered for Speed.</span>
            </h1>
            <p className="about-hero-subtitle">
              Cartify brings together verified luxury footwear, premium electronics, Swiss & Japanese timepieces, and high-performance accessories under one unified shopping experience.
            </p>
            <div className="about-hero-actions">
              <Link to="/#featured-products" className="btn-primary about-cta-btn">
                Explore Full Catalog 🛍️
              </Link>
              <Link to="/contact" className="btn-secondary about-cta-btn">
                Contact Support 💬
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Key Stats Counter Bar */}
        <section className="about-stats-section">
          <div className="container">
            <div className="about-stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="about-stat-card">
                  <span className="about-stat-icon">{stat.icon}</span>
                  <div className="about-stat-content">
                    <h3 className="about-stat-value">{stat.value}</h3>
                    <p className="about-stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Core Pillars / Why Choose Cartify */}
        <section className="about-pillars-section">
          <div className="container">
            <div className="section-header center">
              <span className="section-eyebrow">OUR CORE PRINCIPLES</span>
              <h2>Why Hundreds of Thousands Choose Cartify</h2>
              <p>We built Cartify around the friction points that ruin typical online shopping.</p>
            </div>

            <div className="about-pillars-grid">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="about-pillar-card">
                  <div className="pillar-icon-box">{pillar.icon}</div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Brand Story & Visual Split Section */}
        <section className="about-story-section">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-content">
                <span className="section-eyebrow">THE CARTIFY STORY</span>
                <h2>From a Vision to a Global Shopping Destination</h2>
                <p className="story-lead">
                  We believe that buying premium goods online shouldn't come with doubts about authenticity, slow delivery, or complicated returns.
                </p>
                <p>
                  Every product listed on Cartify goes through our strict 5-point verification checklist. Our automated distribution centers ensure your order is packed with care, sealed in tamper-proof sustainable packaging, and expedited directly to your doorstep.
                </p>

                <div className="story-checklist">
                  <div className="checklist-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Zero Counterfeits Policy:</strong> Verified supplier agreements with full traceability.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>30-Day Hassle-Free Returns:</strong> Instant prepaid return labels with no questions asked.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Eco-Conscious Packaging:</strong> 100% biodegradable and recyclable materials.
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-story-visual">
                <div className="story-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
                    alt="Cartify Technology & Logistics Hub"
                    loading="lazy"
                  />
                  <div className="story-badge-floating">
                    <span className="badge-num">100%</span>
                    <span className="badge-text">Authenticity Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Company Timeline / Milestones */}
        <section className="about-timeline-section">
          <div className="container">
            <div className="section-header center">
              <span className="section-eyebrow">OUR JOURNEY</span>
              <h2>Milestones of Continuous Innovation</h2>
              <p>How we grew into a trusted name in high-performance digital commerce.</p>
            </div>

            <div className="about-timeline-container">
              {milestones.map((m, idx) => (
                <div key={idx} className="timeline-node">
                  <div className="timeline-year-badge">{m.year}</div>
                  <div className="timeline-card">
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Meet The Leadership Team */}
        <section className="about-team-section">
          <div className="container">
            <div className="section-header center">
              <span className="section-eyebrow">LEADERSHIP</span>
              <h2>The Minds Behind Cartify</h2>
              <p>Dedicated engineers, designers, and logistics experts building the future of retail.</p>
            </div>

            <div className="about-team-grid">
              {team.map((member, idx) => (
                <div key={idx} className="team-member-card">
                  <div className="member-avatar-wrap">
                    <img src={member.image} alt={member.name} loading="lazy" />
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <span className="member-role">{member.role}</span>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Verified Customer Reviews Component */}
        <Testimonials />

        {/* 8. VIP Club Call To Action */}
        <section className="about-vip-cta-section">
          <div className="container">
            <div className="vip-cta-banner">
              <div className="vip-cta-content">
                <span className="vip-eyebrow">JOIN 50,000+ VIP SHOPPERS</span>
                <h2>Unlock 10% Off Your First Order Today</h2>
                <p>Use code <strong>SAVE10</strong> at checkout for instant savings across all categories.</p>
                <div className="vip-actions">
                  <Link to="/#featured-products" className="btn-primary vip-btn">
                    Shop Trending Products Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;
