import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const ORDERS_FILE = join(DATA_DIR, "orders.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialise file if it doesn't exist
if (!existsSync(ORDERS_FILE)) {
  writeFileSync(ORDERS_FILE, JSON.stringify([]), "utf-8");
}

export function getAllOrders() {
  try {
    const raw = readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const orders = getAllOrders();
  orders.push(order);
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return order;
}
