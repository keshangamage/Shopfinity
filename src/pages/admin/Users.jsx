import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserEdit,
  FaTrash,
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaShieldAlt,
} from "react-icons/fa";
import { useUsers } from "../../utils/UserContext.jsx";
import { useAuth } from "../../utils/AuthContext.jsx";

const AdminUsers = () => {
  const {
    users,
    loading,
    loadAllUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getUserStats,
    searchUsers,
  } = useUsers();
  const { currentUser } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    // Load users when component mounts
    loadAllUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever users, search term, or filters change
    let filtered = users;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchUsers(searchTerm);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Update existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const success = await updateUserRole(selectedUser.uid, selectedUser.role);
      if (success) {
        await updateUserStatus(selectedUser.uid, selectedUser.status);
        setIsEditModalOpen(false);
        setSelectedUser(null);
        alert("User updated successfully!");
      } else {
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.uid) {
      alert("You cannot delete your own account!");
      return;
    }

    try {
      const success = await deleteUser(userId);
      if (success) {
        setDeleteConfirm(null);
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleQuickRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.uid && newRole !== "admin") {
      alert("You cannot change your own admin role!");
      return;
    }

    try {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        alert(`User role updated to ${newRole}!`);
      } else {
        alert("Failed to update user role.");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("An error occurred while updating the user role.");
    }
  };

  const handleQuickStatusChange = async (userId, newStatus) => {
    if (userId === currentUser?.uid && newStatus === "inactive") {
      alert("You cannot deactivate your own account!");
      return;
    }

    try {
      const success = await updateUserStatus(userId, newStatus);
      if (success) {
        alert(
          `User ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully!`
        );
      } else {
        alert("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred while updating the user status.");
    }
  };

  const debugLocalStorage = () => {
    console.log("🔍 LocalStorage Debug:");
    console.log("Current user:", localStorage.getItem("shopfinity_auth_user"));

    const orderKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("shopfinity_orders_")) {
        orderKeys.push(key);
        try {
          const orders = JSON.parse(localStorage.getItem(key));
          console.log(`📦 ${key}: ${orders.length} orders`);
        } catch (e) {
          console.log(`❌ ${key}: Error parsing`);
        }
      }
    }
    console.log(`Found ${orderKeys.length} order keys:`, orderKeys);

    alert(
      `Check console for localStorage debug info. Found ${orderKeys.length} order collections.`
    );
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered users and their permissions • Real Firebase Auth
            Integration
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={debugLocalStorage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md flex items-center text-sm"
          >
            🔍 Debug Data
          </button>
          <button
            onClick={() => loadAllUsers()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <FaUsers className="mr-2" />
                Refresh Users
              </>
            )}
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-500">Connected to Firebase</div>
            <div className="text-xs text-green-600 font-medium">
              ✅ Live Data
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FaUsers />
          </div>
          <div>
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FaUserCheck />
          </div>
          <div>
            <p className="text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-red-500 rounded-full p-3 mr-4 text-white">
            <FaUserTimes />
          </div>
          <div>
            <p className="text-gray-500">Inactive Users</p>
            <p className="text-2xl font-bold">{stats.inactiveUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-purple-500 rounded-full p-3 mr-4 text-white">
            <FaShieldAlt />
          </div>
          <div>
            <p className="text-gray-500">Admin Users</p>
            <p className="text-2xl font-bold">{stats.adminUsers}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Users ({filteredUsers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center ${
                              user.photoURL ? "hidden" : ""
                            }`}
                          >
                            <span className="text-gray-500 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.uid === currentUser?.uid && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleQuickRoleChange(
                            user.uid,
                            user.role === "admin" ? "customer" : "admin"
                          )
                        }
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                        disabled={user.uid === currentUser?.uid}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleQuickStatusChange(
                            user.uid,
                            user.status === "active" ? "inactive" : "active"
                          )
                        }
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        disabled={user.uid === currentUser?.uid}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit user"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.uid)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                        disabled={user.uid === currentUser?.uid}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaUsers className="text-4xl text-gray-300 mb-2" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        roleFilter !== "all"
                          ? "No users match your search criteria."
                          : "Register new users or sign in with Google to see them here."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Name can only be changed by the user in their profile
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={selectedUser.role}
                    onChange={handleEditUserChange}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={selectedUser.uid === currentUser?.uid}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {selectedUser.uid === currentUser?.uid && (
                    <p className="text-xs text-red-500 mt-1">
                      You cannot change your own role
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={selectedUser.status}
                    onChange={handleEditUserChange}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={selectedUser.uid === currentUser?.uid}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {selectedUser.uid === currentUser?.uid && (
                    <p className="text-xs text-red-500 mt-1">
                      You cannot change your own status
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={selectedUser.uid}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-sm"
                />
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
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
