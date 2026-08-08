function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content: "Cartify's delivery speed blew me away! Order arrived in under 24 hours. The Air Max Pro sneakers are 100% authentic and ridiculously comfortable.",
      rating: 5,
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Tech Enthusiast",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      content: "The Apex Series Smartwatch 5 is top notch. Sleek display, 7-day battery life, and smooth sync with my phone. Highly recommend shopping here!",
      rating: 5,
    },
    {
      id: 3,
      name: "David Miller",
      role: "Pro Photographer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content: "Bought the Lumix Pro 4K camera package. Packaging was rock-solid and customer support answered all my lens compatibility questions instantly.",
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>What Our Customers Say 🌟</h2>
        <p>Over 15,000+ happy shoppers worldwide trust Cartify for quality & speed</p>
      </div>

      <div className="testimonials-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className="testimonial-card">
            <div className="testimonial-stars">{"★".repeat(rev.rating)}</div>
            <p className="testimonial-quote">"{rev.content}"</p>
            <div className="testimonial-author">
              <img src={rev.avatar} alt={rev.name} />
              <div>
                <h4>{rev.name}</h4>
                <span>{rev.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
