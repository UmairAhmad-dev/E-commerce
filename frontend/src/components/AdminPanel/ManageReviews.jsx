import { useState, useEffect } from 'react';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🚀 CUSTOM STATE INJECTIONS
  const [feedback, setFeedback] = useState({ text: "", type: "" }); // Handles inline success/error notifications
  const [deleteTarget, setDeleteTarget] = useState(null); // Tracks which review is queued for deletion
  const [isDeleting, setIsDeleting] = useState(false); // Handles loading state during deletion

  const fetchAllReviews = async () => {
    const token = sessionStorage.getItem('auth-token');
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/reviews/admin/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error(error);
      showFeedback("❌ Error fetching product ratings from database.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Helper helper to show temporary feedback notifications
  const showFeedback = (text, type) => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback({ text: "", type: "" });
    }, 4000);
  };

  // 🚀 Triggered when the admin confirms deletion inside our custom modal
  const executeDelete = async () => {
    if (!deleteTarget) return;
    
    const token = sessionStorage.getItem('auth-token');
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:4000/api/reviews/admin/delete/${deleteTarget}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("🗑️ Review deleted cleanly from database!", "success");
        fetchAllReviews();
      } else {
        showFeedback(`❌ Failed: ${data.message || "Deletion error."}`, "error");
      }
    } catch (error) {
      console.error(error);
      showFeedback("❌ Connection error. Failed to communicate deletion request.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null); // Close the confirmation modal
    }
  };

  if (loading) return <div className="admin-component-wireframe-loader">Loading customer ratings ledger...</div>;

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-meta" style={{ marginBottom: "24px" }}>
        <h2>Product Reviews & Moderation Hub</h2>
        <span className="total-inventory-badge">Total Reviews: {reviews.length}</span>
      </div>

      {/* 🚀 INLINE FEEDBACK BANNER */}
      {feedback.text && (
        <div 
          className={`profile-inline-feedback-banner ${feedback.type === "success" ? "success" : "error"}`}
          style={{
            padding: "14px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "24px",
            border: "1px solid",
            background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: feedback.type === "success" ? "#15803d" : "#b91c1c",
            borderColor: feedback.type === "success" ? "#bbf7d0" : "#fecaca"
          }}
        >
          {feedback.text}
        </div>
      )}

      <div className="admin-responsive-table-scroll">
        <table className="admin-ledger-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", fontSize: "13px", color: "#475569" }}>
              <th style={{ padding: "12px 8px" }}>User</th>
              <th style={{ padding: "12px 8px" }}>Product ID</th>
              <th style={{ padding: "12px 8px" }}>Rating</th>
              <th style={{ padding: "12px 8px" }}>Feedback Comment</th>
              <th style={{ padding: "12px 8px" }}>Date</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="6" className="empty-table-cell" style={{ textAlign: "center", padding: "30px" }}>No reviews found in DB.</td></tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev._id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px" }}>
                  <td style={{ padding: "12px 8px" }}><strong>{rev.userName}</strong></td>
                  <td style={{ padding: "12px 8px" }}>SKU-{rev.productId}</td>
                  <td style={{ padding: "12px 8px", color: "#f59e0b", fontWeight: "bold" }}>
                    {"★".repeat(rev.rating)}
                  </td>
                  <td style={{ padding: "12px 8px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>{rev.comment}</td>
                  <td style={{ padding: "12px 8px" }}>{new Date(rev.date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 8px", textAlign: "center" }}>
                    {/* 🚀 Setting the target open state instead of native confirm() */}
                    <button className="table-row-delete-action-btn" onClick={() => setDeleteTarget(rev._id)}>Remove 🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🚀 CUSTOM DIALOGUE MODAL OVERLAY (No window.confirm!) */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal-content-card animated-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="modal-header-dock">
              <h3>Confirm Deletion</h3>
              <button className="modal-close-trigger" onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            
            <div className="modal-details-ledger-body" style={{ padding: "12px 0 24px 0" }}>
              <p style={{ margin: 0, fontSize: "14.5px", color: "#475569", lineHeight: "1.6" }}>
                Are you sure you want to permanently delete this customer review from the master database? This catalog modification cannot be undone.
              </p>
            </div>
            
            <div className="modal-actions-bar" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                className="table-action-inspect-btn text-muted" 
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{ border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px" }}
              >
                Cancel
              </button>
              <button 
                className="table-row-delete-action-btn" 
                onClick={executeDelete}
                disabled={isDeleting}
                style={{ 
                  backgroundColor: "#ef4444", 
                  color: "#ffffff", 
                  border: "none", 
                  padding: "8px 20px", 
                  borderRadius: "8px", 
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete 🗑️"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;