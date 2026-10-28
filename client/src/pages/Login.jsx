import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button3D from '../components/Button3D';

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (data.user.role === 'superadmin') {
        navigate('/super-admin');
      } else if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (!data.user.isEmailVerified && redirect === '/checkout') {
        navigate('/verify-email?redirect=/checkout');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--snow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--snow)',
          border: '1px solid var(--hairline-sky)',
          borderRadius: '24px',
          padding: '44px 36px',
          boxShadow: 'var(--card-3d-shadow)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Client Access
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              fontWeight: 500,
              color: 'var(--graphite)',
              marginTop: '8px',
            }}
          >
            Welcome <em style={{ fontStyle: 'italic' }}>Back</em>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Enter your credentials to manage orders & bag.
          </p>
        </div>

        {localError && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(163, 64, 64, 0.1)',
              border: '1px solid rgba(163, 64, 64, 0.2)',
              color: 'var(--danger)',
              fontSize: '12px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <Button3D
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
              icon={ArrowRight}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </Button3D>
          </div>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', color: 'var(--ash)' }}>
          <span>New to Elvane Wear? </span>
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--graphite)', fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>

        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--hairline)',
            fontSize: '11px',
            color: 'var(--mist)',
            textAlign: 'center',
          }}
        >
          Protected by Elvane Wear Atelier Security Protocols
        </div>
      </motion.div>
    </div>
  );
}
