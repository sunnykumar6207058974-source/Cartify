import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderCard from "../components/Orders/OrderCard";

function Orders() {
  const mockOrders = [
    {
      id: "CRT-98214",
      date: "August 4, 2026",
      status: "Delivered",
      total: 348,
      items: [
        {
          id: 1,
          name: "Air Max Pro Stealth",
          price: 149,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
        },
        {
          id: 2,
          name: "Apex Series Smartwatch 5",
          price: 199,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      id: "CRT-76190",
      date: "July 28, 2026",
      status: "In-Transit",
      total: 129,
      items: [
        {
          id: 3,
          name: "SonicPro ANC Headphones",
          price: 129,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
        },
      ],
    },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content orders-page container">
        <div className="page-header-banner">
          <h1>My Purchase & Order History 📦</h1>
          <p>Track live dispatches, review past orders, and manage invoices</p>
        </div>

        <div className="orders-list-layout">
          {mockOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
