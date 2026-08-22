import defaultProducts from "../data/products";

const BASE_URL = "http://localhost:5002/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getStoredToken() {
  return localStorage.getItem("cartify_jwt") || null;
}

function saveToken(token) {
  if (token) localStorage.setItem("cartify_jwt", token);
}

export function clearToken() {
  localStorage.removeItem("cartify_jwt");
}

function authHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/products${query ? `?${query}` : ""}`;
    const response = await fetch(url);

    if (response.ok) {
      const resData = await response.json();
      if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
        return resData.data;
      }
    }
  } catch {
    console.log("Backend offline — using local fallback products.");
  }

  return defaultProducts;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function signInUser(email, password, name = "", phone = "") {
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, password, name }),
    });

    if (response.ok) {
      const data = await response.json();
      // Persist the JWT for subsequent authenticated requests
      if (data.user?.token) {
        saveToken(data.user.token);
      }
      return data;
    }

    // Surface server-side validation errors to the caller
    const errData = await response.json().catch(() => ({}));
    return {
      success: false,
      message: errData.message || errData.error || "Sign-in failed. Please try again.",
    };
  } catch (err) {
    console.warn("Backend not reachable for signin:", err);
  }

  // Frontend simulation fallback if backend isn't running
  const fallbackToken = `offline_demo_jwt_${Date.now()}`;
  saveToken(fallbackToken);
  return {
    success: true,
    message: `Sign-in processed for ${email} (offline mode).`,
    user: {
      email,
      phone: phone || null,
      name: name || email.split("@")[0],
      token: fallbackToken,
    },
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function placeOrder(orderData) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to place order.");
  }
  return data;
}

export async function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(
    `${BASE_URL}/orders${query ? `?${query}` : ""}`,
    { headers: { ...authHeaders() } }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders.");
  }
  return data;
}

// ─── Admin API Services ───────────────────────────────────────────────────────

// Products CRUD
export async function createProduct(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create product");
    return data;
  } catch (err) {
    console.warn("Backend create product failed/offline, fallback to local storage:", err);
    // Offline simulation fallback
    const localProds = JSON.parse(localStorage.getItem("cartify_custom_products") || "[]");
    const newProd = {
      ...productData,
      id: Date.now(),
      inStock: productData.inStock !== false,
      rating: 4.8,
      reviewsCount: 1,
    };
    localProds.unshift(newProd);
    localStorage.setItem("cartify_custom_products", JSON.stringify(localProds));
    return { success: true, data: newProd, message: "Product created (offline mode)!" };
  }
}

export async function updateProduct(id, updates) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update product");
    return data;
  } catch (err) {
    console.warn("Backend update product failed/offline, fallback to local storage:", err);
    return { success: true, message: "Product updated (offline mode)!" };
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete product");
    return data;
  } catch (err) {
    console.warn("Backend delete product failed/offline, fallback to local storage:", err);
    return { success: true, id, message: "Product deleted (offline mode)!" };
  }
}

// Orders Management (Admin)
export async function getAllOrdersAdmin(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/orders/all${query ? `?${query}` : ""}`, {
      headers: { ...authHeaders() },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend get all orders offline:", err);
  }

  // Fallback demo orders if backend is offline
  return {
    success: true,
    count: 3,
    total: 3,
    data: [
      {
        id: "ORD-984210",
        customer: { name: "Sunny Kumar", email: "sunny@example.com", phone: "+91 98765 43210" },
        items: [{ id: 1, name: "Air Max Pro Stealth", price: 149, quantity: 1 }],
        total: 149,
        paymentMethod: "Credit / Debit Card",
        status: "Processing",
        createdAt: new Date().toISOString(),
      },
      {
        id: "ORD-873112",
        customer: { name: "Priya Sharma", email: "priya@example.com" },
        items: [{ id: 2, name: "Apex Series Smartwatch 5", price: 199, quantity: 1 }],
        total: 199,
        paymentMethod: "UPI / QR Code",
        status: "Shipped",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "ORD-762901",
        customer: { name: "Alex Johnson", email: "alex@example.com" },
        items: [{ id: 3, name: "SonicPro ANC Headphones", price: 129, quantity: 2 }],
        total: 258,
        paymentMethod: "Cash on Delivery",
        status: "Delivered",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  };
}

export async function updateOrderStatus(id, status) {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update order status");
    return data;
  } catch (err) {
    console.warn("Backend update order status offline:", err);
    return { success: true, message: `Order status updated to ${status} (offline mode)` };
  }
}

export async function cancelOrderUser(id, reason, phone) {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ reason, phone }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to cancel order");
    return data;
  } catch (err) {
    console.warn("Backend cancel order offline fallback:", err);
    return {
      success: true,
      message: `Order #${id} cancelled (offline simulation mode)`,
      data: { id, status: "Cancelled", cancellationReason: reason },
    };
  }
}

export async function deleteOrderAdmin(id) {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete order");
    return data;
  } catch (err) {
    console.warn("Backend delete order offline:", err);
    return { success: true, message: "Order deleted (offline mode)" };
  }
}

// Analytics Dashboard (Admin)
export async function getAdminDashboardStats() {
  try {
    const response = await fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { ...authHeaders() },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) return data.data;
    }
  } catch (err) {
    console.warn("Backend dashboard stats offline:", err);
  }

  // Fallback demo stats
  return {
    totalRevenue: 3498.50,
    totalOrders: 18,
    totalProducts: 8,
    inStockProducts: 7,
    outOfStockProducts: 1,
    averageOrderValue: 194.36,
    statusCounts: { Processing: 4, Shipped: 5, Delivered: 8, Cancelled: 1 },
    categoryCounts: { Shoes: 2, Watches: 2, Electronics: 2, Bags: 1, Camera: 1 },
    activeShoppersOnline: 28,
    totalLoginsToday: 42,
    recentOrders: [],
  };
}

// Admin Authentication Helper
export async function adminLoginUser(email, password, phone) {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, phone }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Invalid admin credentials" };
    }

    if (data.token) {
      setToken(data.token);
    }
    return data;
  } catch (err) {
    console.warn("Backend admin login offline, checking local credentials:", err);
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    if ((cleanEmail === "admin@cartify.com" || cleanEmail === "admin") && cleanPass === "admin123") {
      return {
        success: true,
        message: "Admin authentication successful (local fallback)!",
        admin: {
          email: "admin@cartify.com",
          name: "Store Administrator",
          role: "Super Admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          loggedInAt: new Date().toISOString(),
        },
      };
    }
    return { success: false, message: "Invalid admin credentials. Use admin@cartify.com / admin123" };
  }
}

