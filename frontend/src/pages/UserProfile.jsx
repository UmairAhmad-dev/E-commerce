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
        setMessage({ text: '🎉 Profile settings successfully updated!', type: 'success' });
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
              <span className="tab-icon">👤</span> Profile Information
            </button>
            <button 
              className={`profile-nav-tab-btn ${activeTab === 'orders' ? 'tab-active' : ''}`}
              onClick={() => { setActiveTab('orders'); setMessage({ text: '', type: '' }); }}
            >
              <span className="tab-icon">📦</span> Order History ({orders.length})
            </button>
          </div>
        </aside>

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
                <p>Update your shipping specifications, contact methods, and access configuration parameters.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="profile-ingestion-form">
                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <input 
                      type="text" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder=" "
                    />
                    <label className="floating-label">Full Name</label>
                  </div>
                  
                  <div className="input-field-wrapper">
                    <input 
                      type="text" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleInputChange} 
                      placeholder=" "
                    />
                    <label className="floating-label">Phone Number</label>
                  </div>
                </div>

                <div className="input-field-wrapper single-full-row">
                  <input 
                    type="email" 
                    name="email" 
                    value={profileData.email} 
                    disabled 
                    className="disabled-input" 
                    placeholder=" "
                  />
                  <label className="floating-label">Email Address</label>
                </div>

                <div className="input-field-wrapper single-full-row">
                  <input 
                    type="text" 
                    name="address" 
                    value={profileData.address} 
                    onChange={handleInputChange} 
                    placeholder=" "
                  />
                    <label className="floating-label">Street Address</label>
                </div>

                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <input 
                      type="text" 
                      name="city" 
                      value={profileData.city} 
                      onChange={handleInputChange} 
                      placeholder=" "
                    />
                    <label className="floating-label">City</label>
                  </div>
                  
                  <div className="input-field-wrapper">
                    <input 
                      type="text" 
                      name="postalCode" 
                      value={profileData.postalCode} 
                      onChange={handleInputChange} 
                      placeholder=" "
                    />
                    <label className="floating-label">Postal Code</label>
                  </div>
                </div>

                <div className="settings-divider-dashed" />

                <div className="settings-section-header">
                  <h2>Update Security Credentials</h2>
                  <p>Provide secure credential parameters to modify your portal passkey.</p>
                </div>

                <div className="form-row-grid">
                  <div className="input-field-wrapper">
                    <input 
                      type="password" 
                      name="currentPassword" 
                      value={profileData.currentPassword} 
                      onChange={handleInputChange} 
                      placeholder=" " 
                    />
                    <label className="floating-label">Current Password</label>
                  </div>
                  
                  <div className="input-field-wrapper">
                    <input 
                      type="password" 
                      name="newPassword" 
                      value={profileData.newPassword} 
                      onChange={handleInputChange} 
                      placeholder=" " 
                    />
                    <label className="floating-label">New Password</label>
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