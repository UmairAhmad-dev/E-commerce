import './Breadcrumbs.css';

const Breadcrumbs = ({ product }) => {
  return (
    <div className="breadcrumbs">
      HOME <span className="arrow">➔</span> SHOP <span className="arrow">➔</span> {product.category.toUpperCase()} <span className="arrow">➔</span> {product.name}
    </div>
  );
};

export default Breadcrumbs;