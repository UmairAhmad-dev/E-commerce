import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ id, name, image, new_price, old_price }) => {
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
          {/* 🚀 Changed from $ to Rs. */}
          <span className="price-tag-new-bold">Rs. {new_price.toLocaleString('en-PK')}</span>
          {hasDiscount && (
            <span className="price-tag-old-strike">Rs. {old_price.toLocaleString('en-PK')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;