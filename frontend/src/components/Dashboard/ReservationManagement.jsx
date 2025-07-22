import React, { useState, useEffect } from 'react'
import { reservationAPI, tableAPI } from '../../lib/api'
import { Plus, Eye, Edit, Calendar, Users, Phone, Mail } from 'lucide-react'

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: '',
    partySize: '',
    tableId: '',
    notes: '',
    status: 'PENDING'
  })

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'SEATED', label: 'Seated', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'NO_SHOW', label: 'No Show', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log('Fetching reservations and tables...')
      const [reservationsResponse, tablesResponse] = await Promise.all([
        reservationAPI.getAll(),
        tableAPI.getAll()
      ])
      console.log('Reservations:', reservationsResponse.data)
      console.log('Tables:', tablesResponse.data)
      setReservations(reservationsResponse.data || [])
      setTables(tablesResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays on error to prevent blank page
      setReservations([])
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const reservationData = {
        ...formData,
        tableId: formData.tableId ? parseInt(formData.tableId) : null,
        partySize: parseInt(formData.partySize)
      }

      if (editingReservation) {
        await reservationAPI.update(editingReservation.id, reservationData)
      } else {
        await reservationAPI.create(reservationData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving reservation:', error)
    }
  }

  const handleEdit = (reservation) => {
    setEditingReservation(reservation)
    setFormData({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail || '',
      reservationDate: reservation.reservationDate.slice(0, 16), // Format for datetime-local
      partySize: reservation.partySize,
      tableId: reservation.table?.id || '',
      notes: reservation.notes || '',
      status: reservation.status
    })
    setShowModal(true)
  }

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await reservationAPI.updateStatus(reservationId, newStatus)
      fetchData()
    } catch (error) {
      console.error('Error updating reservation status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      reservationDate: '',
      partySize: '',
      tableId: '',
      notes: '',
      status: 'PENDING'
    })
    setEditingReservation(null)
    setShowModal(false)
  }

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  const getTableNumber = (tableId) => {
    const table = tables.find(t => t.id === tableId)
    return table ? table.tableNumber : 'N/A'
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const filteredReservations = selectedStatus 
    ? reservations.filter(reservation => reservation.status === selectedStatus)
    : reservations

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
        <h1 className="text-2xl font-semibold text-gray-900">Reservation Management</h1>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Reservations</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reservation</span>
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReservations.map(reservation => (
            <li key={reservation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.customerName}
                        </p>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <p>{formatDateTime(reservation.reservationDate)}</p>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="flex-shrink-0 mr-1 h-4 w-4" />
                          <span>{reservation.partySize} guests</span>
                        </div>
                        {reservation.table && (
                          <span>Table {getTableNumber(reservation.table.id)}</span>
                        )}
                        <div className="flex items-center">
                          <Phone className="flex-shrink-0 mr-1 h-4 w-4" />
                          <span>{reservation.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {reservation.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {reservation.notes}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      )}

      {/* Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingReservation ? 'Edit Reservation' : 'Add Reservation'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.reservationDate}
                      onChange={(e) => setFormData({...formData, reservationDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Size
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.partySize}
                      onChange={(e) => setFormData({...formData, partySize: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table (Optional)
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.tableId}
                    onChange={(e) => setFormData({...formData, tableId: e.target.value})}
                  >
                    <option value="">Select Table</option>
                    {tables.map(table => (
                      <option key={table.id} value={table.id}>
                        Table {table.tableNumber} ({table.capacity} seats)
                      </option>
                    ))}
                  </select>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Special requests, dietary restrictions, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
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
                    {editingReservation ? 'Update' : 'Create'}
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

export default ReservationManagement