import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay"; // Adjust paths to your display templates

const Product = () => {
  const { all_product, loading } = useContext(ShopContext);
  const { productId } = useParams();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading Item Specifications Matrix...</div>;
  }

  // Locate the exact matching database entity structure by converting URL string params to numbers
  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: '#ef4444', fontWeight: '600' }}>⚠️ Product Entry Not Found In Cloud Inventories.</div>;
  }

  return (
    <div className="product-page-wrapper">
      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;