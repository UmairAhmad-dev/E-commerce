import { useState } from 'react';
import './AdminPortalAuth.css';
import videoBg from '../../assets/auth-bg.mp4'; 

const AdminPortalAuth = ({ onLoginSuccess }) => {
  const [isLoginState, setIsLoginState] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [adminAuthError, setAdminAuthError] = useState("");
  const [isFormAnimating, setIsFormAnimating] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (adminAuthError) setAdminAuthError(""); 
  };

  const handlePanelStateToggle = () => {
    setIsFormAnimating(true);
    setAdminAuthError("");
    setTimeout(() => {
      setIsLoginState(!isLoginState);
      setIsFormAnimating(false);
    }, 200);
  };

  const executeAdminAuth = async (e) => {
    e.preventDefault();
    setAdminAuthError("");
    
    const endpoint = isLoginState 
      ? 'http://localhost:4000/api/users/admin-login' 
      : 'http://localhost:4000/api/users/admin-signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data.success) {
        // 🚀 Saved to sessionStorage to isolate dashboard state management parameters
        sessionStorage.setItem('auth-token', data.token);
        setAdminAuthError(isLoginState ? "🎉 Clearance accepted. Loading secure console..." : "🎉 Entity profile provisioned successfully!");
        
        if (isLoginState) {
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
          }, 1500);
        } else {
          setTimeout(() => {
            setFormData({ name: "", email: "", password: "" });
            setIsLoginState(true);
            setAdminAuthError("");
          }, 1500);
        }
      } else {
        setAdminAuthError(data.message || "Access Denied: Invalid parameters.");
      }
    } catch (error) {
      console.error("Administrative gate connection breakdown:", error);
      setAdminAuthError("❌ Critical security server connection timeout.");
    }
  };

  return (
    <div className="admin-auth-viewport">
      <video className="admin-video-canvas" src={videoBg} autoPlay loop muted playsInline />
      <div className="admin-video-tint-overlay"></div>

      <div className={`admin-glass-control-card ${isFormAnimating ? 'admin-panel-leaving' : ''}`}>
        <div className="admin-auth-brand-header">
          <h2>SHOPPER CONTROL HUB</h2>
          <p>{isLoginState ? "Master Console Verification Gateway" : "Provision New System Administrator Entity"}</p>
        </div>

        {adminAuthError && (
          <div className={`admin-inline-feedback ${adminAuthError.startsWith('🎉') ? 'admin-msg-ok' : 'admin-msg-err'}`}>
            {adminAuthError}
          </div>
        )}

        <form onSubmit={executeAdminAuth} className="admin-ingestion-form">
          {!isLoginState && (
            <div className="admin-input-group-animated">
              <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleInputChange} required />
              <label className="admin-floating-placeholder">Administrator Full Name</label>
            </div>
          )}
          
          <div className="admin-input-group-animated">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleInputChange} required />
            <label className="admin-floating-placeholder">Secure Core Email Address</label>
          </div>
          
          <div className="admin-input-group-animated">
            <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleInputChange} required />
            <label className="admin-floating-placeholder">Console Passkey / Password</label>
          </div>

          <button type="submit" className="admin-action-submit-btn-wide">
            {isLoginState ? "Authorize Core Console Connection" : "Deploy Secure Admin Record"}
          </button>
        </form>

        <p className="admin-auth-toggle-string" onClick={handlePanelStateToggle}>
          {isLoginState ? "🔧 Register secondary supervisor node" : "🔑 Return to secure console login gate"}
        </p>
      </div>
    </div>
  );
};

export default AdminPortalAuth;