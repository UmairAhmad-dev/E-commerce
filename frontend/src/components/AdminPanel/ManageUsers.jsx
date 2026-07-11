import { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 FETCH LIVE CALCULATED METRICS CORRELATIONS FROM BACKEND
  const fetchUsersData = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/users/allusers", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // 🛡️ Validates session token layers
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        console.error("Server rejected user catalog sync:", data.message);
      }
    } catch (error) {
      console.error("Error connecting to real-time user database module:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  if (loading) {
    return <div className="loading-state">Compiling administrative user access matrix records...</div>;
  }

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta" style={{ marginBottom: '20px' }}>
        <h2>Registered Customer Accounts Database</h2>
        <span className="total-inventory-badge status-blue">Total Profile Entities: {users.length}</span>
      </div>

      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table">
          <thead>
            <tr>
              <th>User ID String Reference</th>
              <th>Full Name</th>
              <th>Email Core Address</th>
              <th>System Access Role</th>
              <th>Access Tier Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No active user records registered in system index.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}> {/* ✅ Fixed: Changed from u.id to u._id to match MongoDB identifiers */}
                  <td>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                      {u._id} {/* ✅ Fixed: Changed from u.id to u._id */}
                    </span>
                  </td>
                  <td><strong>{u.name || "Customer Profile"}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`order-status-pill ${u.role === 'admin' ? 'pending' : 'delivered'}`} 
                      style={{ fontSize: '11px', fontWeight: 'bold' }}
                    >
                      {u.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED SHOPPER'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;