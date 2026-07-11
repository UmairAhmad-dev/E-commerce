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

    // 1. Structure final ordered line items array matching schema types exactly
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

      // 🚀 2. SEND POST FETCH REQUEST WITH VALIDATED API ACCEPT PIPELINE HEADERS
      const response = await fetch('http://localhost:4000/api/orders/placeorder', {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // ✅ Key addition to sync with endpoint routing guidelines!
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
              <input type="text" name="firstName" placeholder="First Name" value={shippingInfo.firstName} onChange={handleInputChange} className={errors.firstName ? "error-border" : ""} disabled={isSubmitting} />
              {errors.firstName && <span className="err-msg">{errors.firstName}</span>}
            </div>
            <div className="input-field">
              <input type="text" name="lastName" placeholder="Last Name" value={shippingInfo.lastName} onChange={handleInputChange} className={errors.lastName ? "error-border" : ""} disabled={isSubmitting} />
              {errors.lastName && <span className="err-msg">{errors.lastName}</span>}
            </div>
          </div>

          <input type="email" name="email" placeholder="Email Address (Optional)" value={shippingInfo.email} onChange={handleInputChange} disabled={isSubmitting} />
          
          <div className="input-field">
            <input type="text" name="address" placeholder="Street Address" value={shippingInfo.address} onChange={handleInputChange} className={errors.address ? "error-border" : ""} disabled={isSubmitting} />
            {errors.address && <span className="err-msg">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="input-field">
              <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} className={errors.city ? "error-border" : ""} disabled={isSubmitting} />
              {errors.city && <span className="err-msg">{errors.city}</span>}
            </div>
            <input type="text" name="postalCode" placeholder="Postal Code" value={shippingInfo.postalCode} onChange={handleInputChange} disabled={isSubmitting} />
          </div>

          <div className="input-field">
            <input type="text" name="phone" placeholder="Phone Number" value={shippingInfo.phone} onChange={handleInputChange} className={errors.phone ? "error-border" : ""} disabled={isSubmitting} />
            {errors.phone && <span className="err-msg">{errors.phone}</span>}
          </div>

          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className="radio-container">
              <input type="radio" name="payment" defaultChecked readOnly />
              <span className="checkmark"></span>
              Cash on Delivery (COD)
            </label>
          </div>

          <button type="submit" className="place-order-btn" disabled={isSubmitting}>
            {isSubmitting ? "TRANSMITTING PURCHASE OVER CLOUD NETWORK..." : "PLACE ORDER NOW"}
          </button>
        </form>

        {/* Right Side: Order Summary sticky side bar panel */}
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