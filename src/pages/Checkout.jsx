import React, { useState } from "react";

const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCardValid, setIsCardValid] = useState(true); // To track card validation state

  const orderItems = [
    {
      id: 1,
      name: "1Pair Silicone Cycling Bicycle Grips",
      price: 296.37,
      quantity: 1,
      image: "https://via.placeholder.com/100x100.png?text=Grips",
    },
    {
      id: 2,
      name: "Nylon Strap For Samsung Galaxy Fit R370",
      price: 969.21,
      quantity: 1,
      image: "https://via.placeholder.com/100x100.png?text=Watch+Strap",
    },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
    // Simple validation: Check if card number has 16 digits
    setIsCardValid(e.target.value.length === 16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the card number is valid before proceeding
    if (isCardValid && expiryDate && cvv) {
      alert("Payment successful!");
    } else {
      alert("Please enter valid card details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-8">
        <h2 className="text-2xl font-bold">Checkout</h2>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>Kandy, Central Province, Sri Lanka</p>
            <p>+94 77 123 4567</p>
          </div>
          <button className="mt-2 text-blue-600 text-sm hover:underline">Change Address</button>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" checked readOnly />
              <span>Credit / Debit Card (VISA / Mastercard / Amex)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" disabled />
              <span className="text-gray-400">Cash on Delivery (Unavailable)</span>
            </label>
          </div>
        </div>

        {/* Card Details Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Enter Card Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength="16"
                className={`w-full mt-1 px-3 py-2 border ${isCardValid ? "border-gray-300" : "border-red-500"} rounded-md`}
                placeholder="Enter your card number"
              />
              {!isCardValid && (
                <p className="text-red-500 text-sm mt-1">Card number must be 16 digits.</p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm">Expiration Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength="5"
                  placeholder="MM/YY"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength="3"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter CVV"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="divide-y">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center py-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
                <div className="ml-4 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right font-semibold">LKR {item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>LKR {subtotal}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>LKR {subtotal}</span>
            </div>
          </div>
        </div>

        {/* Confirm Order */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700"
        >
          Confirm and Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
