import "dotenv/config";
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import authRouter from "./routes/auth.js";
import analyticsRouter from "./routes/analytics.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);

// Health Check Route
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

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ Cartify Backend Server running at http://localhost:${PORT}`);
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && process.env.GMAIL_PASS !== "abcd efgh ijkl mnop") {
    console.log(`📧 Gmail live delivery service initialized for: ${process.env.GMAIL_USER}`);
  } else {
    console.log(`💡 To receive live emails on your phone's Gmail app, add GMAIL_USER & GMAIL_PASS to backend/.env`);
  }
});
