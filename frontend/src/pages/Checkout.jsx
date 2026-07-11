import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { 
    all_product, 
    cartItems,
    getSubtotalAmount, 
    getDiscountAmount, 
    getTaxAmount, 
    getShippingFee, 
    getTotalCartAmount, 
    clearCart 
  } = useContext(ShopContext);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "", lastName: "", email: "", address: "", city: "", postalCode: "", phone: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("⚠️ Verification required! Please log in to complete your purchase.");
      navigate('/login');
      return;
    }
    
    let localErrors = {};
    if (!shippingInfo.firstName.trim()) localErrors.firstName = "Required";
    if (!shippingInfo.lastName.trim()) localErrors.lastName = "Required";
    if (!shippingInfo.address.trim()) localErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) localErrors.city = "City is required";
    if (!shippingInfo.phone.trim()) localErrors.phone = "Phone number is required";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      alert("Please fill in all mandatory shipping fields.");
      return;
    }

    const finalItemsSnapshot = (all_product || [])
      .filter(product => cartItems && (cartItems[product.id] > 0 || cartItems[product._id] > 0))
      .map(product => ({
        productId: Number(product.id || product._id),
        name: product.name,
        image: product.image,
        price: Number(product.new_price),
        size: product.selectedSize || "M", 
        quantity: Number(cartItems[product.id] || cartItems[product._id])
      }));

    const orderPayload = {
      items: finalItemsSnapshot,
      totalAmount: getTotalCartAmount() || 0,
      shippingAddress: {
        fullName: `${shippingInfo.firstName.trim()} ${shippingInfo.lastName.trim()}`,
        phone: shippingInfo.phone.trim(),
        addressLine: shippingInfo.address.trim(),
        city: shippingInfo.city.trim()
      }
    };

    const invoiceSnapshot = {
      items: finalItemsSnapshot,
      subtotal: getSubtotalAmount() || 0,
      discount: getDiscountAmount() || 0,
      tax: getTaxAmount() || 0,
      shipping: getShippingFee() || 0,
      grandTotal: getTotalCartAmount() || 0,
      orderId: Math.floor(100000 + Math.random() * 900000).toString()
    };

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:4000/api/orders/placeorder', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.success) {
        if (data.orderId) invoiceSnapshot.orderId = data.orderId;
        alert("🎉 Order processed successfully! Logged into operational fulfillment databases.");
        clearCart();
        navigate('/order-success', { state: { invoiceSnapshot }, replace: true });
      } else {
        alert(`❌ Backend Database Rejected Processing Request: ${data.message}`);
      }
      
    } catch (error) {
      console.error("Network timeout connecting with backend checkout hubs:", error);
      alert("❌ Critical server connection error. Failed to save purchase document data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasItemsInCart = Object.values(cartItems || {}).some(quantity => quantity > 0);

  if (!hasItemsInCart) {
    return (
      <div className="checkout-empty-state">
        <span className="empty-checkout-icon">🛒</span>
        <h2>Your shopping cart is empty</h2>
        <p style={{ marginTop: '8px' }}>Add premium products to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="premium-checkout-viewport">
      <div className="checkout-workspace-container">
        
        {/* Left Side: Form Ingestion Matrix */}
        <form onSubmit={handlePlaceOrder} className="modern-checkout-form-card">
          <div className="form-section-header">
            <h2>Shipping Information</h2>
            <p>Provide accurate destination logistics details for delivery management.</p>
          </div>
          
          <div className="form-row-grid">
            <div className="input-field-wrapper">
              <label>First Name *</label>
              <input type="text" name="firstName" placeholder="John" value={shippingInfo.firstName} onChange={handleInputChange} className={errors.firstName ? "input-error-border" : ""} disabled={isSubmitting} />
              {errors.firstName && <span className="input-err-msg-string">{errors.firstName}</span>}
            </div>
            <div className="input-field-wrapper">
              <label>Last Name *</label>
              <input type="text" name="lastName" placeholder="Doe" value={shippingInfo.lastName} onChange={handleInputChange} className={errors.lastName ? "input-error-border" : ""} disabled={isSubmitting} />
              {errors.lastName && <span className="input-err-msg-string">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-field-wrapper single-full-row">
            <label>Email Address (Optional)</label>
            <input type="email" name="email" placeholder="john.doe@example.com" value={shippingInfo.email} onChange={handleInputChange} disabled={isSubmitting} />
          </div>
          
          <div className="input-field-wrapper single-full-row">
            <label>Street Address *</label>
            <input type="text" name="address" placeholder="123 Luxury Avenue, Apartment Block B" value={shippingInfo.address} onChange={handleInputChange} className={errors.address ? "input-error-border" : ""} disabled={isSubmitting} />
            {errors.address && <span className="input-err-msg-string">{errors.address}</span>}
          </div>

          <div className="form-row-grid">
            <div className="input-field-wrapper">
              <label>City *</label>
              <input type="text" name="city" placeholder="Sahiwal" value={shippingInfo.city} onChange={handleInputChange} className={errors.city ? "input-error-border" : ""} disabled={isSubmitting} />
              {errors.city && <span className="input-err-msg-string">{errors.city}</span>}
            </div>
            <div className="input-field-wrapper">
              <label>Postal Code</label>
              <input type="text" name="postalCode" placeholder="57000" value={shippingInfo.postalCode} onChange={handleInputChange} disabled={isSubmitting} />
            </div>
          </div>

          <div className="input-field-wrapper single-full-row">
            <label>Phone Number *</label>
            <input type="text" name="phone" placeholder="+92 300 1234567" value={shippingInfo.phone} onChange={handleInputChange} className={errors.phone ? "input-error-border" : ""} disabled={isSubmitting} />
            {errors.phone && <span className="input-err-msg-string">{errors.phone}</span>}
          </div>

          <div className="form-section-header separation-border-top">
            <h2>Payment Architecture</h2>
            <p>Select your authorized transaction management clearance gateway method.</p>
          </div>
          
          <div className="premium-payment-options-box">
            <label className="custom-radio-container">
              <input type="radio" name="payment" defaultChecked readOnly />
              <div className="custom-radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
              <div className="radio-label-strings">
                <strong>Cash on Delivery (COD)</strong>
                <span>Pay securely with cash upon physical drop manifestation arrival.</span>
              </div>
            </label>
          </div>

          <button type="submit" className="premium-place-order-trigger" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="submitting-pulse-label">COMMITTING ORDER TRANSACTION MATRIX...</span>
            ) : (
              "PLACE ORDER NOW"
            )}
          </button>
        </form>

        {/* Right Side: Sticky Receipt Overview Tab */}
        <div className="checkout-sticky-summary-column">
          <div className="summary-canvas-header">
            <h3>Your Order Manifest</h3>
          </div>
          <div className="premium-summary-sticky-card">
            <div className="summary-itemized-calc-rows">
              <div className="summary-calc-row">
                <span>Cart Subtotal</span>
                <strong>${getSubtotalAmount().toFixed(2)}</strong>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="summary-calc-row state-discount-deduction">
                  <span>Coupon Discount</span>
                  <strong>-${getDiscountAmount().toFixed(2)}</strong>
                </div>
              )}
              <div className="summary-calc-row">
                <span>Estimated GST (5%)</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="summary-calc-row">
                <span>Shipping & Logistics</span>
                {getShippingFee() === 0 ? (
                  <span className="logistics-free-label">FREE</span>
                ) : (
                  <span>${getShippingFee().toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <hr className="summary-dashed-divider" />
            
            <div className="summary-calc-row final-grand-invoice-row">
              <h4>Grand Total</h4>
              <h4>${getTotalCartAmount().toFixed(2)}</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;