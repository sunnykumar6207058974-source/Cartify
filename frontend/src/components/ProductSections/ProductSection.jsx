import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import QuickViewModal from "../Common/QuickViewModal";
import { getProducts } from "../../services/api";

function ProductSection({ title, subtitle, icon, filterFn }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayProducts = filterFn ? products.filter(filterFn) : products.slice(0, 4);

  if (!loading && displayProducts.length === 0) return null;

  return (
    <section className="product-showcase-section">
      <div className="section-header">
        <h2>{icon} {title}</h2>
        <p>{subtitle}</p>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="products-grid">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}

export default ProductSection;
