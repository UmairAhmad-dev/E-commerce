import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/Item/Item';
import './ShopCategory.css';

const ShopCategory = ({ category, banner }) => {
  const { allProducts } = useContext(ShopContext);
  
  // State managers to keep track of query matching data inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Filter pipeline to match categories, types, and search queries dynamically
  const filteredProducts = allProducts.filter((item) => {
    const matchesCategory = category === item.category;
    
    // Local sub-category classification parsing logic
    const matchesType = 
      selectedType === "All" || 
      (selectedType === "Stitched" && item.name.toLowerCase().includes("stitched")) ||
      (selectedType === "Kurta" && item.name.toLowerCase().includes("kurta")) ||
      (selectedType === "Lawn" && item.name.toLowerCase().includes("lawn"));

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={banner} alt={`${category} banner`} />
      
      {/* Search and Advanced Filter Engine block */}
      <div className="shopcategory-filter-wrapper">
        <div className="shopcategory-searchbox">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder={`Search in ${category} collections...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && <button onClick={() => setSearchQuery("")}>✕</button>}
        </div>

        <div className="shopcategory-tags">
          {["All", "Stitched", "Kurta", "Lawn"].map((type) => (
            <button
              key={type}
              className={selectedType === type ? "tag-active" : ""}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {filteredProducts.length}</span> out of {allProducts.filter(p => p.category === category).length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <span>▼</span>
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <Item 
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <div className="shopcategory-empty-state">
            <p>No design matches your current search parameters.</p>
          </div>
        )}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;