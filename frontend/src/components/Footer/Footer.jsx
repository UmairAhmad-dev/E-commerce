import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="footer">
      <div className="footer-logo" onClick={handleScrollTop}>
        <span className="footer-logo-icon">🛍️</span>
        <p>SHOPPER</p>
      </div>
      
      {/* Dynamic Navigation Enclosures */}
      <ul className="footer-links">
        <li onClick={handleScrollTop}><Link to="/about">Company</Link></li>
        <li onClick={handleScrollTop}><Link to="/">Products</Link></li>
        <li onClick={handleScrollTop}><Link to="/contact">Offices</Link></li>
        <li onClick={handleScrollTop}><Link to="/about">About</Link></li>
        <li onClick={handleScrollTop}><Link to="/contact">Contact</Link></li>
      </ul>
      
      <div className="footer-social-icon">
        <div className="footer-icons-container" onClick={() => window.open('https://instagram.com', '_blank')}>
          <span>📸</span>
        </div>
        <div className="footer-icons-container" onClick={() => window.open('https://pinterest.com', '_blank')}>
          <span>📌</span>
        </div>
        <div className="footer-icons-container" onClick={() => window.open('https://whatsapp.com', '_blank')}>
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