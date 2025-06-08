import React, { useState } from "react";
import { FaBox, FaSearch, FaShoppingBag, FaCalendarAlt, FaChevronRight, FaTimes } from "react-icons/fa";
import { useOrder } from "../utils/OrderContext.jsx";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, cancelOrder } = useOrder();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCancelOrder = (e, orderId) => {
    e.stopPropagation();
    const orderToCancel = orders.find(order => order.id === orderId);
    setOrderToCancel(orderToCancel);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    cancelOrder(orderToCancel.id);
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your purchases
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-64 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-sm border border-teal-200">
          <div className="flex items-center">
            <div className="bg-teal-500 p-3 rounded-lg text-white mr-4">
              <FaShoppingBag />
            </div>
            <div>
              <p className="text-teal-800 text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg text-white mr-4">
              <FaBox />
            </div>
            <div>
              <p className="text-blue-800 text-sm font-medium">Items Purchased</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.reduce((total, order) => total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg text-white mr-4">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-purple-800 text-sm font-medium">Last Order</p>
              <p className="text-2xl font-bold text-gray-800">
                {orders.length > 0 ? orders[0].date : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-yellow-100 text-yellow-600 rounded-full mb-4">
            <FaBox size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">{searchTerm ? "No orders match your search criteria" : "You haven't placed any orders yet"}</p>
          <a
            href="/"
            className="inline-flex items-center px-5 py-3 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition transform hover:-translate-y-0.5"
          >
            Start Shopping
            <FaChevronRight size={12} className="ml-2" />
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {filteredOrders.map((order, index) => (
            <div 
              key={order.id}
              className={`${index !== filteredOrders.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  {/* Order Info */}
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{order.id}</h3>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered" 
                          ? "bg-green-100 text-green-800" 
                          : order.status === "Processing" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Ordered on {order.date}</p>
                    
                    {/* Products List */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-800">
                        {order.items.map(item => item.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex flex-col items-start md:items-end">
                    <p className="text-xl font-bold text-gray-900">${order.total}</p>
                    <p className="text-sm text-gray-500 mb-2">{order.items.reduce((total, item) => total + item.quantity, 0)} {order.items.reduce((total, item) => total + item.quantity, 0) === 1 ? "item" : "items"}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="inline-flex items-center px-4 py-2 bg-teal-500 bg-opacity-10 hover:bg-opacity-20 text-teal-700 rounded-full text-sm font-medium transition-colors"
                      >
                        View Details <FaChevronRight size={12} className="ml-1" />
                      </button>
                      
                      {order.status === "Processing" && (
                        <button 
                          onClick={(e) => handleCancelOrder(e, order.id)}
                          className="inline-flex items-center px-4 py-2 bg-red-500 bg-opacity-10 hover:bg-opacity-20 text-red-700 rounded-full text-sm font-medium transition-colors"
                        >
                          Cancel Order <FaTimes size={12} className="ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>      
      )}
      
      {/* Help Notice */}
      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start">
        <div className="rounded-full bg-blue-100 p-3 text-blue-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
          <p className="text-gray-600 mt-1">
            If you have any questions about your orders or need assistance with returns, 
            our customer support team is available 24/7.
          </p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center text-sm">
            Contact Support
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order <span className="font-medium">{orderToCancel?.id}</span>? This action cannot be undone.
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

export default Orders;
