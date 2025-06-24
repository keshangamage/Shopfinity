import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

// Create a context for the cart
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";

  // Get cart items from local storage or start with empty array
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadCartFromStorage();
    setIsInitialized(true);
  }, [userId]);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(
        `shopfinity_cart_${userId}`,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems, userId, isInitialized]);

  // Function to load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(`shopfinity_cart_${userId}`);
      console.log(
        `Loading cart for user: ${userId}`,
        savedCart ? JSON.parse(savedCart) : []
      );
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCartItems([]);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex > -1) {
        // If item exists, update the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // If item doesn't exist, add it to the cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Update item quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Use discount price if available, otherwise use regular price
      const priceToUse =
        item.discountPrice !== undefined ? item.discountPrice : item.price;
      return total + priceToUse * item.quantity;
    }, 0);
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loadCartFromStorage,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
