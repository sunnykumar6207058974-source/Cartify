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

  // Recently Viewed Products
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Shipping Address Book
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_addresses");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "addr_default_1",
              tag: "Home",
              fullName: "Sunny Kumar",
              phone: "+91 98765 43210",
              street: "Flat 402, Skyline Residency, Outer Ring Road",
              city: "Bengaluru",
              state: "Karnataka",
              zip: "560103",
              country: "India",
              isDefault: true,
            },
          ];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_user");
      const jwt = localStorage.getItem("cartify_jwt");
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

  // Admin Session State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_admin_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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
    localStorage.setItem("cartify_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem("cartify_addresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cartify_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cartify_user");
    }
  }, [user]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem("cartify_admin_session", JSON.stringify(adminUser));
    } else {
      localStorage.removeItem("cartify_admin_session");
    }
  }, [adminUser]);

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

  const updateUser = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  const logoutUser = () => {
    setUser(null);
    setAuthToken(null);
    clearToken();
    addToast("Signed out successfully.", "info");
  };

  // ─── Admin Authentication ─────────────────────────────────────────────────────
  const adminLogin = (adminData) => {
    const adminObj = {
      name: adminData.name || "Store Administrator",
      email: adminData.email || "admin@cartify.com",
      role: adminData.role || "Super Admin",
      avatar:
        adminData.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      loggedInAt: new Date().toISOString(),
    };
    setAdminUser(adminObj);
    if (adminData.token) {
      setAuthToken(adminData.token);
    }
    addToast(`Welcome back, ${adminObj.name}! ⚡ Super Admin session active.`);
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem("cartify_admin_session");
    addToast("Admin logged out securely. 🔒", "info");
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
      const existing = prevCart.find((p) => String(p.id) === String(product.id));
      if (existing) {
        return prevCart.map((p) =>
          String(p.id) === String(product.id)
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    addToast(`Added "${product.name}" to cart! 🛒`);
  };

  const removeFromCart = (id) => {
    const item = cart.find((i) => String(i.id) === String(id));
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
    if (item) {
      addToast(`Removed "${item.name}" from cart.`, "info");
    }
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: item.quantity - 1 } : item
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
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, "info");
        return prev.filter((item) => String(item.id) !== String(product.id));
      } else {
        addToast(`Added "${product.name}" to wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const moveToCartFromWishlist = (product) => {
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(product.id)));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  // ─── Recently Viewed Products ─────────────────────────────────────────────────
  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => String(p.id) !== String(product.id));
      return [product, ...filtered].slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("cartify_recently_viewed");
    addToast("Browsing history cleared.", "info");
  };

  // ─── Multi-Address Book Management ───────────────────────────────────────────
  const addAddress = (addressData) => {
    const newId = `addr_${Date.now()}`;
    const isFirst = addresses.length === 0 || addressData.isDefault;

    let updated = addresses;
    if (isFirst) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    const newAddr = {
      id: newId,
      tag: addressData.tag || "Home",
      fullName: addressData.fullName || user?.name || "Customer",
      phone: addressData.phone || user?.phone || "",
      street: addressData.street,
      city: addressData.city,
      state: addressData.state || "State",
      zip: addressData.zip,
      country: addressData.country || "India",
      isDefault: isFirst,
    };

    setAddresses([newAddr, ...updated]);
    addToast("New shipping address saved! 🏠");
    return newAddr;
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    addToast("Address updated successfully! 💾");
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    addToast("Address removed.", "info");
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    addToast("Default shipping address updated! ⭐");
  };

  const getDefaultAddress = () => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  };

  // ─── Promo Codes ──────────────────────────────────────────────────────────────
  const applyPromoCode = (code) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (cleanCode === "CARTIFY10" || cleanCode === "SAVE10") {
      setDiscountCode(cleanCode);
      setDiscountPercent(10);
      addToast("10% Discount applied! 🎉");
      return { success: true, message: "10% Discount applied!" };
    } else if (cleanCode === "CARTIFY20" || cleanCode === "SAVE20") {
      setDiscountCode(cleanCode);
      setDiscountPercent(20);
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
        // Admin Auth
        adminUser,
        adminLogin,
        adminLogout,
        isAdminAuthenticated: Boolean(adminUser),
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
        // Recently Viewed
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        // Multi-Address Book
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        // UI
        searchQuery,
        setSearchQuery,
        darkMode,
        toggleDarkMode,
        toasts,
        addToast,
        removeToast,
        // Promo
        discountCode,
        discountPercent,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;