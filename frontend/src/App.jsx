import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import TraceabilityPassport from './pages/TraceabilityPassport';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SurplusRescue from './pages/SurplusRescue';
import HarvestReservations from './pages/HarvestReservations';
import CommunityBuys from './pages/CommunityBuys';
import DemandBoard from './pages/DemandBoard';
import BuyerOrders from './pages/BuyerOrders';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, roleRequired }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user?.role !== roleRequired && !user?.role?.includes(roleRequired)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-cream-200 text-center space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This portal requires <strong>{roleRequired}</strong> privileges.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cream-50 font-sans selection:bg-forest-600 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Core Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/produce/:id" element={<ProductDetail />} />
            <Route path="/traceability/:batchNumber" element={<TraceabilityPassport />} />

            {/* Shopping & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Unique Innovation Features */}
            <Route path="/surplus-rescue" element={<SurplusRescue />} />
            <Route path="/harvest-reservations" element={<HarvestReservations />} />
            <Route path="/community-buys" element={<CommunityBuys />} />
            <Route path="/demand-board" element={<DemandBoard />} />

            {/* Role Dashboards */}
            <Route
              path="/buyer/orders"
              element={
                <ProtectedRoute roleRequired="ROLE_BUYER">
                  <BuyerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute roleRequired="ROLE_FARMER">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roleRequired="ROLE_ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
