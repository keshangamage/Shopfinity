import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { migrateLegacyLocalStorageAssets } from "./utils/localStorageHelper.js";

if (typeof window !== "undefined") {
  migrateLegacyLocalStorageAssets();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
