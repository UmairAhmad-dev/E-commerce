import { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import AdminAnalytics from './AdminAnalytics';
import ManageCoupons from './ManageCoupons'; 
import ManageUsers from './ManageUsers';     
import AdminPortalAuth from './AdminPortalAuth'; // 🚀 Imported to render inline on /admin path
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); // Added clean loading execution state

  useEffect(() => {
    const checkAdminAuthorization = async () => {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setLoading(false);
        return; // Halt process quietly so the inline login card can take over the render tree
      }

      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok && data.success && data.role === "admin") {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('auth-token'); // Clear corrupted/expired token structures
        }
      } catch (error) {
        console.error("Security handshake verification error context:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuthorization();
  }, []);

  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to log out of the Admin Control Panel?")) {
      localStorage.removeItem('auth-token');  
      setIsAuthorized(false); // Drop authority state instantly to flip layout back to the auth page view
    }
  };

  // Display a crisp, animated verification loader while parsing active JWT browser states
  if (loading) {
    return (
      <div className="admin-gate-pulse-loader">
        <div className="security-spinner-ring"></div>
        <p>🛡️ Verifying Enterprise Security Credentials...</p>
      </div>
    );
  }

  /* ===================================================================
     🔒 INLINE SECURITY GUARD INTERCEPTOR
     If authority verification fails, swap layout directly for the login gate
     =================================================================== */
  if (!isAuthorized) {
    return <AdminPortalAuth onLoginSuccess={() => setIsAuthorized(true)} />;
  }

  // 📊 AUTHORIZED STATE: Render the complete administrative dashboard workspace layout
  return (
    <div className="admin-dashboard-layout full-screen-override">
      
      {/* Left Navigation Sidebar Drawer Panel */}
      <aside className="admin-sidebar">
        <div className="admin-brand-profile">
          <h2>SHOPPER</h2>
          <span className="version-pill">CORE v1.5</span>
        </div>
        
        <div className="sidebar-user-card-profile">
          <div className="profile-initial-circle">UN</div>
          <div className="profile-meta-strings">
            <h4>Ch. Umair Nadeem</h4> {/* 🚀 Synchronized to match profile metadata perfectly */}
            <span className="role-indicator-badge">System Administrator</span>
          </div>
        </div>

        <div className="sidebar-divider" />
        
        {/* 🧭 NAVIGATION LINKS MENU */}
        <nav className="sidebar-menu-links">
          <button className={`sidebar-link-btn ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <span className="nav-icon-glyph">📊</span> Dashboard Analytics
          </button>
          <button className={`sidebar-link-btn ${activeTab === "manage" ? "active" : ""}`} onClick={() => setActiveTab("manage")}>
            <span className="nav-icon-glyph">📋</span> Inventory Ledger
          </button>
          <button className={`sidebar-link-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
            <span className="nav-icon-glyph">➕</span> Upload Product
          </button>
          <button className={`sidebar-link-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            <span className="nav-icon-glyph">📦</span> Order Fulfillment
          </button>
          <button className={`sidebar-link-btn ${activeTab === "coupons" ? "active" : ""}`} onClick={() => setActiveTab("coupons")}>
            <span className="nav-icon-glyph">🎟️</span> Promo Coupons
          </button>
          <button className={`sidebar-link-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <span className="nav-icon-glyph">👥</span> User Database
          </button>
        </nav>

        <div className="sidebar-footer-exit">
          <button onClick={logoutHandler} className="exit-portal-btn">
            <span>🚪 Secure Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Control Panel Display Area */}
      <main className="admin-main-workspace">
        <header className="workspace-top-bar">
          <div className="bar-title">
            <h1>
              {activeTab === "analytics" && "Enterprise Business Insights"}
              {activeTab === "manage" && "Live Inventory Matrix"}
              {activeTab === "add" && "Product Catalog Ingestion Form"}
              {activeTab === "orders" && "Order Fulfillment Terminal"}
              {activeTab === "coupons" && "Campaign Coupon Manager"}
              {activeTab === "users" && "User Database Control Panel"}
            </h1>
            <p>Authorized Master Administrative Control Environment</p>
          </div>
          <div className="admin-avatar-badge">
            <span className="online-indicator"></span>
            <strong>System Secure Connection Live</strong>
          </div>
        </header>

        <div className="workspace-core-view">
          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "manage" && <ManageProducts />}
          {activeTab === "add" && <AddProduct />}
          {activeTab === "orders" && <ManageOrders />}
          {activeTab === "coupons" && <ManageCoupons />}
          {activeTab === "users" && <ManageUsers />}
        </div>
      </main>
    </div>
  );
};

export default Admin;