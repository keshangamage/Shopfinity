import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const SavedItemsContext = createContext();

export const useSavedItems = () => useContext(SavedItemsContext);

export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const localSavedItems = localStorage.getItem("shopfinitySavedItems");
      return localSavedItems ? JSON.parse(localSavedItems) : [];
    } catch (error) {
      console.error("Error loading saved items from localStorage:", error);
      return [];
    }
  });
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!currentUser) {
        try {
          const localSavedItems = localStorage.getItem("shopfinitySavedItems");
          if (localSavedItems) {
            setSavedItems(JSON.parse(localSavedItems));
          }
        } catch (error) {
          console.error("Error loading saved items from localStorage:", error);
        }
        return;
      }

      try {
        const userDoc = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists() && docSnap.data().savedItems) {
          const firestoreItems = docSnap.data().savedItems;
          setSavedItems(firestoreItems);

          localStorage.setItem(
            "shopfinitySavedItems",
            JSON.stringify(firestoreItems)
          );
        } else {
          // Initialize with empty array if no saved items exist
          await setDoc(
            doc(db, "users", currentUser.uid),
            { savedItems: [] },
            { merge: true }
          );
          setSavedItems([]);
          localStorage.setItem("shopfinitySavedItems", JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error fetching saved items:", error);

        try {
          const localSavedItems = localStorage.getItem("shopfinitySavedItems");
          if (localSavedItems) {
            setSavedItems(JSON.parse(localSavedItems));
          } else {
            setSavedItems([]);
          }
        } catch (error) {
          setSavedItems([]);
        }
      }
    };

    fetchSavedItems();
  }, [currentUser, db]);

  const saveItemsToFirestore = async (items) => {
    try {
      localStorage.setItem("shopfinitySavedItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        savedItems: items,
      });
    } catch (error) {
      console.error("Error updating saved items in Firestore:", error);
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
      await saveItemsToFirestore(updatedItems);
      return true;
    }
    return false;
  };

  // Remove an item from saved items
  const removeFromSavedItems = async (itemId) => {
    const updatedItems = savedItems.filter((item) => item.id !== itemId);
    setSavedItems(updatedItems);
    await saveItemsToFirestore(updatedItems);
  };

  // Check if an item is saved
  const isItemSaved = (itemId) => {
    return savedItems.some((item) => item.id === itemId);
  };

  // Clear all saved items
  const clearSavedItems = async () => {
    setSavedItems([]);
    await saveItemsToFirestore([]);
  };

  useEffect(() => {
    try {
      localStorage.setItem("shopfinitySavedItems", JSON.stringify(savedItems));
      console.log("Saved items saved to localStorage:", savedItems);
    } catch (error) {
      console.error("Error saving saved items to localStorage:", error);
    }
  }, [savedItems]);

  const value = {
    savedItems,
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
