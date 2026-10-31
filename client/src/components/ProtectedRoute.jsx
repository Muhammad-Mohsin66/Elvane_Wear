import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import Button3D from './Button3D';

export default function ProtectedRoute({ children, allowedRoles = [], requireVerified = false }) {
  const { user, isAuthenticated, loading, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: 'var(--ash)',
        }}
      >
        Loading Atelier...
      </div>
    );
  }

  if (!isAuthenticated) {
    const isAdminTarget = allowedRoles.some((r) => ['admin', 'superadmin'].includes(r));
    const targetLogin = isAdminTarget ? '/admin/login' : '/login';
    return <Navigate to={`${targetLogin}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireVerified && !user?.isEmailVerified) {
    return <Navigate to={`/verify-email?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: 'var(--snow)',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid var(--hairline)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(212, 167, 106, 0.12)',
              color: 'var(--champagne)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--champagne)' }}>
            Elevated Access Required
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              color: 'var(--graphite)',
              marginTop: '8px',
              marginBottom: '12px',
              fontWeight: 600,
            }}
          >
            Super Admin Authority Only
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.6, marginBottom: '24px' }}>
            Aap filhal <strong>{user?.email}</strong> ke taur par logged in hain jiska role <strong>{user?.role}</strong> hai. Yeh section sirf <strong>Super Admin</strong> ke liye makhsoos hai.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button3D
              variant="dark"
              size="md"
              icon={LogOut}
              onClick={() => {
                logout();
                navigate(`/admin/login?redirect=${encodeURIComponent(location.pathname)}`);
              }}
            >
              Sign Out & Login as Super Admin
            </Button3D>

            {user?.role === 'admin' && (
              <Button3D
                variant="outline"
                size="md"
                onClick={() => navigate('/admin')}
              >
                Go to Admin Dashboard
              </Button3D>
            )}

            <Button3D
              variant="ghost"
              size="md"
              icon={ArrowLeft}
              onClick={() => navigate('/')}
            >
              Return to Storefront
            </Button3D>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
