import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertTriangle, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button3D from '../../components/Button3D';

export default function AdminLogin() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@elvanewear.com');
      setPassword('Admin@123');
    } else if (role === 'superadmin') {
      setEmail('superadmin@elvanewear.com');
      setPassword('SuperAdmin@123');
    }
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      const userRole = data?.user?.role;

      if (userRole === 'customer') {
        // Customer accounts not permitted in back-office
        logout();
        setLocalError('Access Denied: Customer accounts are not permitted in the Administrative Portal.');
        return;
      }

      if (userRole === 'superadmin') {
        if (redirect && redirect.startsWith('/super-admin')) {
          navigate(redirect);
        } else if (redirect && redirect.startsWith('/admin')) {
          navigate(redirect);
        } else {
          navigate('/super-admin');
        }
      } else if (userRole === 'admin') {
        if (redirect && redirect.startsWith('/admin')) {
          navigate(redirect);
        } else {
          navigate('/admin/orders');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Invalid administrative credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1A1D20 0%, #0D0F11 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: '460px',
          width: '100%',
          background: 'rgba(25, 28, 32, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: 'clamp(28px, 5vw, 44px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Top Emblem & Badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(212, 167, 106, 0.2) 0%, rgba(212, 167, 106, 0.05) 100%)',
              border: '1px solid rgba(212, 167, 106, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#D4A76A',
              boxShadow: '0 8px 24px rgba(212, 167, 106, 0.15)',
            }}
          >
            <Shield size={28} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(212, 167, 106, 0.1)',
              border: '1px solid rgba(212, 167, 106, 0.25)',
              color: '#D4A76A',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Staff & Executive Gateway
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '30px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '6px',
            }}
          >
            Atelier Back-Office
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}>
            Restricted administrative portal for Elvane Wear management and operations.
          </p>
        </div>

        {/* Quick Role Fill Pills */}
        <div style={{ marginBottom: '22px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', display: 'block', marginBottom: '8px' }}>
            Quick fill credentials:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#E0E0E0',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(212, 167, 106, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <KeyRound size={12} color="#D4A76A" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('superadmin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(212, 167, 106, 0.08)',
                border: '1px solid rgba(212, 167, 106, 0.3)',
                color: '#D4A76A',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 167, 106, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 167, 106, 0.08)';
              }}
            >
              <Shield size={12} color="#D4A76A" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {localError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{localError}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '6px',
              }}
            >
              Staff Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.35)',
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elvanewear.com"
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0 14px 0 42px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4A76A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '6px',
              }}
            >
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.35)',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0 42px 0 42px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4A76A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <Button3D
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              icon={Shield}
            >
              {submitting ? 'Authenticating Protocols...' : 'Authenticate & Enter'}
            </Button3D>
          </div>
        </form>

        {/* Footer info & return */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', marginBottom: '14px' }}>
            All administrative access attempts are monitored and recorded in the audit trail.
          </p>

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A76A')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
          >
            <ArrowLeft size={14} />
            <span>Return to Elvane Wear Storefront</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
