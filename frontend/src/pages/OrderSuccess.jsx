import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccess.css'; // Triple check that this file path matches your folder exactly!

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract invoiceSnapshot from router state payload
  const invoiceSnapshot = location.state?.invoiceSnapshot;

  // Debugger log - Press F12 to see if the snapshot is actually arriving!
  console.log("Arrived Invoice Snapshot Data:", invoiceSnapshot);

  const [orderId] = useState(`ZL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Security check: If someone refreshes the page manually and the state is gone, redirect them home safely
  useEffect(() => {
    if (!invoiceSnapshot) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000); // Wait 3 seconds so they can at least see the screen if it hot-reloaded
      return () => clearTimeout(timer);
    }
  }, [invoiceSnapshot, navigate]);

  // If there is no snapshot data passed, show a clean loading/error fallback instead of hardcoded 0.00s
  if (!invoiceSnapshot) {
    return (
      <div className="order-success-page" style={{textAlign: 'center', padding: '100px 20px'}}>
        <h2>Processing your invoice details...</h2>
        <p>Redirecting you back to the shop shortly.</p>
      </div>
    );
  }

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
            {invoiceSnapshot.items && invoiceSnapshot.items.map((item) => (
              <div key={item.id} className="items-table-row">
                <img src={item.image} alt={item.name} className="receipt-prod-img" />
                <div className="receipt-prod-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p className="receipt-prod-price">${(item.new_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Receipt Pricing Invoice Vector */}
        <div className="order-receipt-totals">
          <div className="receipt-row">
            <p>Subtotal</p>
            <p>${Number(invoiceSnapshot.subtotal || 0).toFixed(2)}</p>
          </div>
          {invoiceSnapshot.discount > 0 && (
            <div className="receipt-row green-text">
              <p>Promo Code Reduction</p>
              <p>-${Number(invoiceSnapshot.discount).toFixed(2)}</p>
            </div>
          )}
          <div className="receipt-row">
            <p>Estimated GST (5%)</p>
            <p>${Number(invoiceSnapshot.tax || 0).toFixed(2)}</p>
          </div>
          <div className="receipt-row">
            <p>Shipping & Handling</p>
            <p>{invoiceSnapshot.shipping === 0 ? "FREE" : `$${Number(invoiceSnapshot.shipping).toFixed(2)}`}</p>
          </div>
          <hr className="receipt-dashed-line" />
          <div className="receipt-row grand-total-row">
            <h3>Amount Paid</h3>
            <h3>${Number(invoiceSnapshot.grandTotal || 0).toFixed(2)}</h3>
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