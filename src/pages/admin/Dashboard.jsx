import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaFileDownload,
  FaSync,
  FaCalendarAlt,
  FaTag,
  FaServer,
  FaDatabase,
  FaCreditCard,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAdmin } from "../../utils/AdminContext.jsx";
import { useProducts } from "../../utils/ProductContext.jsx";

const Dashboard = () => {
  const {
    analytics,
    systemStatus,
    generateReport,
    refreshData,
    lastRefreshed,
  } = useAdmin();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState("daily");
  const [reportType, setReportType] = useState("sales");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshData();
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  // Handle report generation
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const report = generateReport(reportType);
      console.log("Generated Report:", report);

      setIsGeneratingReport(false);
      alert(`${report.title} generated successfully!`);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "online":
      case "running":
        return "bg-green-100 text-green-800";
      case "maintenance":
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getChartData = () => {
    switch (activeTab) {
      case "daily":
        return analytics.dailySalesData || [];
      case "weekly":
        return analytics.weeklySalesData || [];
      case "monthly":
        return analytics.monthlySalesData || [];
      default:
        return [];
    }
  };

  const getChartLabels = () => {
    switch (activeTab) {
      case "daily":
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.getDate();
        });
      case "weekly":
        return Array.from({ length: 12 }, (_, i) => `Week ${12 - i}`);
      case "monthly":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 max-w-7xl bg-gradient-to-br from-gray-50 to-white min-h-screen"
    >
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-white shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <span className="flex items-center bg-blue-50/70 backdrop-blur-sm text-blue-700 px-3 py-1.5 rounded-full text-xs border border-blue-100/50">
              <FaCalendarAlt className="mr-2" size={12} />
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="ml-3 text-blue-600 hover:text-blue-800 focus:outline-none transition-all duration-200 hover:scale-110 bg-blue-50/50 backdrop-blur-sm p-1.5 rounded-full border border-blue-100/30"
              disabled={refreshing}
            >
              <FaSync
                className={`${refreshing ? "animate-spin" : ""}`}
                size={14}
              />
            </motion.button>
          </p>
        </motion.div>
        <motion.div
          className="flex gap-4 w-full md:w-auto"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative flex-1 md:flex-auto">
            <select
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl px-4 py-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customers">Customer Report</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <div className="bg-blue-50/80 p-1.5 rounded-full">
                <FaTag className="text-blue-500" size={12} />
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-200 ${
              isGeneratingReport ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <FaSync className="animate-spin mr-2" />
            ) : (
              <FaFileDownload className="mr-2" />
            )}
            Generate Report
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-6 flex items-center overflow-hidden relative border border-white hover:shadow-blue-100 transition-all duration-300"
          whileHover={{ y: -7, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-blue-400/10 to-blue-600/20 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-gradient-to-tr from-blue-400/10 to-blue-600/20 rounded-full blur-2xl"></div>
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-4 mr-5 text-white shadow-lg flex items-center justify-center z-10">
            <FaBox size={18} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Total Products</p>
            <motion.p
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {products.length}
            </motion.p>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-1.5"></div>
              All active products
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-6 flex items-center overflow-hidden relative border border-white hover:shadow-green-100 transition-all duration-300"
          whileHover={{ y: -7, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-green-400/10 to-green-600/20 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-gradient-to-tr from-green-400/10 to-green-600/20 rounded-full blur-2xl"></div>
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-4 mr-5 text-white shadow-lg flex items-center justify-center z-10">
            <FaShoppingBag size={18} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Total Orders</p>
            <motion.p
              className="text-2xl font-extrabold bg-gradient-to-r from-green-700 to-green-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {analytics.totalOrders || 0}
            </motion.p>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mr-1.5"></div>
              Excluding cancelled orders
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-6 flex items-center overflow-hidden relative border border-white hover:shadow-purple-100 transition-all duration-300"
          whileHover={{ y: -7, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-purple-400/10 to-purple-600/20 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-gradient-to-tr from-purple-400/10 to-purple-600/20 rounded-full blur-2xl"></div>
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-4 mr-5 text-white shadow-lg flex items-center justify-center z-10">
            <FaUsers size={18} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Total Customers</p>
            <motion.p
              className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 to-purple-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {analytics.customerCount || 0}
            </motion.p>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 mr-1.5"></div>
              Unique customer accounts
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-6 flex items-center overflow-hidden relative border border-white hover:shadow-amber-100 transition-all duration-300"
          whileHover={{ y: -7, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-amber-400/10 to-amber-600/20 rounded-full transform translate-x-16 -translate-y-16 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-gradient-to-tr from-amber-400/10 to-amber-600/20 rounded-full blur-2xl"></div>
          <div className="bg-gradient-to-br from-amber-500 via-amber-500 to-orange-500 rounded-2xl p-4 mr-5 text-white shadow-lg flex items-center justify-center z-10">
            <FaChartLine size={18} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Revenue</p>
            <motion.p
              className="text-2xl font-extrabold bg-gradient-to-r from-amber-700 to-amber-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {formatCurrency(analytics.totalSales || 0)}
            </motion.p>
            <div className="flex items-center">
              <span
                className={`text-xs ${
                  analytics.salesGrowth >= 0 ? "text-green-600" : "text-red-600"
                } font-medium flex items-center`}
              >
                {analytics.salesGrowth >= 0 ? (
                  <FaArrowUp className="mr-1" size={10} />
                ) : (
                  <FaArrowDown className="mr-1" size={10} />
                )}
                {analytics.salesGrowth >= 0 ? "+" : ""}
                {analytics.salesGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sales Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <motion.div
          className="lg:col-span-2 bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-7 border border-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text mb-3 sm:mb-0">
              <div className="flex items-center">
                <div className="h-6 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                Sales Overview
              </div>
            </h2>
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-inner w-full sm:w-auto border border-gray-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "daily"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("daily")}
              >
                Daily
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "weekly"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("weekly")}
              >
                Weekly
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "monthly"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("monthly")}
              >
                Monthly
              </motion.button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50/30 to-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-inner">
            <div className="-mx-2 overflow-x-auto pb-2">
              <div className="h-64 min-w-[640px] sm:min-w-full flex items-end justify-between gap-1.5 mt-4 px-2">
                {getChartData().map((value, index) => {
                  const maxValue = Math.max(
                    ...getChartData().filter((v) => v > 0),
                    1
                  );
                  const height = value ? (value / maxValue) * 100 : 0;
                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center flex-1 group"
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ duration: 0.5, delay: 0.05 * index }}
                    >
                      <div className="relative w-full">
                        <motion.div
                          className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-indigo-500 shadow-lg"
                          style={{ height: `${Math.max(height, 1)}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(height, 1)}%` }}
                          transition={{
                            duration: 0.7,
                            delay: 0.1 * index,
                            ease: "easeOut",
                          }}
                        >
                          <motion.div
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-medium rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 shadow-lg whitespace-nowrap z-10 transition-all duration-200 border border-blue-100/50"
                            whileHover={{ y: -2, scale: 1.05 }}
                          >
                            {formatCurrency(value)}
                          </motion.div>
                        </motion.div>
                      </div>
                      <div className="text-xs font-medium mt-2.5 text-gray-600">
                        {getChartLabels()[index]}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/80"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-sm text-blue-600 font-medium mb-1.5 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Average Order
              </p>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text flex items-end">
                {formatCurrency(analytics.averageOrderValue || 0)}
                <span className="text-xs text-gray-500 ml-1.5 mb-0.5">
                  per order
                </span>
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/80"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-sm text-green-600 font-medium mb-1.5 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Conversion Rate
              </p>
              <p className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 text-transparent bg-clip-text flex items-end">
                {analytics.orderConversionRate.toFixed(1)}%
                <span className="text-xs text-gray-500 ml-1.5 mb-0.5">
                  of visits
                </span>
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/80"
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-sm text-purple-600 font-medium mb-1.5 flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                Growth Rate
              </p>
              <p
                className={`text-xl font-bold flex items-end ${
                  analytics.salesGrowth >= 0
                    ? "bg-gradient-to-r from-purple-700 to-purple-500 text-transparent bg-clip-text"
                    : "bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text"
                }`}
              >
                {analytics.salesGrowth >= 0 ? (
                  <FaArrowUp
                    className="mr-1.5 mb-0.5 text-purple-600"
                    size={14}
                  />
                ) : (
                  <FaArrowDown
                    className="mr-1.5 mb-0.5 text-red-600"
                    size={14}
                  />
                )}
                {analytics.salesGrowth >= 0 ? "+" : ""}
                {analytics.salesGrowth}%
                <span className="text-xs text-gray-500 ml-1.5 mb-0.5">
                  monthly
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-7 border border-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
          }}
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text mb-6 flex items-center">
            <div className="h-6 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-3"></div>
            Quick Actions
          </h2>
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/admin/products"
                className="block bg-gradient-to-r from-blue-400/10 to-blue-600/10 hover:from-blue-400/20 hover:to-blue-600/20 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 border border-white/80 backdrop-blur-md"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-10 h-10 rounded-xl shadow-md flex items-center justify-center text-white mr-4">
                    <FaBox size={16} />
                  </div>
                  <span className="font-semibold text-blue-800">
                    Manage Products
                  </span>
                </div>
                <span className="bg-white/90 backdrop-blur-sm text-blue-800 text-xs px-3.5 py-2 rounded-xl shadow-sm font-semibold border border-blue-100/30">
                  {products.length}
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/admin/orders"
                className="block bg-gradient-to-r from-green-400/10 to-green-600/10 hover:from-green-400/20 hover:to-green-600/20 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 border border-white/80 backdrop-blur-md"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 rounded-xl shadow-md flex items-center justify-center text-white mr-4">
                    <FaShoppingBag size={16} />
                  </div>
                  <span className="font-semibold text-green-800">
                    Process Orders
                  </span>
                </div>
                <span className="bg-white/90 backdrop-blur-sm text-green-800 text-xs px-3.5 py-2 rounded-xl shadow-sm font-semibold border border-green-100/30">
                  {analytics.totalOrders || 0}
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/admin/users"
                className="block bg-gradient-to-r from-purple-400/10 to-purple-600/10 hover:from-purple-400/20 hover:to-purple-600/20 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 border border-white/80 backdrop-blur-md"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-10 h-10 rounded-xl shadow-md flex items-center justify-center text-white mr-4">
                    <FaUsers size={16} />
                  </div>
                  <span className="font-semibold text-purple-800">
                    Manage Users
                  </span>
                </div>
                <span className="bg-white/90 backdrop-blur-sm text-purple-800 text-xs px-3.5 py-2 rounded-xl shadow-sm font-semibold border border-purple-100/30">
                  {analytics.customerCount || 0}
                </span>
              </Link>
            </motion.div>

            {analytics.lowStockItems && analytics.lowStockItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-red-400/10 to-red-600/10 p-5 rounded-2xl border border-white/80 shadow-sm mt-5 backdrop-blur-md"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 w-10 h-10 rounded-xl shadow-md flex items-center justify-center text-white mr-4">
                    <FaExclamationTriangle size={16} />
                  </div>
                  <span className="font-semibold bg-gradient-to-r from-red-700 to-red-600 inline-block text-transparent bg-clip-text">
                    Low Stock Alert
                  </span>
                </div>
                <p className="text-sm text-red-700 mb-3.5 ml-1">
                  {analytics.lowStockItems.length} products need attention
                </p>
                <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/admin/products"
                    className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md transition-all duration-200"
                  >
                    Review Inventory
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-7 border border-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
          }}
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 inline-block text-transparent bg-clip-text mb-6 flex items-center">
            <div className="h-6 w-1.5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
            Recent Orders
          </h2>
          <div className="overflow-x-auto rounded-2xl bg-white/40 backdrop-blur-sm border border-white p-2">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-xl bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-xl bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/70">
                {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
                  analytics.recentOrders.map((order, idx) => (
                    <motion.tr
                      key={order.id || idx}
                      className="hover:bg-blue-50/30 transition-colors duration-150"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/orders?id=${
                            order.id || `ORD-${1000 + idx}`
                          }`}
                          className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 flex items-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          #{order.id || `ORD-${1000 + idx}`}
                        </Link>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {order.customerName || "Customer"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                        {formatCurrency(order.total || 0)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                            order.status === "Delivered"
                              ? "bg-green-50/70 text-green-800 border border-green-200/50"
                              : order.status === "Shipped"
                              ? "bg-blue-50/70 text-blue-800 border border-blue-200/50"
                              : order.status === "Processing"
                              ? "bg-amber-50/70 text-amber-800 border border-amber-200/50"
                              : "bg-gray-50/70 text-gray-800 border border-gray-200/50"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : order.status === "Shipped"
                                ? "bg-blue-500"
                                : order.status === "Processing"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {order.status || "Processing"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-5 text-center text-gray-500"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <motion.div
            className="mt-7 flex justify-end"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/admin/orders"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              View All Orders
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-7 border border-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text flex items-center">
              <div className="h-6 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
              System Status
            </h2>
            <div className="text-xs bg-green-50/80 text-green-800 px-3.5 py-2 rounded-full flex items-center shadow-sm border border-green-100/50 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-ping absolute inline-flex"></span>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 relative inline-flex"></span>
              Operational
            </div>
          </div>
          <div className="space-y-5 bg-blue-50/40 backdrop-blur-sm p-5 rounded-2xl border border-blue-50/50">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3 shadow-md">
                    <FaDatabase className="text-white" size={14} />
                  </div>
                  Database
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
                    systemStatus.database.toLowerCase() === "online" ||
                    systemStatus.database.toLowerCase() === "running"
                      ? "bg-green-50/70 text-green-800 border-green-100/50"
                      : systemStatus.database.toLowerCase() === "maintenance" ||
                        systemStatus.database.toLowerCase() === "degraded"
                      ? "bg-yellow-50/70 text-yellow-800 border-yellow-100/50"
                      : "bg-red-50/70 text-red-800 border-red-100/50"
                  }`}
                >
                  {systemStatus.database}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  transition={{ delay: 0.9, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.01 }}
              className="mt-4"
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3 shadow-md">
                    <FaCreditCard className="text-white" size={14} />
                  </div>
                  Payment Gateway
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
                    systemStatus.paymentGateway.toLowerCase() === "online" ||
                    systemStatus.paymentGateway.toLowerCase() === "running"
                      ? "bg-green-50/70 text-green-800 border-green-100/50"
                      : systemStatus.paymentGateway.toLowerCase() ===
                          "maintenance" ||
                        systemStatus.paymentGateway.toLowerCase() === "degraded"
                      ? "bg-yellow-50/70 text-yellow-800 border-yellow-100/50"
                      : "bg-red-50/70 text-red-800 border-red-100/50"
                  }`}
                >
                  {systemStatus.paymentGateway}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-green-500 via-green-600 to-teal-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.01 }}
              className="mt-4"
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
                    <FaShoppingBag className="text-white" size={14} />
                  </div>
                  Order Processing
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
                    systemStatus.orderProcessing.toLowerCase() === "online" ||
                    systemStatus.orderProcessing.toLowerCase() === "running"
                      ? "bg-green-50/70 text-green-800 border-green-100/50"
                      : systemStatus.orderProcessing.toLowerCase() ===
                          "maintenance" ||
                        systemStatus.orderProcessing.toLowerCase() ===
                          "degraded"
                      ? "bg-yellow-50/70 text-yellow-800 border-yellow-100/50"
                      : "bg-red-50/70 text-red-800 border-red-100/50"
                  }`}
                >
                  {systemStatus.orderProcessing}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 via-purple-600 to-fuchsia-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "99%" }}
                  transition={{ delay: 1.1, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.01 }}
              className="mt-4"
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div
                    className={`p-2 rounded-lg mr-3 shadow-md ${
                      systemStatus.serverLoad > 80
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : systemStatus.serverLoad > 60
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                  >
                    <FaServer className="text-white" size={14} />
                  </div>
                  Server Load
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
                    systemStatus.serverLoad > 80
                      ? "bg-red-50/70 text-red-800 border-red-100/50"
                      : systemStatus.serverLoad > 60
                      ? "bg-yellow-50/70 text-yellow-800 border-yellow-100/50"
                      : "bg-green-50/70 text-green-800 border-green-100/50"
                  }`}
                >
                  {systemStatus.serverLoad}%
                </span>
              </div>
              <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <motion.div
                  className={`h-3 rounded-full ${
                    systemStatus.serverLoad > 80
                      ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                      : systemStatus.serverLoad > 60
                      ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600"
                      : "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${systemStatus.serverLoad}%` }}
                  transition={{ delay: 1.2, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.01 }}
              className="mt-4"
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div
                    className={`p-2 rounded-lg mr-3 shadow-md ${
                      systemStatus.storageUsed > 90
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : systemStatus.storageUsed > 70
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                  >
                    <FaDatabase className="text-white" size={14} />
                  </div>
                  Storage
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
                    systemStatus.storageUsed > 90
                      ? "bg-red-50/70 text-red-800 border-red-100/50"
                      : systemStatus.storageUsed > 70
                      ? "bg-yellow-50/70 text-yellow-800 border-yellow-100/50"
                      : "bg-green-50/70 text-green-800 border-green-100/50"
                  }`}
                >
                  {systemStatus.storageUsed}% Used
                </span>
              </div>
              <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <motion.div
                  className={`h-3 rounded-full ${
                    systemStatus.storageUsed > 90
                      ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                      : systemStatus.storageUsed > 70
                      ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600"
                      : "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${systemStatus.storageUsed}%` }}
                  transition={{ delay: 1.3, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="flex items-center font-medium text-gray-700">
                  <div className="bg-indigo-100 p-1.5 rounded-md mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-indigo-600"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  Response Time
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    systemStatus.responseTime > 300
                      ? "bg-red-100 text-red-800"
                      : systemStatus.responseTime > 200
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {systemStatus.responseTime} ms
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                <motion.div
                  className={`h-2.5 rounded-full ${
                    systemStatus.responseTime > 300
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : systemStatus.responseTime > 200
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, systemStatus.responseTime / 5)}%`,
                  }}
                  transition={{ delay: 1.4, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-600">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                Last update
              </span>
              <span className="text-gray-700 font-medium bg-blue-50 px-2 py-1 rounded-md text-xs">
                {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Selling Products */}
      <motion.div
        className="mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
          <div className="h-5 w-1 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-3"></div>
          Top Selling Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 rounded-lg">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {analytics.topSellingProducts &&
              analytics.topSellingProducts.length > 0 ? (
                analytics.topSellingProducts.map((product, idx) => {
                  const stockItem = analytics.inventoryStatus?.find(
                    (item) => item.id === product.id
                  );
                  return (
                    <motion.tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx + 1 }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-700 font-medium">
                          {product.quantity} units
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-900 font-semibold">
                          {formatCurrency(product.total)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {stockItem && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              stockItem.isLowStock
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                stockItem.isLowStock
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            {stockItem.isLowStock ? "Low Stock" : "In Stock"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to="/admin/products"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors duration-200"
                        >
                          Edit
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-4 text-center text-gray-500"
                  >
                    No product data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
