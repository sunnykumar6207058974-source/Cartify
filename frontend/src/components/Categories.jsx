function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    "All",
    "Shoes",
    "Electronics",
    "Watches",
    "Bags",
    "Camera",
    "Apparel",
    "Accessories"
  ];

  return (
    <div className="categories-pills-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-pill ${
            selectedCategory === category ? "active-category-pill" : ""
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Categories;