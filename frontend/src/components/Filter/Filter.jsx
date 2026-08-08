function Filter({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onReset,
}) {
  const categories = ["All", "Shoes", "Electronics", "Watches", "Bags", "Camera"];
  const brands = ["All Brands", "Nike", "Apple", "Sony", "Rolex", "Panasonic", "Cartify Pro", "Apex"];
  const sizes = ["All Sizes", "US 8", "US 9", "US 10", "US 11", "S", "M", "L", "XL", "42mm", "44mm"];
  const colors = ["All Colors", "Black", "Blue", "Silver", "Gold", "Orange"];
  const ratings = [
    { label: "All Ratings", value: 0 },
    { label: "4.5★ & Above", value: 4.5 },
    { label: "4.0★ & Above", value: 4.0 },
    { label: "3.5★ & Above", value: 3.5 },
  ];

  return (
    <aside className="filter-sidebar">
      {/* Header & Reset Button */}
      <div className="filter-header">
        <h3>Filters 🎛️</h3>
        <button className="reset-filter-btn" onClick={onReset}>
          Clear All
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-radio-list">
          {categories.map((cat) => (
            <label key={cat} className="filter-radio-label">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div className="filter-group">
        <h4>Sort By</h4>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">Featured & Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated (4.5+)</option>
        </select>
      </div>

      {/* 2. Price Range Slider Filter */}
      <div className="filter-group">
        <h4>Max Price: <strong>${maxPrice}</strong></h4>
        <input
          type="range"
          min="50"
          max="1200"
          step="25"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>$50</span>
          <span>$1200</span>
        </div>
      </div>

      {/* 3. Rating Filter */}
      <div className="filter-group">
        <h4>Minimum Rating</h4>
        <div className="filter-radio-list">
          {ratings.map((r) => (
            <label key={r.value} className="filter-radio-label">
              <input
                type="radio"
                name="rating"
                checked={minRating === r.value}
                onChange={() => setMinRating(r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Brand Filter */}
      <div className="filter-group">
        <h4>Brand</h4>
        <select
          className="filter-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Size Filter */}
      <div className="filter-group">
        <h4>Size Option</h4>
        <select
          className="filter-select"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Color Filter */}
      <div className="filter-group">
        <h4>Color Variant</h4>
        <select
          className="filter-select"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 7. Availability In-Stock Toggle */}
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="filter-radio-label checkbox-style">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span>In Stock Only ⚡</span>
        </label>
      </div>

      {/* 8. Clear Filters Action */}
      <button className="btn-secondary clear-all-block-btn" onClick={onReset}>
        Reset All 8 Filters 🔄
      </button>
    </aside>
  );
}

export default Filter;
