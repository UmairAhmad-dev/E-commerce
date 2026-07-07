import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  // Destructured clearCart from ShopContext
  const { 
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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    let localErrors = {};
    
    // Simple validation schema
    if (!shippingInfo.firstName.trim()) localErrors.firstName = "Required";
    if (!shippingInfo.lastName.trim()) localErrors.lastName = "Required";
    if (!shippingInfo.address.trim()) localErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) localErrors.city = "City is required";
    if (!shippingInfo.phone.trim()) localErrors.phone = "Phone number is required";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      alert("Please fill in all mandatory shipping fields.");
    } else {
      // 1. Reset the global cart state and localStorage
      clearCart();
      
      // 2. Successful checkout submission path trigger
      navigate('/order-success');
    }
  };

  if (getTotalCartAmount() === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your shopping cart is empty.</h2>
        <p>Add products to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* Left Side: Shipping Form */}
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h2>Shipping Information</h2>
          
          <div className="form-row">
            <div className="input-field">
              <input type="text" name="firstName" placeholder="First Name" value={shippingInfo.firstName} onChange={handleInputChange} className={errors.firstName ? "error-border" : ""} />
              {errors.firstName && <span className="err-msg">{errors.firstName}</span>}
            </div>
            <div className="input-field">
              <input type="text" name="lastName" placeholder="Last Name" value={shippingInfo.lastName} onChange={handleInputChange} className={errors.lastName ? "error-border" : ""} />
              {errors.lastName && <span className="err-msg">{errors.lastName}</span>}
            </div>
          </div>

          <input type="email" name="email" placeholder="Email Address (Optional)" value={shippingInfo.email} onChange={handleInputChange} />
          
          <div className="input-field">
            <input type="text" name="address" placeholder="Street Address" value={shippingInfo.address} onChange={handleInputChange} className={errors.address ? "error-border" : ""} />
            {errors.address && <span className="err-msg">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="input-field">
              <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} className={errors.city ? "error-border" : ""} />
              {errors.city && <span className="err-msg">{errors.city}</span>}
            </div>
            <input type="text" name="postalCode" placeholder="Postal Code" value={shippingInfo.postalCode} onChange={handleInputChange} />
          </div>

          <div className="input-field">
            <input type="text" name="phone" placeholder="Phone Number" value={shippingInfo.phone} onChange={handleInputChange} className={errors.phone ? "error-border" : ""} />
            {errors.phone && <span className="err-msg">{errors.phone}</span>}
          </div>

          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className="radio-container">
              <input type="radio" name="payment" defaultChecked />
              <span className="checkmark"></span>
              Cash on Delivery (COD)
            </label>
          </div>

          <button type="submit" className="place-order-btn">PLACE ORDER NOW</button>
        </form>

        {/* Right Side: Order Summary Sticky Panel */}
        <div className="checkout-summary-panel">
          <h3>Your Order</h3>
          <div className="summary-card">
            <div className="summary-row">
              <p>Subtotal</p>
              <p>${getSubtotalAmount().toFixed(2)}</p>
            </div>
            {getDiscountAmount() > 0 && (
              <div className="summary-row discount">
                <p>Coupon Discount</p>
                <p>-${getDiscountAmount().toFixed(2)}</p>
              </div>
            )}
            <div className="summary-row">
              <p>Estimated GST (5%)</p>
              <p>${getTaxAmount().toFixed(2)}</p>
            </div>
            <div className="summary-row">
              <p>Shipping</p>
              <p>{getShippingFee() === 0 ? "FREE" : `$${getShippingFee().toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="summary-row total">
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