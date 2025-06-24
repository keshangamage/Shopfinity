import { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaRegUser,
  FaClipboardList,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logobgremove.png";
import { useCart } from "../utils/CartContext.jsx";
import { useAuth } from "../utils/AuthContext.jsx";
import { products } from "./Products.jsx";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(
    window.innerWidth >= 640
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        window.innerWidth < 640
      ) {
        setIsSearchVisible(false);
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Close mobile menu on larger screens
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      // Show search on larger screens
      if (window.innerWidth >= 640) {
        setIsSearchVisible(true);
      } else {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/categories/${category}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchVisible(false);
    }
  };

  return (
    <header className="shadow-md flex flex-wrap items-center justify-between text-sm relative z-50 bg-white navbar-container">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 mr-2"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center">
        <Link
          to="/"
          className="gap-1 text-xl md:text-2xl font-bold text-teal-400 cursor-pointer flex items-center navbar-logo"
        >
          <img
            src={logo}
            alt="Shopfinity Logo"
            className="h-6 w-9 md:h-7 md:w-10"
          />
          <span>Shopfinity</span>
        </Link>
      </div>

      {/* Search Icon for Mobile */}
      <button className="sm:hidden text-gray-700" onClick={toggleSearchBar}>
        <FaSearch size={18} />
      </button>

      {/* Category Dropdown - Only visible on larger screens */}
      <div className="hidden md:flex relative ml-4">
        <div
          className="bg-gray-100 rounded-full px-4 py-1 flex items-center space-x-2 cursor-pointer hover:bg-gray-200 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        >
          <FaBars />
          <span>All Categories</span>
        </div>
        {isDropdownOpen && (
          <ul className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-48 text-sm z-50">
            {[
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

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      {/* Search Bar - Full size on desktop, conditional on mobile */}
      <div
        ref={searchRef}
        className={`${
          isSearchVisible || windowWidth >= 640 ? "flex" : "hidden"
        } sm:flex flex-1 mx-2 sm:mx-8 navbar-search ${
          isSearchVisible && windowWidth < 640
            ? "absolute top-full left-0 right-0 p-2 bg-white z-50 shadow-md"
            : "relative"
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="flex w-full border rounded-full overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search in Shopfinity"
            className="w-full px-4 py-2 outline-none text-sm search-transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 flex items-center justify-center hover:bg-teal-600 transition duration-300"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-6 navbar-items">
        {/* App Download - Hide on mobile */}
        <div className="text-xs text-gray-600 hover:text-black text-center leading-tight hidden lg:block">
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
              className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:shadow-lg transition duration-300 shadow-md"
            >
              <div className="w-7 h-7 bg-white text-teal-500 rounded-full flex items-center justify-center overflow-hidden">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          currentUser.displayName ||
                            currentUser.email.split("@")[0]
                        );
                    }}
                  />
                ) : (
                  <FaUser className="text-teal-500" />
                )}
              </div>
              <span className="font-medium hidden sm:inline">
                {currentUser.displayName || currentUser.email.split("@")[0]}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top-right">
                {/* User Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white">
                  <div>
                    <div className="font-bold text-lg">
                      {currentUser.displayName ||
                        currentUser.email.split("@")[0]}
                    </div>
                    <div className="text-xs text-teal-100">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-teal-50 transition-colors duration-200"
                  >
                    <FaRegUser className="text-teal-500" size={16} />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-teal-50 transition-colors duration-200"
                  >
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
          </div>
        ) : (
          // User is not logged in - show sign in button
          <Link
            to="/login"
            className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 shadow-sm hover:shadow-md"
          >
            <div className="w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center">
              <FaUser size={14} />
            </div>
            <span className="font-medium hidden sm:inline">Sign In</span>
          </Link>
        )}

        {/* Cart Button */}
        <Link
          to="/cart"
          className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200 shadow-sm hover:shadow-md relative"
        >
          <div className="w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center">
            <FaShoppingCart size={14} />
          </div>
          <span className="font-medium hidden sm:inline">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md cart-badge">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out mobile-menu ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src={logo} alt="Shopfinity Logo" className="h-6 w-9" />
            <span className="text-xl font-bold text-teal-500">Shopfinity</span>
          </Link>
          <button onClick={toggleMobileMenu} className="text-gray-500">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg mb-2">Categories</h3>
          <ul>
            {[
              "electronics",
              "fashion",
              "fitness",
              "home",
              "toys",
              "accessories",
            ].map((category) => (
              <li
                key={category}
                className="py-2 px-1 border-b border-gray-100 capitalize"
                onClick={() => handleCategoryClick(category)}
              >
                {category.replace("-", " ")}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {currentUser ? (
              <>
                <h3 className="font-medium text-lg mb-2">My Account</h3>
                <ul>
                  <li className="py-2 px-1 border-b border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaRegUser className="text-teal-500" />
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li className="py-2 px-1 border-b border-gray-100">
                    <Link
                      to="/orders"
                      className="flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaClipboardList className="text-teal-500" />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li className="py-2 px-1 border-b border-gray-100">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-500"
                    >
                      <FaSignOutAlt />
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-teal-500 text-white py-2 px-4 rounded-full block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
