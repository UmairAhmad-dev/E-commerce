import { useState, useEffect } from "react";
import "./Admin.css";

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStates, setEditStates] = useState({});

  const fetchInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products/allproducts");
      const data = await res.json();
      
      if (data.success && data.products) {
        setAllProducts(data.products);
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
      setLoading(false);
    }
  };

  useEffect(() => { fetchInfo(); }, []);

  const updateProductHandler = async (id) => {
    const payload = editStates[id];
    const token = localStorage.getItem('auth-token');

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
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          id, old_price: payload.old_price, new_price: payload.new_price, size_stock: payload.size_stock 
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 Inventory details synchronized cleanly inside cloud ledger clusters!");
        fetchInfo();
      }
    } catch (error) {
      alert(`❌ Network/Fetch Error: ${error.message}`);
    }
  };

  const removeProductHandler = async (id) => {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    if (window.confirm("Are you sure you want to delete this product from the database?")) {
      try {
        const response = await fetch("http://localhost:4000/api/products/removeproduct", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ id: id }),
        });
        const data = await response.json();
        if (data.success) {
          alert("🗑️ Product removed successfully from database.");
          await fetchInfo();
        }
      } catch (error) {
        alert(`❌ Deletion Network Error: ${error.message}`);
      }
    }
  };

  if (loading) return <div className="admin-component-wireframe-loader">Syncing secure database matrix streams...</div>;

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      <div className="table-header-action-row">
        <h3>Live Product Inventory Ledgers ({allProducts.length} Total Items)</h3>
      </div>

      <div className="admin-responsive-table-scroll">
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
              <tr><td colSpan="7" className="empty-table-cell">No products found in database.</td></tr>
            ) : (
              allProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-thumb-preview" />
                  </td>
                  <td>
                    <div className="table-cell-title-block">
                      <strong>{product.name}</strong>
                      <span>SKU-{product.id}</span>
                    </div>
                  </td>
                  <td><span className="table-row-category-pill">{product.category}</span></td>
                  
                  <td>
                    <div className="size-stock-stepper-matrix-row">
                      {["S", "M", "L", "XL"].map((size) => {
                        const currentSizeStock = editStates[product.id]?.size_stock?.[size] || 0;
                        return (
                          <div key={size} className={`stepper-input-node ${currentSizeStock > 0 ? "has-stock" : "empty-stock"}`}>
                            <span>{size}</span>
                            <input 
                              type="number" min="0" value={currentSizeStock}
                              onChange={(e) => {
                                const updatedValue = Number(e.target.value);
                                setEditStates(prev => ({
                                  ...prev,
                                  [product.id]: {
                                    ...prev[product.id],
                                    size_stock: { ...prev[product.id].size_stock, [size]: updatedValue }
                                  }
                                }));
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  <td>
                    <input 
                      type="number" step="0.01" min="0" 
                      value={editStates[product.id]?.old_price || 0}
                      className="table-numeric-edit-input old-price-strike"
                      onChange={(e) => {
                        const updatedValue = Number(e.target.value);
                        setEditStates(prev => ({
                          ...prev,
                          [product.id]: { ...prev[product.id], old_price: updatedValue }
                        }));
                      }}
                    />
                  </td>

                  <td>
                    <input 
                      type="number" step="0.01" min="0" 
                      value={editStates[product.id]?.new_price || 0}
                      className="table-numeric-edit-input new-price-bold"
                      onChange={(e) => {
                        const updatedValue = Number(e.target.value);
                        setEditStates(prev => ({
                          ...prev,
                          [product.id]: { ...prev[product.id], new_price: updatedValue }
                        }));
                      }}
                    />
                  </td>
                  
                  <td>
                    <div className="table-row-action-buttons-cluster">
                      <button onClick={() => updateProductHandler(product.id)} className="table-action-save-btn">Save 💾</button>
                      <button onClick={() => removeProductHandler(product.id)} className="table-row-delete-action-btn">Delete 🗑️</button>
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