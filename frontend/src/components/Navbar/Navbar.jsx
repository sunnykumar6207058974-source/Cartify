import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import defaultProducts from "../../data/products";
import { getProducts } from "../../services/api";
import MobileBottomNav from "./MobileBottomNav";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productsList, setProductsList] = useState(defaultProducts);

  // Recent Searches State (persisted in localStorage)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_recent_searches");
      return saved ? JSON.parse(saved) : ["Air Max", "Headphones", "Watches", "Camera"];
    } catch {
      return ["Air Max", "Headphones", "Watches", "Camera"];
    }
  });

  const searchRef = useRef(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    try {
      localStorage.setItem("cartify_recent_searches", JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  // Load products for live search suggestions
  useEffect(() => {
    async function loadSearchProducts() {
      try {
        const fetched = await getProducts();
        if (fetched && fetched.length > 0) {
          setProductsList(fetched);
        }
      } catch {
        setProductsList(defaultProducts);
      }
    }
    loadSearchProducts();
  }, []);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search suggestions by Product Name & Category
  const searchSuggestions = searchQuery.trim()
    ? productsList
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const addRecentSearch = (term) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      return [cleanTerm, ...filtered].slice(0, 6);
    });
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== termToRemove));
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleSelectRecent = (term) => {
    setSearchQuery(term);
    addRecentSearch(term);
    setShowSuggestions(false);
    setMobileOpen(false);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleSelectSuggestion = (product) => {
    addRecentSearch(product.name);
    setShowSuggestions(false);
    setMobileOpen(false);
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <header className={`navbar-header flipkart-style-header ${isScrolled ? "sticky-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <div className="logo-icon">⚡</div>
          <span className="logo-text">Cart<span>ify</span></span>
        </Link>

        {/* Top Search Bar */}
        <div className="header-search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="header-search-bar">
            <input
              type="text"
              placeholder="Search for products, brands and categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="header-search-clear"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
              >
                ✕
              </button>
            )}
            <button type="submit" className="header-search-btn" title="Search">
              🔍
            </button>
          </form>

          {/* Suggestions & Recent Searches Dropdown */}
          {showSuggestions && (
            <div className="search-suggestions-dropdown">
              {searchQuery.trim().length > 0 ? (
                searchSuggestions.length > 0 ? (
                  <>
                    <div className="suggestions-header">Matching Products & Categories</div>
                    <div className="suggestions-list">
                      {searchSuggestions.map((item) => (
                        <div
                          key={item.id}
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          <img src={item.image} alt={item.name} className="suggestion-img" />
                          <div className="suggestion-info">
                            <span className="suggestion-name">{item.name}</span>
                            <span className="suggestion-category">{item.category} • ★{item.rating || 4.8}</span>
                          </div>
                          <span className="suggestion-price">${item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="suggestions-footer" onClick={handleSearchSubmit}>
                      Press <strong>Enter</strong> to search all results for "{searchQuery}" →
                    </div>
                  </>
                ) : (
                  <div className="no-suggestions">
                    No matching products found for "{searchQuery}". Press Enter to view search options.
                  </div>
                )
              ) : (
                recentSearches.length > 0 && (
                  <div className="recent-searches-box">
                    <div className="recent-header">
                      <span>🕒 Recent Searches</span>
                      <button className="clear-recent-btn" onClick={clearAllRecent}>Clear History</button>
                    </div>
                    <div className="recent-items-list">
                      {recentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          className="recent-search-chip"
                          onClick={() => handleSelectRecent(term)}
                        >
                          <span className="search-history-icon">🔍</span>
                          <span className="chip-text">{term}</span>
                          <button
                            className="chip-remove-btn"
                            onClick={(e) => removeRecentSearch(e, term)}
                            title="Remove search"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Top Header Navigation Links: Home, Categories, Orders, Wishlist */}
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            to="/products"
            className={location.pathname === "/products" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            🗂️ Categories
          </Link>
          <Link
            to="/orders"
            className={location.pathname === "/orders" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            📦 My Orders
          </Link>
          <Link
            to="/wishlist"
            className={`wishlist-nav-link ${location.pathname === "/wishlist" ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            ❤️ Wishlist
            {wishlistCount > 0 && <span className="nav-badge-inline">{wishlistCount}</span>}
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            ℹ️ About
          </Link>
          <Link
            to="/admin"
            className={`admin-drawer-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            ⚡ Admin Panel
          </Link>
        </nav>

        {/* Right Top Actions: Profile Account, Theme Toggle, Cart */}
        <div className="navbar-actions">
          {/* Dedicated Admin Panel Quick Button (Always Visible) */}
          <Link to="/admin" className="admin-nav-distinct-btn" title="Open Admin Control Panel">
            <span className="admin-btn-icon">⚡</span>
            <span className="admin-btn-text">Admin Panel</span>
          </Link>

          {/* Account Profile Menu */}
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

              {accountDropdownOpen && (
                <div className="flipkart-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/admin"
                    className="dropdown-item admin-dropdown-highlight"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">⚡</span> Admin Control Panel
                  </Link>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">👤</span> My Profile / Account
                  </Link>
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">📦</span> My Orders & History
                  </Link>
                  <Link
                    to="/wishlist"
                    className="dropdown-item"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="item-icon">❤️</span> My Wishlist ({wishlistCount})
                  </Link>
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
            <div className="guest-nav-actions">
              <Link to="/login" className="login-nav-btn">
                👤 Sign In
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-nav-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {totalCartCount > 0 && (
              <span className="cart-badge-count animate-bounce-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>

    {/* Flipkart / Amazon App style Mobile Bottom Navigation Bar (Fixed at absolute bottom of viewport) */}
    <MobileBottomNav />
    </>
  );
}

export default Navbar;


