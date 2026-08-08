import { useState, useContext, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import QuickViewModal from "../components/Common/QuickViewModal";
import ProductSkeleton from "../components/Skeleton/ProductSkeleton";
import useProducts from "../hooks/useProducts";
import { CartContext } from "../context/CartContext";

function Products() {
  const { products, loading, error } = useProducts();
  const { searchQuery, setSearchQuery } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get("search");
  const activeSearchTerm = urlSearch !== null ? urlSearch : searchQuery;
  const initialCategory = searchParams.get("category") || "All";

  // 8D Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedSize, setSelectedSize] = useState("All Sizes");
  const [selectedColor, setSelectedColor] = useState("All Colors");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Apply 8D Filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term
      const activeSearch = activeSearchTerm ? activeSearchTerm.trim().toLowerCase() : "";
      const matchSearch =
        !activeSearch ||
        p.name.toLowerCase().includes(activeSearch) ||
        p.category.toLowerCase().includes(activeSearch) ||
        (p.description && p.description.toLowerCase().includes(activeSearch));

      // 1. Category
      const matchCategory =
        selectedCategory === "All" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Price Range
      const matchPrice = p.price <= maxPrice;

      // 3. Rating
      const matchRating = (p.rating || 4.5) >= minRating;

      // 4. Brand
      const matchBrand =
        selectedBrand === "All Brands" ||
        (p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase());

      // 5. Size
      const matchSize =
        selectedSize === "All Sizes" ||
        (p.sizes && p.sizes.includes(selectedSize));

      // 6. Color
      const matchColor =
        selectedColor === "All Colors" ||
        (p.colors && p.colors.includes(selectedColor));

      // 7. Availability
      const matchStock = !inStockOnly || p.inStock === true;

      return (
        matchSearch &&
        matchCategory &&
        matchPrice &&
        matchRating &&
        matchBrand &&
        matchSize &&
        matchColor &&
        matchStock
      );
    });
  }, [
    products,
    activeSearchTerm,
    selectedCategory,
    maxPrice,
    minRating,
    selectedBrand,
    selectedSize,
    selectedColor,
    inStockOnly,
  ]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filteredProducts, sortBy]);

  // 8. Clear / Reset All Filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice(1200);
    setMinRating(0);
    setSelectedBrand("All Brands");
    setSelectedSize("All Sizes");
    setSelectedColor("All Colors");
    setInStockOnly(false);
    setSortBy("featured");
    setSearchQuery("");
    navigate("/products");
  };

  const handleCategoryShortcut = (cat) => {
    handleResetFilters();
    setSelectedCategory(cat);
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content products-page-layout container">
        <div className="page-header-banner">
          <h1>Shop Full Catalog</h1>
          <p>Discover tech gadgets, luxury apparel, footwear and accessories</p>
        </div>

        <SearchBar search={searchQuery} setSearch={setSearchQuery} />

        <div className="products-main-grid">
          {/* 8D Filter Sidebar */}
          <Filter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />

          <section className="products-results-section">
            <div className="results-header-bar">
              <span className="results-count">
                Showing <strong>{sortedProducts.length}</strong> products
                {activeSearchTerm && <span> for "<strong>{activeSearchTerm}</strong>"</span>}
              </span>
            </div>

            {loading ? (
              <div className="products-grid">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <ProductSkeleton key={n} />
                ))}
              </div>
            ) : error ? (
              <div className="error-box">
                <p>{error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="no-results-box no-results-enhanced">
                <div className="no-results-icon">🎛️</div>
                <h3>No products match your active filter criteria</h3>
                <p>Try resetting some of your 8 filter options (brand, size, color, or price range).</p>

                <div className="popular-category-suggestions">
                  <span>Explore Categories:</span>
                  <div className="shortcut-pills">
                    {["Shoes", "Electronics", "Watches", "Bags", "Camera"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className="shortcut-pill"
                        onClick={() => handleCategoryShortcut(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn-primary" onClick={handleResetFilters}>
                  Clear All 8 Filters 🔄
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      <Footer />
    </div>
  );
}

export default Products;
