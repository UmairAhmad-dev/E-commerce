import { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = (e) => {
    e.preventDefault();
    alert(`Successfully completed local execution context for action: ${state}`);
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <form onSubmit={handleAction} className="loginsignup-fields">
          {state === "Sign Up" && (
            <input 
              type="text" 
              placeholder="Your Name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required 
          />
          <button type="submit">Continue</button>
        </form>
        
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => setState("Sign Up")}>Click here</span>
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