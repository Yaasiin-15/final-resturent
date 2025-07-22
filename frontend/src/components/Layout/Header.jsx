import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut, User } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Restaurant Management
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">
              {user?.username}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {user?.roles?.[0]?.replace('ROLE_', '')}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header