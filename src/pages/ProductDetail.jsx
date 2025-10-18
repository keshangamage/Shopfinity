import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useSavedItems } from "../utils/SavedItemsContext";
import { useProducts } from "../utils/ProductContext";
import { FiHeart } from "react-icons/fi";

const ProductDetail = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [saveMessage, setSaveMessage] = useState("");
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToSavedItems, removeFromSavedItems, isItemSaved } =
    useSavedItems();
  const { products } = useProducts();
  const navigate = useNavigate();
  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return <div className="p-4 sm:p-8">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show a confirmation toast or message
    alert(`${product.name} has been added to your cart!`);
  };

  const handleSaveItem = async () => {
    try {
      const isSaved = isItemSaved(product.id);

      if (isSaved) {
        await removeFromSavedItems(product.id);
        setSaveMessage(`${product.name} removed from saved items`);
      } else {
        await addToSavedItems(product);
        setSaveMessage(`${product.name} saved! View in your profile.`);
      }

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving item:", error);
      setSaveMessage("Error saving item. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <nav className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-teal-600"
            >
              Home
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <button
              onClick={() =>
                navigate(`/categories/${product.category.toLowerCase()}`)
              }
              className="text-gray-500 hover:text-teal-600 capitalize"
            >
              {product.category}
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-teal-600 truncate max-w-[180px] sm:max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative rounded-lg shadow overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src =
                  "https://via.placeholder.com/400x400?text=Image+Not+Found";
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
            {product.name}
          </h2>

          {/* Price */}
          <div className="mb-4">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <p className="text-xl text-teal-600 font-bold">
                  ${product.discountPrice.toFixed(2)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  ${product.price.toFixed(2)}
                </p>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                  Save ${(product.price - product.discountPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-xl text-teal-600 font-bold">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center border rounded">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-1 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-full hover:bg-teal-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleSaveItem}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full transition ${
                isItemSaved(product.id)
                  ? "bg-pink-100 text-pink-600 border border-pink-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiHeart
                className={isItemSaved(product.id) ? "fill-pink-600" : ""}
              />
              {isItemSaved(product.id) ? "Saved" : "Save"}
            </button>
          </div>

          {/* Save message */}
          {saveMessage && (
            <div className="mt-4 p-2 bg-teal-50 text-teal-700 rounded text-center">
              {saveMessage}
            </div>
          )}

          {/* Product Details */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium text-gray-700">Category:</span>{" "}
                {product.category}
              </li>
              <li>
                <span className="font-medium text-gray-700">Product ID:</span>{" "}
                {product.id}
              </li>
              <li>
                <span className="font-medium text-gray-700">Availability:</span>{" "}
                <span className="text-green-600">In Stock</span>
              </li>
              <li>
                <span className="font-medium text-gray-700">Shipping:</span>{" "}
                Free shipping on orders over $50
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">You Might Also Like</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products
            .filter(
              (p) => p.category === product.category && p.id !== product.id
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="relative overflow-hidden rounded-t-lg aspect-square">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm sm:text-base truncate">
                    {relatedProduct.name}
                  </h4>
                  <p className="text-teal-600 text-sm sm:text-base font-medium mt-1">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    className="mt-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 w-full py-1 rounded transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x800?text=Image+Not+Found";
              }}
            />
            <button
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded mx-auto block"
              onClick={() => setIsImageModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
