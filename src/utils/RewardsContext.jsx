import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { db } from "./firebase.js";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

const RewardsContext = createContext();

export const useRewards = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;
  const [loading, setLoading] = useState(true);

  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [rewardsHistory, setRewardsHistory] = useState([]);

  const rewardsDocRef = useMemo(() => {
    if (!userId) return null;
    return doc(db, "userRewards", userId);
  }, [userId]);

  useEffect(() => {
    if (!rewardsDocRef) {
      setRewardsPoints(0);
      setRewardsHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      rewardsDocRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(rewardsDocRef, {
              points: 0,
              history: [],
              updatedAt: Timestamp.now(),
            });
          } catch (error) {
            console.error("Error initializing rewards doc:", error);
          }

          setRewardsPoints(0);
          setRewardsHistory([]);
        } else {
          const data = snapshot.data();
          setRewardsPoints(Number(data.points) || 0);
          setRewardsHistory(Array.isArray(data.history) ? data.history : []);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing to rewards data:", error);
        setRewardsPoints(0);
        setRewardsHistory([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [rewardsDocRef]);

  const persistRewards = async (points, history) => {
    if (!rewardsDocRef) return;

    try {
      await setDoc(
        rewardsDocRef,
        {
          points,
          history,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving rewards to Firestore:", error);
    }
  };

  const addPoints = async (points, reason) => {
    const increment = Number(points) || 0;
    if (increment === 0) return;

    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      points: increment,
      type: "earned",
      reason: reason || "Purchase reward",
    };

    const updatedPoints = rewardsPoints + increment;
    const updatedHistory = [...rewardsHistory, entry];

    setRewardsPoints(updatedPoints);
    setRewardsHistory(updatedHistory);

    await persistRewards(updatedPoints, updatedHistory);
  };

  const usePoints = async (points, reason) => {
    const decrement = Number(points) || 0;
    if (decrement <= 0) return false;

    if (rewardsPoints < decrement) {
      return false;
    }

    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      points: -decrement,
      type: "redeemed",
      reason: reason || "Points redemption",
    };

    const updatedPoints = rewardsPoints - decrement;
    const updatedHistory = [...rewardsHistory, entry];

    setRewardsPoints(updatedPoints);
    setRewardsHistory(updatedHistory);

    await persistRewards(updatedPoints, updatedHistory);

    return true;
  };

  const getPointsValue = () => {
    return (rewardsPoints / 100).toFixed(2);
  };

  const formattedPoints = rewardsPoints.toLocaleString();

  const rewardsContextValue = {
    rewardsPoints,
    formattedPoints,
    rewardsHistory,
    addPoints,
    usePoints,
    getPointsValue,
    loading,
  };

  return (
    <RewardsContext.Provider value={rewardsContextValue}>
      {children}
    </RewardsContext.Provider>
  );
};
