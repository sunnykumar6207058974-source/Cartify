import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function FlashSale({ product }) {
  const { addToCart } = useContext(CartContext);

  // Live countdown timer state (5 hours, 42 minutes, 18 seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProduct = product || {
    id: 3,
    name: "SonicPro ANC Headphones",
    category: "Electronics",
    price: 129,
    originalPrice: 179,
    rating: 4.9,
    discount: "28% OFF",
    badge: "Flash Deal",
    description: "Active Noise Cancellation studio wireless headphones with deep bass and 40h playtime.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
  };

  const formatDigit = (num) => String(num).padStart(2, "0");

  return (
    <section className="flash-sale-banner">
      <div className="flash-sale-container container">
        <div className="flash-sale-content">
          <div className="flash-badge">⚡ LIMITED TIME FLASH SALE</div>
          <h2>Special Deal Of The Day</h2>
          <p>Get up to 30% discount on top-rated studio audio gear. Offer ends soon!</p>

          {/* Countdown Timer Boxes */}
          <div className="countdown-timer-wrap">
            <div className="timer-box">
              <span className="timer-number">{formatDigit(timeLeft.hours)}</span>
              <span className="timer-label">Hours</span>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-box">
              <span className="timer-number">{formatDigit(timeLeft.minutes)}</span>
              <span className="timer-label">Mins</span>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-box">
              <span className="timer-number">{formatDigit(timeLeft.seconds)}</span>
              <span className="timer-label">Secs</span>
            </div>
          </div>

          {/* Stock Progress Bar */}
          <div className="stock-progress-wrap">
            <div className="stock-labels">
              <span>Stock Claimed: <strong>84%</strong></span>
              <span>Only 12 Items Left!</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "84%" }}></div>
            </div>
          </div>

          <div className="flash-sale-actions">
            <button
              className="btn-primary flash-buy-btn"
              onClick={() => addToCart(flashProduct)}
            >
              Grab Deal Now - ${flashProduct.price} ⚡
            </button>
            <Link to={`/product/${flashProduct.id}`} className="btn-secondary">
              View Specs →
            </Link>
          </div>
        </div>

        <div className="flash-sale-image-col">
          <div className="flash-img-card">
            <span className="flash-discount-tag">{flashProduct.discount}</span>
            <img src={flashProduct.image} alt={flashProduct.name} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashSale;
