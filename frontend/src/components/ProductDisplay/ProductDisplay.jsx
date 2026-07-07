import { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import './ProductDisplay.css';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  // 1. Add state to track the selected size
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to the cart!");
      return;
    }
    addToCart(product.id);
    alert(`Added ${product.name} (Size: ${selectedSize}) to your cart!`);
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="Thumbnail view" />
          <img src={product.image} alt="Thumbnail view" />
          <img src={product.image} alt="Thumbnail view" />
          <img src={product.image} alt="Thumbnail view" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span className="star-dull">★</span>
          <p>(144 Reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price.toFixed(2)}</div>
          <div className="productdisplay-right-price-new">${product.new_price.toFixed(2)}</div>
        </div>
        <div className="productdisplay-right-description">
          A meticulously crafted silhouette featuring signature embroidery work, fine interlaced threads, and dynamic breathability properties optimized for midsummer evening gatherings.
        </div>
        <div className="productdisplay-right-size">
          <h3>Select Size</h3>
          {/* 2. Map through sizes dynamically and apply an active class if selected */}
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div 
                key={size} 
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        {/* 3. Use the updated click handler */}
        <button onClick={handleAddToCart}>ADD TO CART</button>
        <p className="productdisplay-right-category"><span>Category :</span> Traditional Ethnic, Stitched Heritage Collection</p>
        <p className="productdisplay-right-category"><span>Tags :</span> Premium, Breathable, Eid Festive, Newest Arrival</p>
      </div>
    </div>
  );
};

export default ProductDisplay;