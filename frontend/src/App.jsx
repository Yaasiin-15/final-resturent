import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Homepage from "./components/Home/Homepage";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import MenuManagement from "./components/Dashboard/MenuManagement";
import TableManagement from "./components/Dashboard/TableManagement";
import OrderManagement from "./components/Dashboard/OrderManagement";
import ReservationManagement from "./components/Dashboard/ReservationManagement";
import UserManagement from "./components/Dashboard/UserManagement";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="tables" element={<TableManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="reservations" element={<ReservationManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
