import './Offers.css';

const Offers = () => {
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button onClick={() => window.scrollTo({ top: 1800, behavior: 'smooth' })}>Check Now</button>
      </div>
      <div className="offers-right">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500" alt="Exclusive Offer Display" />
      </div>
    </div>
  );
};

export default Offers;