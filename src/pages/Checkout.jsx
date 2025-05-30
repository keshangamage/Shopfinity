import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCardValid, setIsCardValid] = useState(true); // To track card validation state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect to home if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/");
    }
  }, [cartItems, navigate, orderComplete]);

  const subtotal = getCartTotal().toFixed(2);
  const handleCardNumberChange = (e) => {
    // Only allow digits and limit to 16 characters
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCardNumber(value);
    // Simple validation: Check if card number has 16 digits
    setIsCardValid(value.length === 16);
  };

  const handleExpiryDateChange = (e) => {
    // Format as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e) => {
    // Only allow digits and limit to 3 or 4 characters
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !address || !city || !phone) {
      alert("Please fill in all shipping information.");
      return;
    }
    
    // Check if the card number is valid before proceeding
    if (!isCardValid || !expiryDate || !cvv) {
      alert("Please enter valid card details.");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate random order ID
      const generatedOrderId = "SF" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedOrderId);
      
      // Clear the cart after successful payment
      clearCart();
      
      // Show success screen
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-8">
        <h2 className="text-2xl font-bold">Checkout</h2>        {orderComplete ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold mt-4">Order Placed Successfully!</h3>
            <p className="text-gray-600 mt-2">Your order #{orderId} has been placed successfully.</p>
            <p className="text-gray-600">You will receive an email confirmation shortly.</p>
            <button 
              onClick={() => navigate("/")} 
              className="mt-6 bg-teal-600 text-white py-2 px-6 rounded-xl hover:bg-teal-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Kandy"
                  />
                </div>
                <div>
                  <label className="block text-sm">Province</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                    <option value="central">Central Province</option>
                    <option value="northern">Northern Province</option>
                    <option value="eastern">Eastern Province</option>
                    <option value="western">Western Province</option>
                    <option value="southern">Southern Province</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

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
        </div>        {!orderComplete && (
          /* Card Details Form */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Enter Card Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Accepted Cards</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">VISA</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Mastercard</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Amex</span>
                </div>
              </div>
              <div>
                <label className="block text-sm">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full mt-1 px-3 py-2 border ${isCardValid || cardNumber.length === 0 ? "border-gray-300" : "border-red-500"} rounded-md`}
                    placeholder="1234 5678 9012 3456"
                    disabled={isProcessing}
                  />
                  {cardNumber.startsWith("4") && (
                    <span className="absolute right-3 top-2 text-blue-600 font-bold">VISA</span>
                  )}
                  {cardNumber.startsWith("5") && (
                    <span className="absolute right-3 top-2 text-red-600 font-bold">MC</span>
                  )}
                </div>
                {!isCardValid && cardNumber.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">Card number must be 16 digits.</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm">Expiration Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength="5"
                    placeholder="MM/YY"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    disabled={isProcessing}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength="4"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="123"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </form>
          </div>
        )}{/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center py-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100.png?text=No+Image';
                  }}
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right font-semibold">LKR {item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>          {/* Totals */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>LKR {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- LKR {cartItems.reduce((acc, item) => {
                const originalPrice = item.oldPrice || item.discountPrice 
                  ? (item.oldPrice || (item.price * 1.2)) 
                  : item.price;
                return acc + ((originalPrice - item.price) * item.quantity);
              }, 0).toFixed(2)}</span>
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
        </div>        {/* Confirm Order */}
        {!orderComplete && (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl text-lg font-semibold ${
              isProcessing 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </div>
            ) : (
              `Confirm and Pay LKR ${subtotal}`
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
