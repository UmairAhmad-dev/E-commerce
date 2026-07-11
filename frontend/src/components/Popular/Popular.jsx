import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item'; // Double check your relative path to Item

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products/popularinmen')
      .then((response) => response.json())
      .then((data) => {
        // ✅ FIXED: Safely unpacks the array using the .products key wrapper
        if (data.success && data.products) {
          setPopularProducts(data.products);
        } else {
          // Fallback if data is a direct raw array from old configurations
          setPopularProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error("Failed to load popular items:", err));
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN MEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  );
};

export default Popular;