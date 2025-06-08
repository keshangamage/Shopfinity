import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthModule from "./AuthContext.jsx";


const useAuth = AuthModule.useAuth || (() => ({ currentUser: null }));
const OrderContext = createContext();

// Custom hook to use the order context
export const useOrder = () => useContext(OrderContext);


export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";
  
  // Get orders from local storage or start with empty array
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem(`shopfinity_orders_${userId}`);
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      return [];
    }
  });

  // Save orders to local storage whenever they change or user changes
  useEffect(() => {
    try {
      if (userId) {
        localStorage.setItem(`shopfinity_orders_${userId}`, JSON.stringify(orders));
      }
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [orders, userId]);

  // Add a new order
  const addOrder = (order) => {
    const timestamp = new Date().getTime();
    setOrders(prevOrders => [
      {
        ...order,
        timestamp,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      },
      ...prevOrders
    ]);
    return order.id;
  };

  // Get all orders
  const getOrders = () => {
    return orders;
  };

  // Get a specific order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Cancel an order by ID
  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId && order.status === "Processing") {
        return { ...order, status: "Cancelled" };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return updatedOrders.find(order => order.id === orderId);
  };

  const orderContextValue = {
    orders,
    addOrder,
    getOrders,
    getOrderById,
    cancelOrder
  };

  return (
    <OrderContext.Provider value={orderContextValue}>
      {children}
    </OrderContext.Provider>
  );
};
