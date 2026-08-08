import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials/Testimonials";

function About() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content about-page container">
        <div className="page-header-banner">
          <h1>About Cartify ⚡</h1>
          <p>Redefining modern e-commerce with speed, authenticity, and seamless 3D experiences.</p>
        </div>

        <section className="about-hero-grid">
          <div className="about-text">
            <h2>Our Story & Mission</h2>
            <p>
              Founded in 2026, Cartify was built to offer customers a curated luxury shopping experience. We handpick top-performing products across electronics, luxury sneakers, smartwatches, and premium gear.
            </p>
            <p>
              Our promise is simple: 100% verified authenticity, 24-hour express dispatch, and zero-friction customer support.
            </p>

            <div className="about-features-list">
              <div className="feature-item">
                <span>🚀</span>
                <div>
                  <h4>24-Hour Express Dispatch</h4>
                  <p>Orders are packed & shipped within 24 hours of placement.</p>
                </div>
              </div>
              <div className="feature-item">
                <span>🛡️</span>
                <div>
                  <h4>Guaranteed Authenticity</h4>
                  <p>Direct sourcing from authorized global manufacturers.</p>
                </div>
              </div>
              <div className="feature-item">
                <span>💳</span>
                <div>
                  <h4>256-Bit SSL Encrypted Checkout</h4>
                  <p>Ultra-secure transactions with multiple global payment options.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image-card">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
              alt="Cartify Tech Hub"
            />
          </div>
        </section>

        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default About;
