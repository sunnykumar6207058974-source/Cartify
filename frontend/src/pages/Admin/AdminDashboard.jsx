import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getAdminDashboardStats, updateOrderStatus } from "../../services/api";

function AdminDashboard() {
  const { addToast } = useContext(CartContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    const data = await getAdminDashboardStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    setUpdatingOrderId(null);
    if (res.success) {
      addToast(`Order ${orderId} updated to ${newStatus}! ✨`);
      fetchStats();
    } else {
      addToast(res.message || "Failed to update status", "error");
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-loading-state">
        <div className="spinner-large">⚡</div>
        <p>Loading Cartify Admin Dashboard…</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    inStockProducts = 0,
    averageOrderValue = 0,
    statusCounts = {},
    categoryCounts = {},
    recentOrders = [],
    activeShoppersOnline = 24,
  } = stats || {};

  return (
    <div className="admin-dashboard-container">
      {/* Top Banner / Store Health */}
      <div className="admin-hero-banner">
        <div className="admin-hero-text">
          <h1>Welcome to Cartify Control Center</h1>
          <p>
            Monitor store revenue, fulfill incoming orders, and manage your product catalog in real-time.
          </p>
        </div>
        <div className="admin-hero-actions">
          <Link to="/admin/products" className="btn-admin-primary">
            <span>+ Add Product</span>
          </Link>
          <Link to="/admin/orders" className="btn-admin-secondary">
            <span>View All Orders ({totalOrders})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card revenue-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL REVENUE</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="kpi-footer text-success">
            <span>↑ 14.8%</span> from previous period
          </div>
        </div>

        <div className="admin-kpi-card orders-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL ORDERS</span>
            <span className="kpi-icon">📑</span>
          </div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-footer text-primary">
            <span>{statusCounts.Processing || 0}</span> orders currently processing
          </div>
        </div>

        <div className="admin-kpi-card products-card">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE PRODUCTS</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-footer text-info">
            <span>{inStockProducts} in stock</span> • {totalProducts - inStockProducts} out of stock
          </div>
        </div>

        <div className="admin-kpi-card shoppers-card">
          <div className="kpi-header">
            <span className="kpi-label">LIVE SHOPPERS</span>
            <span className="kpi-icon">⚡</span>
          </div>
          <div className="kpi-value">{activeShoppersOnline}</div>
          <div className="kpi-footer text-success">
            <span className="pulse-dot"></span> Active sessions online now
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="admin-analytics-row">
        {/* Order Status Distribution */}
        <div className="admin-card order-status-distribution-card">
          <div className="admin-card-header">
            <h3>Fulfillment Pipeline</h3>
            <span className="badge-pill">Real-time</span>
          </div>
          <div className="status-bars-container">
            {["Processing", "Shipped", "Delivered", "Cancelled"].map((st) => {
              const count = statusCounts[st] || 0;
              const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
              return (
                <div key={st} className="status-bar-item">
                  <div className="status-bar-labels">
                    <span className={`status-tag status-${st.toLowerCase()}`}>{st}</span>
                    <span className="status-bar-count">
                      {count} orders ({pct}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill fill-${st.toLowerCase()}`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="admin-card category-share-card">
          <div className="admin-card-header">
            <h3>Inventory by Category</h3>
            <Link to="/admin/products" className="card-header-link">Manage →</Link>
          </div>
          <div className="category-tags-cloud">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="category-metric-pill">
                <span className="cat-name">{cat}</span>
                <span className="cat-badge">{count} items</span>
              </div>
            ))}
          </div>
          <div className="aov-banner">
            <span className="aov-title">Average Order Value:</span>
            <span className="aov-amount">${averageOrderValue}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Quick-Table */}
      <div className="admin-card recent-orders-card">
        <div className="admin-card-header">
          <div>
            <h3>Recent Customer Orders</h3>
            <p className="card-subtitle">Quickly change order status or view customer information.</p>
          </div>
          <Link to="/admin/orders" className="btn-admin-sm">
            View All Orders →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id-code">{order.id}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{order.customer?.name || "Customer"}</strong>
                        <span>{order.customer?.email || order.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className="order-items-count">
                        {order.items?.length || 1} item(s)
                      </span>
                    </td>
                    <td>
                      <strong className="order-price-val">${Number(order.total || 0).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className="payment-method-pill">{order.paymentMethod || "Card"}</span>
                    </td>
                    <td>
                      <span className={`status-pill status-${(order.status || "Processing").toLowerCase()}`}>
                        {order.status || "Processing"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={order.status || "Processing"}
                        disabled={updatingOrderId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <span className="empty-icon">📦</span>
            <p>No orders placed yet. Place an order on checkout to see it live here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
