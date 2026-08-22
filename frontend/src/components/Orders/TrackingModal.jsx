import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function TrackingModal({ order, onClose }) {
  const { addToast } = useContext(CartContext);
  if (!order) return null;

  const status = order.status || "Processing";
  const orderId = order.id || "ORD-000000";
  const trackingNumber = `TRK-${orderId.replace(/\D/g, "") || "94821"}-EXP`;

  // Determine active step index: 0 = Placed, 1 = Processing/Packed, 2 = Shipped/In Transit, 3 = Delivered
  let activeStep = 0;
  if (status.toLowerCase() === "processing") activeStep = 1;
  else if (status.toLowerCase() === "shipped") activeStep = 2;
  else if (status.toLowerCase() === "delivered") activeStep = 3;
  else if (status.toLowerCase() === "cancelled") activeStep = -1;

  const orderDate = order.createdAt || order.date ? new Date(order.createdAt || order.date) : new Date();
  
  // Format dates for steps
  const placedDateStr = orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  
  const estimatedDelivery = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const steps = [
    {
      title: "Order Placed & Confirmed",
      desc: `Order received and confirmed on ${placedDateStr}`,
      icon: "🛒",
      timestamp: placedDateStr,
    },
    {
      title: "Packed & Processed",
      desc: "Cartify Fulfillment Hub, Sector 62",
      icon: "📦",
      timestamp: activeStep >= 1 ? "Dispatched from Hub" : "Pending",
    },
    {
      title: "In Transit with Courier",
      desc: "Cartify Express Courier (Out for Delivery)",
      icon: "🚚",
      timestamp: activeStep >= 2 ? "Out for Delivery" : "Pending",
    },
    {
      title: "Package Delivered",
      desc: activeStep === 3 ? "Delivered to recipient" : `Estimated delivery by ${estimatedDelivery}`,
      icon: "🏠",
      timestamp: activeStep === 3 ? "Delivered ✓" : estimatedDelivery,
    },
  ];

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(trackingNumber);
    addToast(`Copied tracking ID: ${trackingNumber} 📋`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tracking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">✕</button>
        
        {/* Header */}
        <div className="tracking-modal-header">
          <div className="tracking-title-group">
            <span className="tracking-badge-pill">🚚 LIVE TRACKING</span>
            <h2>Order #{orderId}</h2>
          </div>
          <span className={`order-status-badge status-${status.toLowerCase()}`}>
            {status}
          </span>
        </div>

        {/* Courier Info Box */}
        <div className="tracking-courier-banner">
          <div className="courier-info-col">
            <span className="courier-label">Courier Partner</span>
            <strong>⚡ Cartify Express Air</strong>
          </div>
          <div className="courier-info-col">
            <span className="courier-label">Tracking Number</span>
            <div className="tracking-code-copy" onClick={handleCopyTracking} title="Click to copy">
              <span>{trackingNumber}</span>
              <button type="button" className="copy-btn">📋</button>
            </div>
          </div>
          <div className="courier-info-col">
            <span className="courier-label">Estimated Delivery</span>
            <strong className="text-primary-highlight">{activeStep === 3 ? "Delivered" : estimatedDelivery}</strong>
          </div>
        </div>

        {/* Cancelled Notice */}
        {status.toLowerCase() === "cancelled" ? (
          <div className="tracking-cancelled-box">
            <span className="cancelled-icon">✕</span>
            <div>
              <strong>Order Cancelled</strong>
              <p>This order has been cancelled. Any amount paid has been refunded to your original payment method.</p>
            </div>
          </div>
        ) : (
          /* Interactive Stepper */
          <div className="tracking-timeline-container">
            <div className="tracking-timeline">
              {steps.map((step, idx) => {
                const isCompleted = idx <= activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div
                    key={idx}
                    className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="step-icon-wrapper">
                      <span className="step-icon">{step.icon}</span>
                      {isCompleted && <span className="step-check-dot">✓</span>}
                    </div>

                    <div className="step-content">
                      <div className="step-header-row">
                        <strong>{step.title}</strong>
                        <span className="step-time">{step.timestamp}</span>
                      </div>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Package Items & Address Summary */}
        <div className="tracking-package-summary">
          <h4>📦 Shipment Summary ({order.items?.length || 1} Item{order.items?.length !== 1 ? "s" : ""})</h4>
          <div className="tracking-items-row">
            {order.items?.map((item, idx) => (
              <div key={idx} className="tracking-item-chip">
                {item.image && <img src={item.image} alt={item.name} />}
                <div>
                  <strong>{item.name}</strong>
                  <span>Qty: {item.quantity} • ${item.price}</span>
                </div>
              </div>
            ))}
          </div>

          {order.customer?.address && (
            <div className="tracking-delivery-dest">
              <span className="dest-icon">📍</span>
              <div>
                <span className="dest-label">Delivery Destination:</span>
                <p>{order.customer.name} — {order.customer.address}, {order.customer.city || ""}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="tracking-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              addToast(`Tracking details refreshed for #${orderId}! 🔄`);
            }}
          >
            Refresh Status 🔄
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackingModal;
