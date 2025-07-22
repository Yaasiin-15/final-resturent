import React from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, Users, Calendar, ShoppingBag, Star, Clock, MapPin, Phone } from 'lucide-react'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RestaurantPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to RestaurantPro
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience exceptional dining with our comprehensive restaurant management system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Staff Portal
              </Link>
              <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                Make Reservation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive restaurant management solutions for modern dining experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Management</h3>
              <p className="text-gray-600">
                Dynamic menu system with real-time updates and category management
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Table Management</h3>
              <p className="text-gray-600">
                Efficient table allocation and status tracking for optimal seating
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-gray-600">
                Streamlined order management from kitchen to customer delivery
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reservations</h3>
              <p className="text-gray-600">
                Advanced booking system with customer management and notifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-xl text-gray-600">Orders Processed Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-xl text-gray-600">Tables Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-xl text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us Today</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-orange-400 mr-3" />
                  <span>123 Restaurant Street, Food City, FC 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-400 mr-3" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-400 mr-3" />
                  <span>Mon-Sun: 11:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Staff Access</h2>
              <p className="text-gray-300 mb-6">
                Restaurant staff can access the management system to handle orders, 
                reservations, and daily operations.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Access Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-orange-400" />
              <span className="ml-2 text-lg font-semibold">RestaurantPro</span>
            </div>
            <div className="text-gray-400">
              © 2025 RestaurantPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage