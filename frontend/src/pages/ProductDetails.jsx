import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import productsData from "../data/products";
import { getProducts } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(productsData);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetched = await getProducts();
      setAllProducts(fetched);

      const found = fetched.find((p) => String(p.id) === String(id));
      if (found) {
        setProduct(found);
      } else {
        const fallback = productsData.find((p) => String(p.id) === String(id));
        setProduct(fallback || null);
      }
      setLoading(false);
    }
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="no-results-box margin-y-large">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Back to Shop 🛍️
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content product-details-page">
        <div className="details-container">
          {/* Breadcrumb navigation */}
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>{product.category}</span> /{" "}
            <strong>{product.name}</strong>
          </div>

          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="details-grid">
            {/* Product Image Box */}
            <div className="details-image-box">
              {product.discount && (
                <span className="details-badge">{product.discount}</span>
              )}
              <img src={product.image} alt={product.name} />
            </div>

            {/* Product Meta Box */}
            <div className="details-info-box">
              <span className="details-category-pill">{product.category}</span>
              <h1 className="details-title">{product.name}</h1>

              <div className="details-rating-row">
                <span className="stars">{"★".repeat(Math.round(product.rating || 5))}</span>
                <span className="rating-score">{product.rating}</span>
                <span className="reviews-text">({product.reviewsCount || 84} verified reviews)</span>
              </div>

              <div className="details-price-row">
                <span className="price-current">${product.price}</span>
                {product.originalPrice && (
                  <span className="price-old">${product.originalPrice}</span>
                )}
                <span className="stock-tag">In Stock & Ready to Ship</span>
              </div>

              <p className="details-summary">
                {product.description ||
                  "Designed with state-of-the-art materials and engineered for superior durability, everyday comfort, and maximum performance."}
              </p>

              {/* Quantity & Actions */}
              <div className="details-actions-wrapper">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="qty-controls">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                  </div>
                </div>

                <div className="button-group-row">
                  <button
                    className="btn-primary add-to-cart-large"
                    onClick={() => addToCart(product, quantity)}
                  >
                    Add {quantity} to Cart 🛒
                  </button>

                  <button
                    className={`btn-wishlist-large ${isWishlisted ? "active" : ""}`}
                    onClick={() => toggleWishlist(product)}
                    title="Add to Wishlist"
                  >
                    {isWishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
                  </button>
                </div>
              </div>

              {/* Perks List */}
              <div className="details-perks">
                <div className="perk-item">
                  <span className="perk-icon">🚚</span>
                  <div>
                    <strong>Free Shipping</strong>
                    <span>On orders over $50</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🔄</span>
                  <div>
                    <strong>30 Days Return</strong>
                    <span>Hassle-free money back</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🛡️</span>
                  <div>
                    <strong>2 Year Warranty</strong>
                    <span>Official Manufacturer Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs Section */}
          <div className="details-tabs-container">
            <div className="tabs-header">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={activeTab === "specs" ? "active" : ""}
                onClick={() => setActiveTab("specs")}
              >
                Specifications
              </button>
              <button
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviewsCount || 84})
              </button>
            </div>

            <div className="tab-body">
              {activeTab === "description" && (
                <div className="tab-content-box">
                  <h3>Product Overview</h3>
                  <p>
                    Experience unmatched quality with the {product.name}. Crafted precisely for perfection, this product seamlessly combines elegant design with industry-leading features.
                  </p>
                  <ul>
                    <li>Premium build quality tested to rigorous international standards.</li>
                    <li>Ergonomic design ensuring maximum usability and daily efficiency.</li>
                    <li>Sleek aesthetic profile matching modern lifestyle trends.</li>
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="tab-content-box">
                  <h3>Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td>Brand</td>
                        <td>Cartify Certified</td>
                      </tr>
                      <tr>
                        <td>Category</td>
                        <td>{product.category}</td>
                      </tr>
                      <tr>
                        <td>Warranty</td>
                        <td>2 Years International</td>
                      </tr>
                      <tr>
                        <td>Model Year</td>
                        <td>2026 Edition</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="tab-content-box">
                  <h3>Customer Reviews & Ratings</h3>
                  <div className="review-card">
                    <div className="review-header">
                      <strong>Alex M.</strong>
                      <span className="stars">★★★★★</span>
                    </div>
                    <p>Absolutely thrilled with this purchase! High quality, super fast shipping, and exceptional packaging.</p>
                  </div>
                  <div className="review-card">
                    <div className="review-header">
                      <strong>Sophia R.</strong>
                      <span className="stars">★★★★★</span>
                    </div>
                    <p>Worth every penny! Exactly as described. I will definitely be ordering from Cartify again.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <h2>You Might Also Like</h2>
              <div className="products-grid">
                {relatedProducts.map((relProd) => (
                  <ProductCard key={relProd.id} product={relProd} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetails;