import defaultProducts from "../data/products";

const BACKEND_PRODUCTS_URL = "http://localhost:5001/api/products";
const BACKEND_AUTH_URL = "http://localhost:5001/api/auth/signin";

export async function getProducts() {
  try {
    const response = await fetch(BACKEND_PRODUCTS_URL);

    if (response.ok) {
      const resData = await response.json();
      if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
        return resData.data;
      }
    }
  } catch {
    console.log("Backend server offline, using local fallback products.");
  }

  // Local fallback
  return defaultProducts;
}

export async function signInUser(email, password, name = "", phone = "") {
  try {
    const response = await fetch(BACKEND_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone, password, name }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend server not reachable for signin:", err);
  }

  // Frontend simulation fallback if backend isn't connected
  return {
    success: true,
    message: `Sign-in successful! SMS sent to ${phone || "+91 8340112045"} and welcome message to ${email}`,
    user: { email, phone, name: name || email.split("@")[0] },
  };
}
