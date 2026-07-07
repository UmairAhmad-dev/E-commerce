import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import './OrderSuccess.css'; // Styled cleanly below

const OrderSuccess = () => {
  const { allProducts, cartItems, getSubtotalAmount, getDiscountAmount, getTaxAmount, getShippingFee, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  
  // Create static snapshot vectors to retain billing values even if context refreshes later
  const [orderId] = useState(`ZL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Capture current items in cart to display in final receipt grid mapping
  const summaryItems = allProducts.filter(product => cartItems[product.id] > 0);

  // If a user navigates to this URL directly without any items, redirect them back home safely
  useEffect(() => {
    if (summaryItems.length === 0) {
      // Small timeout to allow state to settle smoothly
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [summaryItems, navigate]);

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        
        {/* Header Block with Success Badge Icon */}
        <div className="success-header">
          <div className="success-checkmark-circle">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for shopping with us. Your invoice has been generated successfully.</p>
        </div>

        {/* Order Meta Details Panel */}
        <div className="order-metadata-card">
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div>
            <span>Date Placed</span>
            <strong>{orderDate}</strong>
          </div>
          <div>
            <span>Payment Mode</span>
            <strong>Cash on Delivery (COD)</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="status-badge">Processing</strong>
          </div>
        </div>

        {/* Itemized Order Breakdown Sheet */}
        <div className="order-items-breakdown">
          <h3>Items Summarized</h3>
          <div className="items-table">
            {summaryItems.map((item) => (
              <div key={item.id} className="items-table-row">
                <img src={item.image} alt={item.name} className="receipt-prod-img" />
                <div className="receipt-prod-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {cartItems[item.id]}</p>
                </div>
                <p className="receipt-prod-price">${(item.new_price * cartItems[item.id]).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Receipt Pricing Invoice Vector */}
        <div className="order-receipt-totals">
          <div className="receipt-row">
            <p>Subtotal</p>
            <p>${getSubtotalAmount().toFixed(2)}</p>
          </div>
          {getDiscountAmount() > 0 && (
            <div className="receipt-row green-text">
              <p>Promo Code Reduction</p>
              <p>-${getDiscountAmount().toFixed(2)}</p>
            </div>
          )}
          <div className="receipt-row">
            <p>Estimated GST (5%)</p>
            <p>${getTaxAmount().toFixed(2)}</p>
          </div>
          <div className="receipt-row">
            <p>Shipping & Handling</p>
            <p>{getShippingFee() === 0 ? "FREE" : `$${getShippingFee().toFixed(2)}`}</p>
          </div>
          <hr className="receipt-dashed-line" />
          <div className="receipt-row grand-total-row">
            <h3>Amount Paid</h3>
            <h3>${getTotalCartAmount().toFixed(2)}</h3>
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="success-actions">
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;