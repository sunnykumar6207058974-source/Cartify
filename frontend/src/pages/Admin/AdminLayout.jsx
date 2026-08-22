import { useState, useContext } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function AdminLayout() {
  const { adminUser, adminLogout, darkMode, toggleDarkMode } = useContext(CartContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "📑" },
    { path: "/admin/analytics", label: "Analytics", icon: "📈" },
  ];

  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Overview & Metrics";
    if (location.pathname.startsWith("/admin/products")) return "Product Inventory & Catalog";
    if (location.pathname.startsWith("/admin/orders")) return "Customer Orders & Fulfillment";
    if (location.pathname.startsWith("/admin/analytics")) return "Store Analytics & Financials";
    return "Admin Portal";
  };

  const handleAdminSignOut = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className={`admin-root ${darkMode ? "dark-theme" : ""}`}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">
            <div className="admin-logo-icon">⚡</div>
            <div className="admin-brand-text">
              <span>Cart<span>ify</span></span>
              <span className="admin-badge-pill">ADMIN</span>
            </div>
          </Link>
          <button className="admin-sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <div className="admin-nav-section-title">MAIN NAVIGATION</div>
        <nav className="admin-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-nav-section-title">STORE ACCESS</div>
        <nav className="admin-nav-links">
          <Link to="/" className="admin-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="admin-nav-icon">🏪</span>
            <span className="admin-nav-label">View Live Store</span>
          </Link>
          <Link to="/profile" className="admin-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="admin-nav-icon">👤</span>
            <span className="admin-nav-label">My Account</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Admin Avatar"
              className="admin-avatar-sm"
            />
            <div className="admin-user-info">
              <span className="admin-user-name">{adminUser?.name || "Store Administrator"}</span>
              <span className="admin-user-role">{adminUser?.role || "Super Admin"}</span>
            </div>
          </div>
          <button
            className="admin-sidebar-logout-btn"
            onClick={handleAdminSignOut}
            title="Log out of Super Admin session"
          >
            <span>🚪</span> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-main-wrapper">
        {/* Admin Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar"
            >
              ☰
            </button>
            <div className="admin-topbar-title">
              <h2>{getPageTitle()}</h2>
              <span className="admin-live-pulse">
                <span className="pulse-dot"></span> System Live &amp; Healthy
              </span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              className="theme-toggle-btn admin-theme-btn"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <Link to="/" className="admin-store-link-btn" title="View Customer Storefront">
              <span>View Store ↗</span>
            </Link>
            <button
              className="admin-topbar-logout-btn"
              onClick={handleAdminSignOut}
              title="Sign Out from Admin Control Panel"
            >
              <span>🚪 Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
