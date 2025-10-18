import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

const SavedItemsContext = createContext();

export const useSavedItems = () => useContext(SavedItemsContext);

export const SavedItemsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;

  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const savedItemsDocRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, "savedItems", userId);
  }, [userId]);

  useEffect(() => {
    if (!savedItemsDocRef) {
      setSavedItems([]);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      savedItemsDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(savedItemsDocRef, {
              items: [],
              updatedAt: Timestamp.now(),
            });
          } catch (error) {
            console.error("Error initializing saved items doc:", error);
          }

          setSavedItems([]);
        } else {
          const data = snapshot.data();
          setSavedItems(Array.isArray(data.items) ? data.items : []);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening for saved items updates:", error);
        setSavedItems([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [savedItemsDocRef]);

  const persistSavedItems = async (items) => {
    if (!savedItemsDocRef) return;

    try {
      await setDoc(
        savedItemsDocRef,
        {
          items,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving saved items to Firestore:", error);
    }
  };

  // Add an item to saved items
  const addToSavedItems = async (item) => {
    // Check if item is already saved
    const isItemSaved = savedItems.some(
      (savedItem) => savedItem.id === item.id
    );

    if (!isItemSaved) {
      const updatedItems = [
        ...savedItems,
        { ...item, addedOn: new Date().toISOString() },
      ];
      setSavedItems(updatedItems);
      await persistSavedItems(updatedItems);
      return true;
    }
    return false;
  };

  // Remove an item from saved items
  const removeFromSavedItems = async (itemId) => {
    const updatedItems = savedItems.filter((item) => item.id !== itemId);
    setSavedItems(updatedItems);
    await persistSavedItems(updatedItems);
  };

  // Check if an item is saved
  const isItemSaved = (itemId) => {
    return savedItems.some((item) => item.id === itemId);
  };

  // Clear all saved items
  const clearSavedItems = async () => {
    setSavedItems([]);
    await persistSavedItems([]);
  };

  const value = {
    savedItems,
    isLoading,
    addToSavedItems,
    removeFromSavedItems,
    isItemSaved,
    clearSavedItems,
  };

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export default SavedItemsContext;
