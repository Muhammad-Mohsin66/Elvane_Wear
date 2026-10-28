import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, RotateCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button3D from '../components/Button3D';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/checkout';

  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  const { user, verifyEmail, resendOTP } = useAuthStore();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter all 6 digits');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await verifyEmail(otp);
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Verification failed. Check the code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMsg('');
    setResendMsg('');
    try {
      await resendOTP();
      setResendMsg('A new verification code has been generated & logged.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not resend OTP');
    } finally {
      setResending(false);
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
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--glacier-glass)',
            border: '1px solid var(--hairline-sky)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--champagne)',
          }}
        >
          <Mail size={26} strokeWidth={1.5} />
        </div>

        <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
          Security Verification
        </span>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '34px',
            fontWeight: 500,
            color: 'var(--graphite)',
            marginTop: '8px',
            marginBottom: '12px',
          }}
        >
          Verify Your <em style={{ fontStyle: 'italic' }}>Email</em>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.6, marginBottom: '28px' }}>
          We sent a 6-digit atelier code to <strong>{user?.email || 'your email'}</strong>. (Check terminal/console logs if SMTP is offline).
        </p>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(163, 64, 64, 0.1)',
              border: '1px solid rgba(163, 64, 64, 0.2)',
              color: 'var(--danger)',
              fontSize: '12px',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {resendMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(90, 138, 106, 0.1)',
              border: '1px solid rgba(90, 138, 106, 0.2)',
              color: 'var(--success)',
              fontSize: '12px',
              marginBottom: '20px',
            }}
          >
            {resendMsg}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              6-Digit Atelier Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{
                textAlign: 'center',
                letterSpacing: '12px',
                fontSize: '26px',
                fontFamily: "'Inter', monospace",
                fontWeight: 600,
                color: 'var(--graphite)',
                padding: '14px',
              }}
            />
          </div>

          <Button3D
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center' }}
            icon={CheckCircle2}
          >
            {submitting ? 'Verifying...' : 'Activate Atelier Account'}
          </Button3D>
        </form>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--ash)' }}>Didn't receive code?</span>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--champagne)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCw size={12} className={resending ? 'animate-spin' : ''} />
            <span>Resend Code</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
