import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Item from '../Item/Item';
import './NewCollections.css';

const NewCollections = () => {
  const { allProducts } = useContext(ShopContext);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {allProducts.map((item) => (
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

export default NewCollections;