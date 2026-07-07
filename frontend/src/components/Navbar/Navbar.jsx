import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <span className="logo-icon">🛍️</span>
        <p>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}><Link to="/">Shop</Link>{menu === "shop" ? <hr/> : null}</li>
        <li onClick={() => setMenu("mens")}><Link to="/mens">Men</Link>{menu === "mens" ? <hr/> : null}</li>
        <li onClick={() => setMenu("womens")}><Link to="/womens">Women</Link>{menu === "womens" ? <hr/> : null}</li>
        <li onClick={() => setMenu("kids")}><Link to="/kids">Kids</Link>{menu === "kids" ? <hr/> : null}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to="/login"><button>Login</button></Link>
        <div className="nav-cart-wrapper">
          <Link to="/cart"><span className="cart-icon">🛒</span></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;