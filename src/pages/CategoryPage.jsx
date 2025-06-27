import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useSavedItems } from "../utils/SavedItemsContext";
import { useProducts } from "../utils/ProductContext";
import { FiHeart } from "react-icons/fi";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const { addToSavedItems, removeFromSavedItems, isItemSaved } = useSavedItems();
  const { products } = useProducts();
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
          message: `${product.name} saved! View in your profile.`,
        });
      }

      setTimeout(() => {
        setSaveMessage({ id: null, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error saving item:", error);
      setSaveMessage({
        id: product.id,
        message: "Error saving item. Please try again.",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 capitalize">
          {categoryName.replace(/-/g, " ")}
        </h1>

        {categoryProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">
              No products found in this category.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categoryProducts.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="product-image-container">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={`/${product.image}`}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=Image+Not+Found";
                      }}
                    />
                    {product.discountPrice && (
                      <div className="sale-badge">SALE</div>
                    )}
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveItem(product);
                    }}
                    className={`wishlist-button ${
                      isItemSaved(product.id)
                        ? "bg-rose-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
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
                  <Link to={`/product/${product.id}`}>
                    <h3 className="product-title hover:text-teal-600">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      {product.discountPrice ? (
                        <>
                          <span className="product-price">
                            ${product.discountPrice.toFixed(2)}
                          </span>
                          <span className="product-price-original">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="product-price">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="product-rating">★★★★☆</div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      alert(`${product.name} added to cart!`);
                    }}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>

                  {/* Save message */}
                  {saveMessage.id === product.id && saveMessage.message && (
                    <div className="mt-2 text-sm text-center p-1 bg-teal-50 text-teal-700 rounded">
                      {saveMessage.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
