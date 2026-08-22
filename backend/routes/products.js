import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/productsStore.js";

const router = express.Router();

// GET /api/products — list products with optional filter, search, and pagination
router.get("/", (req, res) => {
  const { category, search, all } = req.query;
  const products = getAllProducts();

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
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // If all=true, return all items without pagination (useful for admin / catalog lists)
  if (all === "true") {
    return res.json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      page: 1,
      totalPages: 1,
      data: filtered,
    });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 8));

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
  const product = getProductById(req.params.id);

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

// POST /api/products — create new product (Admin)
router.post("/", (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Product name is required." });
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Valid product price is required." });
    }

    const created = createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id — update product (Admin)
router.put("/:id", (req, res) => {
  try {
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found to update." });
    }

    res.json({
      success: true,
      message: "Product updated successfully!",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id — delete product (Admin)
router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found to delete." });
    }

    res.json({
      success: true,
      message: "Product deleted successfully!",
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

