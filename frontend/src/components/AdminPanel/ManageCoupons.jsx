import { useState, useEffect } from "react";
import "./Admin.css";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", expiryDate: ""
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
      console.error(error);
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
      console.error(error);
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
        console.error(error);
      }
    }
  };

  if (loading) return <div className="admin-component-wireframe-loader">Loading active marketing campaigns...</div>;

  return (
    <div className="admin-dual-pane-layout animated-fade">
      
      <div className="admin-card-view premium-ui-card">
        <h3>Create Promo Code</h3>
        <form onSubmit={handleFormSubmit} className="admin-ingestion-form">
          <div className="form-input-block">
            <label>Coupon Code Name</label>
            <input type="text" name="code" placeholder="e.g., FESTIVE20" value={newCoupon.code} onChange={handleInputChange} required style={{ textTransform: "uppercase" }} />
          </div>

          <div className="form-input-block">
            <label>Discount Vector Type</label>
            <select name="discountType" value={newCoupon.discountType} onChange={handleInputChange}>
              <option value="percentage">Percentage Off (%)</option>
              <option value="fixed">Fixed Price Reduction ($)</option>
            </select>
          </div>

          <div className="form-input-block">
            <label>Deduction Value</label>
            <input type="number" min="1" name="discountValue" placeholder={newCoupon.discountType === "percentage" ? "20" : "15"} value={newCoupon.discountValue} onChange={handleInputChange} required />
          </div>

          <div className="form-input-block">
            <label>Minimum Basket Limit ($)</label>
            <input type="number" min="0" name="minOrderAmount" placeholder="50" value={newCoupon.minOrderAmount} onChange={handleInputChange} />
          </div>

          <div className="form-input-block">
            <label>Campaign Expiry Deadline</label>
            <input type="date" name="expiryDate" value={newCoupon.expiryDate} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="admin-action-submit-btn-wide">🚀 Issue Campaign Coupon</button>
        </form>
      </div>

      <div className="admin-card-view premium-ui-card">
        <h3>Active Campaign Coupons Ledger</h3>
        <div className="admin-responsive-table-scroll">
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
                <tr><td colSpan="5" className="empty-table-cell">No promotional campaigns currently running.</td></tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td><span className="coupon-code-pill">{coupon.code}</span></td>
                    <td><strong>{coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`}</strong></td>
                    <td>${coupon.minOrderAmount || "0"}.00</td>
                    <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td style={{ textAlign: "center" }}>
                      <button className="table-row-delete-action-btn" onClick={() => deleteCouponHandler(coupon._id)}>Purge 🗑️</button>
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