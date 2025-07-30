import { useProducts } from "../utils/ProductContext";

export const products = [];

export const useProductsData = () => {
  const { products: contextProducts } = useProducts();
  return contextProducts;
};
