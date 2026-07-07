import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo">
        <span className="footer-logo-icon">🛍️</span>
        <p>SHOPPER</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <span>📸</span>
        </div>
        <div className="footer-icons-container">
          <span>📌</span>
        </div>
        <div className="footer-icons-container">
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