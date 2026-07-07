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
      // Direct user straight to their active category page with custom URL search params if needed, 
      // or simply alert clean execution for your local state preview
      alert(`Searching globally for: ${globalSearch}`);
      setGlobalSearch("");
    }
  };

  return (
    <div className="navbar">
      {/* Brand Identity */}
      <div className="nav-logo" onClick={() => { setMenu("shop"); navigate("/"); }}>
        <span className="logo-icon">🛍️</span>
        <p>SHOPPER</p>
      </div>

      {/* Mobile Hamburger Toggle */}
      <div className={`nav-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Core Navigation Links */}
      <ul className={`nav-menu ${menuOpen ? "nav-menu-mobile" : ""}`}>
        <li onClick={() => { setMenu("shop"); setMenuOpen(false); }}><Link to="/">Shop</Link>{menu === "shop" && <hr/>}</li>
        <li onClick={() => { setMenu("mens"); setMenuOpen(false); }}><Link to="/mens">Men</Link>{menu === "mens" && <hr/>}</li>
        <li onClick={() => { setMenu("womens"); setMenuOpen(false); }}><Link to="/womens">Women</Link>{menu === "womens" && <hr/>}</li>
        <li onClick={() => { setMenu("kids"); setMenuOpen(false); }}><Link to="/kids">Kids</Link>{menu === "kids" && <hr/>}</li>
      </ul>

      {/* Global Center Search Engine Input */}
      <form onSubmit={handleSearchSubmit} className="nav-search-form">
        <input 
          type="text" 
          placeholder="Search products, collections..." 
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      {/* Action Utility Buttons */}
      <div className="nav-login-cart">
        <Link to="/login"><button className="login-btn">Login</button></Link>
        <div className="nav-cart-wrapper">
          <Link to="/cart"><span className="cart-icon">🛒</span></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;