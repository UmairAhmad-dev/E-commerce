import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [menuOpen, setMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  
  const { getTotalCartItems } = useContext(ShopContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch logged-in user details to display custom initials in the avatar
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.user) {
          setUserName(data.user.name || 'Shopper');
        }
      } catch (error) {
        console.error("Error fetching user profile for navigation avatar:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Close the dropdown immediately if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      alert(`Searching globally for: ${globalSearch}`);
      setGlobalSearch("");
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('auth-token');
    setUserName('');
    setDropdownOpen(false);
    navigate('/');
    window.location.reload(); // Refresh to clean memory traces
  };

  // Extract initials for the profile circle (e.g., "Umair Ahmad" -> "UA")
  const getInitials = (fullName) => {
    if (!fullName) return "US";
    return fullName.split(' ').map(name => name[0]).slice(0, 2).join('').toUpperCase();
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
          
          {/* Dynamic Authentication Matrix / Profile Avatar */}
          {localStorage.getItem('auth-token') ? (
            <div className="nav-user-profile-menu-container" ref={dropdownRef}>
              <button 
                className="nav-profile-avatar-trigger" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Toggle user profile menu"
              >
                {getInitials(userName)}
              </button>

              {dropdownOpen && (
                <div className="nav-profile-dropdown-box">
                  <div className="dropdown-user-meta">
                    <strong>{userName || "Client Profile"}</strong>
                    <span>Store Account verified</span>
                  </div>
                  <div className="dropdown-divider-line" />
                  
                  <Link to="/my-account" className="dropdown-menu-item" onClick={() => setDropdownOpen(false)}>
                    👤 My Profile & Orders
                  </Link>
                  
                  <button onClick={logoutHandler} className="dropdown-menu-item logout-red-text">
                    🚪 Logout Securely
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link-wrapper">
              <button className="premium-login-trigger">Sign In</button>
            </Link>
          )}
          
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