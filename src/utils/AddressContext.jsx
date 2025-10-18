import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

const AddressContext = createContext();

// Custom hook to use the address context
export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;

  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addressesDocRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, "userAddresses", userId);
  }, [userId]);

  useEffect(() => {
    if (!addressesDocRef) {
      setAddresses([]);
      setDefaultAddressId(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      addressesDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(
              addressesDocRef,
              {
                addresses: [],
                defaultAddressId: null,
                updatedAt: Timestamp.now(),
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Error initializing addresses doc:", error);
          }

          setAddresses([]);
          setDefaultAddressId(null);
        } else {
          const data = snapshot.data();
          setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
          setDefaultAddressId(data.defaultAddressId || null);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Error subscribing to addresses:", error);
        setAddresses([]);
        setDefaultAddressId(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [addressesDocRef]);

  const persistAddresses = async (nextAddresses, nextDefaultId) => {
    if (!addressesDocRef) return;

    try {
      await setDoc(
        addressesDocRef,
        {
          addresses: nextAddresses,
          defaultAddressId: nextDefaultId || null,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving addresses to Firestore:", error);
    }
  };
  //Countries
  const countries = [
    "Australia",
    "Bangladesh",
    "Brazil",
    "Canada",
    "China",
    "France",
    "Germany",
    "India",
    "Indonesia",
    "Italy",
    "Japan",
    "Malaysia",
    "Mexico",
    "Netherlands",
    "New Zealand",
    "Pakistan",
    "Philippines",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Vietnam",
  ];

  // Add a new address
  const addAddress = async (address) => {
    const newAddress = {
      ...address,
      id: `address_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedAddresses = [newAddress, ...addresses];
    const nextDefaultId =
      addresses.length === 0 ? newAddress.id : defaultAddressId;

    setAddresses(updatedAddresses);
    setDefaultAddressId(nextDefaultId);

    await persistAddresses(updatedAddresses, nextDefaultId);

    return newAddress;
  };

  // Edit an existing address
  const updateAddress = async (id, updatedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id ? { ...address, ...updatedAddress } : address
    );
    setAddresses(updatedAddresses);
    await persistAddresses(updatedAddresses, defaultAddressId);
    return updatedAddresses.find((address) => address.id === id);
  };

  // Remove an address
  const removeAddress = async (id) => {
    const remainingAddresses = addresses.filter((address) => address.id !== id);

    let nextDefaultId = defaultAddressId;

    if (defaultAddressId === id) {
      nextDefaultId = remainingAddresses.length
        ? remainingAddresses[0].id
        : null;
    }

    setAddresses(remainingAddresses);
    setDefaultAddressId(nextDefaultId);

    await persistAddresses(remainingAddresses, nextDefaultId);
  };

  // Set an address as the default
  const setDefaultAddress = async (id) => {
    if (addresses.some((address) => address.id === id)) {
      setDefaultAddressId(id);
      await persistAddresses(addresses, id);
      return true;
    }
    return false;
  };

  // Get all addresses
  const getAddresses = () => {
    return addresses;
  };

  // Get default address
  const getDefaultAddress = () => {
    return addresses.find((address) => address.id === defaultAddressId) || null;
  };
  const addressContextValue = {
    addresses,
    defaultAddressId,
    isLoading,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    getAddresses,
    getDefaultAddress,
    countries,
  };

  return (
    <AddressContext.Provider value={addressContextValue}>
      {children}
    </AddressContext.Provider>
  );
};
