import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="product-card-modern">
      {/* Badges */}
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
        title="Add to Wishlist"
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Image Container */}
      <div className="product-card-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <button
          className="quick-view-overlay-btn"
          onClick={() => onQuickView && onQuickView(product)}
        >
          Quick View 👁️
        </button>
      </div>

      {/* Product Details */}
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

        {/* Price Row */}
        <div className="product-price-row">
          <div className="price-wrap">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="old-price">${product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product)}
          >
            Add to Cart 🛒
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