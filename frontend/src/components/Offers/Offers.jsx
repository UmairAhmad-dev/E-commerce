import './Offers.css';

const Offers = () => {
  return (
    <section className="luxury-offers-container" aria-label="Exclusive Campaign Panel">
      <div className="offers-blur-backdrop-shield" />
      
      <div className="offers-split-workspace">
        
        {/* Left Typography Column Layout */}
        <div className="offers-editorial-left">
          <span className="offers-badge-curation-tag">LIMITED TIMELINE ARCHIVE</span>
          <h2 className="offers-display-headline">
            Exclusive <br />
            Offers For You
          </h2>
          <p className="offers-display-subhead">ONLY ON BEST SELLERS PRODUCTS</p>
          
          <div className="offers-action-dock">
            <button 
              type="button"
              className="offers-premium-cta-trigger"
              onClick={() => window.scrollTo({ top: 1800, behavior: 'smooth' })}
            >
              <span className="cta-label-string">Check Now</span>
              <span className="cta-arrow-vector">→</span>
            </button>
          </div>
        </div>

        {/* Right Product Image Framing Showcase Column */}
        <div className="offers-presentation-right">
          <div className="offers-curated-image-frame">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80" alt="Exclusive Collection Showcase" />
            <div className="frame-matte-overlay" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Offers;