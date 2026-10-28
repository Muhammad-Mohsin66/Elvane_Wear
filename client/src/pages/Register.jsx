import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button3D from '../components/Button3D';

export default function Register() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      // Navigate to OTP verification screen
      navigate(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
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
          maxWidth: '460px',
          background: 'var(--snow)',
          border: '1px solid var(--hairline-sky)',
          borderRadius: '24px',
          padding: '44px 36px',
          boxShadow: 'var(--card-3d-shadow)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Join the Atelier
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
            Create <em style={{ fontStyle: 'italic' }}>Account</em>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Register to checkout and track your luxury orders.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tariq Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '11px', color: 'var(--ash)', lineHeight: 1.5 }}>
            * Note: An OTP verification code will be sent to your email to activate checkout privileges.
          </p>

          <div style={{ marginTop: '10px' }}>
            <Button3D
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
              icon={ArrowRight}
            >
              {submitting ? 'Creating Register...' : 'Proceed to Verification'}
            </Button3D>
          </div>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--ash)' }}>
          <span>Already have an account? </span>
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--graphite)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
