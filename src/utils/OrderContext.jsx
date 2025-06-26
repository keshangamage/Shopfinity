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
  const [isInitialized, setIsInitialized] = useState(false);

  const [allUserOrders, setAllUserOrders] = useState([]);

  useEffect(() => {
    loadOrdersFromStorage();
    setIsInitialized(true);
  }, [userId]);

  const loadOrdersFromStorage = () => {
    try {
      const savedOrders = localStorage.getItem(`shopfinity_orders_${userId}`);
      console.log(
        `Loading orders for user: ${userId}`,
        savedOrders ? JSON.parse(savedOrders) : []
      );
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      setOrders([]);
    }
  };

  // Save orders to local storage whenever they change
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(
        `shopfinity_orders_${userId}`,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [orders, userId, isInitialized]);

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

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);

    if (orderToUpdate) {
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };

          if (trackingNumber) {
            updatedOrder.trackingNumber = trackingNumber;
          }

          return updatedOrder;
        }
        return order;
      });

      setOrders(updatedOrders);

      const updatedOrder = updatedOrders.find((order) => order.id === orderId);

      const event = new CustomEvent("orderUpdated", {
        detail: {
          orderId,
          newStatus,
          trackingNumber,
          forceRefresh: true,
          updatedOrder,
        },
      });
      window.dispatchEvent(event);

      return updatedOrder;
    } else {
      let updatedOrder = null;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("shopfinity_orders_") && !key.includes(userId)) {
          try {
            const userOrders = JSON.parse(localStorage.getItem(key));
            if (!Array.isArray(userOrders)) continue;

            const orderIndex = userOrders.findIndex(
              (order) => order.id === orderId
            );
            if (orderIndex === -1) continue;

            updatedOrder = {
              ...userOrders[orderIndex],
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            };

            if (trackingNumber) {
              updatedOrder.trackingNumber = trackingNumber;
            }

            userOrders[orderIndex] = updatedOrder;

            localStorage.setItem(key, JSON.stringify(userOrders));

            const otherUserId = key.replace("shopfinity_orders_", "");
            updatedOrder.userId = otherUserId;

            break;
          } catch (error) {
            console.error("Error updating order status for other user:", error);
          }
        }
      }

      if (updatedOrder) {
        const event = new CustomEvent("orderUpdated", {
          detail: {
            orderId,
            newStatus,
            trackingNumber,
            forceRefresh: true,
            updatedOrder,
          },
        });
        window.dispatchEvent(event);

        return updatedOrder;
      }
    }

    return null;
  };

  const addTrackingInfo = (orderId, trackingInfo) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);

    if (orderToUpdate) {
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            trackingInfo: {
              ...trackingInfo,
              lastUpdated: new Date().toISOString(),
            },
            trackingNumber: trackingInfo.trackingNumber || order.trackingNumber,
          };
        }
        return order;
      });

      setOrders(updatedOrders);

      const updatedOrder = updatedOrders.find((order) => order.id === orderId);

      const event = new CustomEvent("orderUpdated", {
        detail: { orderId, trackingInfo, forceRefresh: true, updatedOrder },
      });
      window.dispatchEvent(event);

      return updatedOrder;
    } else {
      let updatedOrder = null;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("shopfinity_orders_") && !key.includes(userId)) {
          try {
            const userOrders = JSON.parse(localStorage.getItem(key));
            if (!Array.isArray(userOrders)) continue;

            const orderIndex = userOrders.findIndex(
              (order) => order.id === orderId
            );
            if (orderIndex === -1) continue;

            updatedOrder = {
              ...userOrders[orderIndex],
              trackingInfo: {
                ...trackingInfo,
                lastUpdated: new Date().toISOString(),
              },
              trackingNumber:
                trackingInfo.trackingNumber ||
                userOrders[orderIndex].trackingNumber,
            };

            userOrders[orderIndex] = updatedOrder;

            localStorage.setItem(key, JSON.stringify(userOrders));

            const otherUserId = key.replace("shopfinity_orders_", "");
            updatedOrder.userId = otherUserId;

            break;
          } catch (error) {
            console.error(
              "Error updating tracking info for other user:",
              error
            );
          }
        }
      }

      if (updatedOrder) {
        const event = new CustomEvent("orderUpdated", {
          detail: { orderId, trackingInfo, forceRefresh: true, updatedOrder },
        });
        window.dispatchEvent(event);

        return updatedOrder;
      }
    }

    return null;
  };

  const getAllUsersOrders = () => {
    console.log("Collecting all users' orders from localStorage");
    const allOrders = [];

    allOrders.push(...orders.map((order) => ({ ...order, userId })));
    console.log(`Added ${orders.length} orders from current user (${userId})`);

    let totalExternalOrders = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key.startsWith("shopfinity_orders_") &&
        key !== `shopfinity_orders_${userId}`
      ) {
        try {
          const userOrdersJson = localStorage.getItem(key);
          const userOrders = JSON.parse(userOrdersJson);

          if (!Array.isArray(userOrders) || userOrders.length === 0) continue;

          const otherUserId = key.replace("shopfinity_orders_", "");

          const processedOrders = userOrders.map((order) => ({
            ...order,
            userId: otherUserId,
          }));

          console.log(
            `Added ${processedOrders.length} orders from user ${otherUserId}`
          );
          totalExternalOrders += processedOrders.length;
          allOrders.push(...processedOrders);
        } catch (error) {
          console.error(
            `Error parsing orders from localStorage key ${key}:`,
            error
          );
        }
      }
    }

    console.log(
      `Total orders collected: ${allOrders.length} (${orders.length} current user + ${totalExternalOrders} external)`
    );
    return allOrders;
  };

  const refreshAllOrders = () => {
    const allOrders = getAllUsersOrders();
    setAllUserOrders(allOrders);
    return allOrders;
  };

  useEffect(() => {
    refreshAllOrders();
  }, [orders, userId]);

  const getAdminOrdersData = () => {
    const latestOrders = getAllUsersOrders();

    setAllUserOrders(latestOrders);

    return latestOrders.map((order) => ({
      ...order,
      formattedDate: order.date
        ? new Date(order.date).toLocaleDateString()
        : "N/A",
      customerName:
        order.userId === userId
          ? "Current User"
          : order.userId === "guest"
          ? "Guest User"
          : order.customerName || `User (${order.userId.substring(0, 8)})`,
      hasPriorityFlag: order.hasPriorityFlag || false,
    }));
  };

  const trackOrder = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (!order) return null;

    const orderDate = new Date(order.timestamp);
    const currentDate = new Date();
    const daysSinceOrder = Math.floor(
      (currentDate - orderDate) / (1000 * 60 * 60 * 24)
    );

    // Create a shipping timeline
    let trackingInfo = {
      trackingId:
        order.trackingNumber ||
        `SF-${Math.floor(Math.random() * 900000) + 100000}`,
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
        completed:
          daysSinceOrder >= 1 ||
          ["Shipped", "Out for Delivery", "Delivered"].includes(order.status),
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
        completed:
          daysSinceOrder >= 2 ||
          ["Out for Delivery", "Delivered"].includes(order.status),
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
        date:
          order.lastUpdated &&
          new Date(order.lastUpdated).toLocaleDateString("en-US", {
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
    updateOrderStatus,
    addTrackingInfo,
    getAdminOrdersData,
    refreshAllOrders,
    allUserOrders,
  };

  return (
    <OrderContext.Provider value={orderContextValue}>
      {children}
    </OrderContext.Provider>
  );
};
