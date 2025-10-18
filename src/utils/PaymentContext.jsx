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

const PaymentContext = createContext();

// Custom hook to use the payment context
export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentDocRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, "userPaymentMethods", userId);
  }, [userId]);

  useEffect(() => {
    if (!paymentDocRef) {
      setPaymentMethods([]);
      setDefaultPaymentMethodId(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      paymentDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(
              paymentDocRef,
              {
                paymentMethods: [],
                defaultPaymentMethodId: null,
                updatedAt: Timestamp.now(),
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Error initializing payment methods doc:", error);
          }

          setPaymentMethods([]);
          setDefaultPaymentMethodId(null);
        } else {
          const data = snapshot.data();
          setPaymentMethods(
            Array.isArray(data.paymentMethods) ? data.paymentMethods : []
          );
          setDefaultPaymentMethodId(data.defaultPaymentMethodId || null);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Error subscribing to payment methods:", error);
        setPaymentMethods([]);
        setDefaultPaymentMethodId(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [paymentDocRef]);

  const persistPayments = async (methods, defaultId) => {
    if (!paymentDocRef) return;

    try {
      await setDoc(
        paymentDocRef,
        {
          paymentMethods: methods,
          defaultPaymentMethodId: defaultId || null,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving payment methods to Firestore:", error);
    }
  };

  // Add a new payment method
  const addPaymentMethod = async (paymentMethod) => {
    const newPaymentMethod = {
      ...paymentMethod,
      id: `payment_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedMethods = [newPaymentMethod, ...paymentMethods];
    const nextDefaultId =
      paymentMethods.length === 0
        ? newPaymentMethod.id
        : defaultPaymentMethodId;

    setPaymentMethods(updatedMethods);
    setDefaultPaymentMethodId(nextDefaultId);

    await persistPayments(updatedMethods, nextDefaultId);

    return newPaymentMethod;
  };

  // Edit an existing payment method
  const updatePaymentMethod = async (id, updatedPaymentMethod) => {
    const updatedPaymentMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, ...updatedPaymentMethod } : method
    );
    setPaymentMethods(updatedPaymentMethods);
    await persistPayments(updatedPaymentMethods, defaultPaymentMethodId);
    return updatedPaymentMethods.find((method) => method.id === id);
  };

  // Remove a payment method
  const removePaymentMethod = async (id) => {
    const remainingMethods = paymentMethods.filter(
      (method) => method.id !== id
    );

    let nextDefaultId = defaultPaymentMethodId;

    if (defaultPaymentMethodId === id) {
      nextDefaultId = remainingMethods.length ? remainingMethods[0].id : null;
    }

    setPaymentMethods(remainingMethods);
    setDefaultPaymentMethodId(nextDefaultId);

    await persistPayments(remainingMethods, nextDefaultId);
  };

  // Set a payment method as the default
  const setDefaultPaymentMethod = async (id) => {
    if (paymentMethods.some((method) => method.id === id)) {
      setDefaultPaymentMethodId(id);
      await persistPayments(paymentMethods, id);
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
    isLoading,
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
