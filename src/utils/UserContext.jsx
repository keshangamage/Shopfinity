import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useOrder } from "./OrderContext.jsx";

const PROTECTED_EMAIL = "admin@shopfinity.com";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const orderContext = useOrder();
  const { getAllUsersOrders } = orderContext || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [lastLoadTime, setLastLoadTime] = useState(0);

  const LOAD_DEBOUNCE_MS = 2000;

  useEffect(() => {
    if (isAdmin && isAdmin() && users.length === 0) {
      loadAllUsers();
    }
  }, [currentUser, isAdmin]);

  // Load current user profile
  useEffect(() => {
    if (currentUser) {
      loadUserProfile(currentUser.uid);
    }
  }, [currentUser]);

  const loadAllUsers = async () => {
    const now = Date.now();
    if (now - lastLoadTime < LOAD_DEBOUNCE_MS) {
      return;
    }
    setLastLoadTime(now);

    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const firestoreUsers = [];
      const firestoreUserIds = new Set();

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        firestoreUsers.push({
          id: doc.id,
          uid: doc.id,
          ...userData,
        });
        firestoreUserIds.add(doc.id);
      });

      const allOrders = getAllUsersOrders ? getAllUsersOrders() : [];

      const userOrderCounts = {};
      const usersFromOrders = new Map();

      allOrders.forEach((order) => {
        const userId = order.userId;
        if (userId && userId !== "guest") {
          userOrderCounts[userId] = (userOrderCounts[userId] || 0) + 1;

          if (!firestoreUserIds.has(userId) && !usersFromOrders.has(userId)) {
            usersFromOrders.set(userId, {
              uid: userId,
              email: order.userEmail || `user-${userId}@unknown.com`,
              displayName: order.userName || "Unknown User",
              photoURL: "",
              role: "customer",
              status: "active",
              createdAt: order.date
                ? Timestamp.fromDate(new Date(order.date))
                : Timestamp.now(),
              lastLoginAt: order.date
                ? Timestamp.fromDate(new Date(order.date))
                : Timestamp.now(),
              emailVerified: false,
              isFromOrders: true,
            });
          }
        }
      });

      const localStorageUsers = new Map();
      const currentUserData = localStorage.getItem("shopfinity_auth_user");

      if (currentUserData) {
        try {
          const userData = JSON.parse(currentUserData);
          if (userData && userData.uid && !firestoreUserIds.has(userData.uid)) {
            localStorageUsers.set(userData.uid, {
              uid: userData.uid,
              email: userData.email || `user-${userData.uid}@unknown.com`,
              displayName: userData.displayName || "Current User",
              photoURL: userData.photoURL || "",
              role: "customer",
              status: "active",
              createdAt: Timestamp.now(),
              lastLoginAt: Timestamp.now(),
              emailVerified: userData.emailVerified || false,
              isFromLocalStorage: true,
            });
          }
        } catch (error) {
          console.warn("Error parsing current user data:", error);
        }
      }

      const allUsers = [
        ...firestoreUsers,
        ...Array.from(usersFromOrders.values()),
        ...Array.from(localStorageUsers.values()),
      ];

      const enrichedUsers = allUsers.map((user) => ({
        ...user,
        orders: userOrderCounts[user.uid] || 0,
        name: user.displayName || user.name || "Unknown User",
        email: user.email || "No email",
        role: user.role || "customer",
        status: user.status || "active",
        joinDate: user.createdAt
          ? user.createdAt.seconds
            ? new Date(user.createdAt.seconds * 1000)
                .toISOString()
                .split("T")[0]
            : new Date(user.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        lastLogin: user.lastLoginAt
          ? user.lastLoginAt.seconds
            ? new Date(user.lastLoginAt.seconds * 1000)
                .toISOString()
                .split("T")[0]
            : new Date(user.lastLoginAt).toISOString().split("T")[0]
          : "Never",
      }));

      setUsers(enrichedUsers);

      const usersToCreateInFirestore = allUsers.filter(
        (user) => (user.isFromOrders || user.isFromLocalStorage) && user.uid
      );

      if (usersToCreateInFirestore.length > 0) {
        createFirestoreProfiles(usersToCreateInFirestore);
      }
    } catch (error) {
      console.error("❌ Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFirestoreProfiles = async (usersToCreate) => {
    try {
      await Promise.all(
        usersToCreate.map(async (user) => {
          try {
            const userDoc = doc(db, "users", user.uid);
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.name || "",
              photoURL: user.photoURL || "",
              role: "customer",
              status: "active",
              createdAt: user.createdAt || Timestamp.now(),
              lastLoginAt: user.lastLoginAt || Timestamp.now(),
              emailVerified: user.emailVerified || false,
              migratedFromOrders: user.isFromOrders || false,
              migratedFromLocalStorage: user.isFromLocalStorage || false,
            };

            await setDoc(userDoc, userData, { merge: true });
          } catch (error) {
            console.error(
              `❌ Error creating Firestore profile for user ${user.uid}:`,
              error
            );
          }
        })
      );
    } catch (error) {
      console.error("❌ Error in batch Firestore profile creation:", error);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserProfiles((prev) => ({
          ...prev,
          [userId]: userData,
        }));
      } else {
        const initialProfile = {
          uid: userId,
          email: currentUser?.email || "",
          displayName: currentUser?.displayName || "",
          photoURL: currentUser?.photoURL || "",
          role: "customer",
          status: "active",
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          emailVerified: currentUser?.emailVerified || false,
        };

        await setDoc(userDoc, initialProfile);
        setUserProfiles((prev) => ({
          ...prev,
          [userId]: initialProfile,
        }));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const updateUserProfile = async (userId, updates) => {
    try {
      const userDoc = doc(db, "users", userId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(userDoc, updateData);

      setUserProfiles((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          ...updateData,
        },
      }));

      if (isAdmin && isAdmin()) {
        await loadAllUsers();
      }

      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.email === PROTECTED_EMAIL) {
          console.warn("Blocked attempt to change protected admin role.");
          return false;
        }
      }

      const updatedAt = Timestamp.now();
      await updateDoc(userDoc, {
        role: newRole,
        updatedAt,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );

      setUserProfiles((prev) => {
        if (!prev[userId]) return prev;
        return {
          ...prev,
          [userId]: {
            ...prev[userId],
            role: newRole,
            updatedAt,
          },
        };
      });

      if (isAdmin && isAdmin()) {
        await loadAllUsers();
      }

      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.email === PROTECTED_EMAIL) {
          console.warn("Blocked attempt to change protected admin status.");
          return false;
        }
      }

      const updatedAt = Timestamp.now();
      await updateDoc(userDoc, {
        status: newStatus,
        updatedAt,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.uid === userId ? { ...user, status: newStatus } : user
        )
      );

      setUserProfiles((prev) => {
        if (!prev[userId]) return prev;
        return {
          ...prev,
          [userId]: {
            ...prev[userId],
            status: newStatus,
            updatedAt,
          },
        };
      });

      if (isAdmin && isAdmin()) {
        await loadAllUsers();
      }

      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      return false;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);

      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.email === PROTECTED_EMAIL) {
          console.warn("Blocked attempt to delete protected admin account.");
          return false;
        }
      }

      await deleteDoc(userDoc);

      setUsers((prev) => prev.filter((user) => user.uid !== userId));

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const createUserProfile = async (userAuth, additionalData = {}) => {
    try {
      const userDoc = doc(db, "users", userAuth.uid);
      const userData = {
        uid: userAuth.uid,
        email: userAuth.email,
        displayName: userAuth.displayName || "",
        photoURL: userAuth.photoURL || "",
        role: "customer",
        status: "active",
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
        emailVerified: userAuth.emailVerified,
        ...additionalData,
      };

      await setDoc(userDoc, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
  };

  const updateLastLogin = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        lastLoginAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "active").length;
    const adminUsers = users.filter((user) => user.role === "admin").length;
    const customerUsers = users.filter(
      (user) => user.role === "customer"
    ).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      customerUsers,
    };
  };

  const searchUsers = (searchTerm) => {
    if (!searchTerm.trim()) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const value = useMemo(
    () => ({
      users,
      userProfiles,
      loading,
      loadAllUsers,
      loadUserProfile,
      updateUserProfile,
      updateUserRole,
      updateUserStatus,
      deleteUser,
      createUserProfile,
      updateLastLogin,
      getUserStats,
      searchUsers,
    }),
    [users, userProfiles, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
