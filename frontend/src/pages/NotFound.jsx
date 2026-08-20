import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  useEffect(() => { document.title = "404 Page Not Found — Cartify"; }, []);
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content notfound-page container center-content">
        <div className="notfound-card">
          <h1 className="error-code">404</h1>
          <h2>Page Not Found 🔍</h2>
          <p>The page you are looking for might have been moved, deleted, or never existed.</p>
          <div className="notfound-actions">
            <Link to="/" className="btn-primary">
              Return Home 🏠
            </Link>
            <Link to="/products" className="btn-secondary">
              Browse Products 🛍️
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
