import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import { doc, onSnapshot, setDoc, Timestamp, runTransaction } from "firebase/firestore";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const emptyCart = [];

const ensureCartShape = (items) => {
  if (!Array.isArray(items)) return [...emptyCart];

  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
  }));
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;

  const [cartItems, setCartItems] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(false);

  const cartDocRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, "carts", userId);
  }, [userId]);

  useEffect(() => {
    if (!cartDocRef) {
      setCartItems(emptyCart);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      cartDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(cartDocRef, {
              items: emptyCart,
              updatedAt: Timestamp.now(),
            });
          } catch (error) {
            console.error("Error initializing user cart:", error);
          }

          setCartItems(emptyCart);
        } else {
          const data = snapshot.data();
          setCartItems(ensureCartShape(data.items));
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Error subscribing to cart updates:", error);
        setCartItems(emptyCart);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [cartDocRef]);

  const persistCart = async (items) => {
    if (!cartDocRef) return;

    try {
      await setDoc(
        cartDocRef,
        {
          items: ensureCartShape(items),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number.isFinite(quantity) ? Math.max(1, quantity) : 1;

    const updatedItems = (() => {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        return cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [
        ...cartItems,
        {
          ...product,
          quantity: qty,
        },
      ];
    })();

    setCartItems(updatedItems);

    if (!cartDocRef) return;

    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(cartDocRef);
        const existingItems = snapshot.exists()
          ? ensureCartShape(snapshot.data().items)
          : emptyCart;

        const mergedItems = (() => {
          const existing = existingItems.find((item) => item.id === product.id);

          if (existing) {
            return existingItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            );
          }

          return [
            ...existingItems,
            {
              ...product,
              quantity: qty,
            },
          ];
        })();

        transaction.set(
          cartDocRef,
          {
            items: mergedItems,
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
      });
    } catch (error) {
      console.error("Error adding item to cart in Firestore:", error);
      await persistCart(updatedItems);
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedItems);

    await persistCart(updatedItems);
  };

  const updateQuantity = async (productId, newQuantity) => {
    const qty = Number.isFinite(newQuantity) ? Math.max(1, newQuantity) : 1;

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: qty } : item
    );

    setCartItems(updatedItems);
    await persistCart(updatedItems);
  };

  const clearCart = async () => {
    setCartItems(emptyCart);
    await persistCart(emptyCart);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceToUse =
        item.discountPrice !== undefined ? item.discountPrice : item.price;
      return total + priceToUse * item.quantity;
    }, 0);
  };

  const cartContextValue = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
