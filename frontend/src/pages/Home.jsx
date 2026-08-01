import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    const section = document.getElementById("featured-products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Hero />
        <CategorySection onSelectCategory={handleSelectCategory} />
        <FeaturedProducts initialCategory={activeCategory} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;