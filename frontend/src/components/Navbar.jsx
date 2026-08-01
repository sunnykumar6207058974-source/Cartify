import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const {
    cart,
    wishlist,
    user,
    logoutUser,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
  } = useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMobileOpen(false);

    const scrollToFeatured = () => {
      const section = document.getElementById("featured-products");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname === "/") {
      scrollToFeatured();
    } else {
      navigate("/");
      setTimeout(scrollToFeatured, 150);
    }
  };

  const handleExploreClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);

    const scrollToFeatured = () => {
      const section = document.getElementById("featured-products");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname === "/") {
      scrollToFeatured();
    } else {
      navigate("/");
      setTimeout(scrollToFeatured, 150);
    }
  };

  return (
    <header className="navbar-header flipkart-style-header">
      <div className="navbar-container">
        {/* Left: Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">Cart<span>ify</span></span>
        </Link>

        {/* Center: Flipkart-style Prominent Search Bar */}
        <form onSubmit={handleSearchSubmit} className="header-search-bar">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
          <button type="submit" className="header-search-btn" title="Search">
            🔍
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <a
            href="#featured-products"
            className={location.pathname.startsWith("/product") ? "active" : ""}
            onClick={handleExploreClick}
          >
            Explore
          </a>
          <Link
            to="/cart"
            className={location.pathname === "/cart" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            Cart
          </Link>
          <Link
            to="/checkout"
            className={location.pathname === "/checkout" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            Checkout
          </Link>
        </nav>

        {/* Right Actions: Account Dropdown, Cart, Dark Mode */}
        <div className="navbar-actions">
          {/* Flipkart-Style Account Dropdown */}
          {user && user.isLoggedIn ? (
            <div
              className="account-menu-wrapper"
              onMouseEnter={() => setAccountDropdownOpen(true)}
              onMouseLeave={() => setAccountDropdownOpen(false)}
            >
              <button
                className="account-trigger-btn"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              >
                <img src={user.avatar} alt="User Avatar" className="nav-user-avatar" />
                <span className="nav-user-name">{user.name.split(" ")[0]}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {/* Flipkart Dropdown Menu */}
              {accountDropdownOpen && (
                <div className="flipkart-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/checkout"
                    className="dropdown-item"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">📦</span> My Orders & Purchases
                  </Link>
                  <Link
                    to="/cart"
                    className="dropdown-item"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">❤️</span> Wishlist ({wishlistCount})
                  </Link>
                  <div className="dropdown-item">
                    <span className="item-icon">🎁</span> Rewards (Coupon: SAVE10)
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout-item"
                    onClick={() => {
                      logoutUser();
                      setAccountDropdownOpen(false);
                    }}
                  >
                    <span className="item-icon">🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-nav-btn">
              Sign In
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Cart Nav Button */}
          <Link to="/cart" className="cart-nav-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {totalCartCount > 0 && (
              <span className="cart-badge-count">{totalCartCount}</span>
            )}
          </Link>

          {/* Mobile Navigation Hamburger */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;