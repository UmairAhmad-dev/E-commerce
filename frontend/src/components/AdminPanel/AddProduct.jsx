import { useState } from 'react';

const AddProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "mens",
    stock_qty: "",
    description: "",
    tags: ""
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Front-end execution simulation for team review
    console.log("Ingesting Product Meta Object State:", productDetails, imageFile);
    alert(`Successfully generated catalog mockup for: ${productDetails.name}`);
    
    // Reset inputs
    setProductDetails({ name: "", old_price: "", new_price: "", category: "mens", stock_qty: "", description: "", tags: "" });
    setImageFile(null);
  };

  return (
    <div className="admin-card-view animated-fade">
      <h2>Product Specifications Entry</h2>
      <form onSubmit={handleFormSubmit} className="admin-ingestion-form">
        
        <div className="form-input-block">
          <label>Product Title / Name</label>
          <input type="text" name="name" placeholder="e.g., Men's Luxury Cotton Kurta - Charcoal Slate" value={productDetails.name} onChange={handleInputChange} required />
        </div>

        <div className="form-input-row-grid">
          <div className="form-input-block">
            <label>Original Retail Price ($)</label>
            <input type="number" step="0.01" name="old_price" placeholder="85.00" value={productDetails.old_price} onChange={handleInputChange} required />
          </div>
          <div className="form-input-block">
            <label>Sale Price / Offer Price ($)</label>
            <input type="number" step="0.01" name="new_price" placeholder="55.00" value={productDetails.new_price} onChange={handleInputChange} required />
          </div>
          <div className="form-input-block">
            <label>Initial Vault Stock Quantity</label>
            <input type="number" name="stock_qty" placeholder="150" value={productDetails.stock_qty} onChange={handleInputChange} required />
          </div>
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
            <label>Search Meta Tags (Comma Separated)</label>
            <input type="text" name="tags" placeholder="Premium, Breathable, Eid Festive" value={productDetails.tags} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-input-block">
          <label>Detailed Item Description</label>
          <textarea name="description" rows="4" placeholder="Describe fabric profile composition, stitching density details, embroidery details..." value={productDetails.description} onChange={handleInputChange}></textarea>
        </div>

        <div className="form-input-block image-upload-zone">
          <label>Display Imagery Resource File</label>
          <div className="upload-box-wrapper">
            <input type="file" id="prod-file-img" accept="image/*" onChange={handleImageChange} required />
            <label htmlFor="prod-file-img" className="custom-upload-trigger">
              {imageFile ? `Selected: ${imageFile.name}` : "📂 Drag & drop or browse media files"}
            </label>
          </div>
        </div>

        <button type="submit" className="admin-action-submit-btn">Publish Item to Catalog Mockup</button>
      </form>
    </div>
  );
};

export default AddProduct;