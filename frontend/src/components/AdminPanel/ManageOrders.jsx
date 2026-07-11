import { useState, useEffect } from 'react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // Tracks modal popup view target

  // 🔄 FETCH ALL LOGGED ORDERS FROM BACKEND MATRIX
  const fetchOrders = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/orders/allorders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` // 🛡️ Clears backend protectUser/protectAdmin guards
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        console.error("Server rejected orders query:", data.message);
      }
    } catch (error) {
      console.error("Error pulling live checkout orders stream:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🚚 DISPATCH ORDER STATUS TIMELINE STATE CHANGES LIVE TO DB
  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('auth-token');
    try {
      const res = await fetch("http://localhost:4000/api/orders/updatestatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`🎉 Status tracker shifted cleanly to ${newStatus}`);
        
        // Optimistically update frontend UI collections and active modal reference state
        setOrders(prev => prev.map(order => order.orderId === orderId ? { ...order, status: newStatus } : order));
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert(`❌ Error shifting timeline state: ${data.message}`);
      }
    } catch (error) {
      console.error("Status dispatch error context:", error);
      alert("❌ Server exception handling status mutation.");
    }
  };

  // 🔍 DYNAMIC SEARCH MATRIX FILTER (Matches custom orderId reference or customer fullName)
  const filteredOrders = orders.filter(o => {
    const customerName = o.shippingAddress?.fullName?.toLowerCase() || "";
    const orderIdRef = o.orderId || "";
    const query = orderSearch.toLowerCase();
    return customerName.includes(query) || orderIdRef.includes(query);
  });

  if (loading) {
    return <div className="loading-state">Streaming secure customer logistics matrices...</div>;
  }

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Customer Order Fulfillment Queue</h2>
          <span className="total-inventory-badge status-blue">Active Queue Tasks: {filteredOrders.length}</span>
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
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No active fulfillment matching queries.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td><strong>#{order.orderId}</strong></td>
                  <td>{order.shippingAddress?.fullName}</td>
                  <td>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td className="table-cell-price-bold">${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</td>
                  <td><span className={`order-status-pill ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td style={{textAlign: 'center'}}>
                    <button className="counter-adj-btn" onClick={() => setSelectedOrder(order)} style={{ fontSize: '12px' }}>🔎 Inspect</button>
                  </td>
                  <td>
                    <div className="table-quantity-counter-actions" style={{ justifyContent: 'center' }}>
                      {order.status === "Pending" && (
                        <button className="order-action-btn dispatch" onClick={() => updateOrderStatus(order.orderId, "Shipped")}>🚚 Ship</button>
                      )}
                      {order.status === "Shipped" && (
                        <button className="order-action-btn complete" onClick={() => updateOrderStatus(order.orderId, "Delivered")}>✅ Complete</button>
                      )}
                      {order.status === "Delivered" && <span style={{fontSize: '12px', color: '#10b981', fontWeight: 600}}>Archived</span>}
                      {order.status === "Cancelled" && <span style={{fontSize: '12px', color: '#ef4444', fontWeight: 600}}>Cancelled</span>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED MANIFEST OVERLAY MODAL */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card-view animated-fade" onClick={(e) => e.stopPropagation()} style={{ width: '500px', height: 'fit-content', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Shipping Manifest: #{selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155' }}>
              <p><strong>Customer Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
              <p><strong>Contact Line:</strong> {selectedOrder.shippingAddress?.phone}</p>
              <p><strong>Destination Drop:</strong> {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.city}</p>
              
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "5px" }}>
                <p><strong>Line Items Bought:</strong></p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "#f8fafc", padding: "10px", borderRadius: "6px", marginTop: "5px" }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span>👕 {item.name} ({item.size}) <strong style={{ color: "#64748b" }}>x{item.quantity}</strong></span>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ marginTop: "5px" }}><strong>Grand Invoice:</strong> <span style={{ fontSize: "16px", fontWeight: 800, color: "#10b981" }}>${selectedOrder.totalAmount?.toFixed(2)}</span></p>
              <p>
                <strong>Current Status:</strong> 
                <span className={`order-status-pill ${selectedOrder.status?.toLowerCase()}`} style={{ marginLeft: '10px' }}>{selectedOrder.status}</span>
              </p>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedOrder.status === "Pending" && <button className="admin-action-submit-btn" onClick={() => updateOrderStatus(selectedOrder.orderId, "Shipped")} style={{ margin: 0 }}>Mark Shipped</button>}
              {selectedOrder.status === "Shipped" && <button className="admin-action-submit-btn" onClick={() => updateOrderStatus(selectedOrder.orderId, "Delivered")} style={{ margin: 0, background: '#10b981' }}>Mark Delivered</button>}
              <button className="counter-adj-btn" onClick={() => setSelectedOrder(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;