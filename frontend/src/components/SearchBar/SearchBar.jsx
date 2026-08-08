function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search products by title, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear-btn" onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
