import React, { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext.jsx";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Redirect if not admin
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  // Check if the current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { path: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin/products", icon: <FaBox />, label: "Products" },
    { path: "/admin/orders", icon: <FaShoppingBag />, label: "Orders" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-10 transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-20"
        } lg:relative`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {sidebarOpen && (
            <h2 className="text-lg font-bold">Shopfinity Admin</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${
                    isActive(item.path) ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="text-xl">{item.icon}</div>
                  {sidebarOpen && <span className="ml-4">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-md hover:bg-gray-700 text-gray-300"
            >
              <FaSignOutAlt />
              {sidebarOpen && <span className="ml-4">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "ml-56" : "ml-20"
        } lg:ml-0`}
      >
        {/* Topbar */}
        <header className="bg-white shadow h-16 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 focus:outline-none"
            >
              <FaBars />
            </button>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>

          <div className="ml-auto flex items-center">
            <div className="flex items-center mr-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {currentUser.displayName
                  ? currentUser.displayName.charAt(0)
                  : currentUser.email.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-gray-700">
                {currentUser.displayName || currentUser.email}
              </span>
            </div>
            <Link to="/" className="text-blue-600 hover:underline">
              Return to Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
