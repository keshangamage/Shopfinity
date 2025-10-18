import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

const ORDERS_COLLECTION = "orders";

const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const timestampToDate = (value) => {
  if (!value) return null;
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const normalizeOrderDoc = (snapshotDoc) => {
  const data = snapshotDoc.data() || {};
  const createdAtDate =
    timestampToDate(data.createdAt) || timestampToDate(data.timestamp) || new Date();
  const updatedAtDate = timestampToDate(data.updatedAt);
  const timestampMs = data.timestamp || createdAtDate.getTime();
  const displayDate = data.date || formatDisplayDate(createdAtDate);

  return {
    id: snapshotDoc.id,
    ...data,
    items: Array.isArray(data.items) ? data.items : [],
    total: Number(data.total) || 0,
    status: data.status || "Processing",
    userId: data.userId || "guest",
    timestamp: timestampMs,
    date: displayDate,
    createdAt: createdAtDate.toISOString(),
    updatedAt: updatedAtDate ? updatedAtDate.toISOString() : null,
  };
};

const buildOrderPayload = (order, { docId, userId, user }) => {
  const now = Timestamp.now();
  const createdAtTimestamp = (() => {
    if (order?.createdAt instanceof Timestamp) return order.createdAt;
    const parsed = timestampToDate(order?.createdAt);
    return parsed ? Timestamp.fromDate(parsed) : now;
  })();

  const timestampMs = (() => {
    if (typeof order?.timestamp === "number") return order.timestamp;
    const parsed = timestampToDate(order?.timestamp);
    return parsed ? parsed.getTime() : Date.now();
  })();

  const displayDate = order?.date || formatDisplayDate(new Date(timestampMs));

  const payload = {
    id: docId,
    userId,
    status: order?.status || "Processing",
    items: Array.isArray(order?.items) ? order.items : [],
    total: Number(order?.total) || 0,
    shippingAddress: order?.shippingAddress || null,
    billingAddress: order?.billingAddress || null,
    paymentMethod: order?.paymentMethod || null,
    trackingInfo: order?.trackingInfo || null,
    trackingNumber: order?.trackingNumber || null,
    notes: order?.notes || "",
    hasPriorityFlag: Boolean(order?.hasPriorityFlag),
    timestamp: timestampMs,
    date: displayDate,
    createdAt: createdAtTimestamp,
    updatedAt: now,
    lastUpdated: now,
    userEmail: order?.userEmail || user?.email || "",
    userName:
      order?.userName || order?.shippingAddress?.name || user?.displayName || "",
  };

  if (order?.metadata) {
    payload.metadata = order.metadata;
  }

  if (order?.lastUpdated) {
    const parsedLastUpdated = timestampToDate(order.lastUpdated);
    if (parsedLastUpdated) {
      payload.lastUpdated = Timestamp.fromDate(parsedLastUpdated);
    }
  }

  return payload;
};

const buildTrackingTimeline = (order) => {
  const orderDate = timestampToDate(order.timestamp) || new Date();
  const currentDate = new Date();
  const daysSinceOrder = Math.floor(
    (currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeline = [
    {
      status: "Order Placed",
      date: order.date,
      completed: true,
      description: "Your order has been received and is being processed.",
    },
  ];

  if (order.status !== "Cancelled") {
    timeline.push({
      status: "Processing",
      date: formatDisplayDate(new Date(orderDate.getTime() + 1000 * 60 * 60 * 24)),
      completed:
        daysSinceOrder >= 1 ||
        ["Shipped", "Out for Delivery", "Delivered"].includes(order.status),
      description:
        "Your order has been processed and is being prepared for shipping.",
    });

    timeline.push({
      status: "Shipped",
      date: formatDisplayDate(
        new Date(orderDate.getTime() + 1000 * 60 * 60 * 24 * 2)
      ),
      completed:
        daysSinceOrder >= 2 ||
        ["Out for Delivery", "Delivered"].includes(order.status),
      description: "Your order has been shipped and is on its way to you.",
    });

    timeline.push({
      status: "Out for Delivery",
      date: formatDisplayDate(
        new Date(orderDate.getTime() + 1000 * 60 * 60 * 24 * 6)
      ),
      completed: daysSinceOrder >= 6 || order.status === "Delivered",
      description: "Your order is out for delivery and will arrive soon.",
    });

    timeline.push({
      status: "Delivered",
      date: formatDisplayDate(
        new Date(orderDate.getTime() + 1000 * 60 * 60 * 24 * 7)
      ),
      completed: order.status === "Delivered",
      description: "Your order has been delivered. Thank you for shopping with us!",
    });
  } else {
    timeline.push({
      status: "Cancelled",
      date: order.lastUpdated
        ? formatDisplayDate(timestampToDate(order.lastUpdated))
        : formatDisplayDate(currentDate),
      completed: true,
      description: "This order has been cancelled and will not be processed further.",
    });
  }

  return {
    trackingId:
      order.trackingNumber || `SF-${Math.floor(Math.random() * 900000) + 100000}`,
    status: order.status,
    timeline,
  };
};

export const OrderProvider = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const userId = currentUser?.uid || null;

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAllOrders, setLoadingAllOrders] = useState(false);

  const ordersCollectionRef = useMemo(
    () => collection(db, ORDERS_COLLECTION),
    []
  );

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    setLoadingOrders(true);

    const userQuery = query(ordersCollectionRef, where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        const userOrders = snapshot.docs
          .map(normalizeOrderDoc)
          .sort((a, b) => b.timestamp - a.timestamp);
        setOrders(userOrders);
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error loading user orders:", error);
        setOrders([]);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [userId, ordersCollectionRef]);

  useEffect(() => {
    if (!isAdmin || !isAdmin()) {
      setAllOrders([]);
      return;
    }

    setLoadingAllOrders(true);

    const unsubscribe = onSnapshot(
      ordersCollectionRef,
      (snapshot) => {
        const adminOrders = snapshot.docs
          .map(normalizeOrderDoc)
          .sort((a, b) => b.timestamp - a.timestamp);
        setAllOrders(adminOrders);
        setLoadingAllOrders(false);
      },
      (error) => {
        console.error("Error loading all orders:", error);
        setAllOrders([]);
        setLoadingAllOrders(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin, ordersCollectionRef]);

  const addOrder = async (order) => {
    try {
      const docId = order?.id ? String(order.id) : undefined;
      const orderRef = docId
        ? doc(db, ORDERS_COLLECTION, docId)
        : doc(ordersCollectionRef);

      const payload = buildOrderPayload(order, {
        docId: orderRef.id,
        userId: order?.userId || userId || "guest",
        user: currentUser,
      });

      await setDoc(orderRef, payload, { merge: true });

      return orderRef.id;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  };

  const getOrders = () => orders;

  const getOrderById = (orderId) => {
    return (
      orders.find((order) => order.id === orderId) ||
      allOrders.find((order) => order.id === orderId) ||
      null
    );
  };

  const cancelOrder = async (orderId) => {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, String(orderId));
      const now = Timestamp.now();

      await setDoc(
        orderRef,
        {
          status: "Cancelled",
          lastUpdated: now,
          updatedAt: now,
        },
        { merge: true }
      );

      return getOrderById(orderId);
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = null) => {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, String(orderId));
      const now = Timestamp.now();

      const updateData = {
        status: newStatus,
        lastUpdated: now,
        updatedAt: now,
      };

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      await setDoc(orderRef, updateData, { merge: true });

      const updatedOrder = getOrderById(orderId);

      window.dispatchEvent(
        new CustomEvent("orderUpdated", {
          detail: {
            orderId,
            newStatus,
            trackingNumber,
            forceRefresh: true,
            updatedOrder,
          },
        })
      );

      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const addTrackingInfo = async (orderId, trackingInfo) => {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, String(orderId));
      const now = Timestamp.now();

      const updateData = {
        trackingInfo: {
          ...trackingInfo,
          lastUpdated: now,
        },
        trackingNumber: trackingInfo.trackingNumber || null,
        lastUpdated: now,
        updatedAt: now,
      };

      await setDoc(orderRef, updateData, { merge: true });

      const updatedOrder = getOrderById(orderId);

      window.dispatchEvent(
        new CustomEvent("orderUpdated", {
          detail: {
            orderId,
            trackingInfo,
            forceRefresh: true,
            updatedOrder,
          },
        })
      );

      return updatedOrder;
    } catch (error) {
      console.error("Error updating tracking info:", error);
      throw error;
    }
  };

  const getAllUsersOrders = () => {
    if (isAdmin && isAdmin()) {
      return allOrders;
    }

    return orders;
  };

  const refreshAllOrders = () => getAllUsersOrders();

  const getAdminOrdersData = () => {
    const latestOrders = getAllUsersOrders();

    return latestOrders.map((order) => ({
      ...order,
      formattedDate: order.date || formatDisplayDate(new Date(order.timestamp)),
      customerName:
        order.userId === "guest"
          ? "Guest User"
          : order.userName || order.userEmail || `User (${order.userId.slice(0, 8)})`,
      hasPriorityFlag: Boolean(order.hasPriorityFlag),
    }));
  };

  const trackOrder = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return null;

    return buildTrackingTimeline(order);
  };

  const orderContextValue = {
    orders,
    allUserOrders: allOrders,
    isLoading: loadingOrders,
    isAdminLoading: loadingAllOrders,
    addOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    addTrackingInfo,
    getAllUsersOrders,
    refreshAllOrders,
    getAdminOrdersData,
    trackOrder,
  };

  return (
    <OrderContext.Provider value={orderContextValue}>
      {children}
    </OrderContext.Provider>
  );
};
