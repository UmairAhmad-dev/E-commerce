import { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersData = async () => {
    const token = localStorage.getItem('auth-token');
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsersData(); }, []);

  if (loading) return <div className="admin-component-wireframe-loader">Compiling administrative user access matrix records...</div>;

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-meta">
        <h2>Registered Customer Accounts Database</h2>
        <span className="total-inventory-badge">Total Profile Entities: {users.length}</span>
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
              <tr><td colSpan="5" className="empty-table-cell">No active user records registered in system index.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td><span className="monospace-id-string">{u._id}</span></td>
                  <td><strong>{u.name || "Customer Profile"}</strong></td>
                  <td>{u.email}</td>
                  <td><span className="user-role-text-label">{u.role || 'user'}</span></td>
                  <td>
                    <span className={`order-status-pill ${u.role === 'admin' ? 'pending' : 'delivered'}`}>
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