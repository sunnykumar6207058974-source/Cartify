import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-grid">
          <div className="modal-image-col">
            {product.discount && <span className="modal-badge">{product.discount}</span>}
            <img src={product.image} alt={product.name} />
          </div>

          <div className="modal-details-col">
            <span className="modal-category">{product.category}</span>
            <h2>{product.name}</h2>

            <div className="modal-rating-row">
              <span className="stars">{"★".repeat(Math.round(product.rating || 5))}</span>
              <span className="rating-num">{product.rating}</span>
              <span className="reviews">({product.reviewsCount || 42} customer reviews)</span>
            </div>

            <div className="modal-price-row">
              <span className="modal-price">${product.price}</span>
              {product.originalPrice && (
                <span className="modal-original-price">${product.originalPrice}</span>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-actions">
              <div className="modal-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  addToCart(product, qty);
                  onClose();
                }}
              >
                Add {qty} to Cart 🛒
              </button>

              <button
                className={`btn-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={() => toggleWishlist(product)}
                title="Toggle Wishlist"
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
