import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { tableAPI } from '../../lib/api'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

const TableManagement = () => {
  const { isManager } = useAuth()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    status: 'AVAILABLE'
  })

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Available', color: 'bg-green-100 text-green-800' },
    { value: 'OCCUPIED', label: 'Occupied', color: 'bg-red-100 text-red-800' },
    { value: 'RESERVED', label: 'Reserved', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-gray-100 text-gray-800' }
  ]

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      console.log('Fetching tables...')
      const response = await tableAPI.getAll()
      console.log('Tables:', response.data)
      setTables(response.data || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
      // Set empty array on error to prevent blank page
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTable) {
        await tableAPI.update(editingTable.id, formData)
      } else {
        await tableAPI.create(formData)
      }
      fetchTables()
      resetForm()
    } catch (error) {
      console.error('Error saving table:', error)
    }
  }

  const handleEdit = (table) => {
    setEditingTable(table)
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location || '',
      status: table.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tableAPI.delete(id)
        fetchTables()
      } catch (error) {
        console.error('Error deleting table:', error)
      }
    }
  }

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      await tableAPI.updateStatus(tableId, newStatus)
      fetchTables()
    } catch (error) {
      console.error('Error updating table status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      capacity: '',
      location: '',
      status: 'AVAILABLE'
    })
    setEditingTable(null)
    setShowModal(false)
  }

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Table Management</h1>
        {isManager() && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Table</span>
          </button>
        )}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Table {table.tableNumber}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{table.capacity} seats</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>
            
            {table.location && (
              <p className="text-sm text-gray-600 mb-4">{table.location}</p>
            )}

            <div className="space-y-2">
              <select
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {isManager() && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(table)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingTable ? 'Edit Table' : 'Add Table'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Window side, Patio, Main hall"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingTable ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableManagement