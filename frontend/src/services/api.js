import defaultProducts from "../data/products";

const BASE_URL = "http://localhost:5001/api";

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
      message: errData.message || "Sign-in failed. Please try again.",
    };
  } catch (err) {
    console.warn("Backend not reachable for signin:", err);
  }

  // Frontend simulation fallback if backend isn't running
  return {
    success: true,
    message: `Sign-in processed for ${email} (offline mode).`,
    user: { email, phone: phone || null, name: name || email.split("@")[0] },
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
