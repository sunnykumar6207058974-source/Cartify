import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

export default function RecentlyViewed({ currentProductId = null, title = "Recently Viewed Products" }) {
  const { recentlyViewed, clearRecentlyViewed, addToCart } = useContext(CartContext);

  // Filter out current product if on ProductDetails page
  const displayItems = recentlyViewed.filter(
    (p) => !currentProductId || String(p.id) !== String(currentProductId)
  );

  if (displayItems.length === 0) return null;

  return (
    <section className="recently-viewed-section margin-y-lg container">
      <div className="section-header-flex">
        <div>
          <h2 className="section-heading">🕒 {title}</h2>
          <p className="section-subheading">Based on your recent browsing history</p>
        </div>
        <button
          className="btn-secondary btn-sm"
          onClick={clearRecentlyViewed}
          title="Clear browsing history"
        >
          Clear History 🗑️
        </button>
      </div>

      <div className="recently-viewed-carousel">
        {displayItems.map((item) => (
          <div key={item.id} className="recent-item-card">
            <Link to={`/product/${item.id}`} className="recent-img-wrap">
              <img src={item.image} alt={item.name} loading="lazy" />
            </Link>
            <div className="recent-info">
              <span className="recent-category">{item.category}</span>
              <h4 className="recent-title">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
              </h4>
              <div className="recent-price-row">
                <span className="recent-price">${item.price}</span>
                <button
                  className="recent-add-btn"
                  onClick={() => addToCart(item)}
                  title="Add to cart"
                >
                  🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
