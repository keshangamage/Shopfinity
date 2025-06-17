import React, { createContext, useContext, useState, useEffect } from "react";

const RewardsContext = createContext();

export const useRewards = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }) => {
  const [rewardsPoints, setRewardsPoints] = useState(() => {
    try {
      const savedRewards = localStorage.getItem("shopfinityRewards");
      return savedRewards ? JSON.parse(savedRewards) : 0;
    } catch (error) {
      console.error("Error loading rewards from localStorage:", error);
      return 0;
    }
  });

  const [rewardsHistory, setRewardsHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("shopfinityRewardsHistory");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Error loading rewards history from localStorage:", error);
      return [];
    }
  });

  // Save rewards data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shopfinityRewards", JSON.stringify(rewardsPoints));
    } catch (error) {
      console.error("Error saving rewards to localStorage:", error);
    }
  }, [rewardsPoints]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "shopfinityRewardsHistory",
        JSON.stringify(rewardsHistory)
      );
    } catch (error) {
      console.error("Error saving rewards history to localStorage:", error);
    }
  }, [rewardsHistory]);

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

  const rewardsContextValue = {
    rewardsPoints,
    rewardsHistory,
    addPoints,
    usePoints,
    getPointsValue,
  };

  return (
    <RewardsContext.Provider value={rewardsContextValue}>
      {children}
    </RewardsContext.Provider>
  );
};
