import { resolveAnyImageLikeValue } from "./assetResolver.js";

/**

 * @param {string}
 * @param {any}
 * @returns {boolean}
 */

export const setLocalStorageItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing data in localStorage for key ${key}:`, error);
    return false;
  }
};

/**
 * @param {string}
 * @param {any}
 * @returns {any}
 */
export const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(
      `Error retrieving data from localStorage for key ${key}:`,
      error
    );
    return defaultValue;
  }
};

/**
 * @param {string}
 * @returns {boolean}
 */
export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Error removing data from localStorage for key ${key}:`,
      error
    );
    return false;
  }
};

/**

 * @param {string}
 * @param {string}
 * @returns {string}
 */
export const getUserStorageKey = (baseKey, userId) => {
  return `shopfinity_${baseKey}_${userId || "guest"}`;
};

const transformPersistedValue = (value) => {
  if (Array.isArray(value)) {
    let didChange = false;
    const transformed = value.map((item) => {
      const { value: nextValue, changed } = transformPersistedValue(item);
      if (changed) {
        didChange = true;
      }
      return nextValue;
    });
    return { value: transformed, changed: didChange };
  }

  if (value && typeof value === "object") {
    let didChange = false;
    const nextObject = Object.entries(value).reduce((acc, [key, entry]) => {
      const { value: nextValue, changed } = transformPersistedValue(entry);
      if (changed) {
        didChange = true;
      }
      acc[key] = nextValue;
      return acc;
    }, {});
    return { value: nextObject, changed: didChange };
  }

  if (typeof value === "string") {
    const resolved = resolveAnyImageLikeValue(value);
    if (resolved !== value) {
      return { value: resolved, changed: true };
    }
  }

  return { value, changed: false };
};

export const migrateLegacyLocalStorageAssets = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const keysToInspect = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith("shopfinity_")) {
      keysToInspect.push(key);
    }
  }

  keysToInspect.forEach((key) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      const { value: migrated, changed } = transformPersistedValue(parsed);

      if (changed) {
        window.localStorage.setItem(key, JSON.stringify(migrated));
      }
    } catch (error) {
      console.warn(
        `Failed to migrate legacy asset paths for localStorage key ${key}:`,
        error
      );
    }
  });
};

export const debugLocalStorage = () => {
  console.log("=== Shopfinity localStorage Debug ===");
  const shopfinityKeys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("shopfinity_")) {
      shopfinityKeys.push(key);
    }
  }

  shopfinityKeys.forEach((key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      console.log(`${key}:`, value);
    } catch (e) {
      console.log(`${key}: [Error parsing value]`);
    }
  });

  if (shopfinityKeys.length === 0) {
    console.log("No Shopfinity data found in localStorage");
  }

  console.log("=== End Debug ===");
};
