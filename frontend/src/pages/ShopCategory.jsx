import { useContext } from "react";
import { ShopContext } from "../context/ShopContext"; 
import Item from "../components/Item/Item";

const ShopCategory = (props) => {
  // Grab your live products array and backend loading tracker from context
  const { all_product, loading } = useContext(ShopContext);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', fontWeight: '600', color: '#64748b' }}>
        Loading Category Vault Streams...
      </div>
    );
  }

  // 🛠️ FLEXIBLE STRING MATCHING GATEWAY
  // Normalizes string fields to catch "men" vs "mens", "women" vs "womens" automatically
  const filteredProducts = all_product.filter(item => {
    const itemCat = item.category ? item.category.toLowerCase().trim() : "";
    const propCat = props.category ? props.category.toLowerCase().trim() : "";
    
    return itemCat === propCat || itemCat === `${propCat}s` || `${itemCat}s` === propCat;
  });

  return (
    <div className="shop-category">
      <div className="shopcategory-indexSort" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', alignItems: 'center' }}>
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of {filteredProducts.length} Products
        </p>
      </div>

      <div className="shopcategory-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px', margin: '40px 0' }}>
        {filteredProducts.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
            No live catalog items found matching this specific wardrobe segment yet.
          </p>
        ) : (
          filteredProducts.map((item, i) => (
            <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopCategory;