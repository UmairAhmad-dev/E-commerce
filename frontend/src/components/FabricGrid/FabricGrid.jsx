import { Link } from 'react-router-dom';
import './FabricGrid.css';

const FABRIC_COLLECTIONS = [
  { name: "Premium Lawn", tag: "lawn", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500" },
  { name: "Ready To Wear", tag: "stitched", img: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500" },
  { name: "Luxury Kurtas", tag: "kurta", img: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=500" }
];

const FabricGrid = () => {
  return (
    <section className="premium-fabric-collections-container" aria-label="Collections Lookbook Matrix">
      <div className="fabric-section-editorial-header">
        <span className="fabric-mini-curation-tag">CURATED SEGMENTS</span>
        <h2>Shop By Collection</h2>
        <div className="fabric-minimalist-underline-bar" />
        <p>Browse through exclusively curated traditional designs categorized by fabric profile types</p>
      </div>

      <div className="luxury-fabric-asymmetric-grid">
        {FABRIC_COLLECTIONS.map((col, index) => (
          <div key={index} className={`luxury-fabric-card card-index-${index}`}>
            <div className="luxury-fabric-img-frame">
              <img src={col.img} alt={col.name} className="fabric-fluid-img" />
              <div className="fabric-dark-ambient-gradient" />
            </div>
            <div className="luxury-fabric-card-overlay-details">
              <h3 className="fabric-collection-headline">{col.name}</h3>
              <Link to="/womens" className="fabric-router-anchor-link">
                <button className="premium-explore-hollow-btn">
                  <span>View Catalog</span>
                  <span className="explore-arrow-vector">→</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FabricGrid;