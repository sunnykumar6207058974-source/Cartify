import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function ProfileCard({ user }) {
  const { logoutUser, wishlist } = useContext(CartContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="profile-card-modern">
      <div className="profile-avatar-wrap">
        <img src={user.avatar} alt={user.name} />
        <span className="vip-badge">VIP Platinum Member ⭐</span>
      </div>

      <div className="profile-details">
        <h2>{user.name}</h2>
        <p className="profile-email">📧 {user.email}</p>
        <p className="profile-phone">📞 {user.phone || "+91 8340112045"}</p>
      </div>

      {/* Profile Quick Stats */}
      <div className="profile-stats-row">
        <div className="p-stat">
          <strong>2</strong>
          <span>Orders Placed</span>
        </div>
        <div className="p-stat">
          <strong>{wishlist.length}</strong>
          <span>Wishlist Items</span>
        </div>
        <div className="p-stat">
          <strong>$477.00</strong>
          <span>Total Spent</span>
        </div>
      </div>

      {/* 5. Logout Button */}
      <div className="profile-card-logout-wrap">
        <button className="btn-danger-outline logout-profile-btn" onClick={handleLogout}>
          Sign Out of Account 🚪
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
