import { useState, useEffect, useContext } from "react";
import { getProducts } from "../services/api";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import Categories from "./Categories";
import QuickViewModal from "./QuickViewModal";
import { CartContext } from "../context/CartContext";

function FeaturedProducts({ initialCategory = "All" }) {
  const { searchQuery, setSearchQuery } = useContext(CartContext);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categoryToUse = initialCategory || selectedCategory;

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProductsList(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products. Please check network connection.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = productsList.filter((product) => {
    const activeSearch = searchQuery.trim().toLowerCase();
    const matchSearch =
      !activeSearch ||
      product.name.toLowerCase().includes(activeSearch) ||
      product.category.toLowerCase().includes(activeSearch);

    const activeCat = categoryToUse;
    const matchCategory =
      activeCat === "All" ||
      product.category.toLowerCase() === activeCat.toLowerCase();

    return matchSearch && matchCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="featured-section" id="featured-products">
      <div className="section-header center">
        <h2>Explore Trending Products</h2>
        <p>Handpicked selection of top-selling items with best price guarantees</p>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="products-controls-wrap">
        <SearchBar search={searchQuery} setSearch={setSearchQuery} />

        <div className="filters-row">
          <Categories
            selectedCategory={categoryToUse}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="sort-dropdown-wrap">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Fetching amazing products...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {sortedProducts.length === 0 ? (
            <div className="no-results-box">
              <h3>No products found matching "{searchQuery}".</h3>
              <p>Try clearing filters or searching for something else.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Reset All Filters
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
        </>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}

export default FeaturedProducts;