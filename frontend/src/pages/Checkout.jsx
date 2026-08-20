import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../services/api";
import { formatCurrency } from "../utils/formatters";

function Checkout() {
  const navigate = useNavigate();
  const { cart, user, clearCart, discountPercent, discountCode, applyPromoCode, addToast } =
    useContext(CartContext);

  // Address form — pre-filled from logged-in user, editable
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    upiId: "",
  });

  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [couponInput, setCouponInput] = useState(discountCode || "");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;

  const getDeliveryFee = () => {
    if (cart.length === 0) return 0;
    if (deliveryOption === "express") return 15;
    if (deliveryOption === "sameday") return 25;
    return subtotal >= 50 ? 0 : 10;
  };

  const deliveryFee = getDeliveryFee();
  const taxFee = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxFee);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) applyPromoCode(couponInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setPlacing(true);
    setPlaceError("");

    try {
      const orderPayload = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: grandTotal,
        subtotal,
        discountAmount,
        deliveryFee,
        taxFee,
        deliveryOption,
        paymentMethod: formData.paymentMethod,
      };

      const result = await placeOrder(orderPayload);

      setOrderId(result.data.id);
      setOrderPlaced(true);
      addToast(`Order ${result.data.id} placed successfully! 📦`);
      clearCart();
    } catch (err) {
      // 401 = token missing or expired — send user back to login
      if (err.message?.toLowerCase().includes("unauthori")) {
        addToast("Session expired. Please sign in again.", "error");
        navigate("/login", { state: { from: { pathname: "/checkout" } } });
        return;
      }
      setPlaceError(err.message || "Failed to place order. Please try again.");
      addToast(err.message || "Order failed. Please retry.", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content checkout-page">
        <div className="checkout-container container">
          <div className="page-header-banner">
            <h1>Secure Express Checkout 🔒</h1>
            <p>Complete your shipping address, select delivery speed &amp; payment option.</p>
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
              <p className="order-id-badge">
                Order Reference ID: <strong>{orderId}</strong>
              </p>
              <p className="success-msg">
                Thank you for shopping with Cartify! A confirmation has been sent to{" "}
                <strong>{formData.email}</strong>.
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
              {/* Left Column */}
              <div className="checkout-form-column">
                {/* 1. Address */}
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
                        placeholder="Your full name"
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
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="filter-select"
                      >
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
                      placeholder="123 Main Street, Suite 100"
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
                        placeholder="Bengaluru"
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
                        placeholder="Karnataka"
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
                        placeholder="560001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Speed */}
                <div className="form-card">
                  <h3>2. Select Delivery Speed</h3>
                  <div className="delivery-options-grid">
                    {[
                      { id: "standard", label: "🚀 Standard Delivery", desc: "Est. 3-5 Business Days", price: subtotal >= 50 ? "FREE" : "$10.00" },
                      { id: "express", label: "⚡ 24h Express Dispatch", desc: "Guaranteed Next Day", price: "$15.00" },
                      { id: "sameday", label: "🏎️ Same-Day Rush", desc: "Delivered Within 6 Hours", price: "$25.00" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`delivery-option-card ${deliveryOption === opt.id ? "selected" : ""}`}
                        onClick={() => setDeliveryOption(opt.id)}
                      >
                        <div className="delivery-card-header">
                          <input
                            type="radio"
                            name="deliveryOption"
                            value={opt.id}
                            checked={deliveryOption === opt.id}
                            onChange={() => setDeliveryOption(opt.id)}
                          />
                          <strong>{opt.label}</strong>
                        </div>
                        <p>{opt.desc}</p>
                        <span className="delivery-price-badge">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Payment */}
                <div className="form-card">
                  <h3>3. Payment Option</h3>
                  <div className="payment-options">
                    {[
                      { value: "card", label: "💳 Credit / Debit Card" },
                      { value: "upi", label: "⚡ UPI / Google Pay / PhonePe" },
                      { value: "cod", label: "💵 Cash on Delivery (COD)" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`payment-option ${formData.paymentMethod === opt.value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.value}
                          checked={formData.paymentMethod === opt.value}
                          onChange={handleChange}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
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
                          placeholder="1234 5678 9012 3456"
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
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVC / CVV</label>
                          <input
                            type="password"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            placeholder="•••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "upi" && (
                    <div className="upi-fields margin-top-sm">
                      <div className="form-group">
                        <label>UPI ID</label>
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

              {/* Right Column — Order Summary */}
              <div className="checkout-summary-column">
                <div className="order-review-card">
                  <h3>Order Summary ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</h3>

                  <div className="checkout-items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="checkout-item-preview">
                        <img src={item.image} alt={item.name} />
                        <div className="preview-info">
                          <strong>{item.name}</strong>
                          <span>Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                        </div>
                        <span className="preview-total">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
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

                  {/* Price Breakdown */}
                  <div className="summary-breakdown">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="summary-row discount">
                        <span>Coupon Savings ({discountPercent}%)</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <strong className="free-shipping">FREE</strong>
                        ) : (
                          formatCurrency(deliveryFee)
                        )}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Est. Tax (5%)</span>
                      <span>{formatCurrency(taxFee)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  {placeError && (
                    <div className="auth-error-alert margin-y-sm">{placeError}</div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary place-order-btn"
                    disabled={placing}
                  >
                    {placing ? "Placing Order…" : `Place Order (${formatCurrency(grandTotal)}) 🚀`}
                  </button>

                  <p className="guarantee-text">
                    🔒 By placing order, you agree to Cartify&apos;s 256-Bit SSL Encrypted checkout terms.
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