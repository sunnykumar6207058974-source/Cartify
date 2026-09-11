import { Navigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";

/**
 * Wraps a route so only authenticated users with a valid JWT can access it.
 * Unauthenticated visitors are redirected to /login, with the original path
 * saved in location.state so they can be sent back after a successful sign-in.
 */
function ProtectedRoute({ children }) {
  const { user } = useCart();
  const location = useLocation();

  // Allow any actively authenticated user session
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
