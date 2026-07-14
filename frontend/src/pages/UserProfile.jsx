import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '', email: '', currentPassword: '', newPassword: '', phone: '', address: '', city: '', postalCode: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUpdating, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setMessage({ text: '⚠️ Please sign in to access your profile settings.', type: 'error' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch current profile data
        const profileRes = await fetch('http://localhost:4000/api/users/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileJson = await profileRes.json();
        if (profileJson.success && profileJson.user) {
          setProfileData(prev => ({
            ...prev,
            name: profileJson.user.name || '',
            email: profileJson.user.email || '',
            phone: profileJson.user.phone || '',
            address: profileJson.user.address || '',
            city: profileJson.user.city || '',
            postalCode: profileJson.user.postalCode || ''
          }));
        }

        // 2. Fetch authenticated order history logs
        const ordersRes = await fetch('http://localhost:4000/api/orders/myorders', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersJson = await ordersRes.json();
        if (ordersJson.success) {
          setOrders(ordersJson.orders || []);
        }
      } catch (error) {
        console.error('Error connecting with backend profile hubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndOrders();
  }, []);

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    
    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:4000/api/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: '🎉 Profile settings successfully updated inside the matrix ledger!', type: 'success' });
        setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setMessage({ text: `❌ Update Rejected: ${data.message}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: '❌ Critical security server connection timeout.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-vault">
        <div className="profile-spinner-ring"></div>
        <p>Retrieving Verified Profile Specifications...</p>
      </div>
    );
  }

  return (
    <div className="premium-profile-viewport">
      <div className="profile-workspace-container">
        
        {/* Left Side: Modern Identity Panel card */}
        <aside className="profile-identity-card">
          <div className="user-avatar-avatar-badge">
            {profileData.name ? profileData.name.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <h2 className="user-title-headline">{profileData.name || 'Boutique Client'}</h2>
          <p className="user-subtitle-string">{profileData.email}</p>
          
          <div className="profile-navigation-tabs">
            <button 
              className={`profile-nav-tab-btn ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => { setActiveTab('profile'); setMessage({ text: '', type: '' }); }}
            >
              👤 Profile Information
            </button>
            <button 
              className={`profile-nav-tab-btn ${activeTab === 'orders' ? 'tab-active' : ''}`}
              onClick={() => { setActiveTab('orders'); setMessage({ text: '', type: '' }); }}
            >
              📦 Order History ({orders.length})
            </button>
          </div>
        </aside>

        {/* Right Side: Main Settings Grid View */}
        <main className="profile-main-settings-card">
          {message.text && (
            <div className={`profile-inline-feedback-banner ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-content-view animated-fade">
              <div className="settings-section-header">
                <h2>Account Settings</h2>
                <p>Update your shipping specifications, contact methods, and master access codes.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="profile-ingestion-form">
                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <label>Full Name</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleInputChange} required placeholder="John Doe" />
                  </div>
                  <div className="input-field-wrapper">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={profileData.phone} onChange={handleInputChange} placeholder="+92 300 1234567" />
                  </div>
                </div>

                <div className="input-field-wrapper single-full-row">
                  <label>Email Address</label>
                  <input type="email" name="email" value={profileData.email} disabled className="disabled-input" />
                </div>

                <div className="input-field-wrapper single-full-row">
                  <label>Street Address</label>
                  <input type="text" name="address" value={profileData.address} onChange={handleInputChange} placeholder="123 Luxury Avenue, Apartment Block B" />
                </div>

                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <label>City</label>
                    <input type="text" name="city" value={profileData.city} onChange={handleInputChange} placeholder="Sahiwal" />
                  </div>
                  <div className="input-field-wrapper">
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" value={profileData.postalCode} onChange={handleInputChange} placeholder="57000" />
                  </div>
                </div>

                <div className="settings-divider-dashed" />

                <div className="settings-section-header">
                  <h2>Update Security Credentials</h2>
                  <p>Leave fields blank if you do not wish to modify your active portal password.</p>
                </div>

                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={profileData.currentPassword} onChange={handleInputChange} placeholder="••••••••" />
                  </div>
                  <div className="input-field-wrapper">
                    <label>New Passkey / Password</label>
                    <input type="password" name="newPassword" value={profileData.newPassword} onChange={handleInputChange} placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" className="profile-action-submit-btn" disabled={isUpdating}>
                  {isUpdating ? 'SYNCHRONIZING RECORDS...' : 'SAVE CHANGES'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="settings-content-view animated-fade">
              <div className="settings-section-header">
                <h2>Purchase History</h2>
                <p>Track delivery status manifests and verify chronological invoice calculations.</p>
              </div>

              <div className="orders-timeline-wrapper">
                {orders.length === 0 ? (
                  <div className="profile-empty-orders-state">
                    <span className="fallback-empty-icon">🛍️</span>
                    <h3>No past order tracking records located</h3>
                    <p>When you acquire items from the boutique lookbooks, they will show up here.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.orderId} className="user-order-timeline-card">
                      <div className="order-card-top-summary">
                        <div>
                          <span className="order-id-label">ORDER ID</span>
                          <h4>#{order.orderId}</h4>
                        </div>
                        <div>
                          <span className="order-id-label">DATE PLACED</span>
                          <p className="order-date-text">{new Date(order.date).toLocaleDateString('en-PK', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <span className="order-id-label">TOTAL AMOUNT</span>
                          <h4 className="order-total-price">Rs. {order.totalAmount.toLocaleString('en-PK')}</h4>
                        </div>
                        <div>
                          <span className={`order-status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                        </div>
                      </div>

                      <div className="order-card-items-scroller-box">
                        {order.items?.map((item, index) => (
                          <div key={index} className="order-nested-item-row">
                            <img src={item.image} alt={item.name} className="order-nested-thumb" />
                            <div className="order-nested-details">
                              <h5>{item.name}</h5>
                              <p>Size: <span>{item.size}</span> | Qty: <span>{item.quantity}</span></p>
                            </div>
                            <div className="order-nested-price">
                              Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default UserProfile;