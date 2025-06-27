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
} from "react-icons/fa";
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefreshed.toLocaleTimeString()}
            <button
              onClick={handleRefresh}
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              disabled={refreshing}
            >
              <FaSync
                className={`inline ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              className="bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 appearance-none"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customers">Customer Report</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaTag className="text-gray-400" />
            </div>
          </div>
          <button
            className={`flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
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
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FaBox />
          </div>
          <div>
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
            <div className="text-xs text-gray-400 mt-1">
              All active products
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FaShoppingBag />
          </div>
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{analytics.totalOrders || 0}</p>
            <div className="text-xs text-gray-400 mt-1">
              Excluding cancelled orders
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <div className="bg-purple-500 rounded-full p-3 mr-4 text-white">
            <FaUsers />
          </div>
          <div>
            <p className="text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{analytics.customerCount || 0}</p>
            <div className="text-xs text-gray-400 mt-1">
              Unique customer accounts
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <div className="bg-yellow-500 rounded-full p-3 mr-4 text-white">
            <FaChartLine />
          </div>
          <div>
            <p className="text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(analytics.totalSales || 0)}
            </p>
            <div className="flex items-center">
              <span
                className={`text-xs ${
                  analytics.salesGrowth >= 0 ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                {analytics.salesGrowth >= 0 ? "+" : ""}
                {analytics.salesGrowth}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                className={`px-3 py-1 rounded-md ${
                  activeTab === "daily" ? "bg-white shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("daily")}
              >
                Daily
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  activeTab === "weekly" ? "bg-white shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  activeTab === "monthly" ? "bg-white shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-1 mt-8">
            {getChartData().map((value, index) => {
              const maxValue = Math.max(
                ...getChartData().filter((v) => v > 0),
                1
              );
              const height = value ? (value / maxValue) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 group"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600 relative"
                    style={{ height: `${Math.max(height, 1)}%` }}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {formatCurrency(value)}
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-2">
                    {getChartLabels()[index]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.averageOrderValue || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.orderConversionRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Growth</p>
              <p
                className={`text-2xl font-bold ${
                  analytics.salesGrowth >= 0
                    ? "text-purple-600"
                    : "text-red-600"
                }`}
              >
                {analytics.salesGrowth >= 0 ? "+" : ""}
                {analytics.salesGrowth}%
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block bg-blue-50 hover:bg-blue-100 p-4 rounded-md flex justify-between items-center"
            >
              <span className="font-medium">Manage Products</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {products.length}
              </span>
            </Link>
            <Link
              to="/admin/orders"
              className="block bg-green-50 hover:bg-green-100 p-4 rounded-md flex justify-between items-center"
            >
              <span className="font-medium">Process Orders</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {analytics.totalOrders || 0}
              </span>
            </Link>
            <Link
              to="/admin/users"
              className="block bg-purple-50 hover:bg-purple-100 p-4 rounded-md flex justify-between items-center"
            >
              <span className="font-medium">Manage Users</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {analytics.customerCount || 0}
              </span>
            </Link>

            {analytics.lowStockItems && analytics.lowStockItems.length > 0 && (
              <div className="bg-red-50 p-4 rounded-md border border-red-100">
                <div className="flex items-center mb-2">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  <span className="font-medium text-red-800">
                    Low Stock Alert
                  </span>
                </div>
                <p className="text-sm text-red-600 mb-2">
                  {analytics.lowStockItems.length} products need attention
                </p>
                <Link
                  to="/admin/products"
                  className="text-red-700 text-sm hover:underline"
                >
                  Review Inventory →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
                  analytics.recentOrders.map((order, idx) => (
                    <tr key={order.id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          to={`/admin/orders?id=${
                            order.id || `ORD-${1000 + idx}`
                          }`}
                          className="text-blue-600 hover:underline"
                        >
                          #{order.id || `ORD-${1000 + idx}`}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {order.customerName || "Customer"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {formatCurrency(order.total || 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:underline text-sm"
            >
              View All Orders →
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Status</h2>
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Operational
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="flex items-center">
                  <FaDatabase className="text-gray-400 mr-2" size={14} />
                  Database
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${getStatusColor(
                    systemStatus.database
                  )}`}
                >
                  {systemStatus.database}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "98%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="flex items-center">
                  <FaCreditCard className="text-gray-400 mr-2" size={14} />
                  Payment Gateway
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${getStatusColor(
                    systemStatus.paymentGateway
                  )}`}
                >
                  {systemStatus.paymentGateway}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="flex items-center">
                  <FaShoppingBag className="text-gray-400 mr-2" size={14} />
                  Order Processing
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${getStatusColor(
                    systemStatus.orderProcessing
                  )}`}
                >
                  {systemStatus.orderProcessing}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "99%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="flex items-center">
                  <FaServer className="text-gray-400 mr-2" size={14} />
                  Server Load
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    systemStatus.serverLoad > 80
                      ? "bg-red-100 text-red-800"
                      : systemStatus.serverLoad > 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {systemStatus.serverLoad}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    systemStatus.serverLoad > 80
                      ? "bg-red-500"
                      : systemStatus.serverLoad > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${systemStatus.serverLoad}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Storage</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    systemStatus.storageUsed > 90
                      ? "bg-red-100 text-red-800"
                      : systemStatus.storageUsed > 70
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {systemStatus.storageUsed}% Used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    systemStatus.storageUsed > 90
                      ? "bg-red-500"
                      : systemStatus.storageUsed > 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${systemStatus.storageUsed}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Response Time</span>
                <span
                  className={`px-2 py-0.5 rounded ${
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
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    systemStatus.responseTime > 300
                      ? "bg-red-500"
                      : systemStatus.responseTime > 200
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(100, systemStatus.responseTime / 5)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  Last update
                </span>
                <span className="text-gray-500">
                  {lastRefreshed.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Units Sold
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topSellingProducts &&
              analytics.topSellingProducts.length > 0 ? (
                analytics.topSellingProducts.map((product) => {
                  const stockItem = analytics.inventoryStatus?.find(
                    (item) => item.id === product.id
                  );
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {product.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatCurrency(product.total)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {stockItem && (
                          <span
                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              stockItem.isLowStock
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {stockItem.isLowStock ? "Low Stock" : "In Stock"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to="/admin/products"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No product data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
