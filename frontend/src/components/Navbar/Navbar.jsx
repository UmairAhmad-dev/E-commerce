import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [menuOpen, setMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      alert(`Searching globally for: ${globalSearch}`);
      setGlobalSearch("");
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-blur-wrapper">
        
        {/* Brand Identity */}
        <div className="nav-brand-group" onClick={() => { setMenu("shop"); setMenuOpen(false); navigate("/"); }}>
          <div className="logo-vector-shield">
            <span className="logo-emoji-icon">🛍️</span>
          </div>
          <p className="brand-text-string">SHOPPER</p>
        </div>

        {/* Core Navigation Links Layout Grid */}
        <ul className={`nav-links-matrix ${menuOpen ? "mobile-drawer-expanded" : ""}`}>
          <li className={menu === "shop" ? "active-link-node" : ""} onClick={() => { setMenu("shop"); setMenuOpen(false); }}>
            <Link to="/">Shop</Link>
          </li>
          <li className={menu === "mens" ? "active-link-node" : ""} onClick={() => { setMenu("mens"); setMenuOpen(false); }}>
            <Link to="/mens">Men</Link>
          </li>
          <li className={menu === "womens" ? "active-link-node" : ""} onClick={() => { setMenu("womens"); setMenuOpen(false); }}>
            <Link to="/womens">Women</Link>
          </li>
          <li className={menu === "kids" ? "active-link-node" : ""} onClick={() => { setMenu("kids"); setMenuOpen(false); }}>
            <Link to="/kids">Kids</Link>
          </li>
        </ul>

        {/* Global Center Search Engine Input */}
        <form onSubmit={handleSearchSubmit} className="nav-search-capsule">
          <input 
            type="text" 
            placeholder="Search products, collections..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="search-inner-input"
          />
          <button type="submit" className="search-trigger-lens" aria-label="Submit Search">🔍</button>
        </form>

        {/* Action Utility Buttons */}
        <div className="nav-action-cluster">
          <Link to="/login" className="login-link-wrapper">
            <button className="premium-login-trigger">Sign In</button>
          </Link>
          
          <div className="nav-cart-interactive-node" onClick={() => { setMenuOpen(false); navigate("/cart"); }}>
            <div className="cart-badge-anchor">
              <span className="cart-vector-emoji">🛒</span>
              {getTotalCartItems() > 0 && (
                <div className="cart-counter-bubble-pulse">
                  <span>{getTotalCartItems()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modern Minimalist Hamburger Toggle */}
          <button 
            className={`hamburger-hollow-toggle ${menuOpen ? "toggle-active-cross" : ""}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <div className="burger-bar line-top"></div>
            <div className="burger-bar line-mid"></div>
            <div className="burger-bar line-bot"></div>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;