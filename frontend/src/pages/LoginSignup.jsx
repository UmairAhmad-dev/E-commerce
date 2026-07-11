import React, { useState } from 'react';
import './LoginSignup.css'; 
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔑 1. CALL BACKEND LOGIN ENDPOINT
  const login = async () => {
    console.log("Executing client validation check...", formData);
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      const data = await response.json();

      if (data.success) {
        // Save the JWT secure token and metadata inside local browser memory
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-name', data.user.name);
        localStorage.setItem('user-role', data.user.role);

        // 🛡️ ROLE SEPARATION GATEWAY
        if (data.user.role === 'admin') {
          alert(`Welcome back Administrator ${data.user.name}! Redirecting to Admin Dashboard.`);
          // ⏳ Gives the DOM 100ms to dismiss the alert state before executing navigation
          setTimeout(() => {
            navigate('/admin');
          }, 100);
        } else {
          // If a standard customer, take them right back to complete their checkout or browse
          window.location.replace('/cart');
        }
      } else {
        alert(data.message || "Invalid email or password credentials.");
      }
    } catch (error) {
      console.error("Login component execution error:", error);
      alert("Backend validation server is currently unreachable.");
    }
  };

  // 📝 2. CALL BACKEND SIGNUP ENDPOINT
  const signUp = async () => {
    console.log("Executing client profile creation sequence...", formData);
    try {
      const response = await fetch('http://localhost:4000/api/users/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
      });
      
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-name', data.user.name);
        localStorage.setItem('user-role', data.user.role);

        alert("Account profile registered successfully!");
        window.location.replace('/');
      } else {
        alert(data.message || "Registration failed. Email might already be taken.");
      }
    } catch (error) {
      console.error("Signup component execution error:", error);
      alert("Backend registration server is currently unreachable.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (state === "Login") {
      login();
    } else {
      signUp();
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container animated-fade">
        <div className="loginsignup-header">
          <h1>{state === "Login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="loginsignup-subtitle">
            {state === "Login" 
              ? "Sign in to access your secure profile and dashboard matrix layout settings." 
              : "Join our master collection deployment matrix environment."}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="loginsignup-form-shell">
          <div className="loginsignup-fields">
            {state === "Sign Up" && (
              <div className="input-group">
                <label className="field-meta-label">Full Name</label>
                <input 
                  type="text" 
                  name='username' 
                  value={formData.username} 
                  onChange={changeHandler} 
                  placeholder='Your Name' 
                  required
                />
              </div>
            )}
            
            <div className="input-group">
              <label className="field-meta-label">Email Address</label>
              <input 
                type="email" 
                name='email' 
                value={formData.email} 
                onChange={changeHandler} 
                placeholder='name@example.com' 
                required
              />
            </div>
            
            <div className="input-group">
              <label className="field-meta-label">Password Account Code</label>
              <input 
                type="password" 
                name='password' 
                value={formData.password} 
                onChange={changeHandler} 
                placeholder='••••••••' 
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-action-trigger-btn">
            {state === "Login" ? "Sign In Securely" : "Register Credentials"}
          </button>
        </form>

        <div className="loginsignup-agree">
          <input type="checkbox" id='agree-checkbox' defaultChecked required />
          <label htmlFor='agree-checkbox'>
            By continuing, I explicitly agree to the structural terms of use & data privacy protection protocols.
          </label>
        </div>

        <hr className="auth-structural-divider" />

        <div className="auth-toggle-footer-wrapper">
          {state === "Sign Up" ? (
            <p className="loginsignup-login">
              Already have verified operational credentials? <span onClick={() => { setState("Login") }}>Login here</span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Need to establish a system profile vector? <span onClick={() => { setState("Sign Up") }}>Create account</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;