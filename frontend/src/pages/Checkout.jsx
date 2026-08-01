import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart, discountPercent } = useContext(CartContext);

  const [formData, setFormData] = useState({
    fullName: "Sunny Kumar",
    email: "sunnykumar6207058974@gmail.com",
    address: "742 Tech Hub Avenue",
    city: "San Francisco",
    zip: "94107",
    phone: "+91 8340112045",
    paymentMethod: "card",
    cardNumber: "4532 •••• •••• 8892",
    cardExpiry: "12/28",
    cardCvc: "889",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 10;
  const taxFee = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxFee);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content checkout-page">
        <div className="checkout-container">
          <h2>Secure Checkout</h2>
          <p>Complete your shipping and payment details to place your order.</p>

          {cart.length === 0 && !orderPlaced ? (
            <div className="empty-cart-card margin-y-medium">
              <h3>Your cart is empty</h3>
              <p>Add products to your cart before proceeding to checkout.</p>
              <Link to="/" className="btn-primary">
                Return to Shop
              </Link>
            </div>
          ) : orderPlaced ? (
            <div className="order-success-card">
              <div className="success-icon">🎉</div>
              <h2>Order Placed Successfully!</h2>
              <p className="order-id-badge">Order ID: <strong>{orderId}</strong></p>
              <p className="success-msg">
                Thank you for shopping with Cartify! We have sent an order confirmation & invoice receipt to{" "}
                <strong>{formData.email}</strong>.
              </p>

              <div className="delivery-estimate-box">
                <span>📦 Estimated Delivery:</span>
                <strong>3 - 5 Business Days</strong>
              </div>

              <div className="success-actions">
                <Link to="/" className="btn-primary">
                  Continue Shopping 🛍️
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="checkout-grid">
              {/* Left Column: Customer & Shipping Details */}
              <div className="checkout-form-column">
                <div className="form-card">
                  <h3>1. Shipping Information</h3>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Zip / Postal Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-card">
                  <h3>2. Select Payment Method</h3>
                  <div className="payment-options">
                    <label
                      className={`payment-option ${
                        formData.paymentMethod === "card" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                      />
                      <span>💳 Credit / Debit Card</span>
                    </label>

                    <label
                      className={`payment-option ${
                        formData.paymentMethod === "upi" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleChange}
                      />
                      <span>⚡ UPI / Google Pay / PhonePe</span>
                    </label>

                    <label
                      className={`payment-option ${
                        formData.paymentMethod === "cod" ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                      />
                      <span>💵 Cash on Delivery</span>
                    </label>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="card-fields">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>CVC / CVV</label>
                          <input
                            type="password"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Review */}
              <div className="checkout-summary-column">
                <div className="order-review-card">
                  <h3>Order Review ({cart.length} items)</h3>

                  <div className="checkout-items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="checkout-item-preview">
                        <img src={item.image} alt={item.name} />
                        <div className="preview-info">
                          <strong>{item.name}</strong>
                          <span>
                            Qty: {item.quantity} × ${item.price}
                          </span>
                        </div>
                        <span className="preview-total">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    ))}
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
                        {shippingFee === 0 ? "FREE" : `$${shippingFee}`}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Est. Tax</span>
                      <span>${taxFee}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary place-order-btn">
                    Place Order (${grandTotal.toFixed(2)}) 🚀
                  </button>

                  <p className="guarantee-text">
                    🔒 By clicking Place Order, you agree to Cartify's terms of service and instant return policy.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;