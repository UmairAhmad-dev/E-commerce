import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <span>👋</span>
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn" onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>
          <div>Latest Collection</div>
          <span>➔</span>
        </div>
      </div>
      <div className="hero-right">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" alt="Hero Model Display" />
      </div>
    </div>
  );
};

export default Hero;