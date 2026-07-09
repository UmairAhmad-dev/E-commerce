import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

const ManageProducts = () => {
  const { allProducts } = useContext(ShopContext);
  const [mockInventoryLevels, setMockInventoryLevels] = useState({});
  
  // NEW UX FILTERS STATE
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (allProducts && Array.isArray(allProducts)) {
      const initialLevels = allProducts.reduce((acc, curr) => {
        return { ...acc, [curr.id]: Math.floor(15 + Math.random() * 140) }; // Randomizing some lower numbers to show off your pulsing alert!
      }, {});
      setMockInventoryLevels(initialLevels);
    }
  }, [allProducts]);

  const incrementStockValue = (id) => {
    setMockInventoryLevels(prev => ({ ...prev, [id]: (prev[id] || 0) + 5 }));
  };

  const decrementStockValue = (id) => {
    setMockInventoryLevels(prev => ({ ...prev, [id]: (prev[id] || 0) > 0 ? prev[id] - 5 : 0 }));
  };

  // LIVE SEARCH AND FILTER PIPELINE MATCHING
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="admin-card-view animated-fade" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Loading inventory items...</h2>
      </div>
    );
  }

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Live Active Stock Logs</h2>
          <span className="total-inventory-badge">Showing: {filteredProducts.length} of {allProducts.length} items</span>
        </div>

        {/* CONTROLS RIBBON */}
        <div className="admin-filter-ribbon" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 Search items by title or SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: 1, minWidth: '200px', fontSize: '14px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            {["all", "mens", "womens", "kids"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`counter-adj-btn ${selectedCategory === cat ? 'type-plus' : ''}`}
                style={{ textTransform: 'capitalize', padding: '0 16px', background: selectedCategory === cat ? '#0f172a' : 'white', color: selectedCategory === cat ? 'white' : '#334155' }}
              >
                {cat === "all" ? "All Segments" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-responsive-table-scroll">
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No items match your active search terms.</div>
        ) : (
          <table className="admin-ledger-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Title</th>
                <th>Category Segment</th>
                <th>Sale Valuation</th>
                <th style={{textAlign: 'center'}}>Stock Level (Qty)</th>
                <th style={{textAlign: 'center'}}>Stock Adjustments</th>
                <th style={{textAlign: 'center'}}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const currentStock = mockInventoryLevels[product.id] || 0;
                return (
                  <tr key={product.id}>
                    <td><img src={product.image} alt={product.name} className="table-thumb-preview" /></td>
                    <td className="table-cell-title-block">
                      <strong>{product.name}</strong>
                      <span>ID Reference: SKU-00{product.id}</span>
                    </td>
                    <td><span className="table-row-category-pill">{product.category}</span></td>
                    <td className="table-cell-price-bold">${product.new_price.toFixed(2)}</td>
                    <td style={{textAlign: 'center'}}>
                      <span className={`stock-status-tag ${currentStock < 30 ? 'warning-low' : 'stable-high'}`}>
                        {currentStock} units
                      </span>
                    </td>
                    <td>
                      <div className="table-quantity-counter-actions">
                        <button className="counter-adj-btn type-minus" onClick={() => decrementStockValue(product.id)}>-5</button>
                        <button className="counter-adj-btn type-plus" onClick={() => incrementStockValue(product.id)}>+5</button>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <button className="table-row-delete-action-btn" onClick={() => alert(`Disabled listing for ${product.name}`)}>🗑️ Wipe</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;