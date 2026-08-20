import express from "express";
import products from "../data/productsData.js";

const router = express.Router();

// GET /api/products — list products with optional filter, search, and pagination
router.get("/", (req, res) => {
  const { category, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 8));

  let filtered = [...products];

  if (category && category !== "All") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.json({
    success: true,
    count: paginated.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: paginated,
  });
});

// GET /api/products/:id — single product by ID
router.get("/:id", (req, res) => {
  const product = products.find((p) => String(p.id) === String(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    data: product,
  });
});

export default router;
