import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const AddressContext = createContext();

// Custom hook to use the address context
export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";

  // Get addresses from local storage or start with empty array
  const [addresses, setAddresses] = useState(() => {
    try {
      const savedAddresses = localStorage.getItem(
        `shopfinity_addresses_${userId}`
      );
      return savedAddresses ? JSON.parse(savedAddresses) : [];
    } catch (error) {
      console.error("Error loading addresses from localStorage:", error);
      return [];
    }
  });

  // Default address state
  const [defaultAddressId, setDefaultAddressId] = useState(() => {
    try {
      const savedDefaultId = localStorage.getItem(
        `shopfinity_default_address_${userId}`
      );
      return savedDefaultId || (addresses.length > 0 ? addresses[0].id : null);
    } catch (error) {
      console.error("Error loading default address from localStorage:", error);
      return null;
    }
  });

  // Save addresses to local storage whenever they change or user changes
  useEffect(() => {
    try {
      if (userId) {
        localStorage.setItem(
          `shopfinity_addresses_${userId}`,
          JSON.stringify(addresses)
        );
      }
    } catch (error) {
      console.error("Error saving addresses to localStorage:", error);
    }
  }, [addresses, userId]);

  // Save default address ID to local storage
  useEffect(() => {
    try {
      if (userId && defaultAddressId) {
        localStorage.setItem(
          `shopfinity_default_address_${userId}`,
          defaultAddressId
        );
      }
    } catch (error) {
      console.error("Error saving default address to localStorage:", error);
    }
  }, [defaultAddressId, userId]);
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
  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `address_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAddresses((prevAddresses) => [newAddress, ...prevAddresses]);

    if (addresses.length === 0) {
      setDefaultAddressId(newAddress.id);
    }

    return newAddress;
  };

  // Edit an existing address
  const updateAddress = (id, updatedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id ? { ...address, ...updatedAddress } : address
    );
    setAddresses(updatedAddresses);
    return updatedAddresses.find((address) => address.id === id);
  };

  // Remove an address
  const removeAddress = (id) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address.id !== id)
    );

    if (defaultAddressId === id) {
      const remainingAddresses = addresses.filter(
        (address) => address.id !== id
      );
      if (remainingAddresses.length > 0) {
        setDefaultAddressId(remainingAddresses[0].id);
      } else {
        setDefaultAddressId(null);
      }
    }
  };

  // Set an address as the default
  const setDefaultAddress = (id) => {
    if (addresses.some((address) => address.id === id)) {
      setDefaultAddressId(id);
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
