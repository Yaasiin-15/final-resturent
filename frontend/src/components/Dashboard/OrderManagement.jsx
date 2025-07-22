import React, { useState, useEffect } from "react";
import { orderAPI, tableAPI, menuAPI } from "../../lib/api";
import { Plus, Eye, Edit, Clock, CheckCircle } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    tableId: "",
    customerName: "",
    customerPhone: "",
    notes: "",
    orderItems: [],
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "CONFIRMED",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "PREPARING",
      label: "Preparing",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "READY", label: "Ready", color: "bg-purple-100 text-purple-800" },
    { value: "SERVED", label: "Served", color: "bg-green-100 text-green-800" },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching orders, tables, and menu items...");
      const [ordersResponse, tablesResponse, menuResponse] = await Promise.all([
        orderAPI.getAll(),
        tableAPI.getAll(),
        menuAPI.getAll(),
      ]);
      console.log("Orders:", ordersResponse.data);
      console.log("Tables:", tablesResponse.data);
      console.log("Menu Items:", menuResponse.data);
      setOrders(ordersResponse.data || []);
      setTables(tablesResponse.data || []);
      setMenuItems(menuResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty arrays on error to prevent blank page
      setOrders([]);
      setTables([]);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
  };

  const getTableNumber = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? table.tableNumber : "N/A";
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.status === selectedStatus)
    : orders;

  const handleItemQuantityChange = (menuItemId, quantity) => {
    if (quantity === 0) {
      setSelectedItems(
        selectedItems.filter((item) => item.menuItemId !== menuItemId)
      );
    } else {
      const existingItem = selectedItems.find(
        (item) => item.menuItemId === menuItemId
      );
      if (existingItem) {
        setSelectedItems(
          selectedItems.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item
          )
        );
      } else {
        setSelectedItems([
          ...selectedItems,
          { menuItemId, quantity, notes: "" },
        ]);
      }
    }
  };

  const handleItemNotesChange = (menuItemId, notes) => {
    const existingItem = selectedItems.find(
      (item) => item.menuItemId === menuItemId
    );
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.menuItemId === menuItemId ? { ...item, notes } : item
        )
      );
    } else if (notes) {
      setSelectedItems([...selectedItems, { menuItemId, quantity: 1, notes }]);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        tableId: parseInt(orderForm.tableId),
        customerName: orderForm.customerName || null,
        customerPhone: orderForm.customerPhone || null,
        notes: orderForm.notes || null,
        orderItems: selectedItems.map((item) => {
          const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
          return {
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: menuItem?.price || 0,
            totalPrice: (menuItem?.price || 0) * item.quantity,
            notes: item.notes || null,
          };
        }),
        totalAmount: calculateTotal(),
        status: "PENDING",
      };

      await orderAPI.create(orderData);
      fetchData();

      // Reset form
      setShowCreateModal(false);
      setOrderForm({
        tableId: "",
        customerName: "",
        customerPhone: "",
        notes: "",
        orderItems: [],
      });
      setSelectedItems([]);

      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Order Management
        </h1>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Orders</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          #{order.id}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          Table {getTableNumber(order.table?.id)}
                        </p>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <p>{formatDateTime(order.createdAt)}</p>
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-gray-600">
                          Customer: {order.customerName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.orderItems?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setViewingOrder(order);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Order</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setOrderForm({
                      tableId: "",
                      customerName: "",
                      customerPhone: "",
                      notes: "",
                      orderItems: [],
                    });
                    setSelectedItems([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={orderForm.tableId}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, tableId: e.target.value })
                      }
                    >
                      <option value="">Select Table</option>
                      {tables
                        .filter(
                          (table) =>
                            table.status === "AVAILABLE" ||
                            table.status === "OCCUPIED"
                        )
                        .map((table) => (
                          <option key={table.id} value={table.id}>
                            Table {table.tableNumber} ({table.capacity} seats)
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={orderForm.customerName}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={orderForm.customerPhone}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          customerPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={orderForm.notes}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Menu Items Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select Menu Items
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {menuItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              Category: {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${item.price}
                            </p>
                            {item.preparationTime && (
                              <p className="text-xs text-gray-500">
                                {item.preparationTime} min
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                            value={
                              selectedItems.find(
                                (si) => si.menuItemId === item.id
                              )?.quantity || ""
                            }
                            onChange={(e) =>
                              handleItemQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Special notes..."
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            value={
                              selectedItems.find(
                                (si) => si.menuItemId === item.id
                              )?.notes || ""
                            }
                            onChange={(e) =>
                              handleItemNotesChange(item.id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      {selectedItems.map((item) => {
                        const menuItem = menuItems.find(
                          (mi) => mi.id === item.menuItemId
                        );
                        return (
                          <div
                            key={item.menuItemId}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <span className="font-medium">
                                {menuItem?.name}
                              </span>
                              <span className="text-gray-500 ml-2">
                                x{item.quantity}
                              </span>
                              {item.notes && (
                                <span className="text-sm text-gray-600 block">
                                  Note: {item.notes}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold">
                              ${(menuItem?.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="border-t pt-2 flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setOrderForm({
                        tableId: "",
                        customerName: "",
                        customerPhone: "",
                        notes: "",
                        orderItems: [],
                      });
                      setSelectedItems([]);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedItems.length === 0}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Order #{viewingOrder.id}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Table</p>
                    <p className="text-sm text-gray-900">
                      Table {getTableNumber(viewingOrder.table?.id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                        viewingOrder.status
                      )}`}
                    >
                      {viewingOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(viewingOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      ${viewingOrder.totalAmount}
                    </p>
                  </div>
                </div>

                {viewingOrder.customerName && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Customer
                    </p>
                    <p className="text-sm text-gray-900">
                      {viewingOrder.customerName}
                    </p>
                    {viewingOrder.customerPhone && (
                      <p className="text-sm text-gray-600">
                        {viewingOrder.customerPhone}
                      </p>
                    )}
                  </div>
                )}

                {viewingOrder.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notes</p>
                    <p className="text-sm text-gray-900">
                      {viewingOrder.notes}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Order Items
                  </p>
                  <div className="border rounded-md">
                    {viewingOrder.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border-b last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {item.menuItem?.name || "Unknown Item"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-gray-600">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${item.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.unitPrice} each
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="p-3 text-sm text-gray-500">
                        No items found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
