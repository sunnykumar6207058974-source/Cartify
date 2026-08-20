import express from "express";
import { getAllOrders, saveOrder } from "../store/ordersStore.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — create a new order (auth required)
router.post("/", authMiddleware, (req, res, next) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;

    // --- Input Validation ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    for (const item of items) {
      if (!item.id || !item.name || typeof item.quantity !== "number" || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a valid id, name, and positive quantity.",
        });
      }
    }

    if (typeof total !== "number" || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total must be a positive number.",
      });
    }

    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      customer: customer || { email: req.user.email, name: req.user.name },
      userEmail: req.user.email,
      items,
      total,
      paymentMethod: paymentMethod || "card",
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    const saved = saveOrder(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — list orders for the signed-in user (auth required)
router.get("/", authMiddleware, (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Return only orders belonging to the current user
    const allOrders = getAllOrders();
    const userOrders = allOrders.filter(
      (o) => o.userEmail === req.user.email
    );

    const total = userOrders.length;
    const start = (page - 1) * limit;
    const paginated = userOrders.slice(start, start + limit);

    res.json({
      success: true,
      count: paginated.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
