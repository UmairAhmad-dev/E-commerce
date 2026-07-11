import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
// 1. 👇 IMPORT THE CLIENT-SIDE ROUTER NAVIGATION HOOK
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
  
  // 2. 👇 INITIALIZE THE NAVIGATE FUNCTION ENGINE
  const navigate = useNavigate();

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <span className="cartitems-remove-icon" onClick={() => { removeFromCart(e.id) }} style={{ cursor: 'pointer', color: '#ef4444', fontWeight: '600' }}>❌</span>
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      
      <div className="cartitems-down" style={{ display: 'flex', margin: '80px 0', gap: '10%' }}>
        <div className="cartitems-total" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', fontWeight: '600' }}>
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          
          {/* 3. 🚀 CRITICAL ROUTER LINK UP - STOPS FULL WINDOW HARD RELOADS */}
          <button 
            style={{ width: '260px', height: '58px', outline: 'none', border: 'none', background: '#ff4141', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}
            onClick={() => navigate('/checkout')}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;