import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { cancelOrderUser } from "../../services/api";

const REASONS = [
  "⏱️ Ordered by mistake / Change of mind",
  "🏷️ Found a better price elsewhere",
  "⏳ Delivery date is too long / delayed",
  "🏠 Incorrect shipping address or phone",
  "💳 Want to change payment method or promo",
  "📝 Other reason (specified below)",
];

function CancelOrderModal({ order, onClose, onCancelled }) {
  const { user, addToast } = useContext(CartContext);
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [customRemarks, setCustomRemarks] = useState("");
  const [phone, setPhone] = useState(order?.customer?.phone || user?.phone || "+91 8340112045");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!order) return null;

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullReason = selectedReason.includes("Other") && customRemarks.trim()
      ? customRemarks.trim()
      : selectedReason;

    const res = await cancelOrderUser(order.id, fullReason, phone);
    setLoading(false);

    if (res.success) {
      addToast(`Order #${order.id} cancelled successfully! 📱 Confirmation SMS sent.`);
      if (onCancelled) {
        onCancelled(order.id, fullReason);
      }
      onClose();
    } else {
      setError(res.message || "Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cancel-order-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">✕</button>

        <div className="cancel-modal-header">
          <span className="cancel-warning-icon">⚠️</span>
          <div>
            <h2>Cancel Order #{order.id}</h2>
            <p>Please select a reason for cancelling this order.</p>
          </div>
        </div>

        {error && <div className="auth-error-alert margin-y-sm">⚠️ {error}</div>}

        <form onSubmit={handleConfirmCancel} className="cancel-order-form">
          {/* Order Summary Pill */}
          <div className="cancel-order-summary-box">
            <div className="summary-left">
              <strong>Total Amount:</strong>
              <span className="cancel-total-price">${Number(order.total || 0).toFixed(2)}</span>
            </div>
            <div className="summary-right">
              <span>Items: <strong>{order.items?.length || 1}</strong></span>
              <span>Status: <strong className="status-highlight">{order.status}</strong></span>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="cancel-reasons-group">
            <label className="section-label">Select Cancellation Reason *</label>
            <div className="reasons-radio-list">
              {REASONS.map((r, idx) => (
                <label
                  key={idx}
                  className={`reason-radio-card ${selectedReason === r ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                  />
                  <span className="reason-text">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remarks Textarea */}
          {selectedReason.includes("Other") && (
            <div className="form-group margin-top-sm">
              <label>Provide details</label>
              <textarea
                className="cancel-textarea"
                rows={2}
                placeholder="Tell us why you'd like to cancel this order..."
                value={customRemarks}
                onChange={(e) => setCustomRemarks(e.target.value)}
                required
              />
            </div>
          )}

          {/* Mobile phone number for SMS alert */}
          <div className="form-group margin-top-sm">
            <label>Mobile Number for SMS Cancellation Alert 📱</label>
            <input
              type="tel"
              className="cancel-phone-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          {/* Refund & SMS Telemetry Notice */}
          <div className="cancel-refund-notice">
            <div className="notice-row">
              <span>💰</span>
              <p><strong>100% Refund:</strong> A full refund of <strong>${Number(order.total || 0).toFixed(2)}</strong> will be credited to your original payment method within 24 hours.</p>
            </div>
            <div className="notice-row margin-top-xs">
              <span>📱</span>
              <p><strong>SMS Confirmation:</strong> A live cellular text message will be dispatched immediately to <strong>{phone}</strong>.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cancel-modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Keep My Order
            </button>
            <button
              type="submit"
              className="btn-danger-confirm"
              disabled={loading}
            >
              {loading ? "Cancelling…" : "Confirm Cancellation ✕"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CancelOrderModal;
