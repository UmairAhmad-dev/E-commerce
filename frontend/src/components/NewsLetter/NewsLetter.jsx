import './Newsletter.css';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <section className="premium-newsletter-section" aria-label="Customer Engagement Form">
      <div className="newsletter-blur-radial-shield" />
      
      <div className="newsletter-inner-content-wrapper">
        <span className="newsletter-curated-tag">JOIN THE CLUB</span>
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe to our newsletter to receive priority product collections alerts and special markdown campaigns.</p>
        
        <form onSubmit={handleSubmit} className="premium-newsletter-form-capsule">
          <input 
            type="email" 
            placeholder="Enter your professional email address..." 
            required 
            className="newsletter-inner-input"
          />
          <button type="submit" className="newsletter-action-submit-btn">
            <span>Subscribe</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;