import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../components/Products.jsx";

const LOCAL_STORAGE_PRODUCTS_KEY = "shopfinity_admin_products";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => {
      try {
        setIsLoading(true);
        const savedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
        } else {
          setProducts(initialProducts);
          localStorage.setItem(
            LOCAL_STORAGE_PRODUCTS_KEY,
            JSON.stringify(initialProducts)
          );
        }
      } catch (error) {
        console.error("Error loading products from localStorage:", error);
        setProducts(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Add a new product
  const addProduct = (newProduct) => {
    if (!newProduct.name || !newProduct.price) {
      throw new Error("Product name and price are required!");
    }

    const productToAdd = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id || 0), 0) + 1,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      createdAt: new Date().toISOString(),
      imgURL: newProduct.imageUrl,
      status: newProduct.status || "active",
    };

    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );
    return productToAdd;
  };

  // Update an existing product
  const updateProduct = (updatedData) => {
    if (!updatedData || !updatedData.name || !updatedData.price) {
      throw new Error("Product name and price are required!");
    }

    const productId = updatedData.id;
    if (!productId) {
      throw new Error("Product ID is required for update!");
    }

    const updatedProduct = {
      ...updatedData,
      price: parseFloat(updatedData.price) || 0,
      stock: parseInt(updatedData.stock) || 0,
      updatedAt: new Date().toISOString(),
      imgURL: updatedData.imageUrl || updatedData.imgURL,
    };

    const updatedProducts = products.map((product) =>
      product.id === productId ? updatedProduct : product
    );

    setProducts(updatedProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );
    return updatedProduct;
  };

  // Delete a product
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );
  };

  // Bulk update products
  const bulkUpdateProducts = (productIds, action) => {
    const updatedProducts = [...products];

    productIds.forEach((productId) => {
      const productIndex = updatedProducts.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        if (action === "activate") {
          updatedProducts[productIndex].status = "active";
        } else if (action === "deactivate") {
          updatedProducts[productIndex].status = "inactive";
        }
      }
    });

    setProducts(updatedProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );
  };

  // Delete multiple products
  const bulkDeleteProducts = (productIds) => {
    const updatedProducts = products.filter(
      (product) => !productIds.includes(product.id)
    );

    setProducts(updatedProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );
  };

  // Reset products to original data
  const resetProducts = () => {
    setProducts(initialProducts);
    localStorage.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(initialProducts)
    );
  };

  const value = {
    products,
    isLoading,
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
