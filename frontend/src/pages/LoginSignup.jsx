import React, { useState } from 'react';
import './LoginSignup.css'; 
import { useNavigate } from 'react-router-dom';
import videoBg from '../assets/auth-bg.mp4'; // 🚀 Import the looping background video

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  
  const [authError, setAuthError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(""); 
  };

  const handleStateToggle = (targetState) => {
    setIsAnimating(true);
    setAuthError("");
    setTimeout(() => {
      setState(targetState);
      setIsAnimating(false);
    }, 200); 
  };

  const login = async () => {
    setAuthError("");
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
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-name', data.user.name);
        localStorage.setItem('user-role', data.user.role);

        if (data.user.role === 'admin') {
          setAuthError("🎉 Verified Administrator. Launching console...");
          setTimeout(() => { navigate('/admin'); }, 1500);
        } else {
          window.location.replace('/cart');
        }
      } else {
        setAuthError(data.message || "Invalid credentials.");
      }
    } catch (error) {
      setAuthError("❌ Backend validation server is offline.");
    }
  };

  const signUp = async () => {
    setAuthError("");
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

        setAuthError("🎉 Profile registered successfully!");
        setTimeout(() => { window.location.replace('/'); }, 1500);
      } else {
        setAuthError(data.message || "Registration failed.");
      }
    } catch (error) {
      setAuthError("❌ Backend registration server is offline.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    state === "Login" ? login() : signUp();
  };

  return (
    <div className='loginsignup-viewport'>
      {/* 🚀 VIDEO BACKGROUND CORE ENGINE */}
      <video className="auth-video-background" src={videoBg} autoPlay loop muted playsInline />
      
      {/* Dark overlay sheet to maintain crisp text contrast ratios */}
      <div className="video-dark-overlay"></div>

      <div className={`loginsignup-glass-card ${isAnimating ? 'state-leaving' : ''}`}>
        <div className="loginsignup-header">
          <h1>{state === "Login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="loginsignup-subtitle">
            {state === "Login" 
              ? "Access your secure profile layout settings." 
              : "Join our master collection deployment matrix."}
          </p>
        </div>

        {authError && (
          <div className={`auth-inline-feedback-msg ${authError.startsWith('🎉') ? 'msg-success' : 'msg-error'}`}>
            {authError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="loginsignup-form-shell">
          <div className="loginsignup-fields">
            {state === "Sign Up" && (
              <div className="input-group-animated">
                <input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder=' ' required />
                <label className="floating-placeholder">Full Name</label>
              </div>
            )}
            
            <div className="input-group-animated">
              <input type="email" name='email' value={formData.email} onChange={changeHandler} placeholder=' ' required />
              <label className="floating-placeholder">Email Address</label>
            </div>
            
            <div className="input-group-animated">
              <input type="password" name='password' value={formData.password} onChange={changeHandler} placeholder=' ' required />
              <label className="floating-placeholder">Password</label>
            </div>
          </div>
          
          <button type="submit" className="auth-action-trigger-btn">
            {state === "Login" ? "Sign In Securely" : "Register Credentials"}
          </button>
        </form>

        <div className="loginsignup-agree">
          <input type="checkbox" id='agree-checkbox' defaultChecked required />
          <label htmlFor='agree-checkbox'>
            I agree to the structural terms of use & privacy protocols.
          </label>
        </div>

        <hr className="auth-structural-divider" />

        <div className="auth-toggle-footer-wrapper">
          {state === "Sign Up" ? (
            <p className="loginsignup-login">
              Already verified? <span onClick={() => handleStateToggle("Login")}>Login here</span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Need a system profile? <span onClick={() => handleStateToggle("Sign Up")}>Create account</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;