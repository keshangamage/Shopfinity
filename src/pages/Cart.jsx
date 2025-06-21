import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal().toFixed(2);

  const discount = cartItems
    .reduce((acc, item) => {
      if (item.discountPrice) {
        return acc + (item.price - item.discountPrice) * item.quantity;
      }
      return acc;
    }, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left section - Cart Items */}
          <div className="w-full lg:w-2/3 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Cart ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"})
            </h2>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  to="/"
                  className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start border-b pb-4 gap-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24">
                      <div className="product-image-container !w-24 !h-24">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="product-image rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/100x100.png?text=No+Image";
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Info and Controls */}
                    <div className="flex-1 flex flex-col sm:flex-row w-full justify-between items-center sm:items-start gap-4 text-center sm:text-left">
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {item.category}
                        </p>

                        {/* Mobile Price Display */}
                        <div className="sm:hidden mt-2">
                          {item.discountPrice ? (
                            <div>
                              <span className="font-bold text-teal-600">
                                ${item.discountPrice.toFixed(2)}
                              </span>
                              <span className="text-gray-400 text-sm line-through ml-2">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Price - Desktop */}
                      <div className="hidden sm:block text-right">
                        {item.discountPrice ? (
                          <div>
                            <div className="font-bold text-teal-600">
                              ${item.discountPrice.toFixed(2)}
                            </div>
                            <div className="text-gray-400 text-sm line-through">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="font-bold">
                            ${item.price.toFixed(2)}
                          </div>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                          Subtotal: $
                          {(
                            (item.discountPrice || item.price) * item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                        aria-label="Remove item"
                      >
                        <FaTrash size={14} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <Link
                    to="/"
                    className="text-teal-600 hover:text-teal-700 transition flex items-center gap-2"
                  >
                    <span>← Continue Shopping</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right section - Order Summary */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal}</span>
                  </div>

                  {parseFloat(discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-xl text-teal-700">${subtotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-teal-600 text-white py-3 rounded-full mt-6 hover:bg-teal-700 transition"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>All prices include applicable taxes</p>
                  <p>Free shipping on all orders</p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <img
                    src="https://via.placeholder.com/40x25.png?text=Visa"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://via.placeholder.com/40x25.png?text=MC"
                    alt="MasterCard"
                    className="h-6"
                  />
                  <img
                    src="https://via.placeholder.com/40x25.png?text=Amex"
                    alt="American Express"
                    className="h-6"
                  />
                  <img
                    src="https://via.placeholder.com/40x25.png?text=PayPal"
                    alt="PayPal"
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
