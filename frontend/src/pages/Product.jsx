import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";
import ProductReviews from "../components/ProductReviews/ProductReviews"; // 🚀 Import the reviews panel component

const Product = () => {
  const { all_product, loading } = useContext(ShopContext);
  const { productId } = useParams();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#64748b', fontFamily: 'system-ui' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #f1f5f9', borderTopColor: '#ff4141', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ fontWeight: '600', fontSize: '15px' }}>Verifying Luxury Specifications Matrix...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#ef4444', fontFamily: 'system-ui', fontWeight: '600' }}>
        ⚠️ Specified boutique catalog item reference could not be located.
      </div>
    );
  }

  return (
    <div className="product-page-wrapper-animated" style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* 1. Main visual parameters showcase */}
      <ProductDisplay product={product} />
      
      {/* 🚀 2. Connected User Reviews & Submission Engine Container */}
      <div className="product-reviews-container-box" style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px' }}>
        <ProductReviews productId={product.id || product._id} />
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default Product;