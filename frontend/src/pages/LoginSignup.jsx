import { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing again
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let localErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (state === "Sign Up" && !formData.name.trim()) {
      localErrors.name = "Name field is required.";
    }
    if (!formData.email.trim()) {
      localErrors.email = "Email field is required.";
    } else if (!emailRegex.test(formData.email)) {
      localErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      localErrors.password = "Password field is required.";
    } else if (formData.password.length < 6) {
      localErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleAction = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert(`Validation Successful! Proceeding with API ${state} payload context.`);
      // Reset form on success
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <form onSubmit={handleAction} className="loginsignup-fields">
          {state === "Sign Up" && (
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Your Name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}
          
          <div className="input-group">
            <input 
              type="text" /* Changed to text to manually control clean regex validation testing */
              placeholder="Email Address" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <button type="submit">Continue</button>
        </form>
        
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => { setState("Login"); setErrors({}); }}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => { setState("Sign Up"); setErrors({}); }}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" id="agree-terms" required />
          <label htmlFor="agree-terms">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;