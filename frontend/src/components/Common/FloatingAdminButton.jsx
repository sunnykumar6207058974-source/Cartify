import { Link, useLocation } from "react-router-dom";

function FloatingAdminButton() {
  const location = useLocation();

  // Hide when already inside the Admin Control Panel
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="floating-admin-launcher"
      title="Open Cartify Admin Control Panel"
      aria-label="Open Admin Control Panel"
    >
      <span className="floating-admin-icon">⚡</span>
      <span className="floating-admin-text">Admin Panel</span>
      <span className="floating-admin-badge">PRO</span>
    </Link>
  );
}

export default FloatingAdminButton;
