import { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import './ProductDisplay.css';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [notification, setNotification] = useState({ text: "", type: "" }); 
  const [stockMessage, setStockMessage] = useState({ text: "", type: "" });

  const safeStockMatrix = product.size_stock || {
    "S": 8, "M": 15, "L": 0, "XL": 5
  };

  const isOutOfStock = selectedSize ? safeStockMatrix[selectedSize] === 0 : false;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (notification.type === "error") setNotification({ text: "", type: "" });

    const stockAvailable = safeStockMatrix[size];
    if (stockAvailable === 0) {
      setStockMessage({ text: "🚫 Selected size is completely out of stock", type: "out" });
    } else if (stockAvailable > 0 && stockAvailable < 10) {
      setStockMessage({ text: `🔥 Limited Stock: Only ${stockAvailable} items remaining.`, type: "low" });
    } else {
      setStockMessage({ text: "", type: "" });
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setNotification({ text: "Please select your required size allocation first.", type: "error" });
      return;
    }

    if (isOutOfStock) {
      setNotification({ text: "Cannot allocate sold out dimensions to shopping bag.", type: "error" });
      return;
    }

    addToCart(product.id);
    setNotification({ text: `🎉 Added size ${selectedSize} cleanly into your bag.`, type: "success" });

    setTimeout(() => {
      setNotification({ text: "", type: "" });
    }, 3500);
  };

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="premium-display-canvas">
      
      {/* Left Column: Image Gallery Matrices */}
      <div className="display-gallery-column">
        <div className="vertical-thumbnails-rack">
          <img src={product.image} alt="Boutique angle look" />
          <img src={product.image} alt="Boutique angle look" />
          <img src={product.image} alt="Boutique angle look" />
          <img src={product.image} alt="Boutique angle look" />
        </div>
        <div className="master-showcase-frame">
          <img className="master-fluid-img" src={product.image} alt={product.name} />
        </div>
      </div>

      {/* Right Column: Editorial Details Matrix */}
      <div className="display-particulars-column">
        <span className="particulars-collection-tag">STITCHED HERITAGE COLLECTION</span>
        <h1 className="particulars-title-headline">{product.name}</h1>
        
        <div className="particulars-reviews-row">
          <div className="stars-vector-cluster">★★★★★</div>
          <p>(144 Certified Customer Reviews)</p>
        </div>

        <div className="particulars-price-dock">
          <span className="price-old-strike">${product.old_price.toFixed(2)}</span>
          <span className="price-new-bold">${product.new_price.toFixed(2)}</span>
        </div>

        <p className="particulars-editorial-copy">
          A meticulously crafted silhouette featuring signature embroidery work, fine interlaced threads, and dynamic breathability properties optimized for midsummer evening gatherings.
        </p>

        <hr className="particulars-separator" />

        <div className="particulars-size-picker-section">
          <h3>Select Dimensions</h3>
          <div className="size-buttons-matrix-grid">
            {sizes.map((size) => {
              const outOfStockFlag = safeStockMatrix[size] === 0;
              return (
                <button 
                  key={size} 
                  type="button"
                  className={`size-node-btn ${selectedSize === size ? "node-state-active" : ""} ${outOfStockFlag ? "node-state-soldout" : ""}`}
                  onClick={() => handleSizeSelect(size)}
                  disabled={outOfStockFlag}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Urgency Scarcity Messages */}
        {stockMessage.text && (
          <div className={`scarcity-alert-ribbon ${stockMessage.type}`}>
            {stockMessage.text}
          </div>
        )}

        <button 
          onClick={handleAddToCart}
          className={`bag-execution-action-trigger ${isOutOfStock ? "trigger-state-disabled" : ""}`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO SHOPPING BAG"}
        </button>

        {/* Action Success/Error Alerts */}
        {notification.text && (
          <div className={`action-feedback-ribbon ${notification.type}`}>
            {notification.text}
          </div>
        )}

        <div className="particulars-meta-footer-specs">
          <p><span>Category Matrix:</span> Traditional Ethnic, Kurtas & Sherwanis</p>
          <p><span>Curation Tags:</span> Premium Threads, Breathable Fabric, Eid Festive</p>
        </div>
      </div>

    </div>
  );
};

export default ProductDisplay;