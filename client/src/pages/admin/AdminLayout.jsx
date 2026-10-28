import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, PlusCircle, Megaphone, TrendingUp, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: '+ New Product', path: '/admin/new-product', icon: PlusCircle },
    { label: 'Promo Banner', path: '/admin/promo', icon: Megaphone },
    { label: 'Revenue', path: '/admin/revenue', icon: TrendingUp },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--snow)' }}>
      {/* Fixed Left Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--cloud)',
          borderRight: '1px solid var(--hairline)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 0',
          zIndex: 40,
        }}
      >
        <div>
          {/* Header */}
          <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--hairline)' }}>
            <span className="eyebrow" style={{ color: 'var(--champagne)', fontSize: '10px' }}>
              Atelier Management
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--graphite)',
                marginTop: '4px',
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

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px 48px', minHeight: '100vh', background: 'var(--snow)' }}>
        <Outlet />
      </main>
    </div>
  );
}
