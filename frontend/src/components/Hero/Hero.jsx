import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&auto=format&fit=crop&q=80",
    tagline: "ELEGANT REFINEMENT",
    title: "The Festive Heritage Collection",
    subtitle: "Premium Stitched Luxury Kurtas & Sherwanis",
    buttonText: "Explore Men Collection",
    link: "/mens"
  },
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=80",
    tagline: "LUXURY ETHNIC WEAR",
    title: "Summer Unstitched Lawn '26",
    subtitle: "Breathable Premium Fabrics & Intricate Luxury Embroidery",
    buttonText: "Shop Women Closet",
    link: "/womens"
  },
  {
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1600&auto=format&fit=crop&q=80",
    tagline: "VIBRANT ARRIVALS",
    title: "Junior Eid Arrivals",
    subtitle: "Bright, Vibrant & Comfort-First Traditional Attire",
    buttonText: "Discover Kids Wear",
    link: "/kids"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000); // Extended slightly to let cinematic zoom transitions play beautifully
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <section className="premium-hero-viewport" aria-label="Featured Collections Slider">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div 
            key={index} 
            className={`cinematic-hero-slide ${isActive ? "slide-state-active" : ""}`}
          >
            {/* Background Presentation Canvas with Dual Gradient Shield Layer */}
            <div 
              className="hero-background-image-render"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-atmosphere-curtain" />

            {/* Split Screen Typography Layout Panel */}
            <div className="hero-slide-content-stage">
              <div className="glassomorphic-content-card">
                <span className="premium-section-tag">{slide.tagline}</span>
                <h1 className="hero-display-headline">{slide.title}</h1>
                <p className="hero-display-subhead">{slide.subtitle}</p>
                <div className="hero-button-dock">
                  <Link to={slide.link} className="hero-router-anchor">
                    <button className="premium-action-trigger-btn">
                      <span className="btn-inner-label">{slide.buttonText}</span>
                      <span className="btn-arrow-vector">→</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Sleek Progress Indicator Bar Row */}
      <div className="luxury-slider-pagination-row">
        {HERO_SLIDES.map((_, index) => (
          <button 
            key={index} 
            className={`pagination-bar-node ${index === currentSlide ? "bar-node-active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Navigate showcase slide window space down to panel ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;