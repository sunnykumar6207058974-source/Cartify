import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileCard from "../components/Profile/ProfileCard";
import { CartContext } from "../context/CartContext";
import { getOrders } from "../services/api";

function Profile() {
  const { user, wishlist, updateUser, logoutUser, addToast } = useContext(CartContext);
  const navigate = useNavigate();

  // Pre-fill from context user, no hardcoded PII fallbacks
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");

  // Address section — starts empty, user fills in
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState("Home");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressZip, setNewAddressZip] = useState("");

  // Real orders preview
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders({ page: 1, limit: 3 });
        setRecentOrders(data.data || []);
      } catch {
        // Silently fail — profile still works without orders
      } finally {
        setOrdersLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name: profileName.trim(), phone: profilePhone.trim() });
    addToast("Profile details updated successfully! 💾");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddressStreet && newAddressCity) {
      const newEntry = {
        id: Date.now(),
        tag: newAddressTag,
        street: newAddressStreet,
        city: newAddressCity,
        state: "State",
        zip: newAddressZip || "000000",
        country: "India",
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newEntry]);
      setShowAddAddressModal(false);
      setNewAddressStreet("");
      setNewAddressCity("");
      setNewAddressZip("");
      addToast("New shipping address added! 🏠");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const statusLabel = (status) => {
    const map = {
      Processing: "🔄 Processing",
      Shipped: "📦 Shipped",
      "In-Transit": "🚚 In-Transit",
      Delivered: "✓ Delivered",
      Cancelled: "✕ Cancelled",
    };
    return map[status] || status;
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content profile-page container">
        <div className="page-header-banner">
          <h1>Account Profile &amp; Settings 👤</h1>
          <p>Manage your personal details, shipping addresses, recent orders &amp; saved items.</p>
        </div>

        <div className="profile-grid">
          {/* Left Column: User Profile Card */}
          <ProfileCard user={user} />

          {/* Right Column */}
          <div className="profile-content-column">
            {/* 1. Personal Details */}
            <div className="profile-settings-card">
              <h3>1. Personal Details</h3>
              <form className="profile-form" onSubmit={handleSaveProfile}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={user?.email || ""} readOnly />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Save Profile Changes 💾
                </button>
              </form>
            </div>

            {/* 2. Saved Addresses */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <h3>2. Saved Shipping Addresses</h3>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setShowAddAddressModal(true)}
                >
                  + Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="wishlist-overview-text">No saved addresses yet. Add one above.</p>
              ) : (
                <div className="addresses-list-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? "default-address" : ""}`}>
                      <div className="address-badge-row">
                        <span className="address-tag-badge">{addr.tag}</span>
                        {addr.isDefault && <span className="default-pill">DEFAULT 🏠</span>}
                      </div>
                      <p className="address-street">{addr.street}</p>
                      <p className="address-city">{addr.city}, {addr.state} - {addr.zip}</p>
                      <p className="address-country">{addr.country}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Recent Orders */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <h3>3. Recent Orders</h3>
                <Link to="/orders" className="btn-secondary btn-sm">
                  View All Orders 📦 →
                </Link>
              </div>

              <div className="profile-orders-preview">
                {ordersLoading ? (
                  <p>Loading orders…</p>
                ) : recentOrders.length === 0 ? (
                  <p className="wishlist-overview-text">No orders yet. Place your first order!</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="order-preview-chip">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <span>{order.items?.map((i) => i.name).join(", ") || "—"}</span>
                      </div>
                      <span className="order-status-badge">{statusLabel(order.status)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. Wishlist */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <h3>4. Saved Wishlist Items ({wishlist.length})</h3>
                <Link to="/wishlist" className="btn-secondary btn-sm">
                  View Wishlist ❤️ →
                </Link>
              </div>
              <p className="wishlist-overview-text">
                You have <strong>{wishlist.length}</strong> item{wishlist.length !== 1 ? "s" : ""} saved in your wishlist.
              </p>
            </div>

            {/* 5. Logout */}
            <div className="logout-section-banner margin-top-md">
              <button className="btn-danger-outline logout-full-btn" onClick={handleLogout}>
                Sign Out of Cartify 🚪
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddAddressModal(false)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddAddressModal(false)}>✕</button>
            <div className="forgot-modal-container">
              <h3>Add New Shipping Address 🏠</h3>
              <form onSubmit={handleAddAddress} className="auth-form margin-top-md">
                <div className="form-group">
                  <label>Address Label (e.g. Home, Office)</label>
                  <input
                    type="text"
                    value={newAddressTag}
                    onChange={(e) => setNewAddressTag(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={newAddressStreet}
                    onChange={(e) => setNewAddressStreet(e.target.value)}
                    placeholder="123 Innovation Way, Suite 100"
                    required
                  />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={newAddressCity}
                      onChange={(e) => setNewAddressCity(e.target.value)}
                      placeholder="Bengaluru"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={newAddressZip}
                      onChange={(e) => setNewAddressZip(e.target.value)}
                      placeholder="560001"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary auth-submit-btn">
                  Save Address 🏠
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Profile;
