import { useState, useEffect } from "react";
import { CartContext } from "./CartContextObject.js";

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
      return saved
        ? JSON.parse(saved)
        : {
            name: "Sunny Kumar",
            email: "sunnykumar6207058974@gmail.com",
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            isLoggedIn: true,
          };
    } catch {
      return null;
    }
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

  const loginUser = (userData) => {
    const newUser = {
      name: userData.name || "Sunny Kumar",
      email: userData.email || "sunnykumar6207058974@gmail.com",
      avatar:
        userData.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isLoggedIn: true,
    };
    setUser(newUser);
    addToast(`Signed in as ${newUser.name}! 👋`);
  };

  const logoutUser = () => {
    setUser(null);
    addToast("Signed out successfully.", "info");
  };

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

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

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
        cart,
        wishlist,
        user,
        loginUser,
        logoutUser,
        searchQuery,
        setSearchQuery,
        darkMode,
        toggleDarkMode,
        toasts,
        discountPercent,
        discountCode,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addToast,
        removeToast,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;