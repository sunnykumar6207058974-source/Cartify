import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";

const CATEGORIES = ["All", "Shoes", "Watches", "Electronics", "Bags", "Camera", "Fashion"];

function AdminProducts() {
  const { addToast } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Shoes",
    price: "",
    originalPrice: "",
    badge: "Bestseller",
    description: "",
    image: "",
    inStock: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ all: "true" });
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingProductId(null);
    setFormData({
      name: "",
      category: "Shoes",
      price: "",
      originalPrice: "",
      badge: "New Arrival",
      description: "",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
      inStock: true,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingProductId(product.id);
    setFormData({
      name: product.name || "",
      category: product.category || "Shoes",
      price: product.price !== undefined ? product.price : "",
      originalPrice: product.originalPrice !== undefined ? product.originalPrice : "",
      badge: product.badge || "",
      description: product.description || "",
      image: product.image || "",
      inStock: product.inStock !== false,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast("Please enter product name", "error");
      return;
    }
    if (!formData.price || isNaN(formData.price)) {
      addToast("Please enter a valid price", "error");
      return;
    }

    setFormSubmitting(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
    };

    if (modalMode === "add") {
      const res = await createProduct(payload);
      if (res.success) {
        addToast(`Product "${formData.name}" added successfully! 🎉`);
        setShowModal(false);
        fetchProductList();
      } else {
        addToast(res.message || "Failed to create product", "error");
      }
    } else {
      const res = await updateProduct(editingProductId, payload);
      if (res.success) {
        addToast(`Product "${formData.name}" updated successfully! ✨`);
        setShowModal(false);
        fetchProductList();
      } else {
        addToast(res.message || "Failed to update product", "error");
      }
    }
    setFormSubmitting(false);
  };

  const handleDelete = async (id, name) => {
    const res = await deleteProduct(id);
    if (res.success) {
      addToast(`Product "${name}" deleted! 🗑️`, "info");
      setDeleteConfirmId(null);
      fetchProductList();
    } else {
      addToast(res.message || "Failed to delete product", "error");
    }
  };

  const handleToggleStock = async (product) => {
    const newStock = !product.inStock;
    const res = await updateProduct(product.id, { inStock: newStock });
    if (res.success) {
      addToast(`Stock for "${product.name}" set to ${newStock ? "In Stock" : "Out of Stock"}`);
      fetchProductList();
    }
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.id).includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="admin-products-container">
      {/* Top Header Actions */}
      <div className="admin-page-header">
        <div>
          <h2>Product Inventory Management</h2>
          <p className="card-subtitle">Manage catalog items, pricing, inventory stock, and product images.</p>
        </div>
        <button className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by product name, category, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>

        <div className="category-filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">
            <div className="spinner-large">⚡</div>
            <p>Loading products catalog…</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Badge / Promo</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img src={prod.image} alt={prod.name} className="admin-prod-thumb" />
                    </td>
                    <td>
                      <div className="admin-prod-title-cell">
                        <strong>{prod.name}</strong>
                        <span className="prod-id-tag">ID: #{prod.id} • ★{prod.rating || 4.8}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag-sm">{prod.category}</span>
                    </td>
                    <td>
                      <div className="price-stack">
                        <strong className="current-price">${prod.price}</strong>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="original-price">${prod.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {prod.badge ? (
                        <span className="badge-pill-sm">{prod.badge}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`stock-toggle-btn ${prod.inStock !== false ? "in-stock" : "out-stock"}`}
                        onClick={() => handleToggleStock(prod)}
                        title="Click to toggle in/out of stock"
                      >
                        {prod.inStock !== false ? "● In Stock" : "○ Out of Stock"}
                      </button>
                    </td>
                    <td>
                      <div className="admin-action-btn-group">
                        <button
                          className="btn-action-edit"
                          onClick={() => openEditModal(prod)}
                          title="Edit product"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => setDeleteConfirmId(prod.id)}
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <span className="empty-icon">📦</span>
            <p>No products match your search or filter.</p>
            <button className="btn-admin-secondary margin-top-sm" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="admin-modal-header">
              <h3>{modalMode === "add" ? "✨ Add New Product" : "✏️ Edit Product Details"}</h3>
              <p>Fill in product information, pricing, and high-resolution thumbnail.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              <div className="form-row-2col">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Air Max Pro Stealth"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Shoes">Shoes</option>
                    <option value="Watches">Watches</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Bags">Bags</option>
                    <option value="Camera">Camera</option>
                    <option value="Fashion">Fashion</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3col">
                <div className="form-group">
                  <label>Sale Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="149"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="189"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Badge / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, 20% OFF"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {formData.image && (
                <div className="image-preview-box">
                  <span>Image Preview:</span>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="modal-preview-thumb"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe key product features, dimensions, material..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  Mark item as In Stock
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Saving…" : modalMode === "add" ? "Create Product 🚀" : "Save Changes ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Confirm Product Deletion</h3>
            <p>Are you sure you want to remove this product? This action cannot be undone.</p>
            <div className="admin-modal-actions margin-top-md">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn-admin-danger"
                onClick={() => {
                  const prod = products.find((p) => p.id === deleteConfirmId);
                  handleDelete(deleteConfirmId, prod?.name || "Product");
                }}
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
