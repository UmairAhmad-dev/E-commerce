import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import LoginSignup from './pages/LoginSignup';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Admin from './components/AdminPanel/Admin';

// This wrapper component handles the conditional rendering of store layout headers/footers
const AppContent = () => {
  const location = useLocation();
  
  // Check if the current route starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {/* ONLY render standard store Navbar if we aren't in the Admin Dashboard */}
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/mens" element={<ShopCategory category="men" banner="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200" />} />
        <Route path="/womens" element={<ShopCategory category="women" banner="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200" />} />
        <Route path="/kids" element={<ShopCategory category="kid" banner="https://images.unsplash.com/photo-1514315384763-ba401779410f?w=1200" />} />
        <Route path="/product" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
      
      {/* ONLY render standard store Footer if we aren't in the Admin Dashboard */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;