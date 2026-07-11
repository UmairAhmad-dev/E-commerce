import Hero from '../components/Hero/Hero';
import FabricGrid from '../components/FabricGrid/FabricGrid';
import Popular from '../components/Popular/Popular';
import Offers from '../components/Offers/Offers';
import NewCollections from '../components/NewCollections/NewCollections';
import Newsletter from '../components/Newsletter/Newsletter';

const Shop = () => {
  return (
    <main className="storefront-homepage-canvas" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <Hero />
      <FabricGrid />
      <Popular />
      <Offers />
      <NewCollections />
      <Newsletter />
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </main>
  );
};

export default Shop;