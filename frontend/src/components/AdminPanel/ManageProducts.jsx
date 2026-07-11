import { useState, useEffect } from "react";
import "./Admin.css";

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStates, setEditStates] = useState({}); // Tracks local edits per item row (prices + stock)

  const fetchInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products/allproducts");
      const data = await res.json();
      
      if (data.success && data.products) {
        setAllProducts(data.products);
        
        // Initialize local editable state copies for price and size-stock tracking
        const initialEdits = {};
        data.products.forEach(prod => {
          initialEdits[prod.id] = {
            old_price: prod.old_price || 0,
            new_price: prod.new_price || 0,
            size_stock: prod.size_stock || { S: 0, M: 0, L: 0, XL: 0 }
          };
        });
        setEditStates(initialEdits);
      } else {
        setAllProducts(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live inventory data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  /* =======================================================
     💾 PUSH PRICE & STOCK MODIFICATIONS LIVE TO BACKEND
     ======================================================= */
  const updateProductHandler = async (id) => {
    const payload = editStates[id];
    const token = localStorage.getItem('auth-token'); // Grab active session token

    if (!token) {
      alert("❌ Client Error: No session token found. Please log out and log back in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/products/updateproduct", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🛡️ Structured exactly as required by protectUser middleware
        },
        body: JSON.stringify({ 
          id, 
          old_price: payload.old_price,
          new_price: payload.new_price,
          size_stock: payload.size_stock 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("🎉 Inventory details synchronized cleanly inside cloud ledger clusters!");
        fetchInfo();
      } else {
        alert(`❌ Server Rejected Request: ${data.message || "No error details provided."}`);
      }
    } catch (error) {
      console.error("Full-stack update dispatch breakdown:", error);
      alert(`❌ Network/Fetch Error: ${error.message}`);
    }
  };

  /* ==========================================
     🗑️ PRODUCT SKUS PURGE REMOVAL HANDLER
     ========================================== */
  const removeProductHandler = async (id) => {
    const token = localStorage.getItem('auth-token');

    if (!token) {
      alert("❌ Client Error: No session token found.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product from the database?")) {
      try {
        const response = await fetch("http://localhost:4000/api/products/removeproduct", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // 🛡️ Structured identically to secure the deletion route
          },
          body: JSON.stringify({ id: id }),
        });
        const data = await response.json();
        if (data.success) {
          alert("🗑️ Product removed successfully from database.");
          await fetchInfo();
        } else {
          alert(`❌ Server Rejected Deletion: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`❌ Deletion Network Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div className="loading-state">Syncing secure database matrix streams...</div>;
  }

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-action-row">
        <h3>Live Product Inventory Ledgers ({allProducts.length} Total Items)</h3>
      </div>

      <div className="table-scroll-container">
        <table className="inventory-data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Title</th>
              <th>Category</th>
              <th style={{ textAlign: "center" }}>Per-Size Inventory Stock Matrix</th>
              <th>Original Price ($)</th>
              <th>Offer Price ($)</th>
              <th>Actions Terminal</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>No products found in database.</td></tr>
            ) : (
              allProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong>{product.name}</strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>SKU-{product.id}</span>
                    </div>
                  </td>
                  <td className="category-text-transform">{product.category}</td>
                  
                  {/* 📊 PER-SIZE QUANTITY STEPPER FIELD GRID */}
                  <td>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                      {["S", "M", "L", "XL"].map((size) => {
                        const currentSizeStock = editStates[product.id]?.size_stock?.[size] || 0;

                        return (
                          <div key={size} style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center",
                            gap: "4px",
                            padding: "6px 10px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            backgroundColor: currentSizeStock > 0 ? "#fff" : "#f1f5f9"
                          }}>
                            <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569" }}>{size}</span>
                            <input 
                              type="number" 
                              min="0"
                              value={currentSizeStock}
                              onChange={(e) => {
                                const updatedValue = Number(e.target.value);
                                setEditStates(prev => ({
                                  ...prev,
                                  [product.id]: {
                                    ...prev[product.id],
                                    size_stock: {
                                      ...prev[product.id].size_stock,
                                      [size]: updatedValue
                                    }
                                  }
                                }));
                              }}
                              style={{ 
                                width: "45px", 
                                padding: "4px", 
                                fontSize: "12px", 
                                textAlign: "center", 
                                borderRadius: "4px", 
                                border: "1px solid #cbd5e1",
                                fontWeight: "700",
                                outline: "none"
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* 🏷️ EDITABLE ORIGINAL PRICE */}
                  <td>
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={editStates[product.id]?.old_price || 0}
                      onChange={(e) => {
                        const updatedValue = Number(e.target.value);
                        setEditStates(prev => ({
                          ...prev,
                          [product.id]: { ...prev[product.id], old_price: updatedValue }
                        }));
                      }}
                      style={{
                        width: "70px",
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                        fontWeight: "600",
                        color: "#64748b",
                        textDecoration: "line-through"
                      }}
                    />
                  </td>

                  {/* 🏷️ EDITABLE SALE/OFFER PRICE */}
                  <td>
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={editStates[product.id]?.new_price || 0}
                      onChange={(e) => {
                        const updatedValue = Number(e.target.value);
                        setEditStates(prev => ({
                          ...prev,
                          [product.id]: { ...prev[product.id], new_price: updatedValue }
                        }));
                      }}
                      style={{
                        width: "70px",
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid #cbd5e1",
                        fontWeight: "700",
                        color: "#10b981"
                      }}
                    />
                  </td>
                  
                  {/* 🛠️ CONTROLS PANEL */}
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => updateProductHandler(product.id)} 
                        style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                      >
                        Save 💾
                      </button>
                      <button 
                        onClick={() => removeProductHandler(product.id)} 
                        style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;