import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext.jsx";
import { useOrder } from "../utils/OrderContext.jsx";
import { 
  FiUser, FiMail, FiLock, FiLogOut, FiAlertTriangle, FiCheckCircle, 
  FiAlertCircle, FiShield, FiPackage, FiMapPin, FiCreditCard, 
  FiSettings, FiArrowRight, FiUserPlus, FiHome
} from "react-icons/fi";
import { motion } from "framer-motion";

const Profile = () => {
  const { currentUser, updateUserProfile, resetPassword, logout } = useAuth();
  const { orders } = useOrder();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("profile");  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollProgress, setShowScrollProgress] = useState(false);
  const navigate = useNavigate();
  
  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollProgress(true);
      } else {
        setShowScrollProgress(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await updateUserProfile(currentUser, { displayName });
      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Failed to update profile: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(currentUser.email);
      setMessage({
        text: "Password reset email sent. Check your inbox.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Failed to send password reset email: " + error.message,
        type: "error",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      setMessage({
        text: "Failed to log out: " + error.message,
        type: "error",
      });
    }
  };

  // Generate user initials for avatar
  const userInitials = currentUser?.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.substring(0, 2).toUpperCase() || "ME";
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Scroll Progress Indicator */}
      {showScrollProgress && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </motion.div>
      )}


      {/* Hero Banner with User Info */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">              <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <div className="h-28 w-28 rounded-full flex items-center justify-center relative">
                {/* Animated border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 animate-spin-slow opacity-70"></div>
                {/* Inner circle with user initials */}
                <div className="absolute inset-1 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden z-10">
                  {userInitials}
                </div>
              </div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 rounded-full p-1.5 border-2 border-white cursor-pointer z-20"
              >
                <FiUserPlus className="h-4 w-4" />
              </motion.div>
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-4xl font-bold mb-2"
              >
                {currentUser?.displayName || "Welcome Back!"}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-2 text-white/80"
              >
                <FiMail className="text-white/60" />
                {currentUser?.email}
              </motion.p>
            </div>
          </div>
        </div>
      </div>      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          {[
            { label: "Orders", value: orders.length.toString(), icon: <FiPackage className="text-indigo-600" />, tabId: "orders" },
            { label: "Saved Items", value: "8", icon: <FiCheckCircle className="text-emerald-600" /> },
            { label: "Rewards Points", value: "1,240", icon: <FiUser className="text-amber-600" /> }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-50 cursor-pointer"
              onClick={() => stat.tabId && setActiveTab(stat.tabId)}
            >
              <div className="bg-indigo-50/50 rounded-xl p-4">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Alert messages */}
        {message.text && (<motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-6 rounded-xl flex items-center justify-between shadow-md transition-all ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            <span className="flex items-center gap-2">
              {message.type === "success" ? 
                <FiCheckCircle className="text-emerald-500 text-xl flex-shrink-0" /> : 
                <FiAlertCircle className="text-rose-500 text-xl flex-shrink-0" />
              }
              {message.text}
            </span>
            <button 
              onClick={() => setMessage({ text: "", type: "" })}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </motion.div>
        )}

        <div className="md:grid md:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-3 mb-8 md:mb-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="border-b border-gray-100">
                <h3 className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase">Account Settings</h3>
              </div>
              
              <nav className="space-y-1 p-2">
                {[
                  { id: "profile", icon: <FiUser />, label: "Personal Info" },
                  { id: "security", icon: <FiLock />, label: "Security" },
                  { id: "orders", icon: <FiPackage />, label: "Orders" },
                  { id: "addresses", icon: <FiMapPin />, label: "Addresses" },
                  { id: "payment", icon: <FiCreditCard />, label: "Payment Methods" },
                  { id: "preferences", icon: <FiSettings />, label: "Preferences" },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                      activeTab === tab.id 
                        ? "bg-indigo-50 text-indigo-700 font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`${activeTab === tab.id ? "text-indigo-500" : "text-gray-400"}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-2 w-2 rounded-full bg-indigo-500"
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-9 space-y-6">         
          {activeTab === "profile" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="border-b border-gray-100 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-indigo-600" />
                    Profile Information
                  </h2>
                  <div className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Personal</div>
                </div>
                <div className="p-6">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <input
                            type="email"
                            disabled
                            value={currentUser?.email || ""}
                            className="w-full pl-12 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700"
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                              Verified
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <FiAlertTriangle className="text-amber-400 flex-shrink-0" /> 
                          Email cannot be changed after account creation
                        </p>
                      </div>

                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full pl-12 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          This is how your name will appear to other users
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Updating Profile...</span>
                            </>
                          ) : (
                            <>
                              <FiCheckCircle />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FiMail className="text-indigo-600" />
                      Email Preferences
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {["Order confirmations", "Shipping updates", "Promotions & discounts", "Product recommendations"].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors">
                          <span className="font-medium text-gray-700">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FiAlertCircle className="text-indigo-600" />
                      Recent Activity
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                      
                      {[
                        { date: "June 5", event: "Changed account password", time: "11:32 AM" },
                        { date: "June 3", event: "Purchased 3 items", time: "02:14 PM" },
                        { date: "May 29", event: "Updated shipping address", time: "09:45 AM" },
                        { date: "May 24", event: "Signed in from new device", time: "07:20 PM" }
                      ].map((activity, i) => (
                        <div key={i} className="pl-8 pb-6 relative">
                          <div className="absolute left-[14px] top-1 w-2 h-2 rounded-full bg-indigo-600 border-2 border-white"></div>
                          <p className="text-xs text-gray-500 mb-1">{activity.date} • {activity.time}</p>
                          <p className="text-gray-800">{activity.event}</p>
                        </div>
                      ))}
                      
                      <div className="pl-8 opacity-50">
                        <a href="#" className="text-indigo-600 text-sm hover:text-indigo-800 flex items-center gap-1">
                          View all activity <FiArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Security Content */}
          {activeTab === "security" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiShield className="text-indigo-600" />
                    Password Management
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-100 p-4 rounded-full">
                        <FiLock className="text-indigo-600 text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">Change Your Password</h3>
                      <p className="text-gray-600 mb-4 sm:mb-0">
                        Secure your account by changing your password regularly
                      </p>
                    </div>
                    <button
                      onClick={handleResetPassword}
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                    >
                      <FiMail />
                      <span>Send Reset Link</span>
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-4">Password Requirements:</h3>
                    <ul className="space-y-2">
                      {[
                        "Minimum 8 characters long",
                        "At least one uppercase letter",
                        "At least one lowercase letter",
                        "At least one number",
                        "At least one special character"
                      ].map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCheckCircle className="text-green-500" /> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiAlertTriangle className="text-indigo-600" />
                    Login Sessions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FiCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium">Current Session</h4>
                      <p className="text-sm text-gray-600">Logged in on this device</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                    <div className="flex-shrink-0">
                      <div className="bg-rose-100 p-4 rounded-full">
                        <FiLogOut className="text-rose-600 text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">Sign Out Everywhere</h3>
                      <p className="text-gray-600 mb-4 sm:mb-0">
                        End all active sessions on all devices
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                    >
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiPackage className="text-indigo-600" />
                    Your Orders
                  </h2>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                        <FiPackage size={24} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
                      >
                        Start Shopping
                        <FiArrowRight size={12} className="ml-2" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Display the 3 most recent orders */}
                      {orders.slice(0, 3).map((order, index) => (
                        <div key={index} className="border border-gray-100 rounded-xl p-4 mb-4 hover:border-indigo-100 transition-colors">
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <h3 className="font-medium">Order {order.id}</h3>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 
                                  order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 
                                  order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                  'bg-amber-50 text-amber-700'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="font-medium text-gray-900">${order.total}</span>
                            <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium">
                              View details <FiArrowRight />
                            </Link>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-4 text-center">
                        <Link to="/orders" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
                          View all orders ({orders.length}) <FiArrowRight />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiMapPin className="text-indigo-600" />
                    Your Addresses
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Card */}
                    <div className="border border-gray-100 rounded-xl p-5 hover:border-indigo-100 transition-colors relative group">
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">Default</span>
                      </div>
                      <h3 className="font-medium mb-2">Home</h3>
                      <p className="text-gray-600 text-sm mb-1">John Doe</p>
                      <p className="text-gray-600 text-sm mb-1">123 Main Street, Apt 4B</p>
                      <p className="text-gray-600 text-sm mb-1">New York, NY 10001</p>
                      <p className="text-gray-600 text-sm mb-4">United States</p>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-sm text-gray-600 hover:text-gray-800">Remove</button>
                      </div>
                    </div>
                    
                    {/* Add New Address Card */}
                    <div className="border border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors cursor-pointer min-h-[200px]">
                      <div className="bg-indigo-50 rounded-full p-4 mb-3">
                        <FiMapPin className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="font-medium mb-1">Add a new address</h3>
                      <p className="text-gray-500 text-sm mb-3">Save your shipping and billing addresses</p>
                      <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        Add Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Payment Methods Tab */}
          {activeTab === "payment" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiCreditCard className="text-indigo-600" />
                    Payment Methods
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credit Card */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                      <div className="absolute bottom-0 left-0 h-20 w-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>
                      
                      <div className="flex justify-between mb-8">
                        <span className="font-medium">Credit Card</span>
                        <span className="font-bold">VISA</span>
                      </div>
                      
                      <div className="mb-8">
                        <div className="text-sm text-white/70 mb-1">Card Number</div>
                        <div className="font-mono">**** **** **** 4242</div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-white/70 mb-1">Cardholder Name</div>
                          <div>John Doe</div>
                        </div>
                        <div>
                          <div className="text-sm text-white/70 mb-1">Expiry</div>
                          <div>12/25</div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white border border-white/20 hover:bg-white/30 transition-colors">
                          Edit Card
                        </button>
                      </div>
                    </div>
                    
                    {/* Add Payment Method */}
                    <div className="border border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors cursor-pointer min-h-[220px]">
                      <div className="bg-indigo-50 rounded-full p-4 mb-3">
                        <FiCreditCard className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="font-medium mb-1">Add a payment method</h3>
                      <p className="text-gray-500 text-sm mb-3">Add a credit card or other payment method</p>
                      <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiSettings className="text-indigo-600" />
                    Preferences
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-8">
                    {/* Language Preference */}
                    <div>
                      <h3 className="font-medium text-gray-800 mb-4">Language</h3>
                      <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    {/* Theme Preference */}
                    <div>
                      <h3 className="font-medium text-gray-800 mb-4">Theme</h3>
                      <div className="flex gap-4 flex-wrap">
                        {["Light", "Dark", "System"].map((theme, i) => (
                          <div key={i} className={`border ${i === 0 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} rounded-lg p-4 px-6 cursor-pointer hover:border-indigo-300 transition-colors`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border ${i === 0 ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                                {i === 0 && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                              </div>
                              <span>{theme}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Notification Preferences */}
                    <div>
                      <h3 className="font-medium text-gray-800 mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        {["Push notifications", "Browser notifications", "SMS notifications"].map((notif, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors">
                            <span className="font-medium text-gray-700">{notif}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={i !== 2} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition w-full md:w-auto">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Shopfinity. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3">
            <button className="text-gray-400 hover:text-indigo-600 transition-colors">Privacy Policy</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-400 hover:text-indigo-600 transition-colors">Terms of Service</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-400 hover:text-indigo-600 transition-colors">Help Center</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
