import jwt from "jsonwebtoken";

/**
 * Express middleware that verifies a JWT bearer token.
 * Attaches `req.user` on success; sends 401 on failure.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised — no token provided. Please sign in first.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "cartify_super_secret_jwt_key_change_me_in_production";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please sign in again."
        : "Invalid token. Please sign in again.";

    return res.status(401).json({ success: false, message });
  }
}
