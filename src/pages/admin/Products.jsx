import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaDownload,
  FaUpload,
  FaEye,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaPowerOff,
  FaTags,
  FaBoxes,
  FaSync,
} from "react-icons/fa";
import { useProducts } from "../../utils/ProductContext";

const AdminProducts = () => {
  const {
    products,
    isLoading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    resetProducts,
  } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    stock: "",
    status: "active",
    featured: false,
    tags: [],
  });

  // Filter and sort products whenever they change
  useEffect(() => {
    let filtered = [...products];

    // category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category && product.category === categoryFilter
      );
    }

    // status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (product) =>
          (statusFilter === "active" && product.status !== "inactive") ||
          (statusFilter === "inactive" && product.status === "inactive")
      );
    }

    // search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "price" || sortConfig.key === "stock") {
          aValue = parseFloat(a[sortConfig.key] || 0);
          bValue = parseFloat(b[sortConfig.key] || 0);
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

    setFilteredProducts(filtered);
  }, [searchTerm, products, categoryFilter, statusFilter, sortConfig]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openAddModal = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      stock: "",
      status: "active",
      featured: false,
      tags: [],
    });
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setImagePreview(product.imageUrl || product.imgURL);
    setIsEditModalOpen(true);
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setNewProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "tags") {
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setNewProduct((prev) => ({ ...prev, [name]: tagsArray }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "imageUrl" && value) {
      setImagePreview(value);
    }
  };

  const handleEditProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setSelectedProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "tags") {
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setSelectedProduct((prev) => ({ ...prev, [name]: tagsArray }));
    } else {
      setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "imageUrl" && value) {
      setImagePreview(value);
    }
  };

  const handleProductSelection = (productId) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  // Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price) {
      alert("Product name and price are required!");
      return;
    }

    // Create new product with unique ID
    const productToAdd = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id || 0), 0) + 1,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      createdAt: new Date().toISOString(),
      imgURL: newProduct.imageUrl,
    };

    if (!productToAdd.status) {
      productToAdd.status = "active";
    }

    addProduct(productToAdd);
    setIsAddModalOpen(false);
    setImagePreview(null);

    alert("Product added successfully!");
  };

  // Update existing product
  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (!selectedProduct.name || !selectedProduct.price) {
      alert("Product name and price are required!");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      price: parseFloat(selectedProduct.price) || 0,
      stock: parseInt(selectedProduct.stock) || 0,
      updatedAt: new Date().toISOString(),
      imgURL: selectedProduct.imageUrl || selectedProduct.imgURL,
    };

    updateProduct(updatedProduct);
    setIsEditModalOpen(false);
    setImagePreview(null);

    alert("Product updated successfully!");
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      alert("Product deleted successfully!");
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedProductIds.length === 0) {
      alert("Please select an action and at least one product");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (bulkAction === "delete") {
        bulkDeleteProducts(selectedProductIds);
      } else {
        bulkUpdateProducts(selectedProductIds, bulkAction);
      }

      setIsLoading(false);
      setSelectedProductIds([]);
      setBulkAction("");
      alert(`${selectedProductIds.length} products updated successfully`);
    }, 800);
  };

  const handleImagePreview = (url) => {
    setImagePreview(url);
  };

  const exportProductsAsCSV = () => {
    let csvContent = "ID,Name,Description,Price,Category,Stock,Status\n";

    filteredProducts.forEach((product) => {
      const row = [
        product.id || "",
        product.name || "",
        (product.description || "").replace(/,/g, ";"),
        product.price || 0,
        product.category || "",
        product.stock || 0,
        product.status || "active",
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
      `shopfinity_products_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToOriginalProducts = () => {
    if (
      window.confirm(
        "Are you sure you want to reset to original product data? All your changes will be lost."
      )
    ) {
      resetProducts();
      alert("Products have been reset to original data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 animate-fade-in">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-white/20 backdrop-blur-sm transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Product Management
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 font-medium">
                  {filteredProducts.length} products found
                </p>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Live Dashboard</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={openAddModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <FaPlus className="text-sm" /> Add Product
              </button>
              <button
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                onClick={exportProductsAsCSV}
              >
                <FaDownload className="text-sm" /> Export CSV
              </button>
              <button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                onClick={resetToOriginalProducts}
              >
                <FaSync className="text-sm" /> Reset Products
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-white/20 backdrop-blur-sm transform transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 hover:bg-gray-100 focus:bg-white"
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:bg-gray-100 focus:bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">📱 Electronics</option>
                <option value="Fashion">👕 Fashion</option>
                <option value="Home">🏠 Home</option>
                <option value="Sports">⚽ Sports</option>
                <option value="Toys">🧸 Toys</option>
                <option value="Accessories">💎 Accessories</option>
                <option value="Fitness">💪 Fitness</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaPowerOff className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:bg-gray-100 focus:bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">✅ Active</option>
                <option value="inactive">❌ Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="">Select Bulk Action</option>
                <option value="activate">✅ Activate Products</option>
                <option value="deactivate">❌ Deactivate Products</option>
                <option value="delete">🗑️ Delete Products</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedProductIds.length === 0}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !bulkAction || selectedProductIds.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                Apply to {selectedProductIds.length} item
                {selectedProductIds.length !== 1 ? "s" : ""}
              </button>
            </div>
            <button
              onClick={resetToOriginalProducts}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              🔄 Reset All Products
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20 backdrop-blur-sm transform transition-all duration-500 hover:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllProducts}
                      className="rounded-lg text-blue-600 focus:ring-blue-500 focus:ring-2 w-4 h-4"
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Product
                      {sortConfig.key === "name" && (
                        <span className="text-blue-600 font-bold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-2">
                      Price
                      {sortConfig.key === "price" && (
                        <span className="text-blue-600 font-bold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {sortConfig.key === "category" && (
                        <span className="text-blue-600 font-bold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center gap-2">
                      Stock
                      {sortConfig.key === "stock" && (
                        <span className="text-blue-600 font-bold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">
                          Loading products...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => handleProductSelection(product.id)}
                          className="rounded-lg text-blue-600 focus:ring-blue-500 focus:ring-2 w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-14 w-14 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                            {product.imgURL || product.imageUrl ? (
                              <img
                                src={product.imgURL || product.imageUrl}
                                alt={product.name}
                                className="h-14 w-14 object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/100?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="h-14 w-14 flex items-center justify-center text-gray-500">
                                <FaImage className="text-xl" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 mb-1">
                              {product.name}
                            </div>
                            {product.featured && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-green-600">
                          ${parseFloat(product.price).toFixed(2)}
                        </div>
                        {product.discountPrice && (
                          <div className="text-sm line-through text-red-500 font-medium">
                            ${parseFloat(product.discountPrice).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-2 inline-flex text-sm font-bold rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-sm">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-lg font-bold ${
                            parseInt(product.stock) <= 5
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock ? product.stock : "∞"}
                        </span>
                        {parseInt(product.stock) <= 5 &&
                          parseInt(product.stock) > 0 && (
                            <div className="text-xs text-red-500 font-medium">
                              Low Stock
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold shadow-lg ${
                            product.status === "inactive"
                              ? "bg-gradient-to-r from-red-400 to-pink-400 text-white"
                              : "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                          }`}
                        >
                          {product.status === "inactive" ? (
                            <>
                              <FaTimesCircle className="mr-1" />
                              Inactive
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="mr-1" />
                              Active
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(product)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                            title="View Product"
                          >
                            <FaEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                            title="Edit Product"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                            title="Delete Product"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaBoxes className="text-2xl text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 mb-1">
                            No products found
                          </p>
                          <p className="text-gray-500">
                            Try adjusting your search or filter criteria
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

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FaPlus className="text-2xl" />
                  Add New Product
                </h2>
                <p className="text-blue-100 mt-2">
                  Create a new product for your store
                </p>
              </div>
              <div className="p-8">
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-3">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleNewProductChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="Enter product name..."
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-3">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleNewProductChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 resize-none"
                        placeholder="Describe your product..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleNewProductChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Category
                      </label>
                      <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleNewProductChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">📱 Electronics</option>
                        <option value="Fashion">👕 Fashion</option>
                        <option value="Home">🏠 Home</option>
                        <option value="Sports">⚽ Sports</option>
                        <option value="Toys">🧸 Toys</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={newProduct.imageUrl}
                        onChange={handleNewProductChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleNewProductChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Create Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FaEdit className="text-2xl" />
                  Edit Product
                </h2>
                <p className="text-indigo-100 mt-2">
                  Update product information
                </p>
              </div>
              <div className="p-8">
                <form onSubmit={handleUpdateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-3">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedProduct.name}
                        onChange={handleEditProductChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-3">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={selectedProduct.description || ""}
                        onChange={handleEditProductChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={selectedProduct.price}
                        onChange={handleEditProductChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Category
                      </label>
                      <select
                        name="category"
                        value={selectedProduct.category || ""}
                        onChange={handleEditProductChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">📱 Electronics</option>
                        <option value="Fashion">👕 Fashion</option>
                        <option value="Home">🏠 Home</option>
                        <option value="Sports">⚽ Sports</option>
                        <option value="Toys">🧸 Toys</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={
                          selectedProduct.imageUrl ||
                          selectedProduct.imgURL ||
                          ""
                        }
                        onChange={handleEditProductChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={selectedProduct.stock || ""}
                        onChange={handleEditProductChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Product Modal */}
        {isViewModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FaEye className="text-2xl" />
                  Product Details
                </h2>
                <p className="text-emerald-100 mt-2">
                  View product information
                </p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3">
                      Product Name
                    </label>
                    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 font-medium">
                      {selectedProduct.name}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3">
                      Description
                    </label>
                    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 min-h-[100px]">
                      {selectedProduct.description ||
                        "No description available"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Price
                    </label>
                    <div className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold text-xl">
                      ${selectedProduct.price}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Category
                    </label>
                    <div className="p-4 border border-gray-200 rounded-xl bg-blue-50 text-blue-700 font-medium">
                      {selectedProduct.category || "Uncategorized"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Product Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={
                            selectedProduct.imgURL || selectedProduct.imageUrl
                          }
                          alt={selectedProduct.name}
                          className="h-24 w-24 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleImagePreview(
                            selectedProduct.imgURL || selectedProduct.imageUrl
                          )
                        }
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                      >
                        🔍 Preview Full Size
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Stock Quantity
                    </label>
                    <div
                      className={`p-4 border border-gray-200 rounded-xl font-bold text-xl ${
                        parseInt(selectedProduct.stock) <= 5
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {selectedProduct.stock || "∞"}
                      {parseInt(selectedProduct.stock) <= 5 &&
                        parseInt(selectedProduct.stock) > 0 && (
                          <span className="block text-sm font-medium mt-1">
                            ⚠️ Low Stock Alert
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {imagePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">Image Preview</h3>
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-white hover:text-gray-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-2xl shadow-lg max-h-[70vh] object-contain"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setImagePreview(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
