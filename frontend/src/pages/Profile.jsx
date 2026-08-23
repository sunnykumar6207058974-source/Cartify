import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileCard from "../components/Profile/ProfileCard";
import { CartContext } from "../context/CartContext";
import { getOrders } from "../services/api";

function Profile() {
  const {
    user,
    wishlist,
    updateUser,
    logoutUser,
    addToast,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useContext(CartContext);
  const navigate = useNavigate();

  // Personal details state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");

  // Address modal state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState("Home");
  const [newAddressFullName, setNewAddressFullName] = useState(user?.name || "");
  const [newAddressPhone, setNewAddressPhone] = useState(user?.phone || "");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressState, setNewAddressState] = useState("Karnataka");
  const [newAddressZip, setNewAddressZip] = useState("");
  const [newAddressIsDefault, setNewAddressIsDefault] = useState(false);

  // Real orders preview
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders({ page: 1, limit: 3 });
        setRecentOrders(data.data || []);
      } catch {
        // Silently fail
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
      addAddress({
        tag: newAddressTag,
        fullName: newAddressFullName || profileName,
        phone: newAddressPhone || profilePhone,
        street: newAddressStreet,
        city: newAddressCity,
        state: newAddressState,
        zip: newAddressZip || "560001",
        country: "India",
        isDefault: newAddressIsDefault || addresses.length === 0,
      });

      setShowAddAddressModal(false);
      setNewAddressStreet("");
      setNewAddressCity("");
      setNewAddressZip("");
      setNewAddressIsDefault(false);
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

            {/* 2. Multi-Address Book */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <div>
                  <h3>2. Saved Shipping Address Book ({addresses.length})</h3>
                  <p className="sub-caption-text">Manage delivery addresses for seamless 1-click checkout.</p>
                </div>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setShowAddAddressModal(true)}
                >
                  + Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="wishlist-overview-text">No saved addresses yet. Add your first address above.</p>
              ) : (
                <div className="addresses-list-grid">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card ${addr.isDefault ? "default-address" : ""}`}
                    >
                      <div className="address-badge-row">
                        <span className="address-tag-badge">🏷️ {addr.tag}</span>
                        {addr.isDefault && <span className="default-pill">DEFAULT 🏠</span>}
                      </div>

                      <strong className="addr-recipient">{addr.fullName}</strong>
                      <p className="address-street">{addr.street}</p>
                      <p className="address-city">
                        {addr.city}, {addr.state} - {addr.zip}
                      </p>
                      <p className="address-country">📞 {addr.phone || "No phone provided"}</p>

                      <div className="address-card-actions">
                        {!addr.isDefault && (
                          <button
                            className="btn-link-action"
                            onClick={() => setDefaultAddress(addr.id)}
                          >
                            Set as Default ⭐
                          </button>
                        )}
                        <button
                          className="btn-link-danger"
                          onClick={() => deleteAddress(addr.id)}
                        >
                          Delete 🗑️
                        </button>
                      </div>
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
          <div
            className="modal-content social-auth-modal animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowAddAddressModal(false)}>
              ✕
            </button>
            <div className="forgot-modal-container">
              <h3>Add New Shipping Address 🏠</h3>
              <p>Save this address to your address book for instant checkout.</p>

              <form onSubmit={handleAddAddress} className="auth-form margin-top-md">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Address Label</label>
                    <select
                      value={newAddressTag}
                      onChange={(e) => setNewAddressTag(e.target.value)}
                    >
                      <option value="Home">Home 🏠</option>
                      <option value="Work / Office">Work / Office 🏢</option>
                      <option value="Other">Other 📍</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Recipient Name</label>
                    <input
                      type="text"
                      value={newAddressFullName}
                      onChange={(e) => setNewAddressFullName(e.target.value)}
                      placeholder="e.g. Sunny Kumar"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact Phone Number</label>
                  <input
                    type="tel"
                    value={newAddressPhone}
                    onChange={(e) => setNewAddressPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address &amp; Apartment / Suite</label>
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
                    <label>State / Province</label>
                    <input
                      type="text"
                      value={newAddressState}
                      onChange={(e) => setNewAddressState(e.target.value)}
                      placeholder="Karnataka"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal / Zip Code</label>
                    <input
                      type="text"
                      value={newAddressZip}
                      onChange={(e) => setNewAddressZip(e.target.value)}
                      placeholder="560103"
                      required
                    />
                  </div>
                </div>

                <div className="form-checkbox-group margin-y-sm">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newAddressIsDefault}
                      onChange={(e) => setNewAddressIsDefault(e.target.checked)}
                    />
                    <span>Set as my default shipping address</span>
                  </label>
                </div>

                <button type="submit" className="btn-primary auth-submit-btn">
                  Save Address to Profile 🏠
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
