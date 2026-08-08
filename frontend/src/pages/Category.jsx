import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/Common/QuickViewModal";
import useProducts from "../hooks/useProducts";
import ProductSkeleton from "../components/Skeleton/ProductSkeleton";

function Category() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categoryTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "All";

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === slug?.toLowerCase()
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content category-page container">
        <div className="page-header-banner">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <Link to="/products">Category</Link> &gt; <span>{categoryTitle}</span>
          </div>
          <h1>{categoryTitle} Collection</h1>
          <p>Handpicked selection of premium {categoryTitle.toLowerCase()} items</p>
        </div>

        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4].map((n) => (
              <ProductSkeleton key={n} />
            ))}
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="no-results-box">
            <h3>No products found in "{categoryTitle}".</h3>
            <p>Explore our full catalog to find what you are looking for.</p>
            <Link to="/products" className="btn-primary">
              View All Products 🛍️
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      <Footer />
    </div>
  );
}

export default Category;
