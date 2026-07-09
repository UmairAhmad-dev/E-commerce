import { useState } from 'react';

const INITIAL_USERS = [
  { id: "USR-081", name: "Umair", email: "uzair@example.com", dynamicOrders: 4, spent: 280.00, access: "Customer" },
  { id: "USR-092", name: "Qasim", email: "naeem@example.com", dynamicOrders: 12, spent: 940.00, access: "VIP Customer" },
  { id: "USR-044", name: "Ali", email: "sana@example.com", dynamicOrders: 1, spent: 55.00, access: "Customer" }
];

const ManageUsers = () => {
  const [users] = useState(INITIAL_USERS);

  return (
    <div className="admin-card-view animated-fade">
      <h2>Registered Customer Accounts Database</h2>
      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Core Address</th>
              <th>Lifetime Orders</th>
              <th>Total Revenue Generated</th>
              <th>Access Tier</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><span>{u.id}</span></td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.dynamicOrders} checkouts</td>
                <td className="table-cell-price-bold">${u.spent.toFixed(2)}</td>
                <td>
                  <span className={`order-status-pill ${u.access.includes('VIP') ? 'shipped' : 'delivered'}`} style={{fontSize: '11px'}}>
                    {u.access}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;