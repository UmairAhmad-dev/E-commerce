import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/Item/Item';
import './ShopCategory.css';

const ShopCategory = ({ category, banner }) => {
  const { allProducts } = useContext(ShopContext);

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={banner} alt={`${category} banner`} />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <span>▼</span>
        </div>
      </div>
      <div className="shopcategory-products">
        {allProducts.map((item) => {
          if (category === item.category) {
            return (
              <Item 
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          }
          return null;
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;