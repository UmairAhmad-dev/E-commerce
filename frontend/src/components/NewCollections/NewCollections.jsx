import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products/newcollections')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.products) {
          setNew_Collection(data.products);
        } else {
          setNew_Collection(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error("Collections loading failed:", err));
  }, []);

  return (
    <section className="premium-collections-section" aria-label="Newly Arrived Apparel Lookbook">
      <div className="collections-section-header">
        <span className="section-editorial-tag">JUST RELEASED</span>
        <h2>New Collections</h2>
        <div className="section-minimalist-underline-bar" />
      </div>

      <div className="collections-grid-mesh">
        {new_collection.map((item, i) => (
          <div key={item.id || i} className="collection-card-entrance-box">
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

export default NewCollections;