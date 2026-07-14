import { useState } from 'react';

const AddProduct = () => {
  const [activeStep, setActiveStep] = useState(1); 
  const [productDetails, setProductDetails] = useState({
    name: "", old_price: "", new_price: "", category: "mens", stock_qty: "", description: "", tags: ""
  });
  const [imageFile, setImageFile] = useState(null);
  
  // Custom feedback state replacing standard browser alert systems
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const showFeedback = (text, type) => {
    setFeedback({ text, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (type === "success") {
      setTimeout(() => setFeedback({ text: "", type: "" }), 5000);
    }
  };

  const handleInputChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    if (feedback.text) setFeedback({ text: "", type: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      showFeedback("⚠️ Please select a product image file first!", "error");
      return;
    }

    // 1. Retrieve the session token from sessionStorage (matches your Admin authentication structure)
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      showFeedback("❌ Session Expired: Please log out and log back in to verify security clearance.", "error");
      return;
    }

    try {
      let formData = new FormData();
      formData.append('product', imageFile);

      // 2. Upload image file with authorization headers included
      const uploadResponse = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const responseData = await uploadResponse.json();

      if (responseData.success) {
        const updatedProduct = {
          ...productDetails,
          image: responseData.image_url,
          new_price: Number(productDetails.new_price),
          old_price: Number(productDetails.old_price),
          stock_qty: Number(productDetails.stock_qty)
        };

        // 3. Post master product specifications to backend database with authorization clearance
        const productResponse = await fetch('http://localhost:4000/api/products/addproduct', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Sends verified secure token to pass protectAdmin
          },
          body: JSON.stringify(updatedProduct),
        });

        const finalData = await productResponse.json();
        
        if (finalData.success) {
          showFeedback(`🎉 Success! "${productDetails.name}" is now live in your cloud catalog.`, "success");
          setProductDetails({ name: "", old_price: "", new_price: "", category: "mens", stock_qty: "", description: "", tags: "" });
          setImageFile(null);
          setActiveStep(1);
        } else {
          showFeedback(`❌ Failed: ${finalData.message || "Could not save catalog details."}`, "error");
        }
      } else {
        showFeedback("❌ Image upload system rejected the file stream.", "error");
      }
    } catch (error) {
      console.error("Full-Stack integration failed:", error);
      showFeedback("❌ Error: Unable to connect to your backend server node.", "error");
    }
  };

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      
      {/* INLINE FEEDBACK NOTIFICATION BANNER */}
      {feedback.text && (
        <div 
          className={`profile-inline-feedback-banner ${feedback.type}`}
          style={{
            padding: "14px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "24px",
            border: "1px solid",
            background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: feedback.type === "success" ? "#15803d" : "#b91c1c",
            borderColor: feedback.type === "success" ? "#bbf7d0" : "#fecaca"
          }}
        >
          {feedback.text}
        </div>
      )}

      {/* MODERN STEPPER PROGRESS ROADMAP */}
      <div className="form-stepper-container">
        <div className={`step-node ${activeStep >= 1 ? 'active' : ''}`}>
          <div className="node-number">1</div>
          <span>Basic Specifications</span>
        </div>
        <div className="step-connector-line"></div>
        <div className={`step-node ${activeStep === 2 ? 'active' : ''}`}>
          <div className="node-number">2</div>
          <span>Pricing & Media Assets</span>
        </div>
      </div>

      {/* Isolated form class name to avoid style bleeding conflicts with coupons page */}
      <form className="product-ingestion-form-stepper" onSubmit={handleFormSubmit}>
        
        {/* STEP 1: BASIC INFORMATION */}
        {activeStep === 1 && (
          <div className="stepper-content-view animated-fade">
            <div className="form-input-block">
              <label>Product Title / Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g., Men's Luxury Cotton Kurta - Charcoal Slate" 
                value={productDetails.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-input-row-grid items-two">
              <div className="form-input-block">
                <label>Core Segment Category</label>
                <select name="category" value={productDetails.category} onChange={handleInputChange}>
                  <option value="mens">Men's Ethnic Wear</option>
                  <option value="womens">Women's Premium Lawn</option>
                  <option value="kids">Junior Stitched Collection</option>
                </select>
              </div>
              <div className="form-input-block">
                <label>Search Meta Tags</label>
                <input 
                  type="text" 
                  name="tags" 
                  placeholder="Premium, Breathable, Eid Festive" 
                  value={productDetails.tags} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div className="form-input-block">
              <label>Detailed Item Description</label>
              <textarea 
                name="description" 
                rows="4" 
                placeholder="Describe fabric profile composition, stitching density details..." 
                value={productDetails.description} 
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="stepper-actions-row">
              <button 
                type="button" 
                className="step-next-action-trigger" 
                onClick={() => {
                  if(productDetails.name && productDetails.description) {
                    setActiveStep(2);
                  } else {
                    showFeedback("⚠️ Please fill in the Product Name and Description first!", "error");
                  }
                }}
              >
                Proceed to Next Step →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PRICING, STOCK & IMAGERY */}
        {activeStep === 2 && (
          <div className="stepper-content-view animated-fade">
            <div className="form-input-row-grid">
              <div className="form-input-block">
                <label>Original Retail Price (Rs.)</label>
                <input type="number" step="1" name="old_price" placeholder="8500" value={productDetails.old_price} onChange={handleInputChange} required />
              </div>
              <div className="form-input-block">
                <label>Sale Price (Rs.)</label>
                <input type="number" step="1" name="new_price" placeholder="5500" value={productDetails.new_price} onChange={handleInputChange} required />
              </div>
              <div className="form-input-block">
                <label>Vault Stock Quantity</label>
                <input type="number" name="stock_qty" placeholder="150" value={productDetails.stock_qty} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-input-block image-upload-zone">
              <label>Display Imagery Resource File</label>
              <div className="upload-box-wrapper">
                <input type="file" id="prod-file-img" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
                <label htmlFor="prod-file-img" className="custom-upload-trigger modern-dropzone">
                  <div className="dropzone-inner-prompt">
                    <span className="cloud-upload-emoji">📂</span>
                    <p>{imageFile ? `Selected: ${imageFile.name}` : "Click to browse or drop premium product media assets"}</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="stepper-actions-row split-dock">
              <button type="button" className="step-back-action-trigger" onClick={() => setActiveStep(1)}>
                ← Back
              </button>
              <button type="submit" className="admin-action-submit-btn">
                Publish Item to Catalog
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default AddProduct;
