import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart, discountPercent, discountCode, applyPromoCode, addToast } = useContext(CartContext);

  // 1. Address Form State
  const [formData, setFormData] = useState({
    fullName: "Sunny Kumar",
    email: "sunnykumar6207058974@gmail.com",
    phone: "+91 8340112045",
    street: "Tech Hub Tower, Suite 400",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560001",
    country: "India",
    paymentMethod: "card",
    cardNumber: "4532 •••• •••• 8892",
    cardExpiry: "12/28",
    cardCvc: "889",
    upiId: "sunny@upi",
  });

  // 2. Delivery Option Speed State
  const [deliveryOption, setDeliveryOption] = useState("standard"); // standard, express, sameday

  // 5. Coupon Input State
  const [couponInput, setCouponInput] = useState(discountCode || "");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Subtotal Calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Discount Amount
  const discountAmount = (subtotal * discountPercent) / 100;

  // Delivery Charges Calculation based on Delivery Option
  const getDeliveryFee = () => {
    if (cart.length === 0) return 0;
    if (deliveryOption === "express") return 15;
    if (deliveryOption === "sameday") return 25;
    // Standard is FREE over $50, else $10
    return subtotal >= 50 ? 0 : 10;
  };

  const deliveryFee = getDeliveryFee();
  const taxFee = Math.round((subtotal - discountAmount) * 0.05);

  // Total Amount Calculation
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxFee);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Apply Coupon Code Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderPlaced(true);
    addToast(`Order ${generatedId} placed successfully! 📦`);
    clearCart();
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content checkout-page">
        <div className="checkout-container container">
          <div className="page-header-banner">
            <h1>Secure Express Checkout 🔒</h1>
            <p>Complete your shipping address, select delivery speed & payment option.</p>
          </div>

          {cart.length === 0 && !orderPlaced ? (
            <div className="empty-cart-card margin-y-medium">
              <h3>Your cart is empty</h3>
              <p>Add products to your cart before proceeding to checkout.</p>
              <Link to="/products" className="btn-primary">
                Return to Shop Catalog 🛍️
              </Link>
            </div>
          ) : orderPlaced ? (
            <div className="order-success-card">
              <div className="success-icon">🎉</div>
              <h2>Order Placed Successfully!</h2>
              <p className="order-id-badge">Order Reference ID: <strong>{orderId}</strong></p>
              <p className="success-msg">
                Thank you for shopping with Cartify! We have sent a complete tax invoice & order tracking confirmation to{" "}
                <strong>{formData.email}</strong> and an SMS alert to <strong>{formData.phone}</strong>.
              </p>

              <div className="delivery-estimate-box">
                <span>📦 Delivery Estimate ({deliveryOption.toUpperCase()}):</span>
                <strong>
                  {deliveryOption === "sameday"
                    ? "Today (Within 6 Hours)"
                    : deliveryOption === "express"
                    ? "Tomorrow (24-Hour Express Guarantee)"
                    : "3 - 5 Business Days"}
                </strong>
              </div>

              <div className="success-actions">
                <Link to="/orders" className="btn-primary">
                  View My Orders 📦
                </Link>
                <Link to="/products" className="btn-secondary">
                  Continue Shopping 🛍️
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="checkout-grid">
              {/* Left Column: 1. Address Form + 2. Delivery Option + 3. Payment Option */}
              <div className="checkout-form-column">
                {/* 1. Address Form */}
                <div className="form-card">
                  <h3>1. Shipping Address</h3>
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
                      <label>Email Address (For Invoice Receipt) *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Phone Number (For SMS Alerts) *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <select name="country" value={formData.country} onChange={handleChange} className="filter-select">
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
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
                      <label>State / Region *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP / Postal Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Option Speed Selection */}
                <div className="form-card">
                  <h3>2. Select Delivery Speed</h3>
                  <div className="delivery-options-grid">
                    <label
                      className={`delivery-option-card ${
                        deliveryOption === "standard" ? "selected" : ""
                      }`}
                      onClick={() => setDeliveryOption("standard")}
                    >
                      <div className="delivery-card-header">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={deliveryOption === "standard"}
                          onChange={() => setDeliveryOption("standard")}
                        />
                        <strong>🚀 Standard Delivery</strong>
                      </div>
                      <p>Est. 3-5 Business Days</p>
                      <span className="delivery-price-badge">
                        {subtotal >= 50 ? "FREE" : "$10.00"}
                      </span>
                    </label>

                    <label
                      className={`delivery-option-card ${
                        deliveryOption === "express" ? "selected" : ""
                      }`}
                      onClick={() => setDeliveryOption("express")}
                    >
                      <div className="delivery-card-header">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="express"
                          checked={deliveryOption === "express"}
                          onChange={() => setDeliveryOption("express")}
                        />
                        <strong>⚡ 24h Express Dispatch</strong>
                      </div>
                      <p>Guaranteed Next Day</p>
                      <span className="delivery-price-badge">$15.00</span>
                    </label>

                    <label
                      className={`delivery-option-card ${
                        deliveryOption === "sameday" ? "selected" : ""
                      }`}
                      onClick={() => setDeliveryOption("sameday")}
                    >
                      <div className="delivery-card-header">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="sameday"
                          checked={deliveryOption === "sameday"}
                          onChange={() => setDeliveryOption("sameday")}
                        />
                        <strong>🏎️ Same-Day Rush</strong>
                      </div>
                      <p>Delivered Within 6 Hours</p>
                      <span className="delivery-price-badge">$25.00</span>
                    </label>
                  </div>
                </div>

                {/* 3. Payment Option Selection */}
                <div className="form-card">
                  <h3>3. Payment Option</h3>
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
                      <span>💵 Cash on Delivery (COD)</span>
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

                  {formData.paymentMethod === "upi" && (
                    <div className="upi-fields margin-top-sm">
                      <div className="form-group">
                        <label>Virtual Payment Address (UPI ID)</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="username@upi"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: 4. Order Summary + 5. Coupon Field */}
              <div className="checkout-summary-column">
                <div className="order-review-card">
                  {/* 4. Order Summary */}
                  <h3>Order Summary ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</h3>

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
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 5. Coupon Field */}
                  <form onSubmit={handleApplyCoupon} className="promo-box margin-y-sm">
                    <input
                      type="text"
                      placeholder="Promo / Coupon code (SAVE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button type="submit">Apply</button>
                  </form>
                  <div className="promo-hint">
                    <span>Use <strong>SAVE10</strong> for 10% OFF or <strong>SAVE20</strong> for 20% OFF</span>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="summary-breakdown">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="summary-row discount">
                        <span>Coupon Savings ({discountPercent}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <strong className="free-shipping">FREE</strong>
                        ) : (
                          `$${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Est. Tax (5%)</span>
                      <span>${taxFee.toFixed(2)}</span>
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
                    🔒 By placing order, you agree to Cartify's 256-Bit SSL Encrypted checkout terms.
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