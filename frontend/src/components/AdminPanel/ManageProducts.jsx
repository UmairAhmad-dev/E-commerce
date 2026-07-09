import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

const ManageProducts = () => {
  // Pull our main products array directly out of context
  const { allProducts } = useContext(ShopContext);
  
  // Safe initialization state
  const [mockInventoryLevels, setMockInventoryLevels] = useState({});

  // Initialize inventory values safely only AFTER allProducts is verified as available
  useEffect(() => {
    if (allProducts && Array.isArray(allProducts)) {
      const initialLevels = allProducts.reduce((acc, curr) => {
        return { ...acc, [curr.id]: Math.floor(40 + Math.random() * 120) };
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

  const executeRemoveRequest = (name) => {
    alert(`System action request: Disabling visibility and dropping pipeline records for: ${name}`);
  };

  // Fallback state rendering if data is still loading
  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="admin-card-view animated-fade" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Loading inventory items...</h2>
        <p>Please ensure items exist in your ShopContext file.</p>
      </div>
    );
  }

  return (
    <div className="admin-card-view animated-fade">
      <div className="table-header-meta">
        <h2>Live Active Stock Logs</h2>
        <span className="total-inventory-badge">Total Line Items: {allProducts.length} items</span>
      </div>

      <div className="admin-responsive-table-scroll">
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
            {allProducts.map((product) => {
              const currentStock = mockInventoryLevels[product.id] || 0;
              return (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-thumb-preview" />
                  </td>
                  <td className="table-cell-title-block">
                    <strong>{product.name}</strong>
                    <span>ID Reference: SKU-00{product.id}</span>
                  </td>
                  <td><span className="table-row-category-pill">{product.category}</span></td>
                  <td className="table-cell-price-bold">${product.new_price.toFixed(2)}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={`stock-status-tag ${currentStock < 50 ? 'warning-low' : 'stable-high'}`}>
                      {currentStock} units
                    </span>
                  </td>
                  <td>
                    <div className="table-quantity-counter-actions">
                      <button className="counter-adj-btn type-minus" onClick={() => decrementStockValue(product.id)} title="Deduct 5 items">-5</button>
                      <button className="counter-adj-btn type-plus" onClick={() => incrementStockValue(product.id)} title="Add 5 items">+5</button>
                    </div>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <button className="table-row-delete-action-btn" onClick={() => executeRemoveRequest(product.name)} title="Remove item permanently">
                      🗑️ Wipe
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;