import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const PaymentContext = createContext();

// Custom hook to use the payment context
export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";

  // Get payment methods from local storage or start with empty array
  const [paymentMethods, setPaymentMethods] = useState(() => {
    try {
      const savedPaymentMethods = localStorage.getItem(
        `shopfinity_payment_methods_${userId}`
      );
      return savedPaymentMethods ? JSON.parse(savedPaymentMethods) : [];
    } catch (error) {
      console.error("Error loading payment methods from localStorage:", error);
      return [];
    }
  });

  // Default payment method state
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState(() => {
    try {
      const savedDefaultId = localStorage.getItem(
        `shopfinity_default_payment_${userId}`
      );
      return (
        savedDefaultId ||
        (paymentMethods.length > 0 ? paymentMethods[0].id : null)
      );
    } catch (error) {
      console.error(
        "Error loading default payment method from localStorage:",
        error
      );
      return null;
    }
  });

  useEffect(() => {
    try {
      if (userId) {
        localStorage.setItem(
          `shopfinity_payment_methods_${userId}`,
          JSON.stringify(paymentMethods)
        );
      }
    } catch (error) {
      console.error("Error saving payment methods to localStorage:", error);
    }
  }, [paymentMethods, userId]);

  // Save default payment method ID to local storage
  useEffect(() => {
    try {
      if (userId && defaultPaymentMethodId) {
        localStorage.setItem(
          `shopfinity_default_payment_${userId}`,
          defaultPaymentMethodId
        );
      }
    } catch (error) {
      console.error(
        "Error saving default payment method to localStorage:",
        error
      );
    }
  }, [defaultPaymentMethodId, userId]);

  // Add a new payment method
  const addPaymentMethod = (paymentMethod) => {
    const newPaymentMethod = {
      ...paymentMethod,
      id: `payment_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setPaymentMethods((prevPaymentMethods) => [
      newPaymentMethod,
      ...prevPaymentMethods,
    ]);

    if (paymentMethods.length === 0) {
      setDefaultPaymentMethodId(newPaymentMethod.id);
    }

    return newPaymentMethod;
  };

  // Edit an existing payment method
  const updatePaymentMethod = (id, updatedPaymentMethod) => {
    const updatedPaymentMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, ...updatedPaymentMethod } : method
    );
    setPaymentMethods(updatedPaymentMethods);
    return updatedPaymentMethods.find((method) => method.id === id);
  };

  // Remove a payment method
  const removePaymentMethod = (id) => {
    setPaymentMethods((prevPaymentMethods) =>
      prevPaymentMethods.filter((method) => method.id !== id)
    );

    if (defaultPaymentMethodId === id) {
      const remainingMethods = paymentMethods.filter(
        (method) => method.id !== id
      );
      if (remainingMethods.length > 0) {
        setDefaultPaymentMethodId(remainingMethods[0].id);
      } else {
        setDefaultPaymentMethodId(null);
      }
    }
  };

  // Set a payment method as the default
  const setDefaultPaymentMethod = (id) => {
    if (paymentMethods.some((method) => method.id === id)) {
      setDefaultPaymentMethodId(id);
      return true;
    }
    return false;
  };

  const getPaymentMethods = () => {
    return paymentMethods;
  };

  const getDefaultPaymentMethod = () => {
    return (
      paymentMethods.find((method) => method.id === defaultPaymentMethodId) ||
      null
    );
  };

  // Credit card types
  const cardTypes = ["Visa", "Mastercard", "American Express"];

  const paymentContextValue = {
    paymentMethods,
    defaultPaymentMethodId,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getPaymentMethods,
    getDefaultPaymentMethod,
    cardTypes,
  };

  return (
    <PaymentContext.Provider value={paymentContextValue}>
      {children}
    </PaymentContext.Provider>
  );
};
