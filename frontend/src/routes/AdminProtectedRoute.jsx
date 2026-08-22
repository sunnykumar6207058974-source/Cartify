import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function AdminProtectedRoute({ children }) {
  const { adminUser, isAdminAuthenticated } = useContext(CartContext);
  const location = useLocation();

  if (!isAdminAuthenticated && !adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AdminProtectedRoute;
