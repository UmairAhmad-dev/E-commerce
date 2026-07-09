import { useState } from 'react';

const INITIAL_ORDERS = [
  { id: "ORD-9941", customer: "Umair", date: "July 08, 2026", items: "Premium Lawn Suit (S) x1", amount: 65.00, address: "Sahiwal, Punjab, Pakistan", phone: "+92 300 1234567", status: "Pending" },
  { id: "ORD-9942", customer: "Ahmad", date: "July 08, 2026", items: "Summer Kurti (M) x2", amount: 70.00, address: "Lahore, Punjab, Pakistan", phone: "+92 321 7654321", status: "Shipped" },
  { id: "ORD-9943", customer: "Ali", date: "July 07, 2026", items: "Kids Stitched Pack (L) x1", amount: 45.00, address: "Islamabad, Pakistan", phone: "+92 333 9876543", status: "Delivered" }
];

const ManageOrders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // Tracks modal popup view target

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch)
  );

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Customer Order Fulfillment Queue</h2>
          <span className="total-inventory-badge status-blue">Active Base Count: {filteredOrders.length}</span>
        </div>

        <input 
          type="text" 
          placeholder="🔍 Search queues by customer title name or exact Order ID..." 
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', fontSize: '14px' }}
        />
      </div>

      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Date Placed</th>
              <th>Total Bill</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Manifest</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td className="table-cell-price-bold">${order.amount.toFixed(2)}</td>
                <td><span className={`order-status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td style={{textAlign: 'center'}}>
                  <button className="counter-adj-btn" onClick={() => setSelectedOrder(order)} style={{ fontSize: '12px' }}>🔎 Inspect</button>
                </td>
                <td>
                  <div className="table-quantity-counter-actions">
                    {order.status === "Pending" && (
                      <button className="order-action-btn dispatch" onClick={() => updateOrderStatus(order.id, "Shipped")}>🚚 Ship</button>
                    )}
                    {order.status === "Shipped" && (
                      <button className="order-action-btn complete" onClick={() => updateOrderStatus(order.id, "Delivered")}>✅ Complete</button>
                    )}
                    {order.status === "Delivered" && <span style={{fontSize: '12px', color: '#10b981', fontWeight: 600}}>Archived</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILED MANIFEST OVERLAY MODAL */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyCenter: 'center', display: 'flex', justifyContent: 'center' }}>
          <div className="admin-card-view animated-fade" onClick={(e) => e.stopPropagation()} style={{ width: '500px', marginTop: '10vh', height: 'fit-content', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Shipping Manifest: {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155' }}>
              <p><strong>Customer Name:</strong> {selectedOrder.customer}</p>
              <p><strong>Contact Line:</strong> {selectedOrder.phone}</p>
              <p><strong>Destination Drop:</strong> {selectedOrder.address}</p>
              <p><strong>Line Items Bought:</strong> {selectedOrder.items}</p>
              <p><strong>Grand Invoice:</strong> ${selectedOrder.amount.toFixed(2)}</p>
              <p>
                <strong>Current Status:</strong> 
                <span className={`order-status-pill ${selectedOrder.status.toLowerCase()}`} style={{ marginLeft: '10px' }}>{selectedOrder.status}</span>
              </p>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedOrder.status === "Pending" && <button className="admin-action-submit-btn" onClick={() => updateOrderStatus(selectedOrder.id, "Shipped")} style={{ margin: 0 }}>Mark Shipped</button>}
              {selectedOrder.status === "Shipped" && <button className="admin-action-submit-btn" onClick={() => updateOrderStatus(selectedOrder.id, "Delivered")} style={{ margin: 0, background: '#10b981' }}>Mark Delivered</button>}
              <button className="counter-adj-btn" onClick={() => setSelectedOrder(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;