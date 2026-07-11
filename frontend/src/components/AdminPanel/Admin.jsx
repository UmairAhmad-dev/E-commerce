import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import AdminAnalytics from './AdminAnalytics';
import ManageCoupons from './ManageCoupons'; 
import ManageUsers from './ManageUsers';     

import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { allProducts } = useContext(ShopContext);
  const [isAuthorized, setIsAuthorized] = useState(false);

  /* ===================================================================
     🔒 LIVE SYSTEM ROLE AUDIT GUARD INTERCEPTOR SECURITY ENGINE
     =================================================================== */
  useEffect(() => {
    const checkAdminAuthorization = async () => {
      const token = localStorage.getItem('auth-token');
      
      // 1. If no token is present, bounce them out instantly[cite: 11]
      if (!token) {
        alert("⚠️ Access Denied: Authentication credentials missing. Redirecting to validation gateway."); //[cite: 11]
        window.location.href = "http://localhost:5173/login"; //[cite: 11]
        return;
      }

      try {
        // 2. Query our clean, dedicated profile checkpoint route instead of the full data table list
        const response = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` //[cite: 11]
          }
        });
        
        const data = await response.json();

        // 3. Explicitly verify if the backend authentication layer confirms the user is strictly an admin
        if (response.ok && data.success && data.role === "admin") {
          // Authorization cleared perfectly!
          setIsAuthorized(true);
        } else {
          // If token belongs to a standard role user, reject them[cite: 11]
          alert("🚫 Restricted Area: Administrative access credentials required."); //[cite: 11]
          window.location.href = "http://localhost:5173/login"; //[cite: 11]
        }
      } catch (error) {
        console.error("Security handshake verification error context:", error); //[cite: 11]
        alert("❌ System connection timeout during verification. Evacuating panel area."); //[cite: 11]
        window.location.href = "http://localhost:5173/login"; //[cite: 11]
      }
    };

    checkAdminAuthorization();
  }, []);

  /* ==========================================
     🚪 SECURE LOGOUT TERMINATION HANDLER
     ========================================== */
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to log out of the Admin Control Panel?")) { //[cite: 11]
      // Clear local storage entirely to destroy the session and prevent token bleeding[cite: 11]
      localStorage.clear();  //[cite: 11]
      
      // Kick user back to the storefront login screen[cite: 11]
      window.location.href = "http://localhost:5173/login"; //[cite: 11]
    }
  };

  // 🛡️ Prevent dashboard flashing/flickering while checking security clearances[cite: 11]
  if (!isAuthorized) {
    return (
      <div style={{
        height: '100vh', 
        backgroundColor: '#0f172a', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '600',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        🛡️ Verifying System Security Credentials...
      </div>
    ); //[cite: 11]
  }

  return (
    <div className="admin-dashboard-layout full-screen-override"> {/*[cite: 11] */}
      
      {/* Left Navigation Sidebar Drawer Panel */} {/*[cite: 11] */}
      <div className="admin-sidebar"> {/*[cite: 11] */}
        <div className="admin-brand-profile"> {/*[cite: 11] */}
          <h2>SHOPPER</h2> {/*[cite: 11] */}
          <span>Admin Portal v1.5</span> {/*[cite: 11] */}
        </div>
        
        {/* Professional Profile Badge */} {/*[cite: 11] */}
        <div className="sidebar-user-card-profile"> {/*[cite: 11] */}
          <div className="profile-initial-circle">UN</div> {/*[cite: 11] */}
          <div className="profile-meta-strings"> {/*[cite: 11] */}
            <h4>Ch. Umair Nadeem</h4>
            <p>System Administrator</p> {/*[cite: 11] */}
          </div>
        </div>

        <hr className="sidebar-divider" /> {/*[cite: 11] */}
        
        {/* 🧭 NAVIGATION LINKS MENU */} {/*[cite: 11] */}
        <div className="sidebar-menu-links"> {/*[cite: 11] */}
          <button className={`sidebar-link-btn ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}> {/*[cite: 11] */}
            📊 Dashboard Analytics
          </button>
          <button className={`sidebar-link-btn ${activeTab === "manage" ? "active" : ""}`} onClick={() => setActiveTab("manage")}> {/*[cite: 11] */}
            📋 Inventory Ledger
          </button>
          <button className={`sidebar-link-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}> {/*[cite: 11] */}
            ➕ Upload New Product
          </button>
          <button className={`sidebar-link-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}> {/*[cite: 11] */}
            📦 Order Fulfillment
          </button>
          <button className={`sidebar-link-btn ${activeTab === "coupons" ? "active" : ""}`} onClick={() => setActiveTab("coupons")}> {/*[cite: 11] */}
            🎟️ Promo Coupons
          </button>
          <button className={`sidebar-link-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}> {/*[cite: 11] */}
            👥 User Database
          </button>

          {/* 🌟 RED ACCENT LOGOUT BUTTON ANCHORED INSIDE THE NAVIGATION GROUP */} {/*[cite: 11] */}
          <button 
            onClick={logoutHandler} //[cite: 11]
            className="sidebar-link-btn" //[cite: 11]
            style={{ 
              marginTop: '30px', //[cite: 11]
              backgroundColor: '#ff4d4d', //[cite: 11]
              color: 'white', //[cite: 11]
              fontWeight: '700', //[cite: 11]
              textAlign: 'center', //[cite: 11]
              display: 'flex', //[cite: 11]
              alignItems: 'center', //[cite: 11]
              justifyContent: 'center', //[cite: 11]
              gap: '8px' //[cite: 11]
            }}
          >
            🚪 Secure Log Out
          </button>
        </div>
      </div>

      {/* Main Control Panel Display Area */} {/*[cite: 11] */}
      <div className="admin-main-workspace"> {/*[cite: 11] */}
        <header className="workspace-top-bar"> {/*[cite: 11] */}
          <div className="bar-title"> {/*[cite: 11] */}
            <h1>
              {activeTab === "analytics" && "Enterprise Business Insights"} {/*[cite: 11] */}
              {activeTab === "manage" && "Live Inventory Matrix"} {/*[cite: 11] */}
              {activeTab === "add" && "Product Catalog Ingestion Form"} {/*[cite: 11] */}
              {activeTab === "orders" && "Order Fulfillment Terminal"} {/*[cite: 11] */}
              {activeTab === "coupons" && "Campaign Coupon Manager"} {/*[cite: 11] */}
              {activeTab === "users" && "User Database Control Panel"} {/*[cite: 11] */}
            </h1>
            <p>Authorized Master Administrative Control Environment</p> {/*[cite: 11] */}
          </div>
          <div className="admin-avatar-badge"> {/*[cite: 11] */}
            <span className="online-indicator"></span> {/*[cite: 11] */}
            <strong>System Secure Connection Live</strong> {/*[cite: 11] */}
          </div>
        </header>

        <main className="workspace-core-view"> {/*[cite: 11] */}
          {activeTab === "analytics" && <AdminAnalytics />} {/*[cite: 11] */}
          {activeTab === "manage" && <ManageProducts />} {/*[cite: 11] */}
          {activeTab === "add" && <AddProduct />} {/*[cite: 11] */}
          {activeTab === "orders" && <ManageOrders />} {/*[cite: 11] */}
          {activeTab === "coupons" && <ManageCoupons />} {/*[cite: 11] */}
          {activeTab === "users" && <ManageUsers />} {/*[cite: 11] */}
        </main>
      </div>
    </div>
  );
};

export default Admin;