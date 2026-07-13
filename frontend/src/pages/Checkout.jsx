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
  } = useContext(ShopContext); //[cite: 11]
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "", lastName: "", email: "", address: "", city: "", postalCode: "", phone: ""
  }); //[cite: 11]
  const [errors, setErrors] = useState({}); //[cite: 11]
  const [isSubmitting, setIsSubmitting] = useState(false); //[cite: 11]
  
  // 🚀 REACTIVE STATE FOR INLINE FEEDBACK & PREMIUM TOASTS
  const [inlineFeedback, setInlineFeedback] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const navigate = useNavigate(); //[cite: 11]

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value }); //[cite: 11]
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" }); //[cite: 11]
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setInlineFeedback(""); 
    
    const token = localStorage.getItem('auth-token'); //[cite: 11]
    
    if (!token) {
      setInlineFeedback("⚠️ Verification required! Please log in to complete your purchase.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);
      return;
    }
    
    let localErrors = {}; //[cite: 11]
    if (!shippingInfo.firstName.trim()) localErrors.firstName = "Required"; //[cite: 11]
    if (!shippingInfo.lastName.trim()) localErrors.lastName = "Required"; //[cite: 11]
    if (!shippingInfo.address.trim()) localErrors.address = "Address is required"; //[cite: 11]
    if (!shippingInfo.city.trim()) localErrors.city = "City is required"; //[cite: 11]
    if (!shippingInfo.phone.trim()) localErrors.phone = "Phone number is required"; //[cite: 11]

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors); //[cite: 11]
      setInlineFeedback("❌ Submission Blocked: Please fill in all mandatory shipping fields.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      })); //[cite: 11]

    const orderPayload = {
      items: finalItemsSnapshot,
      totalAmount: getTotalCartAmount() || 0,
      shippingAddress: {
        fullName: `${shippingInfo.firstName.trim()} ${shippingInfo.lastName.trim()}`,
        phone: shippingInfo.phone.trim(),
        addressLine: shippingInfo.address.trim(),
        city: shippingInfo.city.trim()
      }
    }; //[cite: 11]

    const invoiceSnapshot = {
      items: finalItemsSnapshot,
      subtotal: getSubtotalAmount() || 0,
      discount: getDiscountAmount() || 0,
      tax: getTaxAmount() || 0,
      shipping: getShippingFee() || 0,
      grandTotal: getTotalCartAmount() || 0,
      orderId: Math.floor(100000 + Math.random() * 900000).toString()
    }; //[cite: 11]

    try {
      setIsSubmitting(true); //[cite: 11]

      const response = await fetch('http://localhost:4000/api/orders/placeorder', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      }); //[cite: 11]

      const data = await response.json(); //[cite: 11]

      if (data.success) {
        if (data.orderId) invoiceSnapshot.orderId = data.orderId; //[cite: 11]
        
        // 🚀 SHOW TOAST IMMEDIATELY
        setShowSuccessToast(true);
        
        // 🚀 HOLD NAVIGATION FOR 3 SECONDS SO TOAST RENDERS
        setTimeout(() => {
          setShowSuccessToast(false);
          clearCart(); //[cite: 11]
          setIsSubmitting(false); //[cite: 11]
          navigate('/order-success', { state: { invoiceSnapshot }, replace: true }); //[cite: 11]
        }, 3000);
        
      } else {
        setInlineFeedback(`❌ Processing Rejected: ${data.message}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSubmitting(false); //[cite: 11]
      }
      
    } catch (error) {
      console.error("Network timeout connecting with backend checkout hubs:", error); //[cite: 11]
      setInlineFeedback("❌ Critical server connection error. Failed to save purchase document data.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false); //[cite: 11]
    }
  };

  const hasItemsInCart = Object.values(cartItems || {}).some(quantity => quantity > 0); //[cite: 11]

  if (!hasItemsInCart) {
    return (
      <div className="checkout-empty-state">
        <span className="empty-checkout-icon">🛒</span>
        <h2>Your shopping cart is empty</h2>
        <p style={{ marginTop: '8px' }}>Add premium products to your cart before proceeding to checkout.</p>
      </div>
    ); //[cite: 11]
  }

  return (
    <div className="premium-checkout-viewport">
      
      {/* 🚀 FLOATING SUCCESS TOAST */}
      {showSuccessToast && (
        <div className="premium-order-success-toast">
          <div className="toast-icon-wrapper">🎉</div>
          <div className="toast-content-meta">
            <h4>Order processed successfully!</h4>
            <p>Logged into operational fulfillment databases.</p>
          </div>
        </div>
      )}

      <div className="checkout-workspace-container"> {/*[cite: 11] */}
        
        {/* Left Side: Form Ingestion Matrix */}
        <form onSubmit={handlePlaceOrder} className="modern-checkout-form-card"> {/*[cite: 11] */}
          
          <div className="form-section-header">
            <h2>Shipping Information</h2>
            <p>Provide accurate destination logistics details for delivery management.</p>
          </div> {/*[cite: 11] */}
          
          {/* 🚀 INLINE BANNER POSITION */}
          {inlineFeedback && (
            <div className={`checkout-inline-feedback-banner ${inlineFeedback.startsWith('⚠️') ? 'state-warn' : 'state-fail'}`}>
              {inlineFeedback}
            </div>
          )}
          
          <div className="form-row-grid"> {/*[cite: 11] */}
            <div className="input-field-wrapper">
              <label>First Name *</label> {/*[cite: 11] */}
              <input type="text" name="firstName" placeholder="John" value={shippingInfo.firstName} onChange={handleInputChange} className={errors.firstName ? "input-error-border" : ""} disabled={isSubmitting} /> {/*[cite: 11] */}
              {errors.firstName && <span className="input-err-msg-string">{errors.firstName}</span>} {/*[cite: 11] */}
            </div>
            <div className="input-field-wrapper">
              <label>Last Name *</label> {/*[cite: 11] */}
              <input type="text" name="lastName" placeholder="Doe" value={shippingInfo.lastName} onChange={handleInputChange} className={errors.lastName ? "input-error-border" : ""} disabled={isSubmitting} /> {/*[cite: 11] */}
              {errors.lastName && <span className="input-err-msg-string">{errors.lastName}</span>} {/*[cite: 11] */}
            </div>
          </div>

          <div className="input-field-wrapper single-full-row">
            <label>Email Address (Optional)</label> {/*[cite: 11] */}
            <input type="email" name="email" placeholder="john.doe@example.com" value={shippingInfo.email} onChange={handleInputChange} disabled={isSubmitting} /> {/*[cite: 11] */}
          </div>
          
          <div className="input-field-wrapper single-full-row">
            <label>Street Address *</label> {/*[cite: 11] */}
            <input type="text" name="address" placeholder="123 Luxury Avenue, Apartment Block B" value={shippingInfo.address} onChange={handleInputChange} className={errors.address ? "input-error-border" : ""} disabled={isSubmitting} /> {/*[cite: 11] */}
            {errors.address && <span className="input-err-msg-string">{errors.address}</span>} {/*[cite: 11] */}
          </div>

          <div className="form-row-grid"> {/*[cite: 11] */}
            <div className="input-field-wrapper">
              <label>City *</label> {/*[cite: 11] */}
              <input type="text" name="city" placeholder="Sahiwal" value={shippingInfo.city} onChange={handleInputChange} className={errors.city ? "input-error-border" : ""} disabled={isSubmitting} /> {/*[cite: 11] */}
              {errors.city && <span className="input-err-msg-string">{errors.city}</span>} {/*[cite: 11] */}
            </div>
            <div className="input-field-wrapper">
              <label>Postal Code</label> {/*[cite: 11] */}
              <input type="text" name="postalCode" placeholder="57000" value={shippingInfo.postalCode} onChange={handleInputChange} disabled={isSubmitting} /> {/*[cite: 11] */}
            </div>
          </div>

          <div className="input-field-wrapper single-full-row">
            <label>Phone Number *</label> {/*[cite: 11] */}
            <input type="text" name="phone" placeholder="+92 300 1234567" value={shippingInfo.phone} onChange={handleInputChange} className={errors.phone ? "input-error-border" : ""} disabled={isSubmitting} /> {/*[cite: 11] */}
            {errors.phone && <span className="input-err-msg-string">{errors.phone}</span>} {/*[cite: 11] */}
          </div>

          <div className="form-section-header separation-border-top">
            <h2>Payment Architecture</h2>
            <p>Select your authorized transaction management clearance gateway method.</p>
          </div> {/*[cite: 11] */}
          
          <div className="premium-payment-options-box"> {/*[cite: 11] */}
            <label className="custom-radio-container"> {/*[cite: 11] */}
              <input type="radio" name="payment" defaultChecked readOnly /> {/*[cite: 11] */}
              <div className="custom-radio-indicator"> {/*[cite: 11] */}
                <div className="radio-inner-dot"></div> {/*[cite: 11] */}
              </div>
              <div className="radio-label-strings"> {/*[cite: 11] */}
                <strong>Cash on Delivery (COD)</strong> {/*[cite: 11] */}
                <span>Pay securely with cash upon physical drop manifestation arrival.</span> {/*[cite: 11] */}
              </div>
            </label>
          </div>

          <button type="submit" className="premium-place-order-trigger" disabled={isSubmitting}> {/*[cite: 11] */}
            {isSubmitting ? (
              <span className="submitting-pulse-label">COMMITTING ORDER TRANSACTION MATRIX...</span>
            ) : (
              "PLACE ORDER NOW"
            )} {/*[cite: 11] */}
          </button>
        </form>

        {/* Right Side: Sticky Receipt Overview Tab */}
        <div className="checkout-sticky-summary-column"> {/*[cite: 11] */}
          <div className="summary-canvas-header"> {/*[cite: 11] */}
            <h3>Your Order Manifest</h3> {/*[cite: 11] */}
          </div>
          <div className="premium-summary-sticky-card"> {/*[cite: 11] */}
            <div className="summary-itemized-calc-rows"> {/*[cite: 11] */}
              <div className="summary-calc-row"> {/*[cite: 11] */}
                <span>Cart Subtotal</span> {/*[cite: 11] */}
                <strong>${getSubtotalAmount().toFixed(2)}</strong> {/*[cite: 11] */}
              </div>
              {getDiscountAmount() > 0 && (
                <div className="summary-calc-row state-discount-deduction">
                  <span>Coupon Discount</span> {/*[cite: 11] */}
                  <strong>-${getDiscountAmount().toFixed(2)}</strong> {/*[cite: 11] */}
                </div>
              )}
              <div className="summary-calc-row"> {/*[cite: 11] */}
                <span>Estimated GST (5%)</span> {/*[cite: 11] */}
                <span>${getTaxAmount().toFixed(2)}</span> {/*[cite: 11] */}
              </div>
              <div className="summary-calc-row"> {/*[cite: 11] */}
                <span>Shipping & Logistics</span> {/*[cite: 11] */}
                {getShippingFee() === 0 ? (
                  <span className="logistics-free-label">FREE</span>
                ) : (
                  <span>${getShippingFee().toFixed(2)}</span>
                )} {/*[cite: 11] */}
              </div>
            </div>
            
            <hr className="summary-dashed-divider" /> {/*[cite: 11] */}
            
            <div className="summary-calc-row final-grand-invoice-row"> {/*[cite: 11] */}
              <h4>Grand Total</h4> {/*[cite: 11] */}
              <h4>${getTotalCartAmount().toFixed(2)}</h4> {/*[cite: 11] */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;