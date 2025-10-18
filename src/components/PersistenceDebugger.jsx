import React from "react";
import { debugLocalStorage } from "../utils/localStorageHelper";
import { useAuth } from "../utils/AuthContext";

const PersistenceDebugger = () => {
  const { currentUser } = useAuth();
  const shouldDebug = import.meta.env?.VITE_ENABLE_PERSISTENCE_DEBUG === "true";

  const debugStorageState = React.useCallback(() => {
    if (!shouldDebug) {
      return;
    }

    console.group("Shopfinity Persistence Debug");
    console.log("Current User:", currentUser);
    debugLocalStorage();
    console.groupEnd();
  }, [currentUser, shouldDebug]);

  React.useEffect(() => {
    if (!shouldDebug) {
      return undefined;
    }

    const timer = setTimeout(() => {
      debugStorageState();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, debugStorageState, shouldDebug]);

  if (!shouldDebug) {
    return null;
  }

  return (
    <div style={{ display: "none" }}>
      <button onClick={debugStorageState}>Debug Storage</button>
    </div>
  );
};

export default PersistenceDebugger;
