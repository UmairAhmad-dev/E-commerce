import { useState, useEffect } from 'react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const fetchOrders = async () => {
    // 🚀 Swapped from localStorage to sessionStorage
    const token = sessionStorage.getItem('auth-token');
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/orders/allorders", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    // 🚀 Swapped from localStorage to sessionStorage
    const token = sessionStorage.getItem('auth-token');
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
        setOrders(prev => prev.map(order => order.orderId === orderId ? { ...order, status: newStatus } : order));
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert(`❌ Error shifting timeline state: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Server exception handling status mutation.");
    }
  };

  const filteredOrders = orders.filter(o => {
    const customerName = o.shippingAddress?.fullName?.toLowerCase() || "";
    const orderIdRef = o.orderId || "";
    const query = orderSearch.toLowerCase();
    return customerName.includes(query) || orderIdRef.includes(query);
  });

  if (loading) return <div className="admin-component-wireframe-loader">Streaming secure customer logistics matrices...</div>;

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-meta stack-layout">
        <div className="headline-badge-row">
          <h3>Customer Order Fulfillment Queue</h3>
          <span className="total-inventory-badge">Active Queue Tasks: {filteredOrders.length}</span>
        </div>

        <div className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="Search queues by customer name or exact Order ID..." 
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="admin-control-search-input"
          />
        </div>
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
              <tr><td colSpan="7" className="empty-table-cell">No active fulfillment matching queries.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td><strong>#{order.orderId}</strong></td>
                  <td>{order.shippingAddress?.fullName}</td>
                  <td>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td className="table-cell-price-bold">Rs. {order.totalAmount ? order.totalAmount.toLocaleString('en-PK') : "0"}</td>
                  <td><span className={`order-status-pill ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td style={{textAlign: 'center'}}>
                    <button className="table-action-inspect-btn" onClick={() => setSelectedOrder(order)}>Inspect 🔎</button>
                  </td>
                  <td>
                    <div className="table-quantity-counter-actions centered">
                      {order.status === "Pending" && (
                        <button className="order-action-btn dispatch" onClick={() => updateOrderStatus(order.orderId, "Shipped")}>🚚 Ship</button>
                      )}
                      {order.status === "Shipped" && (
                        <button className="order-action-btn complete" onClick={() => updateOrderStatus(order.orderId, "Delivered")}>✅ Complete</button>
                      )}
                      {order.status === "Delivered" && <span className="archive-badge-text green">Archived</span>}
                      {order.status === "Cancelled" && <span className="archive-badge-text red">Cancelled</span>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-content-card animated-fade" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-dock">
              <h3>Shipping Manifest: #{selectedOrder.orderId}</h3>
              <button className="modal-close-trigger" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className="modal-details-ledger-body">
              <p><strong>Customer:</strong> {selectedOrder.shippingAddress?.fullName}</p>
              <p><strong>Contact:</strong> {selectedOrder.shippingAddress?.phone}</p>
              <p><strong>Destination:</strong> {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.city}</p>
              
              <div className="modal-items-sub-card">
                <p className="sub-card-title">Line Items Bought:</p>
                <div className="itemized-manifest-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="manifest-item-line-row">
                      <span>👕 {item.name} ({item.size}) <strong className="qty-muted">x{item.quantity}</strong></span>
                      <strong>Rs. {(item.price * item.quantity).toLocaleString('en-PK')}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-grand-invoice-footer">
                <span>Grand Invoice:</span>
                <span className="grand-invoice-price">Rs. {selectedOrder.totalAmount ? selectedOrder.totalAmount.toLocaleString('en-PK') : "0"}</span>
              </div>
              <p className="modal-status-footer-line">
                <strong>Fulfillment Tracker Status:</strong> 
                <span className={`order-status-pill ${selectedOrder.status?.toLowerCase()}`}>{selectedOrder.status}</span>
              </p>
            </div>
            
            <div className="modal-actions-bar">
              {selectedOrder.status === "Pending" && <button className="admin-action-submit-btn compact" onClick={() => updateOrderStatus(selectedOrder.orderId, "Shipped")}>Mark Shipped</button>}
              {selectedOrder.status === "Shipped" && <button className="admin-action-submit-btn compact green-bg" onClick={() => updateOrderStatus(selectedOrder.orderId, "Delivered")}>Mark Delivered</button>}
              <button className="table-action-inspect-btn text-muted" onClick={() => setSelectedOrder(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;