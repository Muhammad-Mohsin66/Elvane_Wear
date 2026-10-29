import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, PlusCircle, Megaphone, TrendingUp, LogOut, ArrowLeft, Shield, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: '+ New Product', path: '/admin/new-product', icon: PlusCircle },
    { label: 'Promo Banner', path: '/admin/promo', icon: Megaphone },
    { label: 'Revenue', path: '/admin/revenue', icon: TrendingUp },
  ];

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '28px 0' }}>
      <div>
        {/* Header */}
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <img
                src="/logo.jpg"
                alt="Elvane Wear"
                style={{
                  height: '32px',
                  width: 'auto',
                  borderRadius: '4px',
                  mixBlendMode: 'multiply',
                }}
              />
              <span className="eyebrow" style={{ color: 'var(--champagne)', fontSize: '10px' }}>
                Elvane Wear Atelier
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--graphite)',
                marginTop: '2px',
              }}
            >
              Admin Portal
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--ash)' }}>
                {user?.name} ({user?.role})
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ash)',
              padding: '4px',
            }}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <item.icon size={17} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {user?.role === 'superadmin' && (
          <button
            onClick={() => navigate('/super-admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(212, 167, 106, 0.1)',
              border: '1px solid var(--hairline-accent)',
              color: 'var(--champagne)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Shield size={14} />
            <span>Super Admin Portal</span>
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'none',
            border: '1px solid var(--hairline)',
            color: 'var(--ash)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>View Public Storefront</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--snow)', position: 'relative', width: '100%' }}>
      {/* Mobile Top Header (Visible on Mobile & Tablet < 1024px) */}
      <div
        className="flex lg:hidden items-center justify-between px-5 py-4 border-b border-[var(--hairline)] bg-[var(--cloud)] sticky top-0 z-30"
      >
        <button
          onClick={() => setMobileSidebarOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--graphite)' }}
        >
          <Menu size={22} strokeWidth={1.5} />
          <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Menu</span>
        </button>

        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600, color: 'var(--graphite)' }}>
          Admin Panel
        </h3>

        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
        >
          Store
        </button>
      </div>

      {/* Desktop Fixed Left Sidebar (Visible on Desktop >= 1024px) */}
      <aside
        style={{
          width: '270px',
          minWidth: '270px',
          maxWidth: '270px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          background: 'var(--cloud)',
          borderRight: '1px solid var(--hairline)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
        className="hidden lg:flex"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sliding Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.45)', backdropFilter: 'blur(4px)', zIndex: 90 }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                width: '85%',
                maxWidth: '300px',
                background: 'var(--cloud)',
                zIndex: 100,
                boxShadow: '10px 0 30px rgba(26,26,26,0.1)',
              }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area (Offset strictly by 270px on desktop) */}
      <main
        className="admin-main-viewport"
        style={{
          minHeight: '100vh',
          boxSizing: 'border-box',
          padding: 'clamp(28px, 4vw, 48px) clamp(24px, 4vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1100px', margin: 0 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
