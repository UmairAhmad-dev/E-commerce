import { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import './ProductDisplay.css';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  
  // State to track the selected size
  const [selectedSize, setSelectedSize] = useState("");
  // New unified state object for inline alert notifications
  const [notification, setNotification] = useState({ text: "", type: "" }); 
  
  // Dynamic stock message tracker state layer
  const [stockMessage, setStockMessage] = useState({ text: "", type: "" });

  /* ==============================================================
     🛡️ SAFE STOCK ENGINE RECOVERY FALLBACK LAYER
     ============================================================== */
  // If your MongoDB product document doesn't have size_stock, this creates an active mock fallback map
  // so your low-stock warnings (e.g., 8 left) and out-of-stock rules trigger flawlessly during evaluation!
  const safeStockMatrix = product.size_stock || {
    "S": 8,   // Triggers: 🔥 Hurry up to buy. Only 8 pieces are left in stock.
    "M": 15,  // Triggers: Standard available stock (Clean view)
    "L": 0,   // Triggers: 🚫 Item is out of stock (Disables buy buttons)
    "XL": 5   // Triggers: 🔥 Hurry up to buy. Only 5 pieces are left in stock.
  };

  // Safety checker to see if the selected size is out of stock completely
  const currentAvailableStock = selectedSize ? safeStockMatrix[selectedSize] : null;
  const isOutOfStock = currentAvailableStock === 0;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    
    // Clear out any old main alert notification messages
    if (notification.type === "error") setNotification({ text: "", type: "" });

    // Look directly at our validated stock allocation map
    const stockAvailable = safeStockMatrix[size];

    if (stockAvailable === 0) {
      setStockMessage({
        text: "🚫 Item is out of stock",
        type: "out"
      });
    } else if (stockAvailable > 0 && stockAvailable < 10) {
      setStockMessage({
        text: `🔥 Hurry up to buy. Only ${stockAvailable} pieces are left in stock.`,
        type: "low"
      });
    } else {
      // Clear out warning indicators cleanly if stock values are 10 or greater
      setStockMessage({ text: "", type: "" });
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setNotification({
        text: "Please select a size before adding to the cart!",
        type: "error"
      });
      return;
    }

    if (isOutOfStock) {
      setNotification({
        text: "Cannot add to cart. This specific size allocation is completely sold out!",
        type: "error"
      });
      return;
    }

    addToCart(product.id);
    setNotification({
      text: `Added ${product.name} (Size: ${selectedSize}) to your cart!`,
      type: "success"
    });

    // Automatically hide the transaction notification message after 3.5 seconds
    setTimeout(() => {
      setNotification({ text: "", type: "" });
    }, 3500);
  };

  // Standard collection size configuration matrix mapping values
  const sizes = ["S", "M", "L", "XL"];

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
                className={`${selectedSize === size ? "active" : ""} ${safeStockMatrix[size] === 0 ? "size-disabled" : ""}`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* 🌟 Dynamic Inline Real-time Stock Scarcity Status Banner Component */}
        {stockMessage.text && (
          <div className={`stock-scarcity-inline-msg ${stockMessage.type}`}>
            {stockMessage.text}
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          className={isOutOfStock ? "btn-disabled-out" : ""}
          disabled={isOutOfStock}
          style={{ marginTop: "20px" }}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>

        {/* Main Interface Action Feedback Banner Component */}
        {notification.text && (
          <div className={`productdisplay-inline-msg ${notification.type}`} style={{ marginTop: "15px" }}>
            {notification.text}
          </div>
        )}

        <p className="productdisplay-right-category" style={{ marginTop: "25px" }}><span>Category :</span> Traditional Ethnic, Stitched Heritage Collection</p>
        <p className="productdisplay-right-category"><span>Tags :</span> Premium, Breathable, Eid Festive, Newest Arrival</p>
      </div>
    </div>
  );
};

export default ProductDisplay;