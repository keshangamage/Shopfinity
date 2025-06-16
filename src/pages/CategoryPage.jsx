import { useParams } from "react-router-dom";
import { products } from "../components/Products";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useSavedItems } from "../utils/SavedItemsContext";
import { FiHeart } from "react-icons/fi";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const { addToSavedItems, removeFromSavedItems, isItemSaved } =
    useSavedItems();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [saveMessage, setSaveMessage] = useState({ id: null, message: "" });

  const categoryMap = {
    electronics: "Electronics",
    fashion: "Fashion",
    "home-appliances": "Home",
    accessories: "Accessories",
    toys: "Toys",
    sports: "Fitness",
    home: "Home",
    fitness: "Fitness",
    books: "Toys",
  };

  useEffect(() => {
    const standardCategory =
      categoryMap[categoryName.toLowerCase()] || categoryName;

    // Filter products that match the standardized category name
    const filteredProducts = products.filter(
      (item) => item.category.toLowerCase() === standardCategory.toLowerCase()
    );

    setCategoryProducts(filteredProducts);
  }, [categoryName]);

  const handleSaveItem = async (product) => {
    try {
      const isSaved = isItemSaved(product.id);

      if (isSaved) {
        await removeFromSavedItems(product.id);
        setSaveMessage({ id: product.id, message: `Removed from saved items` });
      } else {
        await addToSavedItems(product);
        setSaveMessage({
          id: product.id,
          message: `Saved! View in your profile.`,
        });
      }

      setTimeout(() => {
        setSaveMessage({ id: null, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error saving item:", error);
      setSaveMessage({ id: product.id, message: "Error. Please try again." });
    }
  };

  return (
    <div className="py-16 px-6 bg-white text-center">
      <h1 className="text-3xl font-bold mb-10 capitalize ml-15">
        {categoryName}
      </h1>
      {categoryProducts.length > 0 ? (
        <div className="mr-15 ml-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={`/${product.image}`}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveItem(product);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    isItemSaved(product.id)
                      ? "bg-rose-500 text-white"
                      : "bg-white text-gray-700"
                  } shadow hover:shadow-md transition-all`}
                  title={
                    isItemSaved(product.id)
                      ? "Remove from saved items"
                      : "Save item"
                  }
                >
                  <FiHeart
                    className={isItemSaved(product.id) ? "fill-current" : ""}
                    size={16}
                  />
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-2">
                  {product.discountPrice ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-red-500 font-medium">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    addToCart(product, 1);
                    alert(`${product.name} added to cart!`);
                  }}
                  className="bg-orange-500 text-white py-1.5 px-6.5 rounded-full mt-3 hover:bg-orange-600 transition-all w-full"
                >
                  Add to Cart
                </button>

                {saveMessage.id === product.id && saveMessage.message && (
                  <div className="mt-2 text-xs py-1 px-2 rounded bg-gray-100 text-gray-700">
                    {saveMessage.message}
                  </div>
                )}

                {saveMessage.id === product.id && (
                  <p className="mt-2 text-sm text-gray-500">
                    {saveMessage.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
