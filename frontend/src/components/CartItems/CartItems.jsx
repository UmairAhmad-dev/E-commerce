import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="premium-cart-view-container">
      <div className="cart-workspace-header">
        <h1>Your Shopping Bag</h1>
        <p>Review your luxury selections before finalizing transaction routing.</p>
      </div>

      <div className="cart-workspace-grid-layout">
        
        <div className="cart-items-stack-column">
          <div className="cart-items-table-header">
            <span className="th-product-meta">Product Detail</span>
            <span className="th-price-meta">Price</span>
            <span className="th-qty-meta">Quantity</span>
            <span className="th-total-meta">Total</span>
            <span className="th-action-meta">Remove</span>
          </div>
          
          <div className="cart-items-body-scroller">
            {all_product.map((e) => {
              if (cartItems[e.id] > 0) {
                return (
                  <div key={e.id} className="cart-line-item-row-card">
                    <div className="item-identity-cell">
                      <div className="item-thumbnail-frame">
                        <img src={e.image} alt={e.name} />
                      </div>
                      <div className="item-name-descriptor">
                        <h3>{e.name}</h3>
                        <span>SKU: #{e.id}</span>
                      </div>
                    </div>
                    
                    {/* 🚀 Changed cell markers to Rs. */}
                    <div className="item-price-cell">
                      <span className="cell-currency-symbol">Rs.</span>{e.new_price.toLocaleString('en-PK')}
                    </div>
                    
                    <div className="item-qty-cell">
                      <div className="qty-counter-badge">{cartItems[e.id]}</div>
                    </div>
                    
                    <div className="item-total-cell">
                      <span className="cell-currency-symbol">Rs.</span>{(e.new_price * cartItems[e.id]).toLocaleString('en-PK')}
                    </div>
                    
                    <div className="item-remove-cell">
                      <button 
                        className="remove-trash-trigger" 
                        onClick={() => removeFromCart(e.id)}
                        aria-label="Remove item allocation"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {Object.values(cartItems).every(qty => qty === 0) && (
              <div className="empty-bag-fallback-display">
                <span className="fallback-bag-icon">🛍️</span>
                <h3>Your shopping bag is empty</h3>
                <p>Browse our lookbooks and add premium styles to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="cart-summary-sidebar-panel">
          <div className="summary-sticky-card">
            <h2>Order Summary</h2>
            
            <div className="summary-calc-ledger">
              <div className="calc-row-item">
                <span>Subtotal</span>
                {/* 🚀 Changed to Rs. */}
                <strong>Rs. {getTotalCartAmount().toLocaleString('en-PK')}</strong>
              </div>
              <div className="calc-row-item">
                <span>Estimated Shipping</span>
                <span className="shipping-free-badge">FREE</span>
              </div>
              <hr className="summary-divider-line" />
              <div className="calc-row-item total-grand-row">
                <h4>Grand Total</h4>
                {/* 🚀 Changed to Rs. */}
                <h4>Rs. {getTotalCartAmount().toLocaleString('en-PK')}</h4>
              </div>
            </div>

            <button 
              className="checkout-proceed-action-trigger"
              disabled={getTotalCartAmount() === 0}
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO SECURE CHECKOUT
            </button>

            <div className="cart-promo-activation-dock">
              <p>Have a promotional campaign coupon code?</p>
              <div className="promo-input-capsule">
                <input type="text" placeholder="Enter coupon code..." />
                <button type="button">Apply</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItems;