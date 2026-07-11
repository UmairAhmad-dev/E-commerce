import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item'; // Double check your relative path to Item

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products/newcollections')
      .then((response) => response.json())
      .then((data) => {
        // ✅ FIXED: Safely unpacks the array using the .products key wrapper
        if (data.success && data.products) {
          setNew_Collection(data.products);
        } else {
          // Fallback if data is a direct raw array from old configurations
          setNew_Collection(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error("Collections loading failed:", err));
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections-grid">
        {new_collection.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  );
};

export default NewCollections;