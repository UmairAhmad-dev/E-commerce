import { useState, useEffect } from "react";
import "./Admin.css";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: ""
  });

  const fetchCoupons = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      const res = await fetch("http://localhost:4000/api/coupons/allcoupons", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching campaign coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
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
        alert("🎉 Promo Campaign Coupon Active!");
        setNewCoupon({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", expiryDate: "" });
        fetchCoupons();
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Coupon insertion breakdown:", error);
    }
  };

  const deleteCouponHandler = async (id) => {
    const token = localStorage.getItem('auth-token');
    if (window.confirm("Permanently retire this promo discount code?")) {
      try {
        const res = await fetch("http://localhost:4000/api/coupons/removecoupon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          alert("🗑️ Promo code purged from records.");
          fetchCoupons();
        }
      } catch (error) {
        console.error("Coupon deletion error context:", error);
      }
    }
  };

  if (loading) return <div className="loading-state">Loading active marketing campaigns...</div>;

  return (
    <div className="admin-coupon-workspace animated-fade" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
      
      {/* LEFT: INGESTION FORM CONTAINER */}
      <div className="admin-card-view premium-ui-card">
        <h3>Create Promo Code</h3>
        <form onSubmit={handleFormSubmit} className="admin-ingestion-form" style={{ marginTop: "15px" }}>
          <div className="form-input-block">
            <label>Coupon Code Name</label>
            <input type="text" name="code" placeholder="e.g., FESTIVE20" value={newCoupon.code} onChange={handleInputChange} required style={{ textTransform: "uppercase" }} />
          </div>

          <div className="form-input-block" style={{ marginTop: "15px" }}>
            <label>Discount Vector Type</label>
            <select name="discountType" value={newCoupon.discountType} onChange={handleInputChange}>
              <option value="percentage">Percentage Off (%)</option>
              <option value="fixed">Fixed Price Reduction ($)</option>
            </select>
          </div>

          <div className="form-input-block" style={{ marginTop: "15px" }}>
            <label>Deduction Value</label>
            <input type="number" min="1" name="discountValue" placeholder={newCoupon.discountType === "percentage" ? "e.g., 20" : "e.g., 15"} value={newCoupon.discountValue} onChange={handleInputChange} required />
          </div>

          <div className="form-input-block" style={{ marginTop: "15px" }}>
            <label>Minimum Basket Limit ($)</label>
            <input type="number" min="0" name="minOrderAmount" placeholder="e.g., 50" value={newCoupon.minOrderAmount} onChange={handleInputChange} />
          </div>

          <div className="form-input-block" style={{ marginTop: "15px" }}>
            <label>Campaign Expiry Deadline</label>
            <input type="date" name="expiryDate" value={newCoupon.expiryDate} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="admin-action-submit-btn" style={{ marginTop: "25px", width: "100%" }}>🚀 Issue Campaign Coupon</button>
        </form>
      </div>

      {/* RIGHT: LIVE LEDGER LEDGER GRID */}
      <div className="admin-card-view premium-ui-card">
        <h3>Active Campaign Coupons Ledger</h3>
        <div className="admin-responsive-table-scroll" style={{ marginTop: "15px" }}>
          <table className="admin-ledger-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Deduction</th>
                <th>Min Basket</th>
                <th>Valid Until</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No promotional coupons currently running.</td></tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td><strong style={{ letterSpacing: "1px", color: "#2563eb" }}>{coupon.code}</strong></td>
                    <td>{coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`}</td>
                    <td>${coupon.minOrderAmount || "0"}.00</td>
                    <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td style={{ textAlign: "center" }}>
                      <button className="table-row-delete-action-btn" onClick={() => deleteCouponHandler(coupon._id)} style={{ padding: "4px 10px", fontSize: "12px" }}>Purge 🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageCoupons;