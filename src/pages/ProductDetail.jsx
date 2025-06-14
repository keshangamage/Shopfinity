import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../components/Products";
import { useCart } from "../utils/CartContext";
import { useSavedItems } from "../utils/SavedItemsContext";
import { FiHeart } from "react-icons/fi";

const ProductDetail = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [saveMessage, setSaveMessage] = useState("");
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToSavedItems, removeFromSavedItems, isItemSaved } =
    useSavedItems();
  const navigate = useNavigate();
  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return <div className="p-8">Product not found.</div>;
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`/${product.image}`}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsImageModalOpen(true)}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src =
              "https://via.placeholder.com/400x400?text=Image+Not+Found";
          }}
        />{" "}
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-xl text-teal-600 mb-4">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="flex items-center gap-4 mb-4">
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
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition flex-grow"
            >
              Add to Cart
            </button>
            <button
              onClick={handleSaveItem}
              className={`py-2 px-4 rounded transition flex items-center justify-center ${
                isItemSaved(product.id)
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label={
                isItemSaved(product.id)
                  ? "Remove from saved items"
                  : "Save item"
              }
            >
              <FiHeart
                className={isItemSaved(product.id) ? "fill-current" : ""}
              />
            </button>
          </div>

          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded ${
                saveMessage.includes("removed")
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="max-w-4xl w-full max-h-[90vh] relative">
            <img
              src={`/${product.image}`} // Add leading slash for proper path resolution
              alt={product.name}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src =
                  "https://via.placeholder.com/800x800?text=Image+Not+Found";
              }}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
              onClick={() => setIsImageModalOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
