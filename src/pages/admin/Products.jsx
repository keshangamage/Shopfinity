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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredProducts.length} products found
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={exportProductsAsCSV}
          >
            <FaDownload className="mr-2" /> Export CSV
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={resetToOriginalProducts}
          >
            <FaSync className="mr-2" /> Reset Products
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 appearance-none pl-10"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
            <option value="Fitness">Fitness</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 appearance-none pl-10"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          <option value="">Bulk Actions</option>
          <option value="activate">Activate Products</option>
          <option value="deactivate">Deactivate Products</option>
          <option value="delete">Delete Products</option>
        </select>
        <button
          onClick={handleBulkAction}
          disabled={!bulkAction || selectedProductIds.length === 0}
          className={`px-4 py-2 rounded-md ${
            !bulkAction || selectedProductIds.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Apply ({selectedProductIds.length} selected)
        </button>
        <button
          onClick={resetToOriginalProducts}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Reset Products
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllProducts}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price
                  {sortConfig.key === "price" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category
                  {sortConfig.key === "category" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  Stock
                  {sortConfig.key === "stock" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => handleProductSelection(product.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {product.imgURL || product.imageUrl ? (
                            <img
                              src={product.imgURL || product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/100?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                              <FaImage />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          {product.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(product.price).toFixed(2)}
                      {product.discountPrice && (
                        <span className="block line-through text-xs text-red-500">
                          ${parseFloat(product.discountPrice).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`font-medium ${
                          parseInt(product.stock) <= 5
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {product.stock ? product.stock : "∞"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.status === "inactive" ? (
                          <FaTimesCircle className="mr-1" />
                        ) : (
                          <FaCheckCircle className="mr-1" />
                        )}
                        {product.status === "inactive" ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openViewModal(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Product"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleNewProductChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleEditProductChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={selectedProduct.description || ""}
                  onChange={handleEditProductChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleEditProductChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={selectedProduct.category || ""}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={
                      selectedProduct.imageUrl || selectedProduct.imgURL || ""
                    }
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={selectedProduct.stock || ""}
                    onChange={handleEditProductChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <div className="p-3 border rounded-md bg-gray-50">
                {selectedProduct.name}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <div className="p-3 border rounded-md bg-gray-50">
                {selectedProduct.description}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Price ($)</label>
                <div className="p-3 border rounded-md bg-gray-50">
                  {selectedProduct.price}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <div className="p-3 border rounded-md bg-gray-50">
                  {selectedProduct.category}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Image</label>
                <div className="flex items-center">
                  <img
                    src={selectedProduct.imgURL || selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="h-20 w-20 rounded-md object-cover mr-4"
                  />
                  <button
                    onClick={() =>
                      handleImagePreview(
                        selectedProduct.imgURL || selectedProduct.imageUrl
                      )
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Stock</label>
                <div className="p-3 border rounded-md bg-gray-50">
                  {selectedProduct.stock}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-md"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setImagePreview(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
