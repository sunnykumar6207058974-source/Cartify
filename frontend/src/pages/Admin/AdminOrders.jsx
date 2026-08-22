import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { getAllOrdersAdmin, updateOrderStatus, deleteOrderAdmin } from "../../services/api";

const STATUS_OPTIONS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const { addToast } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersAdmin({
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    if (res.success) {
      addToast(`Order ${orderId} marked as ${newStatus}! 🚚`);
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } else {
      addToast(res.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (orderId) => {
    const res = await deleteOrderAdmin(orderId);
    if (res.success) {
      addToast(`Order ${orderId} removed.`, "info");
      setDeleteConfirmId(null);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      fetchOrders();
    } else {
      addToast(res.message || "Failed to delete order", "error");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || (o.status || "").toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(q)) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2>Customer Orders &amp; Fulfillment</h2>
          <p className="card-subtitle">Track incoming shipments, review customer addresses, and update delivery statuses.</p>
        </div>
        <button className="btn-admin-secondary" onClick={fetchOrders}>
          🔄 Refresh Orders
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <form onSubmit={handleSearchSubmit} className="admin-search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => { setSearchQuery(""); fetchOrders(); }}>
              ✕
            </button>
          )}
        </form>

        <div className="category-filter-pills">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              className={`filter-pill-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">
            <div className="spinner-large">⚡</div>
            <p>Loading orders pipeline…</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order ID &amp; Date</th>
                  <th>Customer Info</th>
                  <th>Items Purchased</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-id-group">
                        <strong className="order-code-clickable" onClick={() => setSelectedOrder(order)}>
                          {order.id}
                        </strong>
                        <span className="order-timestamp">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{order.customer?.name || "Anonymous Customer"}</strong>
                        <span>{order.customer?.email || order.userEmail}</span>
                        {order.customer?.phone && <span className="customer-phone">{order.customer.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="items-summary-cell">
                        <strong>{order.items?.length || 1} item(s)</strong>
                        <span className="first-item-preview">
                          {order.items?.[0]?.name || "Product"}
                          {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong className="order-price-val">${Number(order.total || 0).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className="payment-method-pill">{order.paymentMethod || "Card"}</span>
                    </td>
                    <td>
                      <select
                        className={`admin-status-select status-select-${(order.status || "Processing").toLowerCase()}`}
                        value={order.status || "Processing"}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Processing">Processing ⏳</option>
                        <option value="Shipped">Shipped 🚚</option>
                        <option value="Delivered">Delivered ✅</option>
                        <option value="Cancelled">Cancelled ❌</option>
                      </select>
                    </td>
                    <td>
                      <div className="admin-action-btn-group">
                        <button
                          className="btn-action-view"
                          onClick={() => setSelectedOrder(order)}
                          title="View order details"
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => setDeleteConfirmId(order.id)}
                          title="Delete order"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <span className="empty-icon">📑</span>
            <p>No orders found matching the current filter.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content admin-order-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <div className="admin-modal-header">
              <div className="order-modal-title-row">
                <h3>Order Details: {selectedOrder.id}</h3>
                <span className={`status-pill status-${(selectedOrder.status || "Processing").toLowerCase()}`}>
                  {selectedOrder.status || "Processing"}
                </span>
              </div>
              <p className="order-modal-date">
                Placed on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "Recently"}
              </p>
            </div>

            <div className="order-modal-body">
              {/* Customer & Shipping Section */}
              <div className="order-modal-section">
                <h4>👤 Customer &amp; Shipping Information</h4>
                <div className="customer-info-grid">
                  <div>
                    <span className="info-label">Full Name:</span>
                    <strong>{selectedOrder.customer?.name || "Customer"}</strong>
                  </div>
                  <div>
                    <span className="info-label">Email:</span>
                    <span>{selectedOrder.customer?.email || selectedOrder.userEmail}</span>
                  </div>
                  <div>
                    <span className="info-label">Phone:</span>
                    <span>{selectedOrder.customer?.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="info-label">Payment Method:</span>
                    <span>{selectedOrder.paymentMethod || "Credit / Debit Card"}</span>
                  </div>
                  {selectedOrder.customer?.address && (
                    <div className="full-width">
                      <span className="info-label">Shipping Address:</span>
                      <span>
                        {selectedOrder.customer.address}, {selectedOrder.customer.city || ""}{" "}
                        {selectedOrder.customer.zip || ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="order-modal-section">
                <h4>📦 Purchased Items ({selectedOrder.items?.length || 0})</h4>
                <div className="order-modal-items-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="order-modal-item-row">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="order-item-thumb" />
                      )}
                      <div className="order-item-info">
                        <strong>{item.name}</strong>
                        <span className="item-qty-tag">Quantity: {item.quantity}</span>
                      </div>
                      <div className="order-item-price">
                        <strong>${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}</strong>
                        <span className="item-unit-price">${Number(item.price || 0).toFixed(2)} each</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-modal-summary-box">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${Number(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="summary-row grand-total">
                    <strong>Total Paid:</strong>
                    <strong>${Number(selectedOrder.total || 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Update Status Actions inside modal */}
              <div className="order-modal-section">
                <h4>⚡ Update Status</h4>
                <div className="modal-status-buttons">
                  {["Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      className={`btn-status-pill ${selectedOrder.status === st ? "active" : ""}`}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Remove Order Record</h3>
            <p>Are you sure you want to permanently delete order #{deleteConfirmId}?</p>
            <div className="admin-modal-actions margin-top-md">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn-admin-danger"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
