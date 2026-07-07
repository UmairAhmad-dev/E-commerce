import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Professional fall-back handler for social nodes
  const handleSocialClick = (platform) => {
    alert(`${platform} integration is coming soon! Our corporate media links are being verified.`);
  };

  return (
    <div className="footer">
      <div className="footer-logo" onClick={handleScrollTop}>
        <span className="footer-logo-icon">🛍️</span>
        <p>SHOPPER</p>
      </div>
      
      <ul className="footer-links">
        <li onClick={handleScrollTop}><Link to="/about">Company</Link></li>
        <li onClick={handleScrollTop}><Link to="/">Products</Link></li>
        <li onClick={handleScrollTop}><Link to="/contact">Offices</Link></li>
        <li onClick={handleScrollTop}><Link to="/about">About</Link></li>
        <li onClick={handleScrollTop}><Link to="/contact">Contact</Link></li>
      </ul>
      
      {/* Updated interactive nodes with safe inline handlers */}
      <div className="footer-social-icon">
        <div className="footer-icons-container" onClick={() => handleSocialClick("Instagram")}>
          <span>📸</span>
        </div>
        <div className="footer-icons-container" onClick={() => handleSocialClick("Pinterest")}>
          <span>📌</span>
        </div>
        <div className="footer-icons-container" onClick={() => handleSocialClick("WhatsApp Support")}>
          <span>💬</span>
        </div>
      </div>
      
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ {new Date().getFullYear()} - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;