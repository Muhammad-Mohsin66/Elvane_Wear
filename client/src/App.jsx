import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import ReturnsPolicy from './pages/ReturnsPolicy';
import TrackOrder from './pages/TrackOrder';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminNewProduct from './pages/admin/AdminNewProduct';
import AdminPromo from './pages/admin/AdminPromo';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminInquiries from './pages/admin/AdminInquiries';

// Super Admin Page
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SmoothScrollManager() {
  const location = useLocation();
  const isAdmin =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/super-admin') ||
    location.pathname.startsWith('/superadmin');

  useEffect(() => {
    // Disable smooth inertial Lenis on administrative back-office portals to prevent modal scroll hijacking
    if (isAdmin) {
      document.documentElement.classList.remove('lenis');
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdmin]);

  return null;
}

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin') || location.pathname.startsWith('/superadmin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <main style={{ minHeight: isAdminRoute ? '100vh' : 'calc(100vh - 72px)' }}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Router>
      <SmoothScrollManager />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returns" element={<ReturnsPolicy />} />
          <Route path="/return-policy" element={<ReturnsPolicy />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Customer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requireVerified={true}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Back-Office / Admin Login Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/super-admin/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/superadmin/login" element={<Navigate to="/admin/login" replace />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/orders" replace />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="new-product" element={<AdminNewProduct />} />
            <Route path="promo" element={<AdminPromo />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>

          {/* Protected Super Admin Route */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/superadmin" element={<Navigate to="/super-admin" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
