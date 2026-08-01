import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    discountPercent,
    applyPromoCode,
  } = useContext(CartContext);

  const [promoInput, setPromoInput] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 10;
  const taxFee = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput) {
      applyPromoCode(promoInput);
    }
  };

  return (
    <div className="cart-page-container">
      <div className="cart-header-title">
        <h2>Your Shopping Cart</h2>
        <p>Review items, adjust quantities, apply discount coupons, and proceed to checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is currently empty</h3>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="btn-primary">
            Start Shopping Now 🛍️
          </Link>
        </div>
      ) : (
        <div className="cart-grid-layout">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product ({cart.length} items)</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div className="cart-item-row" key={item.id}>
                  <div className="cart-item-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <Link to={`/product/${item.id}`} className="item-title">
                        {item.name}
                      </Link>
                      <span className="item-category">{item.category}</span>
                    </div>
                  </div>

                  <div className="cart-item-price">${item.price}</div>

                  <div className="cart-item-qty">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ${item.price * item.quantity}
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-actions-footer">
              <Link to="/" className="btn-secondary">
                ← Continue Shopping
              </Link>
              <button className="btn-danger-outline" onClick={clearCart}>
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card">
            <h3>Order Summary</h3>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="promo-box">
              <input
                type="text"
                placeholder="Promo code (e.g. SAVE10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button type="submit">Apply</button>
            </form>
            <div className="promo-hint">
              <span>Try code <strong>SAVE10</strong> (10% off) or <strong>SAVE20</strong> (20% off)</span>
            </div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              {discountPercent > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="free-shipping">FREE</strong>
                  ) : (
                    `$${shippingFee}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>${taxFee}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary checkout-btn-block">
              Proceed to Checkout 🔒
            </Link>

            <div className="secure-badge-footer">
              🔒 256-Bit SSL Encrypted & Guaranteed Safe Checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;