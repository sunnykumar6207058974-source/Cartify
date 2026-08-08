import { useState, useEffect } from "react";
import { getProducts } from "../services/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load products");
          setLoading(false);
        }
      }
    }
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

export default useProducts;
