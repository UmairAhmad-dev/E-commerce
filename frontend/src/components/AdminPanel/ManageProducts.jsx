import { useState, useEffect } from "react";
import "./Admin.css"; // Ensure this matches your CSS file name

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phase 1: Fetch live catalog data from your MongoDB cluster
  const fetchInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products/allproducts");
      const data = await res.json();
      setAllProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live inventory data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Phase 2: Handle delete action via your live MVC endpoint
  const removeProductHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product from the database?")) {
      try {
        const response = await fetch("http://localhost:4000/api/products/removeproduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert("🗑️ Product removed successfully from database.");
          // Instantly refresh the UI array state list without refreshing the page
          await fetchInfo();
        } else {
          alert("❌ Failed to remove product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
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
              <th>SKU ID</th>
              <th>Category</th>
              <th>Old Price</th>
              <th>Live Offer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                  No products found in the database. Go upload your first Men's Kurta!
                </td>
              </tr>
            ) : (
              allProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="table-thumbnail-preview" 
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td><span className="sku-badge">SKU-{product.id}</span></td>
                  <td className="category-text-transform">{product.category}</td>
                  <td className="price-strike">${product.old_price}</td>
                  <td className="sale-price-green">${product.new_price}</td>
                  <td>
                    <button 
                      onClick={() => removeProductHandler(product.id)} 
                      className="action-delete-btn"
                      style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete 🗑️
                    </button>
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