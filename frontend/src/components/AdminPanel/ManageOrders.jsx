import { useState } from 'react';

const INITIAL_ORDERS = [
  { id: "ORD-9941", customer: "Umair", date: "July 08, 2026", items: "Premium Lawn Suit (S) x1", amount: 65.00, status: "Pending" },
  { id: "ORD-9942", customer: "Qasim", date: "July 08, 2026", items: "Summer Kurti (M) x2", amount: 70.00, status: "Shipped" },
  { id: "ORD-9943", customer: "Zayn Ahmad", date: "July 07, 2026", items: "Kids Stitched Pack (L) x1", amount: 45.00, status: "Delivered" }
];

const ManageOrders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta">
        <h2>Customer Order Fulfillment Queue</h2>
        <span className="total-inventory-badge status-blue">Active Orders: {orders.length}</span>
      </div>

      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Date Placed</th>
              <th>Items Ordered</th>
              <th>Total Bill</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td style={{fontSize: '13px', color: '#475569'}}>{order.items}</td>
                <td className="table-cell-price-bold">${order.amount.toFixed(2)}</td>
                <td>
                  <span className={`order-status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="table-quantity-counter-actions">
                    {order.status === "Pending" && (
                      <button className="order-action-btn dispatch" onClick={() => updateOrderStatus(order.id, "Shipped")}>🚚 Ship Order</button>
                    )}
                    {order.status === "Shipped" && (
                      <button className="order-action-btn complete" onClick={() => updateOrderStatus(order.id, "Delivered")}>✅ Complete</button>
                    )}
                    {order.status === "Delivered" && (
                      <span style={{fontSize: '12px', color: '#10b981', fontWeight: 600}}>Archived</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;