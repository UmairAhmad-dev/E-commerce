import { useState, useEffect } from "react";
import "./Admin.css";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", expiryDate: ""
  });
  
  // State handlers for non-native feedback notifications and modals
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showFeedback = (text, type) => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: "", type: "" }), 4000);
  };

  const fetchCoupons = async () => {
    const token = sessionStorage.getItem('auth-token');
    try {
      const res = await fetch("http://localhost:4000/api/coupons/allcoupons", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (error) {
      console.error(error);
      showFeedback("❌ Error syncing promotional catalog.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleInputChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth-token');
    try {
      const res = await fetch("http://localhost:4000/api/coupons/addcoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCoupon)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("🎉 Promo Campaign Coupon Active!", "success");
        setNewCoupon({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", expiryDate: "" });
        fetchCoupons();
      } else {
        showFeedback(`❌ Failed: ${data.message}`, "error");
      }
    } catch (error) {
      console.error(error);
      showFeedback("❌ Server link communication failure.", "error");
    }
  };

  const executeDeleteCoupon = async () => {
    if (!deleteTarget) return;
    const token = sessionStorage.getItem('auth-token');
    try {
      const res = await fetch("http://localhost:4000/api/coupons/removecoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: deleteTarget })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("🗑️ Promo code purged from records.", "success");
        fetchCoupons();
      }
    } catch (error) {
      console.error(error);
      showFeedback("❌ Deletion process failed.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="admin-component-wireframe-loader">Loading active marketing campaigns...</div>;

  return (
    <div className="admin-dual-pane-layout animated-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "30px", alignItems: "flex-start" }}>
      
      {/* LEFT SIDE: CREATION INTERFACE */}
      <div className="admin-card-view premium-ui-card">
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0" }}>Create Promo Code</h3>
        
        {feedback.text && (
          <div 
            style={{
              padding: "12px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: "600", marginBottom: "16px", border: "1px solid",
              background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2", color: feedback.type === "success" ? "#15803d" : "#b91c1c",
              borderColor: feedback.type === "success" ? "#bbf7d0" : "#fecaca"
            }}
          >
            {feedback.text}
          </div>
        )}
        
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-input-block">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>Coupon Code Name</label>
            <input type="text" name="code" placeholder="e.g., FESTIVE20" value={newCoupon.code} onChange={handleInputChange} required style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0", textTransform: "uppercase" }} />
          </div>

          <div className="form-input-block">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>Discount Vector Type</label>
            <select name="discountType" value={newCoupon.discountType} onChange={handleInputChange} style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
              <option value="percentage">Percentage Off (%)</option>
              <option value="fixed">Fixed Price Reduction (Rs.)</option>
            </select>
          </div>

          <div className="form-input-block">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>Deduction Value</label>
            <input type="number" min="1" name="discountValue" placeholder={newCoupon.discountType === "percentage" ? "20" : "500"} value={newCoupon.discountValue} onChange={handleInputChange} required style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>

          <div className="form-input-block">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>Minimum Basket Limit (Rs.)</label>
            <input type="number" min="0" name="minOrderAmount" placeholder="2500" value={newCoupon.minOrderAmount} onChange={handleInputChange} style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>

          <div className="form-input-block">
            <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "8px", color: "#0f172a" }}>Campaign Expiry Deadline</label>
            <input type="date" name="expiryDate" value={newCoupon.expiryDate} onChange={handleInputChange} required style={{ width: "100%", height: "44px", padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#475569" }} />
          </div>

          <button type="submit" style={{ width: "100%", height: "46px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}>🚀 Issue Campaign Coupon</button>
        </form>
      </div>

      {/* RIGHT SIDE: OVERVIEW TABLE */}
      <div className="admin-card-view premium-ui-card">
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0" }}>Active Campaign Coupons Ledger</h3>
        <div className="admin-responsive-table-scroll">
          <table className="admin-ledger-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", fontSize: "13px", color: "#475569" }}>
                <th style={{ padding: "12px 8px" }}>Code</th>
                <th style={{ padding: "12px 8px" }}>Deduction</th>
                <th style={{ padding: "12px 8px" }}>Min Basket</th>
                <th style={{ padding: "12px 8px" }}>Valid Until</th>
                <th style={{ padding: "12px 8px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan="5" className="empty-table-cell" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No promotional campaigns currently running.</td></tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px" }}>
                    <td style={{ padding: "12px 8px" }}><span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontWeight: "700", color: "#0f172a" }}>{coupon.code}</span></td>
                    <td style={{ padding: "12px 8px" }}><strong>{coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `Rs. ${coupon.discountValue} Off`}</strong></td>
                    <td style={{ padding: "12px 8px" }}>Rs. {coupon.minOrderAmount || "0"}</td>
                    <td style={{ padding: "12px 8px" }}>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <button className="table-row-delete-action-btn" onClick={() => setDeleteTarget(coupon._id)}>Purge 🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OVERLAY DIALOG MODAL FOR DISMISSING CAMPAIGNS */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal-content-card animated-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className="modal-header-dock">
              <h3>Retire Campaign Coupon</h3>
              <button className="modal-close-trigger" onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className="modal-details-ledger-body" style={{ padding: "12px 0 24px 0" }}>
              <p style={{ margin: 0, fontSize: "14.5px", color: "#475569", lineHeight: "1.6" }}>
                Are you sure you want to permanently delete this promotional discount coupon? Customers will no longer be able to apply this code during checkout operations.
              </p>
            </div>
            <div className="modal-actions-bar" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button className="table-action-inspect-btn text-muted" onClick={() => setDeleteTarget(null)} style={{ border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px", background: "none", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
              <button onClick={executeDeleteCoupon} style={{ backgroundColor: "#ef4444", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Yes, Purge 🗑️</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCoupons;