import { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, toggleWishlist, moveToCartFromWishlist } = useContext(CartContext);

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      moveToCartFromWishlist(product);
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content wishlist-page container">
        <div className="page-header-banner">
          <h1>My Saved Wishlist ❤️</h1>
          <p>Keep track of products you love and move them to cart anytime</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-cart-card">
            <div className="empty-cart-icon">❤️</div>
            <h3>Your Wishlist is Empty</h3>
            <p>You haven't saved any items yet. Browse products and tap 🤍 on any item to save it here!</p>
            <Link to="/products" className="btn-primary">
              Explore Products 🛍️
            </Link>
          </div>
        ) : (
          <div className="wishlist-container-wrap">
            <div className="wishlist-header-bar">
              <span>Saved Items (<strong>{wishlist.length}</strong>)</span>
              <div className="wishlist-header-actions">
                <button className="btn-primary btn-sm" onClick={handleMoveAllToCart}>
                  Move All to Cart 🛒
                </button>
              </div>
            </div>

            <div className="wishlist-grid-list">
              {wishlist.map((product) => (
                <div key={product.id} className="wishlist-card-item">
                  <div className="wishlist-card-img-wrap">
                    {product.discount && (
                      <span className="badge-tag discount-tag">{product.discount}</span>
                    )}
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                    </Link>
                  </div>

                  <div className="wishlist-card-body">
                    <span className="wishlist-category">{product.category}</span>
                    <h3 className="wishlist-title">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="wishlist-price-row">
                      <span className="current-price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="old-price">${product.originalPrice}</span>
                      )}
                    </div>

                    <div className="wishlist-card-actions">
                      {/* Move to Cart Action */}
                      <button
                        className="btn-primary move-to-cart-btn"
                        onClick={() => moveToCartFromWishlist(product)}
                      >
                        Move to Cart 🛒
                      </button>

                      {/* Remove Item Action */}
                      <button
                        className="btn-danger-outline remove-wishlist-btn"
                        onClick={() => toggleWishlist(product)}
                        title="Remove from Wishlist"
                      >
                        Remove 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Wishlist;
