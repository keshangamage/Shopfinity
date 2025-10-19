import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { resolveProductImage } from "./assetResolver.js";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const PRODUCTS_COLLECTION = "products";
const MAX_BATCH_SIZE = 450;

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNumberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractImage = (product) => {
  const imageCandidates = [
    product.imageUrl,
    product.imgURL,
    product.image,
    product.imagePath,
  ];

  for (const candidate of imageCandidates) {
    if (typeof candidate === "string" && candidate) {
      const resolved = resolveProductImage(candidate);
      if (resolved) {
        return resolved;
      }
      return candidate;
    }
  }

  return "";
};

const normalizeProductDoc = (snapshotDoc) => {
  const data = snapshotDoc.data() || {};

  const createdAt =
    data.createdAt && typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : data.createdAt || null;

  const updatedAt =
    data.updatedAt && typeof data.updatedAt.toDate === "function"
      ? data.updatedAt.toDate().toISOString()
      : data.updatedAt || null;

  const normalized = {
    id: snapshotDoc.id,
    ...data,
    price: toNumberOrZero(data.price),
    stock: toNumberOrZero(data.stock),
    createdAt,
    updatedAt,
  };

  const discountPrice = toNumberOrNull(data.discountPrice);
  if (discountPrice !== null) {
    normalized.discountPrice = discountPrice;
  } else {
    delete normalized.discountPrice;
  }

  const resolvedImage = extractImage(normalized);
  if (resolvedImage) {
    normalized.image = resolvedImage;
    normalized.imageUrl = resolvedImage;
    normalized.imgURL = resolvedImage;
  }

  if (data.legacyId !== undefined && data.legacyId !== null) {
    normalized.legacyId = data.legacyId;
  }

  return normalized;
};

const chunkItems = (items, chunkSize) => {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
};

const buildProductPayload = (product, { isNew } = { isNew: false }) => {
  const now = Timestamp.now();
  const image = extractImage(product);
  const discountPrice = toNumberOrNull(product.discountPrice);
  const payload = {
    name: product.name,
    description: product.description || "",
    category: product.category || "",
    price: toNumberOrZero(product.price),
    stock: toNumberOrZero(product.stock),
    status: product.status || "active",
    featured: Boolean(product.featured),
    tags: Array.isArray(product.tags)
      ? product.tags
      : typeof product.tags === "string" && product.tags.length
      ? product.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    image,
    imageUrl: image,
    imgURL: image,
    updatedAt: now,
  };

  if (discountPrice !== null) {
    payload.discountPrice = discountPrice;
  } else {
    payload.discountPrice = null;
  }

  if (isNew) {
    payload.createdAt = now;
  }

  if (product.brand) {
    payload.brand = product.brand;
  }

  if (product.specifications) {
    payload.specifications = product.specifications;
  }

  if (product.attributes) {
    payload.attributes = product.attributes;
  }

  if (product.legacyId !== undefined && product.legacyId !== null) {
    payload.legacyId = product.legacyId;
  }

  return payload;
};

let cachedSeedProducts = null;

const loadSeedProducts = async () => {
  if (cachedSeedProducts) {
    return cachedSeedProducts;
  }

  try {
    const module = await import("../components/Products.jsx");
    const loadedProducts = Array.isArray(module.products)
      ? module.products
      : [];
    cachedSeedProducts = loadedProducts;
    return cachedSeedProducts;
  } catch (error) {
    console.error("Failed to load seed products:", error);
    cachedSeedProducts = [];
    return cachedSeedProducts;
  }
};

const seedInitialProducts = async () => {
  const initialProducts = await loadSeedProducts();

  if (!initialProducts.length) {
    console.warn("No seed products available to populate Firestore.");
    return;
  }

  const productChunks = chunkItems(initialProducts, MAX_BATCH_SIZE);

  for (const productChunk of productChunks) {
    const batch = writeBatch(db);

    productChunk.forEach((product) => {
      const legacyId =
        product.legacyId !== undefined && product.legacyId !== null
          ? product.legacyId
          : product.id;

      const docId = legacyId !== undefined ? String(legacyId) : undefined;
      const productRef =
        docId !== undefined
          ? doc(db, PRODUCTS_COLLECTION, docId)
          : doc(collection(db, PRODUCTS_COLLECTION));

      const payload = buildProductPayload(
        {
          ...product,
          legacyId,
        },
        { isNew: true }
      );

      batch.set(productRef, payload);
    });

    await batch.commit();
  }
};

const clearProductsCollection = async () => {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  if (snapshot.empty) {
    return;
  }

  const docChunks = chunkItems(snapshot.docs, MAX_BATCH_SIZE);
  for (const docChunk of docChunks) {
    const batch = writeBatch(db);
    docChunk.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasSeededRef = useRef(false);

  useEffect(() => {
    setIsLoading(true);

    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const productsQuery = query(
      productsCollection,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      productsQuery,
      async (snapshot) => {
        if (snapshot.empty && !hasSeededRef.current) {
          hasSeededRef.current = true;
          try {
            await seedInitialProducts();
          } catch (seedError) {
            console.error("Error seeding initial products:", seedError);
            setError(seedError);
            setIsLoading(false);
          }
          return;
        }

        const loadedProducts = snapshot.docs.map(normalizeProductDoc);
        setProducts(loadedProducts);
        setError(null);
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Error loading products from Firestore:", snapshotError);
        setError(snapshotError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getNextProductId = () => {
    const numericIds = products
      .map((product) => {
        const candidate =
          product.legacyId !== undefined && product.legacyId !== null
            ? Number(product.legacyId)
            : Number(product.id);
        return Number.isFinite(candidate) ? candidate : null;
      })
      .filter((value) => value !== null);

    if (numericIds.length === 0) {
      return 1;
    }

    return Math.max(...numericIds) + 1;
  };

  const addProduct = async (newProduct) => {
    if (!newProduct?.name || newProduct.price === undefined) {
      throw new Error("Product name and price are required!");
    }

    try {
      const nextId = getNextProductId();
      const docId = String(nextId);
      const payload = buildProductPayload(
        {
          ...newProduct,
          legacyId: nextId,
        },
        { isNew: true }
      );

      const productRef = doc(db, PRODUCTS_COLLECTION, docId);
      await setDoc(productRef, payload);

      return { id: docId, ...newProduct, legacyId: nextId };
    } catch (addError) {
      console.error("Error adding product:", addError);
      setError(addError);
      throw addError;
    }
  };

  const updateProduct = async (updatedData) => {
    if (!updatedData?.id) {
      throw new Error("Product ID is required for update!");
    }

    if (!updatedData.name || updatedData.price === undefined) {
      throw new Error("Product name and price are required!");
    }

    try {
      const docId = String(updatedData.id);
      const legacyId =
        updatedData.legacyId !== undefined && updatedData.legacyId !== null
          ? updatedData.legacyId
          : toNumberOrNull(updatedData.id) ?? updatedData.id;

      const payload = buildProductPayload(
        {
          ...updatedData,
          legacyId,
        },
        { isNew: false }
      );

      const productRef = doc(db, PRODUCTS_COLLECTION, docId);
      await setDoc(productRef, payload, { merge: true });

      return { id: docId, ...updatedData, legacyId };
    } catch (updateError) {
      console.error("Error updating product:", updateError);
      setError(updateError);
      throw updateError;
    }
  };

  const deleteProduct = async (productId) => {
    if (!productId) {
      throw new Error("Product ID is required for deletion!");
    }

    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, String(productId));
      await deleteDoc(productRef);
    } catch (deleteError) {
      console.error("Error deleting product:", deleteError);
      setError(deleteError);
      throw deleteError;
    }
  };

  const bulkUpdateProducts = async (productIds, action) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return;
    }

    if (!["activate", "deactivate"].includes(action)) {
      throw new Error("Unsupported bulk action for products.");
    }

    const status = action === "activate" ? "active" : "inactive";
    const now = Timestamp.now();

    try {
      const idChunks = chunkItems(productIds, MAX_BATCH_SIZE);
      for (const chunk of idChunks) {
        const batch = writeBatch(db);
        chunk.forEach((productId) => {
          const productRef = doc(db, PRODUCTS_COLLECTION, String(productId));
          batch.update(productRef, { status, updatedAt: now });
        });
        await batch.commit();
      }
    } catch (bulkUpdateError) {
      console.error("Error updating products in bulk:", bulkUpdateError);
      setError(bulkUpdateError);
      throw bulkUpdateError;
    }
  };

  const bulkDeleteProducts = async (productIds) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return;
    }

    try {
      const idChunks = chunkItems(productIds, MAX_BATCH_SIZE);
      for (const chunk of idChunks) {
        const batch = writeBatch(db);
        chunk.forEach((productId) => {
          const productRef = doc(db, PRODUCTS_COLLECTION, String(productId));
          batch.delete(productRef);
        });
        await batch.commit();
      }
    } catch (bulkDeleteError) {
      console.error("Error deleting products in bulk:", bulkDeleteError);
      setError(bulkDeleteError);
      throw bulkDeleteError;
    }
  };

  const resetProducts = async () => {
    try {
      await clearProductsCollection();
      await seedInitialProducts();
    } catch (resetError) {
      console.error("Error resetting products:", resetError);
      setError(resetError);
      throw resetError;
    }
  };

  const value = {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    resetProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
