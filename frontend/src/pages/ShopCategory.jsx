import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/Item/Item';
import './ShopCategory.css';

const ShopCategory = ({ category, banner }) => {
  const { allProducts } = useContext(ShopContext);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("default"); // Options: default, lowHigh, highLow

  // Processing pipeline: Filter -> Sort
  const processedProducts = allProducts
    .filter((item) => {
      const matchesCategory = category === item.category;
      
      // Dynamic filters matching modern traditional retail tags
      const matchesType = 
        selectedType === "All" || 
        (selectedType === "Stitched" && item.name.toLowerCase().includes("stitched")) ||
        (selectedType === "Kurta" && item.name.toLowerCase().includes("kurta")) ||
        (selectedType === "Lawn" && item.name.toLowerCase().includes("lawn"));

      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "lowHigh") {
        return a.new_price - b.new_price;
      }
      if (sortOrder === "highLow") {
        return b.new_price - a.new_price;
      }
      return 0; // Maintain default data ordering
    });

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={banner} alt={`${category} banner`} />
      
      {/* Search and Tag Filtering Controls Row */}
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

      {/* Index Counter and Sorting Dropdown Row */}
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {processedProducts.length}</span> out of {allProducts.filter(p => p.category === category).length} products
        </p>
        
        <div className="shopcategory-sort-container">
          <label htmlFor="price-sort">Sort by: </label>
          <select 
            id="price-sort"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="shopcategory-dropdown"
          >
            <option value="default">Default Features</option>
            <option value="lowHigh">Price: Low to High</option>
            <option value="highLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="shopcategory-products">
        {processedProducts.length > 0 ? (
          processedProducts.map((item) => (
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
            <p>No designs match your current search parameters.</p>
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