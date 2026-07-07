import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Item from '../Item/Item';
import './Popular.css';

const Popular = () => {
  const { allProducts } = useContext(ShopContext);
  
  // Filter for specific featured items to represent standard platform behavior
  const popularInWomen = allProducts.filter(item => item.category === "women").slice(0, 4);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularInWomen.map((item) => (
          <Item 
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;