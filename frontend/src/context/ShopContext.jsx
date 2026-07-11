import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 305; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogAndCart = async () => {
      try {
        // 1. Fetch products and destructure the wrapped array correctly
        const productRes = await fetch("http://localhost:4000/api/products/allproducts");
        const productData = await productRes.json();
        
        if (productData.success && productData.products) {
          setAll_Product(productData.products); // ✅ Fixed: Extracts the actual array
        } else {
          setAll_Product(Array.isArray(productData) ? productData : []);
        }

        const userToken = localStorage.getItem("auth-token");
        if (userToken) {
          // 2. Fetch cart with updated modern Bearer Authorization token schemas
          const cartRes = await fetch("http://localhost:4000/api/users/getcart", {
            method: "POST", // Changed to POST to match typical backend cart fetches safely
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${userToken}`, // ✅ Fixed: Aligns with your backend split pattern
              "Content-Type": "application/json",
            },
          });
          const cartData = await cartRes.json();
          if (cartData.success && cartData.cartData) {
            setCartItems(cartData.cartData);
          } else if (cartData && !cartData.success) {
            setCartItems(getDefaultCart());
          }
        }
      } catch (error) {
        console.error("Connection failure to backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogAndCart();
  }, []);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    const userToken = localStorage.getItem("auth-token");
    if (userToken) {
      try {
        await fetch("http://localhost:4000/api/users/addtocart", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${userToken}`, // ✅ Fixed: Aligns with authMiddleware
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        });
      } catch (error) {
        console.error("Failed to sync cart item:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 0) }));

    const userToken = localStorage.getItem("auth-token");
    if (userToken) {
      try {
        await fetch("http://localhost:4000/api/users/removefromcart", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${userToken}`, // ✅ Fixed: Aligns with authMiddleware
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        });
      } catch (error) {
        console.error("Failed to decrement cart item:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => 
            Number(product.id) === Number(item) || 
            String(product._id) === String(item)
        );
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
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    loading,
    getSubtotalAmount: getTotalCartAmount, 
    getDiscountAmount: () => 0, 
    getTaxAmount: () => getTotalCartAmount() * 0.05, 
    getShippingFee: () => 0, 
    clearCart: () => setCartItems(getDefaultCart())
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;