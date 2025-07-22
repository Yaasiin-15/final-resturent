import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { menuAPI } from '../../lib/api'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'

const MenuManagement = () => {
  const { isManager } = useAuth()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
    preparationTime: ''
  })

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads']

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items...')
      const response = await menuAPI.getAll()
      console.log('Menu Items:', response.data)
      setMenuItems(response.data || [])
    } catch (error) {
      console.error('Error fetching menu items:', error)
      // Set empty array on error to prevent blank page
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await menuAPI.update(editingItem.id, formData)
      } else {
        await menuAPI.create(formData)
      }
      fetchMenuItems()
      resetForm()
    } catch (error) {
      console.error('Error saving menu item:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuAPI.delete(id)
        fetchMenuItems()
      } catch (error) {
        console.error('Error deleting menu item:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true,
      preparationTime: ''
    })
    setEditingItem(null)
    setShowModal(false)
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
        <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
        {isManager() && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="text-lg font-bold text-green-600">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {item.preparationTime && (
                <p className="text-xs text-gray-500 mb-3">
                  Prep time: {item.preparationTime} minutes
                </p>
              )}
              {isManager() && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                    Available
                  </label>
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
                    {editingItem ? 'Update' : 'Create'}
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

export default MenuManagement