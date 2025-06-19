import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const RewardsContext = createContext();

export const useRewards = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";
  const [loading, setLoading] = useState(true);

  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [rewardsHistory, setRewardsHistory] = useState([]);

  // Load rewards data when user changes
  useEffect(() => {
    loadRewardsData();
  }, [userId]);

  // Load rewards data from localStorage
  const loadRewardsData = () => {
    try {
      const savedRewards = localStorage.getItem(`shopfinity_rewards_${userId}`);
      setRewardsPoints(savedRewards ? JSON.parse(savedRewards) : 0);

      const savedHistory = localStorage.getItem(
        `shopfinity_rewards_history_${userId}`
      );
      setRewardsHistory(savedHistory ? JSON.parse(savedHistory) : []);

      setLoading(false);
    } catch (error) {
      console.error("Error loading rewards data from localStorage:", error);
      setRewardsPoints(0);
      setRewardsHistory([]);
      setLoading(false);
    }
  };

  // Save rewards data to localStorage
  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        `shopfinity_rewards_${userId}`,
        JSON.stringify(rewardsPoints)
      );
    } catch (error) {
      console.error("Error saving rewards to localStorage:", error);
    }
  }, [rewardsPoints, userId, loading]);

  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        `shopfinity_rewards_history_${userId}`,
        JSON.stringify(rewardsHistory)
      );
    } catch (error) {
      console.error("Error saving rewards history to localStorage:", error);
    }
  }, [rewardsHistory, userId, loading]);

  // Function to add rewards points
  const addPoints = (points, reason) => {
    setRewardsPoints((prevPoints) => prevPoints + points);

    setRewardsHistory((prevHistory) => [
      ...prevHistory,
      {
        id: Date.now(),
        date: new Date().toISOString(),
        points: points,
        type: "earned",
        reason: reason || "Purchase reward",
      },
    ]);
  };

  const usePoints = (points, reason) => {
    if (rewardsPoints >= points) {
      setRewardsPoints((prevPoints) => prevPoints - points);

      setRewardsHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now(),
          date: new Date().toISOString(),
          points: -points,
          type: "redeemed",
          reason: reason || "Points redemption",
        },
      ]);

      return true;
    }
    return false;
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
