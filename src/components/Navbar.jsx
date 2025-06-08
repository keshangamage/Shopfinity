import { useState, useRef, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaBars, FaUser, FaSignOutAlt, FaRegUser, FaClipboardList, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logobgremove.png"; 
import { useCart } from "../utils/CartContext.jsx";
import { useAuth } from "../utils/AuthContext.jsx";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();
  const userMenuRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    navigate(`/categories/${category}`);
  };

  return (
    <header className="shadow-md px-4 py-2 flex items-center justify-between text-sm relative z-50 bg-white">
      {/* Logo and Dropdown */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="gap-1 text-2xl font-bold text-teal-400 cursor-pointer flex items-center"
        >
          <img src={logo} alt="Shopfinity Logo" className="h-7 w-10" />
          <span>Shopfinity</span>
        </Link>

        {/* Category Dropdown */}
        <div className="relative">
          <div
            className="bg-gray-100 rounded-full px-4 py-1 flex items-center space-x-2 cursor-pointer hover:bg-gray-200 transition duration-200"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          >
            <FaBars />
            <span>All Categories</span>
          </div>          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-48 text-sm z-50">              {[
                "electronics",
                "fashion",
                "fitness",
                "home",
                "toys",
                "accessories",
              ].map((category) => (
                <li
                  key={category}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.replace("-", " ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      {/* Search Bar */}
      <div className="flex-1 mx-4 sm:mx-8">
        <div className="flex border rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search in Shopfinity"
            className="w-full px-4 py-2 outline-none text-sm"
          />
          <button className="bg-teal-500 text-white px-4 flex items-center justify-center hover:bg-teal-600 transition duration-300">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* App Download */}
        <div className="text-xs text-gray-600 hover:text-black text-center leading-tight hidden sm:block">
          <button
            onClick={() => alert("App will be available soon!")}
            className="hover:underline"
          >
            Download the <br /> Shopfinity app
          </button>
        </div>
        
        {/* Authentication */}
        {currentUser ? (
          // User is logged in - show profile dropdown
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:shadow-lg transition duration-300 shadow-md"
            >
              <div className="w-7 h-7 bg-white text-teal-500 rounded-full flex items-center justify-center">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-teal-500" />
                )}
              </div>
              <span className="font-medium">
                {currentUser.displayName || currentUser.email.split("@")[0]}
              </span>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top-right">
                {/* User Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white text-teal-500 rounded-full flex items-center justify-center shadow-md">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FaUser size={20} className="text-teal-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{currentUser.displayName || currentUser.email.split("@")[0]}</div>
                      <div className="text-xs text-teal-100">{currentUser.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-teal-50 transition-colors duration-200">
                    <FaRegUser className="text-teal-500" size={16} />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-teal-50 transition-colors duration-200">
                    <FaClipboardList className="text-teal-500" size={16} />
                    <span className="font-medium">My Orders</span>
                  </Link>
                  
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <FaSignOutAlt size={16} className="text-red-500" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>        ) : (
          // User is not logged in - show sign in button
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 shadow-sm hover:shadow-md"
          >
            <div className="w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center">
              <FaUser size={14} />
            </div>
            <span className="font-medium">Sign In / Register</span>
          </Link>
        )}
        
        {/* Cart Button */}        <Link
          to="/cart"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 shadow-sm hover:shadow-md relative"
        >
          <div className="w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center">
            <FaShoppingCart size={14} />
          </div>
          <span className="font-medium">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
