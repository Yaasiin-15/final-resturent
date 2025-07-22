import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { menuAPI, tableAPI, orderAPI, reservationAPI } from '../../lib/api'
import { 
  Menu, 
  Table, 
  ShoppingCart, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalTables: 0,
    activeOrders: 0,
    todayReservations: 0,
    availableTables: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [menuResponse, tablesResponse, ordersResponse, reservationsResponse] = await Promise.all([
        menuAPI.getAll(),
        tableAPI.getAll(),
        orderAPI.getAll(),
        reservationAPI.getAll()
      ])

      const availableTables = tablesResponse.data.filter(table => table.status === 'AVAILABLE').length
      const pendingOrders = ordersResponse.data.filter(order => 
        ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status)
      ).length

      const today = new Date().toISOString().split('T')[0]
      const todayReservations = reservationsResponse.data.filter(reservation => 
        reservation.reservationDate.startsWith(today)
      ).length

      setStats({
        totalMenuItems: menuResponse.data.length,
        totalTables: tablesResponse.data.length,
        activeOrders: ordersResponse.data.length,
        todayReservations,
        availableTables,
        pendingOrders
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">Here's what's happening at your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Menu Items"
          value={stats.totalMenuItems}
          icon={Menu}
          color="bg-blue-500"
          description="Total items in menu"
        />
        
        <StatCard
          title="Available Tables"
          value={`${stats.availableTables}/${stats.totalTables}`}
          icon={Table}
          color="bg-green-500"
          description="Ready for customers"
        />
        
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          color="bg-yellow-500"
          description="Awaiting preparation"
        />
        
        <StatCard
          title="Today's Reservations"
          value={stats.todayReservations}
          icon={Calendar}
          color="bg-purple-500"
          description="Scheduled for today"
        />
        
        <StatCard
          title="Total Orders"
          value={stats.activeOrders}
          icon={TrendingUp}
          color="bg-red-500"
          description="All time orders"
        />
        
        <StatCard
          title="System Status"
          value="Online"
          icon={Clock}
          color="bg-indigo-500"
          description="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-900">Create New Order</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-green-50 hover:bg-green-100 transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-900">Add Reservation</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="flex items-center">
                <Table className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-900">Update Table Status</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">New order received - Table 5</span>
              <span className="text-gray-400 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Reservation confirmed - 7:00 PM</span>
              <span className="text-gray-400 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Table 3 marked as available</span>
              <span className="text-gray-400 ml-auto">8 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard