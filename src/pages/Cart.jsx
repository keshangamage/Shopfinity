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
                  {/* Visa Card */}
                  <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="38"
                      className="p-1"
                    >
                      <path
                        fill="#00579F"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      />
                      <path
                        d="M15 8.4l-4.8 11.2H7L4.5 10c-.2-.5-.3-.7-.8-1-.8-.4-1.6-.7-2.7-.9L1.2 8h4c.5 0 1 .4 1.1.9L8 16 11.5 8.4H15zm13.4 7.6c0-3-4-3.2-4-4.5 0-.4.4-.8 1.3-.9.8-.1 1.8 0 2.6.4l.5-2.2c-.6-.2-1.5-.4-2.6-.4-2.8 0-4.7 1.5-4.7 3.5 0 1.5 1.4 2.4 2.4 2.9 1.1.5 1.5.8 1.5 1.3 0 .7-.9 1-1.7 1-.9 0-1.8-.2-2.5-.5l-.5 2.2c.8.3 1.7.5 2.7.5 3.2 0 4.9-1.5 5-3.3zm7.4 3.6h2.5l-2.2-11.2h-2.3c-.5 0-1 .3-1.1.8L28.3 19.6h2.8l.7-1.9h4l.4 1.9zm-3.4-4 1.7-4.5 1 4.5H32.4zm-8.2-7.2l-2.2 11.2h-2.7l2.2-11.2h2.7z"
                        fill="#ffffff"
                      />
                    </svg>
                  </div>

                  {/* MasterCard */}
                  <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="38"
                      className="p-1"
                    >
                      <path
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        fill="#16366F"
                      />
                      <path
                        d="M23.6 12c0-3.2-2.6-5.8-5.8-5.8S12 8.8 12 12c0 3.2 2.6 5.8 5.8 5.8 3.2-.1 5.8-2.6 5.8-5.8z"
                        fill="#D9222A"
                      />
                      <path
                        d="M19.5 6.2c-1.2.5-2.3 1.4-3.1 2.6-.7 1.2-1.2 2.5-1.2 4 0 1.4.4 2.8 1.2 4 .7 1.2 1.8 2.1 3.1 2.6-2.8.5-5.5-1.4-6-4.1-.5-2.8 1.4-5.5 4.1-6 .7-.1 1.3-.1 1.9 0v-.1z"
                        fill="#EE9F2D"
                      />
                      <path
                        d="M35 12c0 3.9-3.2 7-7 7-1.9 0-3.6-.7-4.9-2-1.1-1.1-1.8-2.5-2-4.1h.4c.4 1.5 1.2 2.7 2.4 3.6 1.2.9 2.6 1.4 4.1 1.4 3.7 0 6.7-3 6.7-6.7s-3-6.7-6.7-6.7c-1.5 0-3 .5-4.1 1.4-1.2.9-2 2.2-2.4 3.6h-.4c.2-1.6.9-3 2-4.1 1.3-1.3 3-2 4.9-2 3.8 0 7 3.1 7 7z"
                        fill="#4A4A4A"
                      />
                    </svg>
                  </div>

                  {/* American Express */}
                  <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="38"
                      className="p-1"
                    >
                      <path
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        fill="#2557D6"
                      />
                      <path
                        d="M16.4 15h2V9.7h-2V15zm-4.4-2.7l4.6-4.6h-3.4v-.7h4.6v1.5l-4.6 4.5H17v.8h-5v-1.5zm16.4 1.2h1.3v-.7h-1.3v-1h1.4v-.7h-1.4v-1h1.4v-.8h-2.3v4.2h.9zm-3.4 0h1.2v-3.5h-1v2.6l-1.1-2.6h-1.4v4.2h1v-2.6l1.3 2.6zm-2.9-1.5v-.7h-1.3v-1h1.4v-.7h-1.4v-1h1.4v-.8h-2.3v4.2h2.2v-.7h-.8v-.3h.8zm-6.4 1.5h.9v-3.5h1.2v-.7h-3.4v.7H16v3.5zm2.3-2h.7v-.7h-.7v.7z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>

                  {/* PayPal */}
                  <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="38"
                      className="p-1"
                    >
                      <path
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        fill="#ffffff"
                      />
                      <path
                        d="M23.9 8.3c.2-1.6 0-2.8-.7-3.8-.8-1-2.1-1.4-3.8-1.4h-5c-.3 0-.5.2-.6.5L12 18.6c0 .2.1.4.3.4h3.4c.2 0 .4-.2.5-.4l.6-3.5.1-.8c.1-.3.3-.5.5-.5h1.6c2.3 0 4-.9 4.6-3.3.2-.6.2-1.1.2-1.7.1-.2.1-.3.1-.5z"
                        fill="#253B80"
                      />
                      <path
                        d="M23.9 8.3c-.1.2-.1.3-.1.5-.6 2.4-2.4 3.3-4.6 3.3h-1.6c-.2 0-.4.2-.5.5l-.8 4.3-.2 1.1c0 .2.1.4.3.4h3.4c.3 0 .5-.2.5-.4l.2-1.1.5-3.4.1-.8c.1-.2.3-.4.5-.4h1.6c2.3 0 4-.9 4.6-3.3.2-.6.2-1.1.2-1.7-.4.1-1 .2-1.6.2-.5 0-1 0-1.5-.2z"
                        fill="#179BD7"
                      />
                      <path
                        d="M19.1 8.3c-.1-.1-.3-.1-.5-.1h-3.2c-.1 0-.2.1-.3.2l-.7 4.4v.1l.1-.8c.1-.3.3-.5.6-.5h1.6c2.3 0 4-.9 4.6-3.3 0-.1 0-.2.1-.3-.4-.2-.9-.3-1.4-.3-.3 0-.6.2-.9.3z"
                        fill="#222D65"
                      />
                    </svg>
                  </div>
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
