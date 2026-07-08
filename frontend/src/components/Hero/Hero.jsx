import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&auto=format&fit=crop&q=80",
    title: "The Festive Heritage Collection",
    subtitle: "Premium Stitched Luxury Kurtas & Sherwanis",
    buttonText: "Explore Men",
    link: "/mens"
  },
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=80",
    title: "Summer Unstitched Lawn '26",
    subtitle: "Breathable Premium Fabrics & Intricate Luxury Embroidery",
    buttonText: "Shop Women",
    link: "/womens"
  },
  {
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1600&auto=format&fit=crop&q=80",
    title: "Junior Eid Arrivals",
    subtitle: "Bright, Vibrant & Comfort-First Traditional Attire",
    buttonText: "Discover Kids",
    link: "/kids"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <div className="hero-slider-container">
      {HERO_SLIDES.map((slide, index) => (
        <div 
          key={index} 
          className={`hero-slide ${index === currentSlide ? "slide-active" : ""}`}
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45)), url(${slide.image})` }}
        >
          <div className="hero-slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <Link to={slide.link}>
              <button className="hero-action-btn">{slide.buttonText}</button>
            </Link>
          </div>
        </div>
      ))}
      
      <div className="slider-dots-row">
        {HERO_SLIDES.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? "dot-active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;