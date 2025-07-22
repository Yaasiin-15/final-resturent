import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Menu, 
  Table, 
  ShoppingCart, 
  Calendar,
  Users,
  UserPlus
} from 'lucide-react'

const Sidebar = () => {
  const { user, isManager } = useAuth()
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    {
      name: 'Menu',
      href: '/dashboard/menu',
      icon: Menu,
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    {
      name: 'Tables',
      href: '/dashboard/tables',
      icon: Table,
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingCart,
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    {
      name: 'Reservations',
      href: '/dashboard/reservations',
      icon: Calendar,
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: UserPlus,
      roles: ['ROLE_ADMIN']
    }
  ]

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">RMS</h2>
        <p className="text-gray-400 text-sm">Restaurant Management</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          // Check if user has required role for this nav item
          const hasRequiredRole = item.roles.some(role => user?.roles?.includes(role))
          
          if (!hasRequiredRole) return null
          
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar