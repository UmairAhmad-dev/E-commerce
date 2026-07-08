import { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import './ProductDisplay.css';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  
  // State to track the selected size
  const [selectedSize, setSelectedSize] = useState("");
  // New unified state object for inline alert notifications
  const [notification, setNotification] = useState({ text: "", type: "" }); 

  const handleAddToCart = () => {
    if (!selectedSize) {
      setNotification({
        text: "Please select a size before adding to the cart!",
        type: "error"
      });
      return;
    }

    addToCart(product.id);
    setNotification({
      text: `Added ${product.name} (Size: ${selectedSize}) to your cart!`,
      type: "success"
    });

    // Automatically hide the message line after 3.5 seconds
    setTimeout(() => {
      setNotification({ text: "", type: "" });
    }, 3500);
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
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div 
                key={size} 
                className={selectedSize === size ? "active" : ""}
                onClick={() => {
                  setSelectedSize(size);
                  // Instantly clear out error messages when user selects a size
                  if (notification.type === "error") setNotification({ text: "", type: "" });
                }}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        
        <button onClick={handleAddToCart}>ADD TO CART</button>

        {/* Inline Feedback Banner Component */}
        {notification.text && (
          <div className={`productdisplay-inline-msg ${notification.type}`}>
            {notification.text}
          </div>
        )}

        <p className="productdisplay-right-category"><span>Category :</span> Traditional Ethnic, Stitched Heritage Collection</p>
        <p className="productdisplay-right-category"><span>Tags :</span> Premium, Breathable, Eid Festive, Newest Arrival</p>
      </div>
    </div>
  );
};

export default ProductDisplay;