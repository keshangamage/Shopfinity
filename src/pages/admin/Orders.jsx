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
  const { orders, updateOrderStatus, addTrackingInfo, getAdminOrdersData } =
    useOrder();
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
    const adminOrders = getAdminOrdersData();
    setFilteredOrders(adminOrders);
  }, [orders, getAdminOrdersData]);

  useEffect(() => {
    let filtered = [...orders];

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

    setFilteredOrders(filtered);
  }, [
    searchTerm,
    orders,
    statusFilter,
    dateFilter,
    sortConfig,
    getAdminOrdersData,
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
      const updatedOrder = updateOrderStatus(
        orderId,
        newStatus,
        trackingNumber || undefined
      );

      if (trackingNumber && newStatus === "Shipped") {
        addTrackingInfo(orderId, {
          carrier: "Shopfinity Express",
          trackingNumber,
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
        });
      }

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
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
      selectedOrderIds.forEach((orderId) => {
        if (bulkAction === "mark-shipped") {
          updateOrderStatus(orderId, "Shipped");
        } else if (bulkAction === "mark-delivered") {
          updateOrderStatus(orderId, "Delivered");
        } else if (bulkAction === "mark-cancelled") {
          updateOrderStatus(orderId, "Cancelled");
        }
      });

      setIsLoading(false);
      setSelectedOrderIds([]);
      setBulkAction("");
      alert(`${selectedOrderIds.length} orders updated successfully`);
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredOrders.length} orders found
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className={`${
              showAnalytics ? "bg-purple-700" : "bg-purple-600"
            } hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center`}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? (
              <FaChartLine className="mr-2" />
            ) : (
              <FaChartBar className="mr-2" />
            )}
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                alert("Orders synchronized successfully!");
              }, 1000);
            }}
          >
            <FaSync className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Sync Orders
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={exportOrdersAsCSV}
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Search by order ID, customer, status or tracking number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 appearance-none pl-10"
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 appearance-none pl-10"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          <option value="">Bulk Actions</option>
          <option value="mark-shipped">Mark as Shipped</option>
          <option value="mark-delivered">Mark as Delivered</option>
          <option value="mark-cancelled">Mark as Cancelled</option>
        </select>
        <button
          onClick={handleBulkAction}
          disabled={!bulkAction || selectedOrderIds.length === 0}
          className={`px-4 py-2 rounded-md ${
            !bulkAction || selectedOrderIds.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Apply ({selectedOrderIds.length} selected)
        </button>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden mb-6 ${
          showAnalytics ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <OrdersAnalytics orders={filteredOrders} />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllOrders}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Order ID
                  {sortConfig.key === "id" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortConfig.key === "date" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  Total
                  {sortConfig.key === "total" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig.key === "status" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <FaSync className="animate-spin inline mr-2" /> Loading
                    orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(order.id)}
                        onChange={() => handleOrderSelection(order.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium">
                        #{order.id || `ORD-${1000 + index}`}
                      </span>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName || `Customer ${index + 1}`}
                        </div>
                        {order.customerEmail && (
                          <div className="text-xs text-gray-500">
                            {order.customerEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {formatOrderItems(order.items)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total || 0)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
                          order.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(order.status)}
                        </span>
                        {order.status || "Processing"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditTrackingOpen(true);
                            setTrackingNumber(order.trackingNumber || "");
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Update Tracking"
                        >
                          <FaTruck />
                        </button>
                        <button
                          onClick={() =>
                            alert("Order print functionality would go here")
                          }
                          className="text-gray-600 hover:text-gray-900"
                          title="Print Order"
                        >
                          <FaPrint />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Order Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Order ID:</strong> {selectedOrder.id || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date:</strong> {formatDate(selectedOrder.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColorClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status || "Processing"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.paymentStatus || "Paid"}
                  </p>
                  {selectedOrder.trackingNumber && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Customer Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Name:</strong> {selectedOrder.customerName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong>{" "}
                    {selectedOrder.customerEmail || "N/A"}
                  </p>
                  {selectedOrder.address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Address:</strong>
                      </p>
                      <p className="text-sm text-gray-600 ml-2">
                        {selectedOrder.address.street}
                        <br />
                        {selectedOrder.address.city},{" "}
                        {selectedOrder.address.state}{" "}
                        {selectedOrder.address.zip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mb-3">Items</h3>
              <table className="min-w-full mb-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Subtotal:
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(selectedOrder.total || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Tax:
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency((selectedOrder.total || 0) * 0.06)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Shipping:
                    </td>
                    <td className="px-4 py-3">{formatCurrency(5.99)}</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right font-semibold text-lg"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 font-semibold text-lg">
                      {formatCurrency((selectedOrder.total || 0) * 1.06 + 5.99)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Update Status
                </h3>
                <div className="flex items-center space-x-3">
                  <select
                    defaultValue={selectedOrder.status || "Processing"}
                    className="border rounded-md px-3 py-2"
                    id="status-select"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      const select = document.getElementById("status-select");
                      const newStatus = select.value;
                      handleStatusChange(selectedOrder.id, newStatus);
                    }}
                  >
                    Update
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="border rounded-md px-3 py-2 flex-1"
                    />
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
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

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md mr-2"
              >
                Close
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() =>
                  alert(`Order ${selectedOrder.id || "N/A"} details printed!`)
                }
              >
                <FaPrint className="mr-2" />
                Print Details
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditTrackingOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Update Tracking Information
              </h2>
              <button
                onClick={() => setIsEditTrackingOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Order ID:</strong> {selectedOrder.id || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColorClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status || "Processing"}
                </span>
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Carrier
              </label>
              <select
                className="w-full border rounded-md px-3 py-2 mb-4"
                defaultValue="Shopfinity Express"
              >
                <option value="Shopfinity Express">Shopfinity Express</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full border rounded-md px-3 py-2 mb-4"
              />

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="update-status"
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="update-status"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Also update status to Shipped
                  </label>
                </div>
              </div>

              {selectedOrder.status === "Processing" && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-start">
                  <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    This order is currently in Processing status. Adding a
                    tracking number will automatically update it to Shipped.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditTrackingOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  const updateStatus =
                    document.getElementById("update-status").checked;
                  if (updateStatus) {
                    handleStatusChange(selectedOrder.id, "Shipped");
                  } else if (trackingNumber) {
                    const updatedStatus = selectedOrder.status || "Processing";
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
  );
};

export default AdminOrders;
