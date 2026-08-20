import { Navigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";

/**
 * Wraps a route so only authenticated users with a valid JWT can access it.
 * Unauthenticated visitors are redirected to /login, with the original path
 * saved in location.state so they can be sent back after a successful sign-in.
 */
function ProtectedRoute({ children }) {
  const { user, authToken } = useCart();
  const location = useLocation();

  // Require BOTH a logged-in user AND a JWT token.
  // This catches stale sessions (user in localStorage but no JWT).
  if (!user?.isLoggedIn || !authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
