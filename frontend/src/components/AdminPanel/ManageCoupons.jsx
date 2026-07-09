import { useState } from 'react';

const INITIAL_COUPONS = [
  { code: "EID2026", discount: "20%", type: "Percentage", status: "Active" },
  { code: "LAWN10", discount: "$10.00", type: "Flat Rate", status: "Active" },
  { code: "WELCOME5", discount: "5%", type: "Percentage", status: "Expired" }
];

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "Percentage" });

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discount.trim()) return;
    
    setCoupons([...coupons, { ...newCoupon, code: newCoupon.code.toUpperCase(), status: "Active" }]);
    setNewCoupon({ code: "", discount: "", type: "Percentage" });
  };

  return (
    <div className="admin-card-view animated-fade">
      <h2>Campaign Coupon & Voucher Manager</h2>
      
      {/* Mini Ingestion Form */}
      <form onSubmit={handleAddCoupon} style={{display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end'}}>
        <div className="form-input-block" style={{margin: 0, flex: 1}}>
          <label>Voucher Code</label>
          <input type="text" placeholder="e.g., FESTIVE30" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})} required />
        </div>
        <div className="form-input-block" style={{margin: 0, flex: 1}}>
          <label>Discount Value</label>
          <input type="text" placeholder="e.g., 30% or $15.00" value={newCoupon.discount} onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})} required />
        </div>
        <div className="form-input-block" style={{margin: 0, width: '180px'}}>
          <label>Type</label>
          <select value={newCoupon.type} onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}>
            <option value="Percentage">Percentage (%)</option>
            <option value="Flat Rate">Flat Rate ($)</option>
          </select>
        </div>
        <button type="submit" className="admin-action-submit-btn" style={{margin: 0, height: '45px'}}>Create Code</button>
      </form>

      {/* Ledger Grid */}
      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table">
          <thead>
            <tr>
              <th>Voucher Code</th>
              <th>Discount Deduction</th>
              <th>Coupon Type</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={i}>
                <td><strong style={{letterSpacing: '1px', color: '#0f172a'}}>{c.code}</strong></td>
                <td>{c.discount}</td>
                <td>{c.type}</td>
                <td>
                  <span className={`order-status-pill ${c.status === "Active" ? "delivered" : "pending"}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{textAlign: 'center'}}>
                  <button className="table-row-delete-action-btn" onClick={() => setCoupons(coupons.filter((_, idx) => idx !== i))}>Wipe</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;