import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import TrackingModal from "./TrackingModal";
import CancelOrderModal from "./CancelOrderModal";

function OrderCard({ order, onOrderCancelled }) {
  const [showTracking, setShowTracking] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order?.status || "Processing");
  const { addToCart, addToast } = useContext(CartContext);
  const navigate = useNavigate();

  if (!order) return null;

  const isCancelled = currentStatus.toLowerCase() === "cancelled";
  const isDelivered = currentStatus.toLowerCase() === "delivered";
  const canCancel = !isCancelled && !isDelivered;

  const orderDateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : order.date || "Recent";

  const handleReorder = () => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        addToCart({
          id: item.id || 1,
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
        }, item.quantity || 1);
      });
      addToast(`Reordered ${order.items.length} item(s) to your cart! 🛒`);
      navigate("/cart");
    }
  };

  const handleCancelledSuccess = (orderId, reason) => {
    setCurrentStatus("Cancelled");
    if (onOrderCancelled) {
      onOrderCancelled(orderId, reason);
    }
  };

  return (
    <>
      <div className={`order-card-wrapper ${isCancelled ? "order-card-cancelled" : ""}`}>
        <div className="order-card-header">
          <div>
            <span className="order-id">Order #{order.id}</span>
            <span className="order-date">Placed on {orderDateStr}</span>
          </div>
          <span className={`order-status-badge status-${currentStatus.toLowerCase()}`}>
            {currentStatus}
          </span>
        </div>

        <div className="order-items-preview">
          {order.items?.map((item, idx) => (
            <div key={idx} className="order-item-row">
              <img src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80"} alt={item.name} />
              <div className="order-item-details">
                <Link to={`/product/${item.id || 1}`} className="order-item-name">
                  {item.name}
                </Link>
                <span>Qty: {item.quantity} × ${item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {isCancelled && order.cancellationReason && (
          <div className="order-cancellation-banner">
            <span>⚠️ <strong>Cancelled:</strong> {order.cancellationReason}</span>
          </div>
        )}

        <div className="order-card-footer">
          <div className="order-total-price">
            <span>Total Amount:</span>
            <strong>${Number(order.total || 0).toFixed(2)}</strong>
          </div>
          <div className="order-actions">
            {canCancel && (
              <button
                className="btn-danger-outline btn-sm btn-cancel-order"
                onClick={() => setShowCancelModal(true)}
                title="Cancel this order"
              >
                Cancel Order ✕
              </button>
            )}
            <button
              className="btn-secondary btn-sm btn-track-package"
              onClick={() => setShowTracking(true)}
            >
              Track Package 🚚
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={handleReorder}
            >
              Reorder 🔄
            </button>
          </div>
        </div>
      </div>

      {/* Live Tracking Modal */}
      {showTracking && (
        <TrackingModal order={{ ...order, status: currentStatus }} onClose={() => setShowTracking(false)} />
      )}

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <CancelOrderModal
          order={order}
          onClose={() => setShowCancelModal(false)}
          onCancelled={handleCancelledSuccess}
        />
      )}
    </>
  );
}

export default OrderCard;
