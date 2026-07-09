import { useState, useContext } from 'react';
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

  return (
    <div className="admin-dashboard-layout full-screen-override">
      
      {/* Left Navigation Sidebar Drawer Panel */}
      <div className="admin-sidebar">
        <div className="admin-brand-profile">
          <h2>SHOPPER</h2>
          <span>Admin Portal v1.5</span>
        </div>
        
        {/* Professional Profile Badge */}
        <div className="sidebar-user-card-profile">
          <div className="profile-initial-circle">UN</div>
          <div className="profile-meta-strings">
            <h4>Ch. Umair Nadeem</h4>
            <p>System Administrator</p>
          </div>
        </div>

        <hr className="sidebar-divider" />
        
        <div className="sidebar-menu-links">
          <button className={`sidebar-link-btn ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            📊 Dashboard Analytics
          </button>
          <button className={`sidebar-link-btn ${activeTab === "manage" ? "active" : ""}`} onClick={() => setActiveTab("manage")}>
            📋 Inventory Ledger
          </button>
          <button className={`sidebar-link-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
            ➕ Upload New Product
          </button>
          <button className={`sidebar-link-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            📦 Order Fulfillment
          </button>
          <button className={`sidebar-link-btn ${activeTab === "coupons" ? "active" : ""}`} onClick={() => setActiveTab("coupons")}>
            🎟️ Promo Coupons
          </button>
          <button className={`sidebar-link-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            👥 User Database
          </button>
          <button className={`sidebar-link-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            ⚙️ Global Settings
          </button>
          <button className={`sidebar-link-btn ${activeTab === "logs" ? "active" : ""}`} onClick={() => setActiveTab("logs")}>
            🖥️ System Audit Logs
          </button>
        </div>
        
        <div className="sidebar-footer-exit">
          <a href="/" className="exit-portal-link">↩ Back To Live Storefront</a>
        </div>
      </div>

      {/* Main Control Panel Display Area */}
      <div className="admin-main-workspace">
        <header className="workspace-top-bar">
          <div className="bar-title">
            <h1>
              {activeTab === "analytics" && "Enterprise Business Insights"}
              {activeTab === "manage" && "Live Inventory Matrix"}
              {activeTab === "add" && "Product Catalog Ingestion Form"}
              {activeTab === "orders" && "Order Fulfillment Terminal"}
              {activeTab === "coupons" && "Campaign Coupon Manager"}
              {activeTab === "users" && "User Database Control Panel"}
              {activeTab === "settings" && "Global Store Configurations"}
              {activeTab === "logs" && "System Audit Log Streaming Grid"}
            </h1>
            <p>Authorized Master Administrative Control Environment</p>
          </div>
          <div className="admin-avatar-badge">
            <span className="online-indicator"></span>
            <strong>System Secure Connection Live</strong>
          </div>
        </header>

        <main className="workspace-core-view">
          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "manage" && <ManageProducts />}
          {activeTab === "add" && <AddProduct />}
          {activeTab === "orders" && <ManageOrders />}
          {activeTab === "coupons" && <ManageCoupons />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "settings" && <AdminSettings />}
          {activeTab === "logs" && <AdminLogs />}
        </main>
      </div>
    </div>
  );
};

export default Admin;