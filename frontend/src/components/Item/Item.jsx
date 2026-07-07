import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ id, name, image, new_price, old_price }) => {
  return (
    <div className="item">
      <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)}>
        <img src={image} alt={name} className="item-image" />
      </Link>
      <p className="item-name">{name}</p>
      <div className="item-prices">
        <div className="item-price-new">${new_price.toFixed(2)}</div>
        <div className="item-price-old">${old_price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Item;