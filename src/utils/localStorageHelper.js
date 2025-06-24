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
