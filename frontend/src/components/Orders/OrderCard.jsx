import { Link } from "react-router-dom";

function OrderCard({ order }) {
  if (!order) return null;

  return (
    <div className="order-card-wrapper">
      <div className="order-card-header">
        <div>
          <span className="order-id">Order #{order.id}</span>
          <span className="order-date">Placed on {order.date}</span>
        </div>
        <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <div className="order-items-preview">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item-row">
            <img src={item.image} alt={item.name} />
            <div className="order-item-details">
              <Link to={`/product/${item.id || 1}`} className="order-item-name">
                {item.name}
              </Link>
              <span>Qty: {item.quantity} × ${item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <div className="order-total-price">
          <span>Total Amount:</span>
          <strong>${order.total}</strong>
        </div>
        <div className="order-actions">
          <button className="btn-secondary btn-sm">Track Package 🚚</button>
          <button className="btn-primary btn-sm">Reorder 🔄</button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
