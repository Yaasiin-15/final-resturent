import React, { useState } from "react";
import api from "../../lib/api";

const UserManagement = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    roles: ["staff"],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [createdUser, setCreatedUser] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((role) => role !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setCreatedUser(null);

    try {
      const response = await api.post("/auth/admin/create-user", formData);
      setCreatedUser(response.data);
      setMessage("User created successfully!");

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        roles: ["staff"],
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Roles
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="staff"
                  checked={formData.roles.includes("staff")}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Staff</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="manager"
                  checked={formData.roles.includes("manager")}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Manager</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="admin"
                  checked={formData.roles.includes("admin")}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              createdUser
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {createdUser && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              User Created Successfully!
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {createdUser.fullName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Username:</span>{" "}
                {createdUser.username}
              </p>
              <p className="text-sm">
                <span className="font-medium">Password:</span>{" "}
                {createdUser.password}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {createdUser.email}
              </p>
              <p className="text-xs text-blue-600 mt-3 font-medium">
                Please provide these credentials to the user.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
