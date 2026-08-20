import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { CategorySection } from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductSection from "../components/ProductSections";
import FlashSale from "../components/FlashSale";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Cartify — Premium E-Commerce Shopping";
  }, []);

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    const section = document.getElementById("featured-products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper">
      {/* 1. Header Navigation */}
      <Navbar />

      <main className="main-content">
        {/* 2. Hero Banner */}
        <Hero />

        {/* 3. Shop by Category */}
        <CategorySection onSelectCategory={handleSelectCategory} />

        {/* 4. Featured Products (Interactive Search, Sort & Category Filter Grid) */}
        <FeaturedProducts initialCategory={activeCategory} />

        {/* 5. Best Sellers Showcase */}
        <div className="container">
          <ProductSection
            title="Best Sellers"
            subtitle="Top-rated customer favorites backed by 1,000+ positive reviews"
            icon="🏆"
            filterFn={(p) => p.badge === "Bestseller" || p.rating >= 4.9}
          />
        </div>

        {/* 6. Flash Sale (Live Countdown Timer & Stock Bar) */}
        <FlashSale />

        {/* 7. Trending Now */}
        <div className="container">
          <ProductSection
            title="Trending Now"
            subtitle="High demand products capturing maximum attention this week"
            icon="📈"
            filterFn={(p) => p.badge === "Trending" || p.badge === "Popular" || p.reviewsCount > 150}
          />
        </div>

        {/* 8. New Arrivals */}
        <div className="container">
          <ProductSection
            title="New Arrivals"
            subtitle="Freshly launched 2026 items with express 24h dispatch"
            icon="✨"
            filterFn={(p) => p.badge === "New Arrival" || p.badge === "Luxury" || p.badge === "Pro Gear"}
          />
        </div>

        {/* 9. Customer Reviews */}
        <div className="container">
          <Testimonials />
        </div>
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}

export default Home;