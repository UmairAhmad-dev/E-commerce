import Hero from '../components/Hero/Hero';
import FabricGrid from '../components/FabricGrid/FabricGrid'; // Imported the new fabric grid
import Popular from '../components/Popular/Popular';
import Offers from '../components/Offers/Offers';
import NewCollections from '../components/NewCollections/NewCollections';
import Newsletter from '../components/Newsletter/Newsletter';

const Shop = () => {
  return (
    <div>
      <Hero />
      <FabricGrid /> {/* Inserted cleanly below the sliding hero view */}
      <Popular />
      <Offers />
      <NewCollections />
      <Newsletter />
    </div>
  );
};

export default Shop;