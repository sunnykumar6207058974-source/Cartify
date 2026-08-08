import { useNavigate } from "react-router-dom";

function CategorySection({ onSelectCategory }) {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Shoes",
      count: "12 Products",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Electronics",
      count: "24 Products",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Watches",
      count: "18 Products",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Bags",
      count: "15 Products",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Camera",
      count: "9 Products",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else {
      navigate(`/category/${categoryName.toLowerCase()}`);
    }
  };

  return (
    <section className="category-section-container">
      <div className="section-header">
        <h2>Shop by Category</h2>
        <p>Curated premium items categorized for effortless browsing</p>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => (
          <div
            className="category-card-item"
            key={index}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="category-img-container">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="category-overlay"></div>
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <span>{category.count}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
