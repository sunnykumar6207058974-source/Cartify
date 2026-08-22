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
  orders.unshift(order);
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return order;
}

export function updateOrderStatus(orderId, status) {
  const orders = getAllOrders();
  const index = orders.findIndex((o) => String(o.id) === String(orderId));
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[index];
}

export function cancelOrder(orderId, reason) {
  const orders = getAllOrders();
  const index = orders.findIndex((o) => String(o.id) === String(orderId));
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status: "Cancelled",
    cancellationReason: reason || "Customer requested cancellation",
    cancelledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[index];
}

export function deleteOrder(orderId) {
  const orders = getAllOrders();
  const index = orders.findIndex((o) => String(o.id) === String(orderId));
  if (index === -1) return false;

  orders.splice(index, 1);
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return true;
}
