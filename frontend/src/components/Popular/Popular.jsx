import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products/popularinmen')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.products) {
          setPopularProducts(data.products);
        } else {
          setPopularProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error("Failed to load popular items:", err));
  }, []);

  return (
    <section className="premium-popular-section-block" aria-label="Trending Catalog Showcase Feed">
      <div className="popular-section-header">
        <span className="section-mini-curation-tag">TRENDING NOW</span>
        <h2>Popular In Men's Collection</h2>
        <div className="section-minimalist-underline-bar" />
      </div>
      
      <div className="popular-products-flex-grid-mesh">
        {popularProducts.slice(0, 4).map((item, i) => (
          <div key={item.id || i} className="popular-grid-item-fade-box">
            <Item 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Popular;