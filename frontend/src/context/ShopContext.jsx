import { createContext, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 1; index <= 12; index++) {
    cart[index] = 0;
  }
  return cart;
};

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  
  const [allProducts] = useState([
    // --- WOMEN'S PAKISTANI SELECTION ---
    { id: 1, name: "Premium Embroidered 3-Piece Lawn Suit - Floral Ivory", category: "women", new_price: 65.0, old_price: 95.0, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
    { id: 2, name: "Hand-Block Printed Summer Kurti - Indigo Breeze", category: "women", new_price: 35.0, old_price: 50.0, image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600" },
    { id: 3, name: "Festive Velvet Shawl & Stitched Silk Pishwas - Crimson Royal", category: "women", new_price: 120.0, old_price: 180.0, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600" },
    { id: 4, name: "Classic Chikankari Straight Silhouette Kurta - Mint Pastel", category: "women", new_price: 45.0, old_price: 70.0, image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600" },
    
    // --- MEN'S TRADITIONAL SELECTION ---
    { id: 5, name: "Men's Luxury Cotton Kurta Shalwar - Charcoal Slate", category: "men", new_price: 55.0, old_price: 85.0, image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600" },
    { id: 6, name: "Premium Wash & Wear Festive Kurta - Deep Navy", category: "men", new_price: 48.0, old_price: 75.0, image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600" },
    
    // --- KIDS' PAKISTANI ETHNIC MINIATURES ---
    { id: 7, name: "Junior Girls Jacquard Lehnga Choli Set - Powder Pink", category: "kid", new_price: 40.0, old_price: 65.0, image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=600" },
    { id: 8, name: "Toddler Boys Soft Cotton Kurta Vest Combination - Emerald Gold", category: "kid", new_price: 32.0, old_price: 50.0, image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600" },
    { id: 9, name: "Kids Hand-Embellished Cotton Shalwar Suit - Sunflower Yellow", category: "kid", new_price: 38.0, old_price: 55.0, image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600" }
  ]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, prev[itemId] - 1) }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProducts.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems
  };

  return (
    <ShopContext value={contextValue}>
      {children}
    </ShopContext>
  );
};