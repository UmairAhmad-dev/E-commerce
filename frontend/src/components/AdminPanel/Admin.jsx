import { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import AdminAnalytics from './AdminAnalytics';
import ManageCoupons from './ManageCoupons'; 
import ManageUsers from './ManageUsers';     
import ManageReviews from './ManageReviews'; 
import AdminPortalAuth from './AdminPortalAuth';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); 
  
  // STATE FOR CUSTOM OVERLAY DIALOGUE
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkAdminAuthorization = async () => {
      const token = sessionStorage.getItem('auth-token');
      
      if (!token) {
        setLoading(false); 
        return;
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
          sessionStorage.removeItem('auth-token'); 
        }
      } catch (error) {
        console.error("Security handshake verification error context:", error);
      } finally {
        setLoading(false); 
      }
    };

    checkAdminAuthorization();

    // THE UNMOUNT CLEANER: This triggers the exact second the admin leaves the admin panel route
    return () => {
      sessionStorage.removeItem('auth-token');
    };
  }, []);

  const executeLogout = () => {
    sessionStorage.clear();  
    setIsAuthorized(false); 
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return (
      <div className="admin-gate-pulse-loader">
        <div className="security-spinner-ring"></div>
        <p>🛡️ Verifying Enterprise Security Credentials...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <AdminPortalAuth onLoginSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <div className="admin-dashboard-layout full-screen-override">
      <aside className="admin-sidebar">
        <div className="admin-brand-profile">
          <h2>SHOPPER</h2>
          <span className="version-pill">CORE v1.5</span>
        </div>
        
        <div className="sidebar-user-card-profile">
          <div className="profile-initial-circle">UA</div>
          <div className="profile-meta-strings">
            <h4>Umair Ahmad</h4>
            <span className="role-indicator-badge">System Administrator</span>
          </div>
        </div>

        <div className="sidebar-divider" />
        
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
          
          <button className={`sidebar-link-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
            <span className="nav-icon-glyph" style={{ color: '#f59e0b' }}>⭐</span> Moderate Reviews
          </button>
        </nav>

        <div className="sidebar-footer-exit">
          <button onClick={() => setShowLogoutConfirm(true)} className="exit-portal-btn">
            <span>🚪 Secure Exit Portal</span>
          </button>
        </div>
      </aside>

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
              {activeTab === "reviews" && "Product Review Moderation Portal"} 
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
          {activeTab === "reviews" && <ManageReviews />} 
        </div>
      </main>

      {/* PREMIUM CONFIRMATION OVERLAY MODAL */}
      {showLogoutConfirm && (
        <div className="admin-modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="admin-modal-content-card animated-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className="modal-header-dock">
              <h3>Admin Session Exit</h3>
              <button className="modal-close-trigger" onClick={() => setShowLogoutConfirm(false)}>×</button>
            </div>
            
            <div className="modal-details-ledger-body" style={{ padding: "12px 0 24px 0" }}>
              <p style={{ margin: 0, fontSize: "14.5px", color: "#475569", lineHeight: "1.6" }}>
                Are you sure you want to completely terminate your active admin connection tokens and log out of the dashboard portal workspace?
              </p>
            </div>
            
            <div className="modal-actions-bar" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                className="table-action-inspect-btn text-muted" 
                onClick={() => setShowLogoutConfirm(false)}
                style={{ border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px", background: "none", cursor: "pointer", fontWeight: "600" }}
              >
                Stay Logged In
              </button>
              <button 
                onClick={executeLogout}
                style={{ 
                  backgroundColor: "#ef4444", 
                  color: "#ffffff", 
                  border: "none", 
                  padding: "8px 20px", 
                  borderRadius: "8px", 
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Yes, Terminate 🚪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;