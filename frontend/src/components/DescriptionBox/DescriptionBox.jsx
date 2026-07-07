import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (144)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Our premium ethnic platform showcases garments carefully sourced to honor historical weaving processes while integrating standard stitch profiles. Each lawn and silk piece features detailed floral motifs, reinforced borders, and colorways configured to maintain color fastness over multiple washes.
        </p>
        <p>
          Designed distinctly with versatility in mind, these sets can be easily paired down for standard daily tasks or styled up dynamically using custom jewelry for celebratory formal milestones.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;