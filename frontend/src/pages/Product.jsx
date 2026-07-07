import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../components/DescriptionBox/DescriptionBox';

const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  
  // React 19 safety casting parameter extraction
  const product = allProducts.find((e) => e.id === Number(productId));

  if (!product) {
    return <div style={{ padding: "80px", textPosition: "center" }}><h3>SKU Inventory Record Not Found.</h3></div>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
    </div>
  );
};

export default Product;