import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content contact-page container">
        <div className="page-header-banner">
          <h1>Customer Support & Contact Us 💬</h1>
          <p>Have questions about your order or our products? We're available 24/7.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-col">
            <h3>Get In Touch</h3>
            <p>Reach out to our customer care team anytime for assistance.</p>

            <div className="contact-cards">
              <div className="contact-card">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email Support</h4>
                  <p>support@cartify.com</p>
                </div>
              </div>
              <div className="contact-card">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Helpline</h4>
                  <p>+91 8340112045</p>
                </div>
              </div>
              <div className="contact-card">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Headquarters</h4>
                  <p>Tech Hub Tower, Suite 400, Bengaluru</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            {submitted ? (
              <div className="submitted-box">
                <h3>🎉 Message Received!</h3>
                <p>Thank you for reaching out, {formData.name}. Our support team will reply within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send Us a Message</h3>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  Send Message 📨
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
