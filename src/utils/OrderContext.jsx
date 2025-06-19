import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const OrderContext = createContext();

// Custom hook to use the order context
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";

  // State for orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrdersFromStorage();
  }, [userId]);

  const loadOrdersFromStorage = () => {
    try {
      const savedOrders = localStorage.getItem(`shopfinity_orders_${userId}`);
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      setOrders([]);
    }
  };

  // Save orders to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        `shopfinity_orders_${userId}`,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [orders, userId]);

  // Add a new order
  const addOrder = (order) => {
    const timestamp = new Date().getTime();
    setOrders((prevOrders) => [
      {
        ...order,
        timestamp,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      ...prevOrders,
    ]);
    return order.id;
  };

  // Get all orders
  const getOrders = () => {
    return orders;
  };

  // Get a specific order by ID
  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  // Cancel an order by ID
  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId && order.status === "Processing") {
        return { ...order, status: "Cancelled" };
      }
      return order;
    });

    setOrders(updatedOrders);
    return updatedOrders.find((order) => order.id === orderId);
  };

  const trackOrder = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (!order) return null;

    const orderDate = new Date(order.timestamp);
    const currentDate = new Date();
    const daysSinceOrder = Math.floor(
      (currentDate - orderDate) / (1000 * 60 * 60 * 24)
    );

    // Create a fake shipping timeline
    let trackingInfo = {
      trackingId: `SF-${Math.floor(Math.random() * 900000) + 100000}`,
      status: order.status,
      timeline: [
        {
          status: "Order Placed",
          date: order.date,
          completed: true,
          description: "Your order has been received and is being processed.",
        },
      ],
    };

    if (order.status !== "Cancelled") {
      trackingInfo.timeline.push({
        status: "Processing",
        date: new Date(
          orderDate.getTime() + 1000 * 60 * 60 * 24
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completed: daysSinceOrder >= 1 || order.status === "Delivered",
        description:
          "Your order has been processed and is being prepared for shipping.",
      });

      trackingInfo.timeline.push({
        status: "Shipped",
        date: new Date(
          orderDate.getTime() + 1000 * 60 * 60 * 24 * 2
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completed: daysSinceOrder >= 2 || order.status === "Delivered",
        description: "Your order has been shipped and is on its way to you.",
      });

      trackingInfo.timeline.push({
        status: "Out for Delivery",
        date: new Date(
          orderDate.getTime() + 1000 * 60 * 60 * 24 * 6
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completed: daysSinceOrder >= 6 || order.status === "Delivered",
        description: "Your order is out for delivery and will arrive soon.",
      });

      trackingInfo.timeline.push({
        status: "Delivered",
        date: new Date(
          orderDate.getTime() + 1000 * 60 * 60 * 24 * 7
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completed: order.status === "Delivered",
        description:
          "Your order has been delivered. Thank you for shopping with us!",
      });
    } else {
      // Add cancelled step for cancelled orders
      trackingInfo.timeline.push({
        status: "Cancelled",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        completed: true,
        description:
          "This order has been cancelled and will not be processed further.",
      });
    }

    return trackingInfo;
  };

  const orderContextValue = {
    orders,
    addOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    trackOrder,
  };

  return (
    <OrderContext.Provider value={orderContextValue}>
      {children}
    </OrderContext.Provider>
  );
};
