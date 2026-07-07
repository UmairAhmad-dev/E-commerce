import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import LoginSignup from './pages/LoginSignup';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/mens" element={<ShopCategory category="men" banner="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200" />} />
        <Route path="/womens" element={<ShopCategory category="women" banner="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200" />} />
        <Route path="/kids" element={<ShopCategory category="kid" banner="https://images.unsplash.com/photo-1514315384763-ba401779410f?w=1200" />} />
        <Route path="/product" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;