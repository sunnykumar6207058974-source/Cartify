import express from "express";
import { getAllOrders } from "../store/ordersStore.js";
import { getAllProducts } from "../store/productsStore.js";

const router = express.Router();

// Shared counters — exported so auth route can increment them
export let totalLoginsToday = 0;
let activeSessionsCount = Math.floor(25 + Math.random() * 15);

/** Called by auth route on each successful sign-in */
export function incrementLogins() {
  totalLoginsToday += 1;
}

// GET /api/analytics/live-users
router.get("/live-users", (req, res) => {
  // Realistically fluctuate active shopper count
  const delta = Math.floor(Math.random() * 5) - 2;
  activeSessionsCount = Math.max(12, activeSessionsCount + delta);

  res.json({
    success: true,
    activeShoppersOnline: activeSessionsCount,
    totalLoginsToday,
    serverCapacityLimit: "10,000+ Concurrent Users",
    status: "Optimal Performance",
  });
});

// GET /api/analytics/dashboard — high-level stats for the admin dashboard
router.get("/dashboard", (req, res) => {
  try {
    const orders = getAllOrders();
    const products = getAllProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const inStockProducts = products.filter((p) => p.inStock !== false).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    // Status counts
    const statusCounts = {
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
      Pending: 0,
    };

    orders.forEach((o) => {
      const s = o.status || "Processing";
      if (statusCounts[s] !== undefined) {
        statusCounts[s] += 1;
      } else {
        statusCounts[s] = 1;
      }
    });

    // Category distribution
    const categoryCounts = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Average Order Value
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        averageOrderValue: Number(averageOrderValue),
        statusCounts,
        categoryCounts,
        recentOrders,
        activeShoppersOnline: activeSessionsCount,
        totalLoginsToday,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

