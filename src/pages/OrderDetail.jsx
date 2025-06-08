import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../utils/OrderContext.jsx";
import { FaArrowLeft, FaBox, FaTruck, FaMapMarkerAlt, FaCalendar, FaTimes } from "react-icons/fa";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { getOrderById, cancelOrder } = useOrder();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  useEffect(() => {
    const orderData = getOrderById(orderId);
    if (orderData) {
      setOrder(orderData);
    } else {
      // Redirect to orders page if order not found
      navigate("/orders");
    }
  }, [orderId, getOrderById, navigate]);

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    const updatedOrder = cancelOrder(orderId);
    setOrder(updatedOrder);
    setShowCancelModal(false);
  };

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 border-opacity-50 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  
  const orderDate = new Date(order.timestamp);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  
  // Format delivery date
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/orders")}
          className="flex items-center text-gray-600 hover:text-teal-600 transition mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order {order.id}</h1>
            <p className="text-gray-500 mt-1">Placed on {order.date}</p>
          </div>
          <span className={`mt-3 md:mt-0 px-4 py-2 inline-flex items-center rounded-full text-sm font-medium ${
            order.status === "Delivered" 
              ? "bg-green-100 text-green-800" 
              : order.status === "Processing" 
              ? "bg-yellow-100 text-yellow-800" 
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {order.status === "Processing" && <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>}
            {order.status === "Delivered" && <FaTruck className="mr-2" />}
            {order.status === "Cancelled" && <FaTimes className="mr-2" />}
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  <FaBox className="text-teal-600 text-sm" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-5 flex items-start">                  <div className="h-20 w-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image.startsWith('/') ? item.image : `/${item.image}`} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100.png?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="ml-5 flex-grow">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          Quantity: <span className="font-medium text-gray-700">{item.quantity}</span>
                        </p>                        <p className="text-sm text-gray-500">
                          Price: <span className="font-medium text-gray-700">${item.price.toFixed(2)}</span>
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <FaTruck className="text-purple-600 text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Delivery Information</h3>
            </div>
            
            <div className="pl-11">
              <div className="mb-5">
                <p className="text-gray-600 mb-1">Expected Delivery Date</p>
                <div className="flex items-center">
                  <FaCalendar className="text-gray-400 mr-2" />
                  <p className="font-medium text-gray-800">{formattedDeliveryDate}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 mb-1">Shipping Address</p>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.city}</p>
                    <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.total}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-xl">${order.total}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                {order.status === "Processing" && (
                  <button 
                    onClick={handleCancelOrder}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition mb-3 flex items-center justify-center"
                  >
                    <FaTimes className="mr-2" /> Cancel Order
                  </button>
                )}
                
                <button className={`w-full ${order.status === "Processing" ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} py-3 rounded-lg font-medium transition`}>
                  Track Order
                </button>
                
                <button className="w-full mt-3 border border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium transition">
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Keep Order
              </button>
              <button 
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
