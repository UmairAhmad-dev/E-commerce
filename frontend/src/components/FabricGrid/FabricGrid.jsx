import { Link } from 'react-router-dom';
import './FabricGrid.css';

const FABRIC_COLLECTIONS = [
  { name: "Premium Lawn", tag: "lawn", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500" },
  { name: "Ready To Wear", tag: "stitched", img: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500" },
  { name: "Luxury Kurtas", tag: "kurta", img: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=500" }
];

const FabricGrid = () => {
  return (
    <div className="fabric-collections-section">
      <div className="section-title-block">
        <h2>Shop By Collection</h2>
        <hr />
        <p>Browse through exclusively curated traditional designs categorized by fabric profile types</p>
      </div>

      <div className="fabric-cards-grid">
        {FABRIC_COLLECTIONS.map((col, index) => (
          <div key={index} className="fabric-card">
            <div className="fabric-img-wrapper">
              <img src={col.img} alt={col.name} />
            </div>
            <div className="fabric-card-overlay">
              <h3>{col.name}</h3>
              <Link to="/womens">
                <button className="fabric-explore-btn">View Catalog</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FabricGrid;