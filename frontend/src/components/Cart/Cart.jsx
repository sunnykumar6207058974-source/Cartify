import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

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

  // Real-time Subtotal & Price Updates
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  // Delivery Charges: Free shipping over $50, else $10 flat rate
  const freeShippingThreshold = 50;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 10;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const taxFee = Math.round((subtotal - discountAmount) * 0.05);

  // Total Amount Calculation
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
        /* Empty Cart State */
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is currently empty</h3>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping Now 🛍️
          </Link>
        </div>
      ) : (
        <div className="cart-grid-layout">
          {/* Cart Items List */}
          <div className="cart-items-section">
            {/* Free Shipping Progress Indicator */}
            {amountNeededForFreeShipping > 0 ? (
              <div className="shipping-progress-banner">
                🚚 Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!
              </div>
            ) : (
              <div className="shipping-progress-banner free-unlocked">
                🎉 Congratulations! You have unlocked <strong>FREE Express Shipping</strong>!
              </div>
            )}

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
                      <span className="item-category">
                        {item.category} {item.color ? `• ${item.color}` : ""} {item.size ? `• ${item.size}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="cart-item-price">${item.price}</div>

                  {/* Increase & Decrease Quantity */}
                  <div className="cart-item-qty">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total Price Update */}
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Item */}
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
              <Link to="/products" className="btn-secondary">
                ← Continue Shopping
              </Link>

              {/* Empty Entire Cart Button */}
              <button className="btn-danger-outline" onClick={clearCart}>
                Clear Entire Cart 🗑️
              </button>
            </div>
          </div>

          {/* Cart Order Summary Card */}
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
              {/* Subtotal */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Amount */}
              {discountPercent > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Delivery Charges */}
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="free-shipping">FREE</strong>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Tax */}
              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>${taxFee.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              {/* Total Amount */}
              <div className="summary-row total">
                <span>Total Amount</span>
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
