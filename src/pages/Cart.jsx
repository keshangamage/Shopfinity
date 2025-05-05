import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate(); // <-- navigation hook

  const cartItems = [
    {
      id: 1,
      name: "1Pair Silicone Cycling Bicycle Grips",
      shop: "June4225 Store",
      price: 296.37,
      oldPrice: 529.52,
      image: "./src/assets/1Pair Silicone Cycling Bicycle Grips.jpg",
      shipping: "Shipped by AliExpress",
      quantity: 1,
    },
    {
      id: 2,
      name: "Nylon Strap For Samsung Galaxy Fit R370",
      shop: "Essidi Official Store",
      price: 969.21,
      oldPrice: 1309.94,
      image: "https://via.placeholder.com/100x100.png?text=Watch+Strap",
      shipping: "Shipped by global sellers",
      quantity: 1,
    },
  ];

  const subtotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const discount = cartItems
    .reduce((acc, item) => acc + (item.oldPrice - item.price), 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Left section */}
        <div className="w-2/3 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Cart ({cartItems.length})</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start border-b py-4 gap-4">
              <input type="checkbox" className="mt-4" />
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500">{item.shipping}</p>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.shop}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-red-600 font-semibold">
                    LKR {item.price.toFixed(2)}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    LKR {item.oldPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="bg-gray-200 px-2 rounded">+</button>
                <p>{item.quantity}</p>
                <button className="bg-gray-200 px-2 rounded">-</button>
              </div>
            </div>
          ))}
        </div>

        {/* Right summary */}
        <div className="w-1/3 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items total</span>
              <span className="line-through text-gray-400">
                LKR {(parseFloat(subtotal) + parseFloat(discount)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Items discount</span>
              <span>- LKR {discount}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>LKR {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Estimated total</span>
              <span>LKR {subtotal}</span>
            </div>
          </div>

          {/* Checkout Button with Navigation */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
          >
            Checkout ({cartItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
