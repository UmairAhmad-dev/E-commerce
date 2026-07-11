import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext"; 
import Item from "../components/Item/Item";
import "./ShopCategory.css";

const ShopCategory = (props) => {
  const { all_product, loading } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  if (loading) {
    return (
      <div className="category-loading-vault">
        <div className="spinner-orbit-ring"></div>
        <p>Streaming Premium Wardrobe Vaults...</p>
      </div>
    );
  }

  // 🛠️ Structural String Normalization Gateway
  const categoryFiltered = (all_product || []).filter(item => {
    const itemCat = item.category ? item.category.toLowerCase().trim() : "";
    const propCat = props.category ? props.category.toLowerCase().trim() : "";
    return itemCat === propCat || itemCat === `${propCat}s` || `${itemCat}s` === propCat;
  });

  // 🔍 Dynamic Search Box & Tag Sub-Filter Matrix
  const deepFilteredProducts = categoryFiltered.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTag === "new") return matchesSearch && (item.id % 3 === 0); // Simulated tag parameters
    if (activeTag === "sale") return matchesSearch && (item.old_price > item.new_price);
    return matchesSearch;
  });

  // 📊 Multi-Criteria Price & Index Sort Sorting Matrix
  const sortedProducts = [...deepFilteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.new_price - b.new_price;
    if (sortOption === "price-high") return b.new_price - a.new_price;
    if (sortOption === "alpha") return a.name.localeCompare(b.name);
    return 0; // Default Mongo Collection sequencing order
  });

  return (
    <div className="shop-category-view">
      
      {/* Premium Curated Collection Banner Frame */}
      <div className="premium-category-banner-container">
        <div className="banner-editorial-overlay" />
        <div className="banner-editorial-typography">
          <span className="editorial-mini-tag">CURATED COLLECTION</span>
          <h1 className="editorial-main-headline">{props.category?.toUpperCase()} WARDROBE</h1>
          <p className="editorial-subhead-string">Experience unmatched comfort stitched with premium traditional perfection.</p>
        </div>
      </div>

      {/* Modern Filter & Search Navigation Bar Layout */}
      <div className="shopcategory-filter-wrapper">
        <div className="shopcategory-searchbox">
          <span className="search-lens-vector">🔍</span>
          <input 
            type="text" 
            placeholder="Search within this collection..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="shopcategory-tags">
          <button className={activeTag === "all" ? "tag-active" : ""} onClick={() => setActiveTag("all")}>All Apparel</button>
          <button className={activeTag === "new" ? "tag-active" : ""} onClick={() => setActiveTag("new")}>New Arrivals</button>
          <button className={activeTag === "sale" ? "tag-active" : ""} onClick={() => setActiveTag("sale")}>Special Offers</button>
        </div>
      </div>

      {/* Ledger Sorting & Counter Meta Line */}
      <div className="shopcategory-indexSort">
        <p>
          Showing <span>1-{sortedProducts.length}</span> out of {categoryFiltered.length} boutique items
        </p>
        <select 
          className="shopcategory-sort" 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="alpha">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Crisp Dynamic Product Catalog Grid Grid */}
      <div className="shopcategory-products">
        {sortedProducts.length === 0 ? (
          <div className="empty-catalog-fallback-box">
            <span className="fallback-empty-icon">🧥</span>
            <h3>No Collection Items Match Your Queries</h3>
            <p>Try refining your spelling parameters or clear active sub-filter tags.</p>
          </div>
        ) : (
          sortedProducts.map((item, i) => (
            <div key={item.id || i} className="product-card-entrance-wrapper">
              <Item 
                id={item.id} 
                name={item.name} 
                image={item.image} 
                new_price={item.new_price} 
                old_price={item.old_price} 
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopCategory;