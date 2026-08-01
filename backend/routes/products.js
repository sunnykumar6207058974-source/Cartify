import express from "express";
import products from "../data/productsData.js";

const router = express.Router();

// GET all products
router.get("/", (req, res) => {
  const { category, search } = req.query;

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

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// GET single product by ID
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
