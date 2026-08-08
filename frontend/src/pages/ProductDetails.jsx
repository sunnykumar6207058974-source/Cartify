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
  const { addToCart, toggleWishlist, isInWishlist, addToast } = useContext(CartContext);

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

  // Interactive Review Form state
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: "Alex M.",
      rating: 5,
      date: "August 2, 2026",
      comment: "Absolutely thrilled with this purchase! High quality, super fast shipping, and exceptional packaging.",
    },
    {
      id: 2,
      name: "Sophia R.",
      rating: 5,
      date: "July 29, 2026",
      comment: "Worth every penny! Exactly as described. I will definitely be ordering from Cartify again.",
    },
  ]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

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
        // Default color & size based on category
        setSelectedColor(target.category === "Shoes" ? "Stealth Black" : target.category === "Watches" ? "Midnight Silver" : "Matte Black");
        setSelectedSize(target.category === "Shoes" ? "US 10" : target.category === "Apparel" ? "L" : "Standard 44mm");
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
  const sizesList = product.category === "Shoes" 
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

  // 6. Add to Cart with Options
  const handleAddToCart = () => {
    addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
  };

  // 7. Buy Now Button Handler
  const handleBuyNow = () => {
    addToCart({ ...product, color: selectedColor, size: selectedSize }, quantity);
    navigate("/checkout");
  };

  // Add New Customer Review
  const handleAddReview = (e) => {
    e.preventDefault();
    if (newReviewName && newReviewComment) {
      const newEntry = {
        id: Date.now(),
        name: newReviewName,
        rating: newReviewRating,
        date: "Just now",
        comment: newReviewComment,
      };
      setReviewsList([newEntry, ...reviewsList]);
      setNewReviewName("");
      setNewReviewComment("");
      addToast("Review submitted successfully! Thank you ⭐");
    }
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
            <Link to="/">Home</Link> &gt; <Link to="/products">Catalog</Link> &gt; <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link> &gt;{" "}
            <strong>{product.name}</strong>
          </div>

          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Browsing
          </button>

          <div className="details-grid">
            {/* Left: 1. Multiple Images Gallery + 2. Hover Zoom Lens */}
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
                <span className="reviews-text">({reviewsList.length + 84} verified reviews)</span>
              </div>

              {/* Price & Stock */}
              <div className="details-price-row">
                <span className="price-current">${product.price}</span>
                {product.originalPrice && (
                  <span className="price-old">${product.originalPrice}</span>
                )}
                <span className="stock-tag">In Stock & Ready to Ship ⚡</span>
              </div>

              <p className="details-summary">
                {product.description ||
                  "Engineered with premium materials for maximum durability, everyday style, and peak performance."}
              </p>

              {/* 3. Color Selection Swatches */}
              <div className="option-selection-group">
                <label className="option-label">Color Variant: <strong>{selectedColor}</strong></label>
                <div className="color-swatches-row">
                  {colorsList.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-pill ${selectedColor === c ? "active-color" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      <span className="color-dot" style={{
                        background: c.includes("Black") ? "#1e293b" : c.includes("Blue") ? "#2563eb" : c.includes("Silver") ? "#94a3b8" : "#f97316"
                      }}></span>
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Size Selection Pills */}
              <div className="option-selection-group">
                <label className="option-label">Size Options: <strong>{selectedSize}</strong></label>
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

              {/* 5. Quantity Selector & 6. Add to Cart / 7. Buy Now */}
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
                  {/* 6. Add to Cart Button */}
                  <button
                    className="btn-primary add-to-cart-large"
                    onClick={handleAddToCart}
                  >
                    Add {quantity} to Cart 🛒
                  </button>

                  {/* 7. Buy Now Button */}
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

          {/* Product Tabs & 8. Customer Reviews */}
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
                Customer Reviews ({reviewsList.length})
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
                        <td>Color Variant</td>
                        <td>{selectedColor}</td>
                      </tr>
                      <tr>
                        <td>Size / Dimension</td>
                        <td>{selectedSize}</td>
                      </tr>
                      <tr>
                        <td>Warranty</td>
                        <td>2 Years International</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 8. Customer Reviews & Interactive Submission */}
              {activeTab === "reviews" && (
                <div className="tab-content-box">
                  <div className="reviews-header-summary">
                    <div>
                      <h3>Customer Reviews & Ratings</h3>
                      <div className="overall-rating-badge">
                        <span className="score">4.9</span>
                        <span className="stars">★★★★★</span>
                        <span>Based on {reviewsList.length + 84} ratings</span>
                      </div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="review-card">
                        <div className="review-header">
                          <strong>{rev.name} <span className="verified-tag">✓ Verified Buyer</span></strong>
                          <span className="stars">{"★".repeat(rev.rating)}</span>
                        </div>
                        <span className="review-date">{rev.date}</span>
                        <p className="review-comment">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="add-review-form">
                    <h4>Write a Review</h4>
                    <div className="form-group-inline">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        required
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      >
                        <option value="5">5 Stars ★★★★★</option>
                        <option value="4">4 Stars ★★★★☆</option>
                        <option value="3">3 Stars ★★★☆☆</option>
                      </select>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="Write your feedback about this product..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn-primary">
                      Submit Review ⭐
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* 9. Related Products */}
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