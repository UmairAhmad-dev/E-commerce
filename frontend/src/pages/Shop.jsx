import Hero from '../components/Hero/Hero';
import FabricGrid from '../components/FabricGrid/FabricGrid';
import Popular from '../components/Popular/Popular';
import Offers from '../components/Offers/Offers';
import NewCollections from '../components/NewCollections/NewCollections';
import Newsletter from '../components/Newsletter/Newsletter';

const Shop = () => {
  return (
    <div>
      <Hero />
      <FabricGrid />
      <Popular />
      <Offers />
      <NewCollections />
      <Newsletter />
    </div>
  );
};

export default Shop;