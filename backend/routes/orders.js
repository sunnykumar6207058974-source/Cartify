import express from "express";

const router = express.Router();

// Mock in-memory orders database
const orders = [];

// POST create a new order
router.post("/", (req, res) => {
  const { customer, items, total, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order items cannot be empty",
    });
  }

  const newOrder = {
    id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    customer: customer || {},
    items,
    total,
    paymentMethod: paymentMethod || "card",
    status: "Processing",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: newOrder,
  });
});

// GET list all orders
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export default router;
