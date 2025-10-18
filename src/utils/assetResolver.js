const assetEntries = import.meta.glob("../assets/*", {
  eager: true,
  import: "default",
  query: "?url",
});

const normalizeKey = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/\\/g, "/")
    .replace(/^\s+|\s+$/g, "")
    .replace(/^\.+\//g, "")
    .replace(/^(?:\.\.)+\//g, "")
    .replace(/^src\//i, "")
    .replace(/^assets\//i, "")
    .replace(/^src\/assets\//i, "")
    .toLowerCase();
};

const assetMap = Object.create(null);
Object.entries(assetEntries).forEach(([key, url]) => {
  const normalized = normalizeKey(key);
  if (normalized) {
    assetMap[normalized] = url;
  }
  const withoutPrefix = normalizeKey(key.replace(/^(?:\.\.\/)+/, ""));
  if (withoutPrefix) {
    assetMap[withoutPrefix] = url;
  }
  const filenameOnly = normalizeKey(key.split("/").pop());
  if (filenameOnly) {
    assetMap[filenameOnly] = url;
  }
});

const httpPattern = /^(?:https?:)?\/\//i;
const legacyAssetPattern = /(?:^|\/)src\/assets\//i;

const shouldAttemptResolve = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  if (!value.trim()) {
    return false;
  }

  if (httpPattern.test(value) || value.startsWith("data:")) {
    return false;
  }

  return value.includes("assets/") || legacyAssetPattern.test(value);
};

export const resolveAsset = (fileName) => {
  if (typeof fileName !== "string") return "";
  const normalized = normalizeKey(fileName);
  if (normalized && assetMap[normalized]) {
    return assetMap[normalized];
  }
  const filenameOnly = normalizeKey(fileName.split("/").pop());
  return filenameOnly && assetMap[filenameOnly] ? assetMap[filenameOnly] : "";
};

export const resolveProductImage = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (httpPattern.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/assets/")) {
    return trimmed;
  }

  const directResolution = resolveAsset(trimmed);
  if (directResolution) {
    return directResolution;
  }

  const cleaned = trimmed
    .replace(/^\.\/+/g, "")
    .replace(/^src\//i, "")
    .replace(/^assets\//i, "")
    .replace(/^src\/assets\//i, "");

  const resolvedCleaned = resolveAsset(cleaned);
  if (resolvedCleaned) {
    return resolvedCleaned;
  }

  const decoded = decodeURIComponent(cleaned);
  const resolvedDecoded = resolveAsset(decoded);
  if (resolvedDecoded) {
    return resolvedDecoded;
  }

  const lastSegment = cleaned.split("/").pop();
  if (lastSegment) {
    const resolvedLastSegment = resolveAsset(lastSegment);
    if (resolvedLastSegment) {
      return resolvedLastSegment;
    }
  }

  return trimmed.replace(/^\.\//, "/");
};

export const resolveProductImages = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (!item || typeof item !== "object") return item;
    const resolvedImage = resolveProductImage(
      item.image || item.imageUrl || item.imgURL || item.imagePath || ""
    );

    if (!resolvedImage) {
      return {
        ...item,
      };
    }

    return {
      ...item,
      image: resolvedImage,
      imageUrl: item.imageUrl || resolvedImage,
      imgURL: item.imgURL || resolvedImage,
    };
  });
};

export const resolveAnyImageLikeValue = (value) => {
  if (!shouldAttemptResolve(value)) {
    return value;
  }

  const resolved = resolveProductImage(value);
  return resolved || value;
};
