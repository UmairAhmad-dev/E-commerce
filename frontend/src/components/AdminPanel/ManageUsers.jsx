import { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // 🚀 Tracks the currently selected user for detail views

  const fetchUsersData = async () => {
    const token = sessionStorage.getItem('auth-token');
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/users/allusers", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users || []);
    } catch (error) {
      console.error("Error streaming user records ledger matrix:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsersData(); }, []);

  const filteredUsers = users.filter(u => {
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const city = u.city?.toLowerCase() || "";
    const query = userSearch.toLowerCase();
    return name.includes(query) || email.includes(query) || city.includes(query);
  });

  if (loading) return <div className="admin-component-wireframe-loader">Compiling administrative user access matrix records...</div>;

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-meta stack-layout" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div className="headline-badge-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Registered Customer Accounts Database</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Review contact profiles, authorization tiers, and delivery destinations.</p>
          </div>
          <span className="total-inventory-badge" style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
            Total Profiles: {filteredUsers.length}
          </span>
        </div>

        <div className="search-bar-wrapper" style={{ width: '100%' }}>
          <input 
            type="text" 
            placeholder="Search database profiles by name, email core, or registered city..." 
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="admin-control-search-input"
            style={{ width: '100%', height: '46px', padding: '0 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', fontWeight: '500' }}
          />
        </div>
      </div>

      <div className="admin-responsive-table-scroll" style={{ overflowX: 'auto' }}>
        <table className="admin-ledger-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', height: '44px', fontSize: '13px', color: '#475569', fontWeight: '700' }}>
              <th style={{ padding: '12px 8px' }}>Customer Identity</th>
              <th style={{ padding: '12px 8px' }}>Contact Number</th>
              <th style={{ padding: '12px 8px' }}>City Block</th>
              <th style={{ padding: '12px 8px' }}>System Access Role</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Inspect Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="empty-table-cell" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: '600' }}>No profile directory items matched your queries.</td></tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', height: '60px', fontSize: '14px', color: '#334155' }}>
                  
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: '#0f172a', fontWeight: '700' }}>{u.name || "Customer Profile"}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{u.email}</span>
                    </div>
                  </td>
                  
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#475569' }}>
                    {u.phone ? u.phone : <em style={{ color: '#cbd5e1', fontWeight: '500' }}>None</em>}
                  </td>
                  
                  <td style={{ padding: '12px 8px' }}>
                    {u.city ? (
                      <span style={{ fontWeight: '600' }}>{u.city}</span>
                    ) : (
                      <em style={{ color: '#cbd5e1' }}>Unconfigured</em>
                    )}
                  </td>
                  
                  <td style={{ padding: '12px 8px' }}>
                    <span 
                      className={`order-status-pill ${u.role === 'admin' ? 'pending' : 'delivered'}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        backgroundColor: u.role === 'admin' ? '#fff7ed' : '#f0fdf4',
                        color: u.role === 'admin' ? '#c2410c' : '#15803d'
                      }}
                    >
                      {u.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED SHOPPER'}
                    </span>
                  </td>

                  {/* 🚀 INSPECT BUTTON TERMINAL */}
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <button className="table-action-inspect-btn" onClick={() => setSelectedUser(u)}>Inspect 🔎</button>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🚀 POP-UP PROFILE DOSSIER OVERLAY (Matches Order Details layout and styling exactly) */}
      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-content-card animated-fade" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-dock">
              <h3>Customer Profile Dossier</h3>
              <button className="modal-close-trigger" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            
            <div className="modal-details-ledger-body">
              {/* User Identity Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                  {selectedUser.name ? selectedUser.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '850', color: '#0f172a' }}>{selectedUser.name}</h4>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>{selectedUser.email}</span>
                </div>
              </div>

              {/* General Account Specifications */}
              <p style={{ margin: '10px 0' }}><strong>Unique Database Ref:</strong> <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '12.5px' }}>{selectedUser._id}</span></p>
              <p style={{ margin: '10px 0' }}><strong>Contact Number:</strong> {selectedUser.phone || <em style={{ color: '#cbd5e1' }}>None provided</em>}</p>
              <p style={{ margin: '10px 0' }}><strong>Account Created:</strong> {new Date(selectedUser.date).toLocaleDateString('en-PK', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
              
              {/* Shipping Address Container block */}
              <div className="modal-items-sub-card" style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p className="sub-card-title" style={{ fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 12px 0', letterSpacing: '0.75px' }}>Saved Delivery Specifications</p>
                <p style={{ margin: '6px 0', fontSize: '13.5px' }}><strong>Street Address:</strong> {selectedUser.address || <em style={{ color: '#cbd5e1' }}>Not configured</em>}</p>
                <p style={{ margin: '6px 0', fontSize: '13.5px' }}><strong>Registered City:</strong> {selectedUser.city || <em style={{ color: '#cbd5e1' }}>Not configured</em>}</p>
                <p style={{ margin: '6px 0', fontSize: '13.5px' }}><strong>Postal/Zip Code:</strong> {selectedUser.postalCode || <em style={{ color: '#cbd5e1' }}>Not configured</em>}</p>
              </div>

              <div className="modal-grand-invoice-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0 0', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '750', fontSize: '14px', color: '#475569' }}>System Authorization Role:</span>
                <span 
                  className={`order-status-pill ${selectedUser.role === 'admin' ? 'pending' : 'delivered'}`}
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    backgroundColor: selectedUser.role === 'admin' ? '#fff7ed' : '#f0fdf4',
                    color: selectedUser.role === 'admin' ? '#c2410c' : '#15803d'
                  }}
                >
                  {selectedUser.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED SHOPPER'}
                </span>
              </div>
            </div>
            
            <div className="modal-actions-bar">
              <button className="table-action-inspect-btn text-muted" onClick={() => setSelectedUser(null)}>Dismiss Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;