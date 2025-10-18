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
const hashSuffixPattern = /[-_][a-z0-9]{6,}$/i;

const stripQueryAndFragment = (value) => {
  if (typeof value !== "string") return "";
  const [withoutQuery] = value.split(/[?#]/, 1);
  return withoutQuery || "";
};

const uniquePush = (array, value) => {
  if (!value) return;
  if (!array.includes(value)) {
    array.push(value);
  }
};

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

  const candidateSegmentRaw = cleaned.split("/").pop() || "";
  const candidateSegment = stripQueryAndFragment(candidateSegmentRaw);
  const decodedSegment = stripQueryAndFragment(
    decodeURIComponent(candidateSegment)
  );

  if (decodedSegment) {
    const extensionMatch = decodedSegment.match(/\.[^.]+$/);
    const originalExtension = extensionMatch
      ? extensionMatch[0].toLowerCase()
      : "";

    const baseWithoutExtension = originalExtension
      ? decodedSegment.slice(0, -originalExtension.length)
      : decodedSegment;

    const baseWithoutHash = hashSuffixPattern.test(baseWithoutExtension)
      ? baseWithoutExtension.replace(hashSuffixPattern, "")
      : baseWithoutExtension;

    const baseCandidates = [];
    uniquePush(baseCandidates, baseWithoutExtension.trim());
    uniquePush(baseCandidates, baseWithoutHash.trim());

    const extensionCandidates = [];
    uniquePush(extensionCandidates, ".webp");
    uniquePush(extensionCandidates, originalExtension);
    uniquePush(extensionCandidates, ".jpg");
    uniquePush(extensionCandidates, ".jpeg");
    uniquePush(extensionCandidates, ".png");
    uniquePush(extensionCandidates, ".avif");

    for (const base of baseCandidates) {
      if (!base) continue;
      for (const extension of extensionCandidates) {
        if (!extension) continue;
        const candidateName = `${base}${extension}`;
        const resolvedCandidate = resolveAsset(candidateName);
        if (resolvedCandidate) {
          return resolvedCandidate;
        }
        const candidateWithPrefix = `assets/${candidateName}`;
        const resolvedWithPrefix = resolveAsset(candidateWithPrefix);
        if (resolvedWithPrefix) {
          return resolvedWithPrefix;
        }
      }
    }
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
