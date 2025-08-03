import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaDownload,
  FaSync,
  FaFilter,
  FaTruck,
  FaCheck,
  FaBan,
  FaEdit,
  FaPrint,
  FaTrash,
  FaTags,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import { useOrder } from "../../utils/OrderContext";
import OrdersAnalytics from "../../components/admin/OrdersAnalytics";

const AdminOrders = () => {
  const {
    orders,
    updateOrderStatus,
    addTrackingInfo,
    getAdminOrdersData,
    refreshAllOrders,
  } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditTrackingOpen, setIsEditTrackingOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showAnalytics, setShowAnalytics] = useState(true);

  useEffect(() => {
    const loadOrdersData = () => {
      console.log("Loading admin orders data");
      const adminOrders = getAdminOrdersData();
      setFilteredOrders(adminOrders);
    };

    loadOrdersData();
  }, [orders]);

  useEffect(() => {
    const handleOrderUpdate = (event) => {
      console.log("Order update event received:", event.detail);
      setIsLoading(true);

      setTimeout(() => {
        const refreshedOrders = getAdminOrdersData();
        console.log("Refreshed orders:", refreshedOrders);
        setFilteredOrders(refreshedOrders);
        setIsLoading(false);

        if (
          selectedOrder &&
          event.detail.orderId === selectedOrder.id &&
          event.detail.updatedOrder
        ) {
          setSelectedOrder(event.detail.updatedOrder);
        }
      }, 100);
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [selectedOrder]);

  useEffect(() => {
    console.log("Filtering orders with filters:", {
      statusFilter,
      dateFilter,
      searchTerm,
    });

    const adminOrders = getAdminOrdersData();
    let filtered = [...adminOrders];

    // status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.status &&
          order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter((order) => {
        const orderDate = order.date ? new Date(order.date) : null;
        if (!orderDate) return false;

        switch (dateFilter) {
          case "today":
            return orderDate >= today;
          case "yesterday":
            return orderDate >= yesterday && orderDate < today;
          case "week":
            return orderDate >= lastWeek;
          case "month":
            return orderDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          (order.id &&
            order.id
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (order.customerName &&
            order.customerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (order.customerEmail &&
            order.customerEmail
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (order.status &&
            order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.trackingNumber &&
            order.trackingNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aValue = a.date ? new Date(a.date).getTime() : 0;
          bValue = b.date ? new Date(b.date).getTime() : 0;
        } else if (sortConfig.key === "total") {
          aValue = parseFloat(a.total || 0);
          bValue = parseFloat(b.total || 0);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    console.log("Setting filtered orders:", filtered.length);
    setFilteredOrders(filtered);
  }, [
    searchTerm,
    statusFilter,
    dateFilter,
    sortConfig,

    // Remove getAdminOrdersData from dependencies to avoid deep comparisons
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);

    setTrackingNumber(order.trackingNumber || "");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = (orderId, newStatus) => {
    setIsLoading(true);

    setTimeout(() => {
      console.log(`Updating order ${orderId} to status ${newStatus}`);

      const updatedOrder = updateOrderStatus(
        orderId,
        newStatus,
        trackingNumber || undefined
      );

      console.log("Updated order:", updatedOrder);

      if (trackingNumber && newStatus === "Shipped") {
        const trackingData = {
          carrier: "Shopfinity Express",
          trackingNumber,
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
        };

        console.log(`Adding tracking info for order ${orderId}:`, trackingData);
        addTrackingInfo(orderId, trackingData);
      }

      setIsLoading(false);
      alert(`Order ${orderId} status updated to ${newStatus}`);

      if (isEditTrackingOpen) {
        setIsEditTrackingOpen(false);
      }
    }, 800);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedOrderIds.length === 0) {
      alert("Please select an action and at least one order");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log(
        `Processing bulk action ${bulkAction} for ${selectedOrderIds.length} orders`
      );

      selectedOrderIds.forEach((orderId) => {
        if (bulkAction === "mark-shipped") {
          updateOrderStatus(orderId, "Shipped");
        } else if (bulkAction === "mark-delivered") {
          updateOrderStatus(orderId, "Delivered");
        } else if (bulkAction === "mark-cancelled") {
          updateOrderStatus(orderId, "Cancelled");
        }
      });

      const orderCount = selectedOrderIds.length;
      setSelectedOrderIds([]);
      setBulkAction("");
      setIsLoading(false);
      alert(`${orderCount} orders updated successfully`);
    }, 1000);
  };

  const handleOrderSelection = (orderId) => {
    setSelectedOrderIds((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map((order) => order.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColorClass = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <FaSync />;

    switch (status.toLowerCase()) {
      case "processing":
        return <FaSync />;
      case "shipped":
        return <FaTruck />;
      case "delivered":
        return <FaCheck />;
      case "cancelled":
        return <FaBan />;
      default:
        return <FaSync />;
    }
  };

  const formatOrderItems = (items) => {
    if (!items || items.length === 0) return "No items";

    if (items.length <= 2) {
      return items.map((item) => item.name).join(", ");
    }

    return `${items[0].name}, ${items[1].name}, +${items.length - 2} more`;
  };

  const exportOrdersAsCSV = () => {
    let csvContent = "Order ID,Date,Customer,Status,Items,Total\n";

    filteredOrders.forEach((order) => {
      const row = [
        order.id || "",
        formatDate(order.date),
        order.customerName || "",
        order.status || "Processing",
        formatOrderItems(order.items),
        order.total || 0,
      ];

      const sanitizedRow = row.map((field) => {
        const fieldStr = String(field);
        return fieldStr.includes(",") ? `"${fieldStr}"` : fieldStr;
      });

      csvContent += sanitizedRow.join(",") + "\n";
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `shopfinity_orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600 text-lg">
                  {filteredOrders.length} orders found
                </p>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">
                  Live Updates
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className={`${
                  showAnalytics
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-200"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-200"
                } text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                {showAnalytics ? (
                  <FaChartLine className="text-lg" />
                ) : (
                  <FaChartBar className="text-lg" />
                )}
                <span>
                  {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                </span>
              </button>

              <button
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200"
                onClick={() => {
                  setIsLoading(true);
                  console.log("Manual refresh triggered");
                  setTimeout(() => {
                    refreshAllOrders();
                    const freshOrders = getAdminOrdersData();
                    console.log("Fresh orders loaded:", freshOrders.length);
                    setFilteredOrders(freshOrders);
                    setIsLoading(false);
                    alert("Orders refreshed successfully!");
                  }, 300);
                }}
                disabled={isLoading}
              >
                <FaSync
                  className={`text-lg ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh Orders</span>
              </button>

              <button
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-emerald-200"
                onClick={exportOrdersAsCSV}
              >
                <FaDownload className="text-lg" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Search & Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/*Search Input */}
            <div className="relative col-span-1 md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders, customers, tracking numbers..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-4 pl-12 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="w-full px-5 py-4 pl-12 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="w-full px-5 py-4 pl-12 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/*Bulk Actions Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Bulk Actions
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Action</option>
                <option value="mark-shipped">Mark as Shipped</option>
                <option value="mark-delivered">Mark as Delivered</option>
                <option value="mark-cancelled">Mark as Cancelled</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedOrderIds.length === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  !bulkAction || selectedOrderIds.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                }`}
              >
                Apply to {selectedOrderIds.length} orders
              </button>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden mb-8 ${
            showAnalytics ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <OrdersAnalytics orders={filteredOrders} />
          </div>
        </div>

        {/*Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Orders Overview
            </h3>
            <p className="text-gray-500 mt-1">
              Manage and track all your orders
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllOrders}
                      className="w-4 h-4 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Order ID</span>
                      {sortConfig.key === "id" && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortConfig.key === "date" && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total</span>
                      {sortConfig.key === "total" && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortConfig.key === "status" && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">
                          Loading orders...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.id || index}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => handleOrderSelection(order.id)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            #{order.id || `ORD-${1000 + index}`}
                          </span>
                          {order.trackingNumber && (
                            <div className="flex items-center space-x-1 mt-1">
                              <FaTruck className="text-xs text-blue-500" />
                              <span className="text-xs text-blue-600 font-medium">
                                {order.trackingNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400 text-sm" />
                          <span className="text-sm text-gray-600 font-medium">
                            {formatDate(order.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(order.customerName || `Customer ${index + 1}`)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {order.customerName || `Customer ${index + 1}`}
                            </div>
                            {order.customerEmail && (
                              <div className="text-xs text-gray-500">
                                {order.customerEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          <span className="font-medium">
                            {formatOrderItems(order.items)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColorClass(
                            order.status
                          )}`}
                        >
                          <span className="mr-1.5">
                            {getStatusIcon(order.status)}
                          </span>
                          {order.status || "Processing"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View Order Details"
                          >
                            <FaEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsEditTrackingOpen(true);
                              setTrackingNumber(order.trackingNumber || "");
                            }}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200"
                            title="Update Tracking"
                          >
                            <FaTruck className="text-lg" />
                          </button>
                          <button
                            onClick={() =>
                              alert("Order print functionality would go here")
                            }
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Print Order"
                          >
                            <FaPrint className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaSearch className="text-2xl text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            No orders found
                          </h3>
                          <p className="text-gray-500">
                            Try adjusting your search criteria or filters
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-indigo-100 mt-1">
                      #{selectedOrder.id || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:bg-opacity-30"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <FaEye className="text-white text-sm" />
                      </div>
                      Order Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-semibold text-gray-900">
                          #{selectedOrder.id || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(selectedOrder.date)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColorClass(
                            selectedOrder.status
                          )}`}
                        >
                          <span className="mr-1.5">
                            {getStatusIcon(selectedOrder.status)}
                          </span>
                          {selectedOrder.status || "Processing"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          <FaCheck className="mr-1.5" />
                          {selectedOrder.paymentStatus || "Paid"}
                        </span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tracking:</span>
                          <div className="flex items-center space-x-2">
                            <FaTruck className="text-blue-500" />
                            <span className="font-mono text-sm font-semibold text-blue-600">
                              {selectedOrder.trackingNumber}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedOrder.customerName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.customerEmail || "N/A"}
                        </span>
                      </div>
                      {selectedOrder.address && (
                        <div>
                          <span className="text-gray-600 block mb-2">
                            Address:
                          </span>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-800 font-medium">
                              {selectedOrder.address.street}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.address.city},{" "}
                              {selectedOrder.address.state}{" "}
                              {selectedOrder.address.zip}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <FaTags className="text-white text-sm" />
                      </div>
                      Order Items
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {selectedOrder.items &&
                        selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {item.name}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-700 font-medium">
                                  {formatCurrency(item.price)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-900 font-bold text-lg">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FaTags className="text-gray-400 text-xl" />
                                </div>
                                <p className="text-gray-500 font-medium">
                                  No items found
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr className="border-t-2 border-gray-200">
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-right font-semibold text-gray-700"
                          >
                            Subtotal:
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {formatCurrency(selectedOrder.total || 0)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-right font-semibold text-gray-700"
                          >
                            Tax (6%):
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {formatCurrency((selectedOrder.total || 0) * 0.06)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-right font-semibold text-gray-700"
                          >
                            Shipping:
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {formatCurrency(5.99)}
                          </td>
                        </tr>
                        <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t-2 border-emerald-200">
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-right font-bold text-lg text-emerald-800"
                          >
                            Grand Total:
                          </td>
                          <td className="px-6 py-4 font-bold text-xl text-emerald-900">
                            {formatCurrency(
                              (selectedOrder.total || 0) * 1.06 + 5.99
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <FaEdit className="text-white text-sm" />
                    </div>
                    Quick Actions
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Update Order Status
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          defaultValue={selectedOrder.status || "Processing"}
                          className="px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all duration-300"
                          id="status-select"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                          onClick={() => {
                            const select =
                              document.getElementById("status-select");
                            const newStatus = select.value;
                            handleStatusChange(selectedOrder.id, newStatus);
                          }}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tracking Number
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                          className="flex-1 min-w-[200px] px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all duration-300"
                        />
                        <button
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-200"
                          onClick={() => {
                            if (trackingNumber) {
                              handleStatusChange(
                                selectedOrder.id,
                                selectedOrder.status || "Processing"
                              );
                            }
                          }}
                        >
                          Save Tracking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex flex-wrap justify-between items-center gap-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </button>
                <div className="flex space-x-3">
                  <button
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-emerald-200"
                    onClick={() =>
                      alert(
                        `Order ${selectedOrder.id || "N/A"} details printed!`
                      )
                    }
                  >
                    <FaPrint />
                    <span>Print Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditTrackingOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Update Tracking</h2>
                    <p className="text-orange-100 mt-1">
                      Order #{selectedOrder.id || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditTrackingOpen(false)}
                    className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:bg-opacity-30"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Order ID:</span>
                    <span className="font-bold text-gray-900">
                      #{selectedOrder.id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Current Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColorClass(
                        selectedOrder.status
                      )}`}
                    >
                      <span className="mr-1.5">
                        {getStatusIcon(selectedOrder.status)}
                      </span>
                      {selectedOrder.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Shipping Carrier
                    </label>
                    <select
                      className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                      defaultValue="Shopfinity Express"
                    >
                      <option value="Shopfinity Express">
                        Shopfinity Express
                      </option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="USPS">USPS</option>
                      <option value="DHL">DHL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="update-status"
                          type="checkbox"
                          className="w-4 h-4 rounded border-2 border-yellow-300 text-yellow-600 focus:ring-yellow-500 focus:ring-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="update-status"
                          className="ml-3 text-sm font-medium text-yellow-800"
                        >
                          Also update status to Shipped
                        </label>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status === "Processing" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                      <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-1">
                          Status Update Notice
                        </h4>
                        <p className="text-sm text-amber-700">
                          This order is currently in Processing status. Adding a
                          tracking number will automatically update it to
                          Shipped.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-between items-center">
                <button
                  onClick={() => setIsEditTrackingOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                  onClick={() => {
                    const updateStatus =
                      document.getElementById("update-status").checked;
                    if (updateStatus) {
                      handleStatusChange(selectedOrder.id, "Shipped");
                    } else if (trackingNumber) {
                      const updatedStatus =
                        selectedOrder.status || "Processing";
                      handleStatusChange(selectedOrder.id, updatedStatus);
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
