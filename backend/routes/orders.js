import express from "express";
import { getAllOrders, saveOrder, updateOrderStatus, cancelOrder, deleteOrder } from "../store/ordersStore.js";
import { authMiddleware } from "../middleware/auth.js";
import { sendSMSNotification } from "../services/smsService.js";

const router = express.Router();

// POST /api/orders/:id/cancel — cancel an existing order and notify via SMS
router.post("/:id/cancel", async (req, res, next) => {
  try {
    const { reason, phone } = req.body;
    const orderId = req.params.id;

    const cancelledOrder = cancelOrder(orderId, reason);
    if (!cancelledOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found or could not be cancelled.",
      });
    }

    // Determine customer phone number to receive confirmation SMS
    const customerPhone =
      (phone || cancelledOrder.customer?.phone || req.body.customerPhone || "").trim();

    let smsResult = { success: false, skipped: true };
    if (customerPhone) {
      const smsMessage = `Your Cartify order #${orderId} has been cancelled successfully. Reason: ${reason || "Customer request"}. Full refund of $${Number(cancelledOrder.total || 0).toFixed(2)} has been initiated.`;
      smsResult = await sendSMSNotification(customerPhone, smsMessage);
    }

    res.json({
      success: true,
      message: `Order #${orderId} has been cancelled successfully!`,
      data: cancelledOrder,
      smsNotification: smsResult,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/all — list all orders across all customers (Admin)
router.get("/all", (req, res, next) => {
  try {
    const { status, search } = req.query;
    let orders = getAllOrders();

    if (status && status !== "All") {
      orders = orders.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
          (o.customer?.email && o.customer.email.toLowerCase().includes(q)) ||
          (o.userEmail && o.userEmail.toLowerCase().includes(q))
      );
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

    const total = orders.length;
    const start = (page - 1) * limit;
    const paginated = orders.slice(start, start + limit);

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

// PATCH /api/orders/:id/status — update order status (Admin)
router.patch("/:id/status", (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updated = updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}!`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/orders/:id — delete order (Admin)
router.delete("/:id", (req, res, next) => {
  try {
    const deleted = deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found to delete.",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully!",
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
});

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
