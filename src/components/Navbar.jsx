import { useState } from "react";
import { FaSearch, FaShoppingCart, FaBars, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logobgremove.png"; // Adjust path as needed

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
          </div>

          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-48 text-sm z-50">
              {[
                "electronics",
                "fashion",
                "home-appliances",
                "accessories",
                "toys",
                "sports",
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

        {/* Sign In/Register Button */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 shadow-sm"
        >
          <FaUser className="text-gray-500" />
          <span className="font-medium">Sign In / Register</span>
        </Link>

        {/* Cart Button */}
        <Link
          to="/cart"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 shadow-sm"
        >
          <FaShoppingCart className="text-gray-500" />
          <span className="font-medium">Cart</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
