import Navbar from "../components/Navbar";
import CartComponent from "../components/Cart";
import Footer from "../components/Footer";

function Cart() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <CartComponent />
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
