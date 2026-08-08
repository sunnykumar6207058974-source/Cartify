import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function MobileBottomNav() {
  const { cart, wishlist, user } = useContext(CartContext);
  const location = useLocation();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      path: "/",
    },
    {
      id: "categories",
      label: "Categories",
      icon: "🗂️",
      path: "/products",
    },
    {
      id: "orders",
      label: "My Orders",
      icon: "📦",
      path: "/orders",
    },
    {
      id: "cart",
      label: "Cart",
      icon: "🛒",
      path: "/cart",
      badge: totalCartCount > 0 ? totalCartCount : null,
    },
    {
      id: "account",
      label: "Account",
      icon: "👤",
      path: user && user.isLoggedIn ? "/profile" : "/login",
    },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <div className="bottom-nav-icon-wrap">
              <span className="bottom-nav-icon">{item.icon}</span>
              {item.badge && (
                <span className="bottom-nav-badge">{item.badge}</span>
              )}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
