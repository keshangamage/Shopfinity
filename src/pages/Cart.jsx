import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  
  const discount = cartItems
    .reduce((acc, item) => {
      const originalPrice = item.oldPrice || item.discountPrice 
        ? (item.oldPrice || (item.price * 1.2)) 
        : item.price;
      return acc + ((originalPrice - item.price) * item.quantity);
    }, 0)
    .toFixed(2);
    
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left section */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Cart ({cartItems.length})</h2>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link to="/" className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition">
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start border-b py-4 gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100.png?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-red-600 font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <p>{item.quantity}</p>
                  <button 
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                  >
                    -
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right summary */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ${discount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
            disabled={cartItems.length === 0}
          >
            Checkout ({cartItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
