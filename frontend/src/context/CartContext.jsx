import { useState, useEffect } from "react";
import { CartContext } from "./CartContextObject.js";
import { clearToken } from "../services/api.js";

export { CartContext };

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_user");
      const jwt = localStorage.getItem("cartify_jwt");
      // If a stored user has no JWT the session is stale (pre-auth or expired).
      // Treat them as unauthenticated so they have to sign in again.
      if (saved && !jwt) {
        localStorage.removeItem("cartify_user");
        return null;
      }
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // JWT token — synced with localStorage key used by api.js
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("cartify_jwt") || null;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_dark_mode");
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // ─── Persistence Effects ─────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("cartify_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("cartify_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cartify_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cartify_user");
    }
  }, [user]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("cartify_jwt", authToken);
    } else {
      localStorage.removeItem("cartify_jwt");
    }
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem("cartify_dark_mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.documentElement.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
      document.documentElement.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // ─── Auth ────────────────────────────────────────────────────────────────────
  /**
   * Called after a successful sign-in.
   * Accepts the full API user object; stores token separately.
   */
  const loginUser = (userData) => {
    const { token, ...rest } = userData;
    const newUser = {
      name: rest.name || rest.email?.split("@")[0] || "User",
      email: rest.email || "",
      phone: rest.phone || null,
      avatar:
        rest.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isLoggedIn: true,
    };
    setUser(newUser);
    if (token) setAuthToken(token);
    addToast(`Signed in as ${newUser.name}! 👋`);
  };

  /** Updates mutable profile fields (name, phone) in context + localStorage */
  const updateUser = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  const logoutUser = () => {
    setUser(null);
    setAuthToken(null);
    clearToken();
    addToast("Signed out successfully.", "info");
  };

  // ─── Toasts ──────────────────────────────────────────────────────────────────
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message, type = "success") => {
    const id = String(Date.now()) + "-" + String(Math.floor(Math.random() * 1000));
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id);
      if (existing) {
        return prevCart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    addToast(`Added "${product.name}" to cart! 🛒`);
  };

  const removeFromCart = (id) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (item) {
      addToast(`Removed "${item.name}" from cart.`, "info");
    }
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast("Cart cleared.", "info");
  };

  // ─── Wishlist ─────────────────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, "info");
        return prev.filter((item) => item.id !== product.id);
      } else {
        addToast(`Added "${product.name}" to wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const moveToCartFromWishlist = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id);
      if (existing) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    addToast(`Moved "${product.name}" to cart! 🛒`);
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // ─── Promo Codes ──────────────────────────────────────────────────────────────
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "CARTIFY10" || cleanCode === "SAVE10") {
      setDiscountPercent(10);
      setDiscountCode(cleanCode);
      addToast("10% Discount applied! 🎉");
      return { success: true, message: "10% Discount applied!" };
    } else if (cleanCode === "CARTIFY20" || cleanCode === "SAVE20") {
      setDiscountPercent(20);
      setDiscountCode(cleanCode);
      addToast("20% Discount applied! 🎉");
      return { success: true, message: "20% Discount applied!" };
    } else {
      addToast("Invalid Promo Code. Try SAVE10 or SAVE20", "error");
      return { success: false, message: "Invalid promo code" };
    }
  };

  return (
    <CartContext.Provider
      value={{
        // Auth
        user,
        authToken,
        loginUser,
        updateUser,
        logoutUser,
        // Cart
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        // UI
        searchQuery,
        setSearchQuery,
        darkMode,
        toggleDarkMode,
        toasts,
        addToast,
        removeToast,
        // Promo
        discountPercent,
        discountCode,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;