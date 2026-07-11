import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ id, name, image, new_price, old_price }) => {
  // Compute if the specific boutique item features a live promotional markdown reduction
  const hasDiscount = old_price > new_price;

  return (
    <div className="premium-boutique-item-card">
      <div className="card-image-presentation-frame">
        {hasDiscount && (
          <div className="card-editorial-sale-badge">
            <span>SALE</span>
          </div>
        )}
        <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)} className="card-image-router-mask">
          <img src={image} alt={name} className="card-fluid-thumbnail" />
          <div className="card-hover-matte-curtain" />
        </Link>
      </div>
      
      <div className="card-textual-descriptor-box">
        <h3 className="card-product-title-string">{name}</h3>
        
        <div className="card-pricing-ledger-dock">
          <span className="price-tag-new-bold">${new_price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="price-tag-old-strike">${old_price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;