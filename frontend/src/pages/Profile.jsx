import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileCard from "../components/Profile/ProfileCard";
import { CartContext } from "../context/CartContext";

function Profile() {
  const { user, wishlist, logoutUser, addToast } = useContext(CartContext);
  const navigate = useNavigate();

  const currentUser = user || {
    name: "Sunny Kumar",
    email: "sunnykumar6207058974@gmail.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    phone: "+91 8340112045",
  };

  // 1. Personal details form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || "+91 8340112045");

  // 2. Address section state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      tag: "Home (Default)",
      street: "742 Tech Hub Tower, Suite 400",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      tag: "Office",
      street: "Building 4B, Silicon Valley Tech Park",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560001",
      country: "India",
      isDefault: false,
    },
  ]);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState("Other");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressZip, setNewAddressZip] = useState("");

  const handleSaveProfile = (e) => {
    e.preventDefault();
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
        zip: newAddressZip || "10001",
        country: "India",
        isDefault: false,
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

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content profile-page container">
        <div className="page-header-banner">
          <h1>Account Profile & Settings 👤</h1>
          <p>Manage your personal details, shipping addresses, recent orders & saved items.</p>
        </div>

        <div className="profile-grid">
          {/* Left Column: User Profile Card */}
          <ProfileCard user={currentUser} />

          {/* Right Column: Personal Details, Address, Orders, Wishlist */}
          <div className="profile-content-column">
            {/* 1. Personal details Form Card */}
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={currentUser.email} readOnly />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Save Profile Changes 💾
                </button>
              </form>
            </div>

            {/* 2. Address Section */}
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
            </div>

            {/* 3. Orders Quick Overview */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <h3>3. Recent Orders</h3>
                <Link to="/orders" className="btn-secondary btn-sm">
                  View All Orders 📦 →
                </Link>
              </div>

              <div className="profile-orders-preview">
                <div className="order-preview-chip">
                  <div>
                    <strong>Order #CRT-98214</strong>
                    <span>Air Max Pro & Apex Watch</span>
                  </div>
                  <span className="order-status-badge status-delivered">Delivered ✓</span>
                </div>
                <div className="order-preview-chip">
                  <div>
                    <strong>Order #CRT-76190</strong>
                    <span>SonicPro ANC Headphones</span>
                  </div>
                  <span className="order-status-badge status-in-transit">In-Transit 🚚</span>
                </div>
              </div>
            </div>

            {/* 4. Wishlist Quick Overview */}
            <div className="profile-settings-card margin-top-md">
              <div className="card-header-flex">
                <h3>4. Saved Wishlist Items ({wishlist.length})</h3>
                <Link to="/wishlist" className="btn-secondary btn-sm">
                  View Wishlist ❤️ →
                </Link>
              </div>
              <p className="wishlist-overview-text">
                You have <strong>{wishlist.length}</strong> items saved in your wishlist. Tap below to review or move items to cart anytime.
              </p>
            </div>

            {/* 5. Logout Action Banner */}
            <div className="logout-section-banner margin-top-md">
              <button className="btn-danger-outline logout-full-btn" onClick={handleLogout}>
                Sign Out of Cartify 🚪
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddAddressModal(false)}>
          <div className="modal-content social-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddAddressModal(false)}>
              ✕
            </button>
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
                      required
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
