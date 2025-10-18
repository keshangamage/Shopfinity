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

const maskCardNumber = (last4) => `**** **** **** ${last4}`;

const formatExpiryDate = (month, year) => {
  if (!month || !year) return "";
  const normalizedMonth = month.toString().padStart(2, "0");
  const normalizedYear = year.toString();
  return `${normalizedMonth}/${normalizedYear.slice(-2)}`;
};

const getRandomToken = () => {
  const cryptoObj =
    typeof globalThis !== "undefined" ? globalThis.crypto : null;
  if (cryptoObj?.randomUUID) {
    return `tok_${cryptoObj.randomUUID().replace(/-/g, "")}`;
  }
  return `tok_${Math.random().toString(36).slice(2)}${Date.now()}`;
};

const detectCardBrand = (digits) => {
  if (digits.startsWith("4")) return "Visa";
  if (
    /^5[1-5]/.test(digits) ||
    /^2(2[2-9]|[3-6][0-9]|7[01]|720)/.test(digits)
  ) {
    return "Mastercard";
  }
  if (/^3[47]/.test(digits)) return "American Express";
  return "Card";
};

const passesLuhnCheck = (digits) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits[i], 10);
    if (Number.isNaN(digit)) {
      return false;
    }
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const tokenizeCardDetails = (cardNumber, explicitBrand) => {
  const sanitized = (cardNumber || "").replace(/\D/g, "");
  if (sanitized.length < 12 || sanitized.length > 19) {
    throw new Error("Card number must contain between 12 and 19 digits.");
  }
  if (!passesLuhnCheck(sanitized)) {
    throw new Error(
      "Card number appears invalid. Try a valid card or a payment provider test card, such as 4242 4242 4242 4242."
    );
  }
  const brand = explicitBrand || detectCardBrand(sanitized);
  return {
    token: getRandomToken(),
    last4: sanitized.slice(-4),
    brand,
  };
};

const sanitizeStoredMethods = (methods) => {
  let hasUpdates = false;
  const sanitizedMethods = methods.map((method) => {
    if (!method || typeof method !== "object") {
      return method;
    }
    const nextMethod = { ...method };
    if (nextMethod.cardNumber) {
      try {
        const { token, last4, brand } = tokenizeCardDetails(
          nextMethod.cardNumber,
          nextMethod.cardType || nextMethod.cardBrand
        );
        nextMethod.cardToken = nextMethod.cardToken || token;
        nextMethod.last4 = last4;
        nextMethod.cardBrand = nextMethod.cardBrand || brand;
        nextMethod.cardType = nextMethod.cardType || brand;
        nextMethod.maskedCardNumber = maskCardNumber(last4);
      } catch (error) {
        console.warn("Unable to tokenize stored payment method.", error);
      }
      delete nextMethod.cardNumber;
      hasUpdates = true;
    }
    if (nextMethod.cvv) {
      delete nextMethod.cvv;
      hasUpdates = true;
    }
    if (nextMethod.expiryMonth && nextMethod.expiryYear) {
      nextMethod.expiryDate = formatExpiryDate(
        nextMethod.expiryMonth,
        nextMethod.expiryYear
      );
    }
    if (nextMethod.last4 && !nextMethod.maskedCardNumber) {
      nextMethod.maskedCardNumber = maskCardNumber(nextMethod.last4);
    }
    if (!nextMethod.cardToken) {
      nextMethod.cardToken = getRandomToken();
      hasUpdates = true;
    }
    return nextMethod;
  });
  return { sanitizedMethods, hasUpdates };
};

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
          const rawMethods = Array.isArray(data.paymentMethods)
            ? data.paymentMethods
            : [];
          const { sanitizedMethods, hasUpdates } =
            sanitizeStoredMethods(rawMethods);
          setPaymentMethods(sanitizedMethods);
          setDefaultPaymentMethodId(data.defaultPaymentMethodId || null);
          if (hasUpdates) {
            persistPayments(
              sanitizedMethods,
              data.defaultPaymentMethodId || null
            ).catch((persistError) => {
              console.error(
                "Error updating stored payment methods:",
                persistError
              );
            });
          }
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
    const sanitizedNumber = (paymentMethod.cardNumber || "").replace(/\D/g, "");
    if (!sanitizedNumber) {
      throw new Error("Card number is required.");
    }

    const { token, last4, brand } = tokenizeCardDetails(
      sanitizedNumber,
      paymentMethod.cardType
    );

    const expiryMonth = paymentMethod.expiryMonth
      ? paymentMethod.expiryMonth.toString().padStart(2, "0")
      : "";
    const expiryYear = paymentMethod.expiryYear
      ? paymentMethod.expiryYear.toString()
      : "";

    if (!expiryMonth || !expiryYear) {
      throw new Error("Expiry date is required.");
    }

    const newPaymentMethod = {
      id: `payment_${Date.now()}`,
      cardToken: token,
      cardBrand: brand,
      cardType: paymentMethod.cardType || brand,
      last4,
      maskedCardNumber: maskCardNumber(last4),
      cardholderName: (paymentMethod.cardholderName || "").trim(),
      expiryMonth,
      expiryYear,
      expiryDate: formatExpiryDate(expiryMonth, expiryYear),
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
    const existingMethod = paymentMethods.find((method) => method.id === id);
    if (!existingMethod) {
      throw new Error("Payment method not found.");
    }

    const nextUpdates = { ...updatedPaymentMethod };
    const sanitizedNumber = (nextUpdates.cardNumber || "").replace(/\D/g, "");

    if (sanitizedNumber) {
      const { token, last4, brand } = tokenizeCardDetails(
        sanitizedNumber,
        nextUpdates.cardType || existingMethod.cardType
      );
      nextUpdates.cardToken = token;
      nextUpdates.last4 = last4;
      nextUpdates.cardBrand = brand;
      nextUpdates.cardType = nextUpdates.cardType || brand;
      nextUpdates.maskedCardNumber = maskCardNumber(last4);
    }

    delete nextUpdates.cardNumber;
    delete nextUpdates.cvv;

    if (nextUpdates.expiryMonth && nextUpdates.expiryYear) {
      const expiryMonth = nextUpdates.expiryMonth.toString().padStart(2, "0");
      const expiryYear = nextUpdates.expiryYear.toString();
      nextUpdates.expiryMonth = expiryMonth;
      nextUpdates.expiryYear = expiryYear;
      nextUpdates.expiryDate = formatExpiryDate(expiryMonth, expiryYear);
    }

    if (!nextUpdates.maskedCardNumber && nextUpdates.last4) {
      nextUpdates.maskedCardNumber = maskCardNumber(nextUpdates.last4);
    }

    if (typeof nextUpdates.cardholderName === "string") {
      nextUpdates.cardholderName = nextUpdates.cardholderName.trim();
    }

    const updatedPaymentMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, ...nextUpdates } : method
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
