import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderCard from "../components/Orders/OrderCard";
import { CartContext } from "../context/CartContext";
import { getOrders } from "../services/api";
import { formatCurrency } from "../utils/formatters";

function Orders() {
  const { user } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrders({ page, limit: 10 });
        setOrders(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [page]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content orders-page container">
        <div className="page-header-banner">
          <h1>My Purchase &amp; Order History 📦</h1>
          <p>Track live dispatches, review past orders, and manage invoices for {user?.name || "your account"}.</p>
        </div>

        {loading ? (
          <div className="orders-loading">
            <div className="loader-spinner" />
            <p>Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="error-box">
            <p>⚠️ {error}</p>
            <button className="btn-primary" onClick={() => setPage(1)}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-cart-icon">📦</div>
            <h3>No orders yet</h3>
            <p>You haven&apos;t placed any orders. Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-primary">
              Start Shopping 🛍️
            </Link>
          </div>
        ) : (
          <>
            <div className="orders-list-layout">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
