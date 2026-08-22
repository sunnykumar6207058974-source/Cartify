import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import defaultProducts from "../data/productsData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const PRODUCTS_FILE = join(DATA_DIR, "products.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialise file if it doesn't exist
if (!existsSync(PRODUCTS_FILE)) {
  writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), "utf-8");
}

export function getAllProducts() {
  try {
    const raw = readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function getProductById(id) {
  const products = getAllProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

export function createProduct(productData) {
  const products = getAllProducts();
  const nextId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  const newProduct = {
    id: nextId,
    name: productData.name || "Untitled Product",
    category: productData.category || "General",
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
    rating: Number(productData.rating) || 4.8,
    reviewsCount: Number(productData.reviewsCount) || 1,
    discount: productData.discount || (productData.originalPrice && productData.price < productData.originalPrice ? `${Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF` : null),
    badge: productData.badge || "New Arrival",
    description: productData.description || "",
    image: productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80",
    inStock: productData.inStock !== false,
    createdAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  return newProduct;
}

export function updateProduct(id, updates) {
  const products = getAllProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

  const current = products[index];
  const price = updates.price !== undefined ? Number(updates.price) : current.price;
  const originalPrice = updates.originalPrice !== undefined ? Number(updates.originalPrice) : current.originalPrice;

  let calculatedDiscount = updates.discount !== undefined ? updates.discount : current.discount;
  if (!updates.discount && originalPrice > price) {
    calculatedDiscount = `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
  }

  const updatedProduct = {
    ...current,
    ...updates,
    id: current.id, // preserve ID
    price,
    originalPrice,
    discount: calculatedDiscount,
    inStock: updates.inStock !== undefined ? Boolean(updates.inStock) : current.inStock,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  return updatedProduct;
}

export function deleteProduct(id) {
  const products = getAllProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return false;

  products.splice(index, 1);
  writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  return true;
}
