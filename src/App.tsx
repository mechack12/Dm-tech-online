/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { MainLayout } from './components/MainLayout';
import { AdminLayout } from './components/AdminLayout';
import { ShopScreen } from './screens/ShopScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { OrderHistoryScreen } from './screens/OrderHistoryScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { EditProductScreen } from './screens/EditProductScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { SupportScreen } from './screens/SupportScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { DealsScreen } from './screens/DealsScreen';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'admin' | 'guest' }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Auth Route */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Main App Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ShopScreen />} />
            <Route path="/product/:id" element={<ProductDetailScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistoryScreen />
              </ProtectedRoute>
            } />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/deals" element={<DealsScreen />} />
            <Route path="/support" element={<SupportScreen />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InventoryScreen />} />
            <Route path="edit/:id" element={<EditProductScreen />} />
            <Route path="dashboard" element={<div className="p-20 text-center text-4xl font-display font-bold text-white">Admin Dashboard Analytics</div>} />
            <Route path="orders" element={<div className="p-20 text-center text-4xl font-display font-bold text-white">Master Order Management</div>} />
            <Route path="customers" element={<div className="p-20 text-center text-4xl font-display font-bold text-white">Customer Database</div>} />
            <Route path="settings" element={<div className="p-20 text-center text-4xl font-display font-bold text-white">System Settings</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

