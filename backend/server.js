import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import authRouter from "./routes/auth.js";
import analyticsRouter from "./routes/analytics.js";

const app = express();
const PORT = process.env.PORT || 5002;

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(origin) ||
        origin.includes("cartify") ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Rate Limiting ───────────────────────────────────────────────────────────
// Protect auth endpoints: max 20 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many sign-in attempts from this IP. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/analytics", analyticsRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Cartify E-Commerce API Server!",
    status: "Healthy",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      auth: "/api/auth/signin",
      analytics: "/api/analytics/live-users",
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Catches any error passed via next(err) from route handlers
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`⚡ Cartify Backend running at http://localhost:${PORT}`);
  console.log(`🔒 CORS enabled for localhost / 127.0.0.1 development`);
  if (
    process.env.GMAIL_USER &&
    process.env.GMAIL_PASS &&
    process.env.GMAIL_PASS !== "abcd efgh ijkl mnop"
  ) {
    console.log(`📧 Gmail live delivery configured for: ${process.env.GMAIL_USER}`);
  } else {
    console.log(`💡 Add a real GMAIL_PASS to backend/.env for live email delivery.`);
  }
});
