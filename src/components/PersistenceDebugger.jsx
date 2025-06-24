import React from "react";
import { debugLocalStorage } from "../utils/localStorageHelper";
import { useAuth } from "../utils/AuthContext";

const PersistenceDebugger = () => {
  const { currentUser } = useAuth();

  const debugStorageState = () => {
    console.group("Shopfinity Persistence Debug");
    console.log("Current User:", currentUser);
    debugLocalStorage();
    console.groupEnd();
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      debugStorageState();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  return (
    <div style={{ display: "none" }}>
      <button onClick={debugStorageState}>Debug Storage</button>
    </div>
  );
};

export default PersistenceDebugger;
