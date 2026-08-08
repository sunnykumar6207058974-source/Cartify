import express from "express";

const router = express.Router();

// Real-time active users simulation & analytics
let totalLoginsToday = 142;
let activeSessionsCount = Math.floor(25 + Math.random() * 15);

// GET /api/analytics/live-users
router.get("/live-users", (req, res) => {
  // Fluctuate active online users realistically
  const delta = Math.floor(Math.random() * 5) - 2;
  activeSessionsCount = Math.max(12, activeSessionsCount + delta);

  res.json({
    success: true,
    activeShoppersOnline: activeSessionsCount,
    totalLoginsToday: totalLoginsToday,
    serverCapacityLimit: "10,000+ Concurrent Users",
    status: "Optimal Performance",
  });
});

export default router;
