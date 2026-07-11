import { useState } from 'react';

const AddProduct = () => {
  const [activeStep, setActiveStep] = useState(1); 
  const [productDetails, setProductDetails] = useState({
    name: "", old_price: "", new_price: "", category: "mens", stock_qty: "", description: "", tags: ""
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a product image file first!");
      return;
    }

    try {
      let formData = new FormData();
      formData.append('product', imageFile);

      const uploadResponse = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
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

        const productResponse = await fetch('http://localhost:4000/api/products/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        const finalData = await productResponse.json();
        
        if (finalData.success) {
          alert(`🎉 Success! "${productDetails.name}" is now live in your cloud catalog.`);
          setProductDetails({ name: "", old_price: "", new_price: "", category: "mens", stock_qty: "", description: "", tags: "" });
          setImageFile(null);
          setActiveStep(1);
        } else {
          alert("❌ Failed to push product meta fields to database.");
        }
      } else {
        alert("❌ Image upload system rejected the file stream.");
      }
    } catch (error) {
      console.error("Full-Stack integration failed:", error);
      alert("❌ Error: Unable to connect to your backend server node.");
    }
  };

  return (
    <div className="admin-card-view premium-ui-card animated-fade">
      
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

      <form className="admin-ingestion-form" onSubmit={handleFormSubmit}>
        
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
                    alert("Please fill in the Product Name and Description first!");
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
                <label>Original Retail Price ($)</label>
                <input type="number" step="0.01" name="old_price" placeholder="85.00" value={productDetails.old_price} onChange={handleInputChange} required />
              </div>
              <div className="form-input-block">
                <label>Sale Price ($)</label>
                <input type="number" step="0.01" name="new_price" placeholder="55.00" value={productDetails.new_price} onChange={handleInputChange} required />
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