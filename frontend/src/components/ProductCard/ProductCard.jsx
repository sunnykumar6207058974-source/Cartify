import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80";

function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const [imgSrc, setImgSrc] = useState(product?.image || FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="product-card-modern">
      {/* Discount & Feature Badges */}
      <div className="product-card-badges">
        {product.discount && (
          <span className="badge-tag discount-tag">{product.discount}</span>
        )}
        {product.badge && (
          <span className="badge-tag feature-tag">{product.badge}</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        aria-label="Wishlist"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Image Container with Hover Zoom & Quick View */}
      <div className="product-card-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="product-main-thumb"
          />
        </Link>

        {/* Quick View Trigger Button */}
        <button
          type="button"
          className="quick-view-overlay-btn"
          onClick={() => onQuickView && onQuickView(product)}
        >
          Quick View 👁️
        </button>
      </div>

      {/* Product Information Body */}
      <div className="product-card-body">
        <span className="product-category-text">{product.category}</span>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating Row */}
        <div className="product-rating-bar">
          <span className="star-icon">★</span>
          <span className="rating-value">{product.rating || 4.8}</span>
          <span className="reviews-count">({product.reviewsCount || 42})</span>
        </div>

        {/* Price & Discount Row */}
        <div className="product-price-row">
          <div className="price-wrap">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="old-price">${product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Add to Cart & Details Action Buttons */}
        <div className="product-card-actions">
          <button
            className={`btn-add-cart ${isAdded ? "added-success" : ""}`}
            onClick={handleAddToCart}
          >
            {isAdded ? "Added! ✓" : "Add to Cart 🛒"}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="btn-view-details"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
