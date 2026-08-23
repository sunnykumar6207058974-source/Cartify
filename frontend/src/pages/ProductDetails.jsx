import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductReviews from "../components/ProductDetails/ProductReviews";
import RecentlyViewed from "../components/Common/RecentlyViewed";
import { CartContext } from "../context/CartContext";
import productsData from "../data/products";
import { getProducts } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    addToast,
  } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(productsData);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Image Zoom Lens coordinates state
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, isHovering: false });

  // Bundle offer state
  const [bundleAdded, setBundleAdded] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetched = await getProducts();
      setAllProducts(fetched);

      const found = fetched.find((p) => String(p.id) === String(id));
      const target = found || productsData.find((p) => String(p.id) === String(id));
      if (target) {
        setProduct(target);
        setSelectedImage(target.image);
        addRecentlyViewed(target);
        // Default color & size based on category
        setSelectedColor(
          target.category === "Shoes"
            ? "Stealth Black"
            : target.category === "Watches"
            ? "Midnight Silver"
            : "Matte Black"
        );
        setSelectedSize(
          target.category === "Shoes"
            ? "US 10"
            : target.category === "Apparel"
            ? "L"
            : "Standard 44mm"
        );
      } else {
        setProduct(null);
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
          <button className="btn-primary" onClick={() => navigate("/products")}>
            Browse Full Catalog 🛍️
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // 1. Multiple Gallery Images Array
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  ];

  // Options arrays
  const colorsList = ["Matte Black", "Midnight Blue", "Cyber Silver", "Neon Orange"];
  const sizesList =
    product.category === "Shoes"
      ? ["US 8", "US 9", "US 10", "US 11"]
      : product.category === "Watches" || product.category === "Electronics"
      ? ["38mm", "42mm", "44mm", "48mm"]
      : ["S", "M", "L", "XL"];

  // Handle Zoom Lens Hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, isHovering: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, isHovering: false }));
  };

  const isWishlisted = isInWishlist(product.id);

  // Add to Cart with Options
  const handleAddToCart = () => {
    addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
  };

  // Buy Now Button Handler
  const handleBuyNow = () => {
    addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
    navigate("/checkout");
  };

  // Bundle item (matching accessory from another category)
  const bundleCompanion = allProducts.find((p) => p.id !== product.id && p.category !== product.category) || allProducts[0];
  const bundleCombinedPrice = Math.round((product.price + (bundleCompanion?.price || 49)) * 0.85);
  const bundleSavings = (product.price + (bundleCompanion?.price || 49)) - bundleCombinedPrice;

  const handleAddBundleToCart = () => {
    addToCart(product, 1);
    if (bundleCompanion) addToCart(bundleCompanion, 1);
    setBundleAdded(true);
    addToast("Bundle added to cart with 15% discount! 🎉");
    setTimeout(() => setBundleAdded(false), 2000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content product-details-page">
        <div className="details-container container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <Link to="/products">Catalog</Link> &gt;{" "}
            <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link> &gt;{" "}
            <strong>{product.name}</strong>
          </div>

          <div className="details-top-nav-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back to Browsing
            </button>
          </div>

          <div className="details-grid">
            {/* Left: Multiple Images Gallery + Hover Zoom Lens */}
            <div className="details-gallery-col">
              {/* Main Image with Zoom Lens */}
              <div
                className="details-main-img-box"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {product.discount && (
                  <span className="details-badge">{product.discount}</span>
                )}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="main-product-img"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: zoomPos.isHovering ? "scale(1.8)" : "scale(1)",
                  }}
                />
                {zoomPos.isHovering && (
                  <span className="zoom-hint-tag">🔍 1.8x Zoom Active</span>
                )}
              </div>

              {/* Multiple Thumbnail Images */}
              <div className="gallery-thumbnails-row">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`thumb-box ${selectedImage === imgUrl ? "active-thumb" : ""}`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Meta Information & Options */}
            <div className="details-info-box">
              <span className="details-category-pill">{product.category}</span>
              <h1 className="details-title">{product.name}</h1>

              {/* Rating Row */}
              <div className="details-rating-row">
                <span className="stars">{"★".repeat(Math.round(product.rating || 5))}</span>
                <span className="rating-score">{product.rating || 4.9}</span>
                <span className="reviews-text">({product.reviewsCount || 48} verified reviews)</span>
              </div>

              {/* Price & Stock */}
              <div className="details-price-row">
                <span className="price-current">${product.price}</span>
                {product.originalPrice && (
                  <span className="price-old">${product.originalPrice}</span>
                )}
                <span className="stock-tag">In Stock &amp; Ready to Ship ⚡</span>
              </div>

              <p className="details-summary">
                {product.description ||
                  "Engineered with premium materials for maximum durability, everyday style, and peak performance."}
              </p>

              {/* Color Selection Swatches */}
              <div className="option-selection-group">
                <label className="option-label">
                  Color Variant: <strong>{selectedColor}</strong>
                </label>
                <div className="color-swatches-row">
                  {colorsList.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-pill ${selectedColor === c ? "active-color" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      <span
                        className="color-dot"
                        style={{
                          background: c.includes("Black")
                            ? "#1e293b"
                            : c.includes("Blue")
                            ? "#2563eb"
                            : c.includes("Silver")
                            ? "#94a3b8"
                            : "#f97316",
                        }}
                      ></span>
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection Pills */}
              <div className="option-selection-group">
                <label className="option-label">
                  Size Options: <strong>{selectedSize}</strong>
                </label>
                <div className="size-pills-row">
                  {sizesList.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-pill ${selectedSize === s ? "active-size" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Actions */}
              <div className="details-actions-wrapper">
                <div className="quantity-selector">
                  <label className="option-label">Quantity:</label>
                  <div className="qty-controls">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                  </div>
                </div>

                <div className="button-group-row">
                  <button
                    className="btn-primary add-to-cart-large"
                    onClick={handleAddToCart}
                  >
                    Add {quantity} to Cart 🛒
                  </button>

                  <button
                    className="btn-accent buy-now-btn"
                    onClick={handleBuyNow}
                  >
                    Buy Now ⚡
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

              {/* Delivery Perks */}
              <div className="details-perks">
                <div className="perk-item">
                  <span className="perk-icon">🚚</span>
                  <div>
                    <strong>24h Express Delivery</strong>
                    <span>Free shipping over $50</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🔄</span>
                  <div>
                    <strong>30-Day Free Return</strong>
                    <span>Hassle-free 100% refund policy</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🛡️</span>
                  <div>
                    <strong>Official Warranty</strong>
                    <span>2 Year Manufacturer Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together Bundle Card */}
          {bundleCompanion && (
            <div className="bundle-deal-card margin-y-lg animate-fade-in">
              <div className="bundle-header">
                <span className="bundle-tag">🔥 FREQUENTLY BOUGHT TOGETHER</span>
                <h3>Save 15% with this matching smart bundle</h3>
              </div>
              <div className="bundle-content-flex">
                <div className="bundle-items-visual">
                  <div className="bundle-single-item">
                    <img src={product.image} alt={product.name} />
                    <span>{product.name}</span>
                    <strong>${product.price}</strong>
                  </div>
                  <span className="bundle-plus-icon">+</span>
                  <div className="bundle-single-item">
                    <img src={bundleCompanion.image} alt={bundleCompanion.name} />
                    <span>{bundleCompanion.name}</span>
                    <strong>${bundleCompanion.price}</strong>
                  </div>
                </div>
                <div className="bundle-pricing-action">
                  <div className="bundle-price-details">
                    <span className="bundle-total-label">Bundle Price:</span>
                    <span className="bundle-final-price">${bundleCombinedPrice}</span>
                    <span className="bundle-old-total">${product.price + bundleCompanion.price}</span>
                    <span className="bundle-savings-badge">Save ${bundleSavings} (15% OFF)</span>
                  </div>
                  <button
                    className={`btn-primary bundle-add-btn ${bundleAdded ? "added" : ""}`}
                    onClick={handleAddBundleToCart}
                  >
                    {bundleAdded ? "Bundle Added! ✓" : "Add Both to Cart 🛍️"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Tabs & Customer Reviews */}
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
                Customer Reviews &amp; Ratings ⭐
              </button>
            </div>

            <div className="tab-body">
              {activeTab === "description" && (
                <div className="tab-content-box">
                  <h3>Product Overview &amp; Key Features</h3>
                  <p>
                    Experience unmatched quality with the {product.name}. Crafted precisely for perfection, this product seamlessly combines elegant design with industry-leading features.
                  </p>
                  <div className="features-bullets-grid">
                    <div className="feature-bullet-item">
                      <span className="bullet-icon">✨</span>
                      <div>
                        <strong>Aerospace-Grade Materials</strong>
                        <p>Constructed with durable high-resilience components tested for long-lasting performance.</p>
                      </div>
                    </div>
                    <div className="feature-bullet-item">
                      <span className="bullet-icon">⚡</span>
                      <div>
                        <strong>Ergonomic Comfort</strong>
                        <p>Engineered for lightweight daily wear, comfort, and all-day satisfaction.</p>
                      </div>
                    </div>
                    <div className="feature-bullet-item">
                      <span className="bullet-icon">🛡️</span>
                      <div>
                        <strong>Weather &amp; Water Resistant</strong>
                        <p>Built to handle outdoor conditions, daily commutes, and active workouts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="tab-content-box">
                  <h3>Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td>Brand</td>
                        <td>Cartify Certified Premium</td>
                      </tr>
                      <tr>
                        <td>Category</td>
                        <td>{product.category}</td>
                      </tr>
                      <tr>
                        <td>Color Variant</td>
                        <td>{selectedColor}</td>
                      </tr>
                      <tr>
                        <td>Size / Dimension</td>
                        <td>{selectedSize}</td>
                      </tr>
                      <tr>
                        <td>Warranty</td>
                        <td>2 Years Full Replacement Guarantee</td>
                      </tr>
                      <tr>
                        <td>Package Contents</td>
                        <td>Product, Quick Guide, Certificate of Authenticity</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Customer Reviews Component */}
              {activeTab === "reviews" && (
                <div className="tab-content-box reviews-tab-wrapper">
                  <ProductReviews productId={product.id} productName={product.name} />
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section margin-y-lg">
              <h2>You Might Also Like</h2>
              <div className="products-grid">
                {relatedProducts.map((relProd) => (
                  <ProductCard key={relProd.id} product={relProd} />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed Products Section */}
          <RecentlyViewed currentProductId={product.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetails;