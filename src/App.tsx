
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Index from './pages/Index';
import AuthCallback from './pages/auth/AuthCallback';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/settings/Settings';
import AdminPanel from './pages/AdminPanel';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Marketplace from './pages/marketplace/Marketplace';
import PrivateRoute from './components/auth/PrivateRoute';
import SellerRoute from './components/auth/SellerRoute';
import AdminRoute from './components/auth/AdminRoute';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProfile from './pages/seller/Profile';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';
import SellerAnalytics from './pages/seller/Analytics';
import AddItem from './pages/items/AddItem';
import Cart from './pages/cart/Cart';
import MyOrders from './pages/orders/MyOrders';
import AdvancedFeatures from './pages/services/AdvancedFeatures';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/auth'; 
import { ZeroBotProvider } from '@/contexts/ZeroBotContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ZeroBot5 from '@/components/ai/ZeroBot5';
import './styles/mobile-optimized.css';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/advanced-features" element={<AdvancedFeatures />} />

              <Route element={<SellerRoute />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/profile" element={<SellerProfile />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/analytics" element={<SellerAnalytics />} />
                <Route path="/items/add" element={<AddItem />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin/panel" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Enhanced ZeroBot AI v5.0 with mobile optimization */}
        <ZeroBot5
          enableVoice={true}
          enableRealtime={true}
          showAnalytics={true}
          sellerMode={currentUser?.isSeller || false}
          enableAI={true}
          isMobile={window.innerWidth < 768}
        />
        <Toaster richColors />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ZeroBotProvider>
          <AppContent />
        </ZeroBotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
