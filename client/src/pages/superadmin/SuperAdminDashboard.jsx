import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, KeyRound, Activity, BarChart3, TrendingUp, Users,
  ShoppingBag, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api, { formatPKR } from '../../utils/api';
import Button3D from '../../components/Button3D';
import { useAuthStore } from '../../store/authStore';

const COLORS = ['#D4A76A', '#B8DCF0', '#E8C4B8', '#5A8A6A', '#A34040'];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [period, setPeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password reset state for Admin account
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadData = async () => {
    try {
      const [analyticsRes, logsRes, adminRes] = await Promise.all([
        api.get(`/super-admin/analytics?period=${period}`),
        api.get('/super-admin/audit-logs'),
        api.get('/super-admin/admin-user'),
      ]);
      setAnalytics(analyticsRes.data);
      setAuditLogs(logsRes.data.logs || []);
      setAdminUser(adminRes.data);
    } catch (err) {
      console.error('Super Admin data load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const handleUpdateAdminPassword = async (e) => {
    e.preventDefault();
    setPasswordUpdating(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await api.put('/super-admin/admin-password', { newPassword: newAdminPassword });
      setPasswordSuccess('Admin password updated successfully. Audit log packet recorded.');
      setNewAdminPassword('');
      // Reload audit logs to show the password change event
      const logsRes = await api.get('/super-admin/audit-logs');
      setAuditLogs(logsRes.data.logs || []);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update admin password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const getActionBadgeColor = (actionType) => {
    switch (actionType) {
      case 'PRODUCT_ADDED':
        return { bg: 'rgba(90, 138, 106, 0.12)', color: 'var(--success)' };
      case 'PRODUCT_DELETED':
        return { bg: 'rgba(163, 64, 64, 0.12)', color: 'var(--danger)' };
      case 'DISCOUNT_APPLIED':
        return { bg: 'rgba(212, 167, 106, 0.15)', color: 'var(--champagne)' };
      case 'PAYMENT_VERIFIED':
        return { bg: 'rgba(184, 220, 240, 0.25)', color: '#2B6CB0' };
      case 'ADMIN_PASSWORD_CHANGED':
        return { bg: 'rgba(163, 64, 64, 0.15)', color: 'var(--danger)' };
      default:
        return { bg: 'var(--cloud)', color: 'var(--ash)' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--snow)', color: 'var(--ash)' }}>
        Authenticating Executive Protocols...
      </div>
    );
  }

  const paymentData = [
    { name: 'COD', value: analytics?.paymentSplit?.COD || 0 },
    { name: 'JazzCash', value: analytics?.paymentSplit?.JazzCash || 0 },
  ];

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 48px)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Elvane Wear" style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(212, 167, 106, 0.15)',
                border: '1px solid var(--hairline-accent)',
                color: 'var(--champagne)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              <Shield size={12} />
              <span>Elvane Wear — Super Admin Authority</span>
            </span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4.5vw, 42px)', color: 'var(--graphite)', marginTop: '8px' }}>
            Executive Dashboard & Audit Log
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            System-level audit tracking, financial charts, and admin credential governance.
          </p>
        </div>

        {/* Top actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button3D variant="outline" size="sm" onClick={() => navigate('/admin')}>
            Enter Admin Panel
          </Button3D>
          <Button3D variant="ghost" size="sm" onClick={() => navigate('/')}>
            Storefront
          </Button3D>
          <Button3D variant="dark" size="sm" onClick={loadData} icon={RefreshCw}>
            Refresh Feeds
          </Button3D>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Total Platform Revenue</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {formatPKR(analytics?.totalRevenue || 0)}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>Gross volume (PKR)</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Total Orders</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {analytics?.totalOrders || 0}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Across Pakistan</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Average Order Value</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {formatPKR(analytics?.avgOrderValue || 0)}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Per transaction</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Registered Customers</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {analytics?.totalCustomers || 0}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Client Accounts</span>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(20px, 3vw, 32px)', marginBottom: '40px' }}>
        {/* Main Revenue Over Time */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: 'clamp(20px, 3.5vw, 32px)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '10px' }}>Financial Metric</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>Revenue Trajectory</h3>
            </div>
            {/* Period Toggles */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--cloud)', borderRadius: '999px', padding: '4px' }}>
              {['daily', 'weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    border: 'none',
                    background: period === p ? 'var(--graphite)' : 'transparent',
                    color: period === p ? 'var(--snow)' : 'var(--ash)',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenueChart || []}>
                <defs>
                  <linearGradient id="superGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--champagne)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--glacier-sky)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--mist)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--mist)" fontSize={11} tickLine={false} tickFormatter={(val) => `Rs.${val / 1000}k`} />
                <Tooltip formatter={(val) => [formatPKR(val), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="var(--champagne)" strokeWidth={2.5} fill="url(#superGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Split Pie Chart */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: 'clamp(20px, 3.5vw, 32px)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
          <div>
            <span className="eyebrow" style={{ fontSize: '10px' }}>Payment Channels</span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginTop: '4px' }}>
              COD vs. JazzCash
            </h3>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  <Cell fill="var(--champagne)" />
                  <Cell fill="var(--glacier-sky)" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--ash)', textAlign: 'center' }}>
            <span>Cash on Delivery: <strong>{analytics?.paymentSplit?.COD || 0}</strong></span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>JazzCash: <strong>{analytics?.paymentSplit?.JazzCash || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: AUDIT LOG PACKETS & ADMIN CREDENTIALS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(20px, 3vw, 32px)' }}>
        {/* Left: Real-Time Admin Activity Audit Logs ("Change Packets") */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Immutable Records</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px' }}>
                Admin Activity Audit Logs ({auditLogs.length} Packets)
              </h3>
            </div>
            <Activity size={18} color="var(--champagne)" />
          </div>

          {auditLogs.length === 0 ? (
            <p style={{ color: 'var(--ash)', fontSize: '13px' }}>
              No administrative write actions recorded yet. All product edits, inventory adjustments, and discount changes will generate real-time audit packets here.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto' }}>
              {auditLogs.map((log) => {
                const badge = getActionBadgeColor(log.actionType);
                return (
                  <div
                    key={log._id}
                    style={{
                      background: 'var(--cloud)',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      border: '1px solid var(--hairline)',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {log.actionType}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--graphite)' }}>
                          {log.adminName} ({log.adminEmail})
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--mist)' }}>
                        {new Date(log.createdAt).toLocaleString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p style={{ color: 'var(--charcoal)', marginBottom: '6px' }}>
                      {log.description}
                    </p>

                    {/* Target & Before/After packet details */}
                    {(log.before || log.after) && (
                      <div style={{ fontSize: '11px', color: 'var(--ash)', background: 'var(--snow)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--hairline)', fontFamily: 'monospace' }}>
                        {log.before && <div>Before: {JSON.stringify(log.before)}</div>}
                        {log.after && <div>After: {JSON.stringify(log.after)}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Manage Admin Credentials (Only Super Admin can change Admin's password) */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', boxShadow: '0 4px 18px rgba(26,26,26,0.03)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <KeyRound size={22} color="var(--champagne)" />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>
              Admin Governance
            </h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.6, marginBottom: '24px' }}>
            <strong>Security Rule:</strong> The Admin account cannot change its own password. Only the Super Admin possesses the authority to rotate and set the Admin's password.
          </p>

          <div style={{ padding: '14px 18px', background: 'var(--cloud)', borderRadius: '12px', marginBottom: '24px', fontSize: '13px' }}>
            <p className="eyebrow" style={{ fontSize: '10px', marginBottom: '4px' }}>Target Account</p>
            <p style={{ fontWeight: 600, color: 'var(--graphite)' }}>{adminUser?.name || 'Admin'}</p>
            <p style={{ fontSize: '12px', color: 'var(--ash)' }}>{adminUser?.email || 'admin@elvanewear.com'}</p>
          </div>

          {passwordSuccess && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(90,138,106,0.1)', color: 'var(--success)', fontSize: '12px', marginBottom: '16px' }}>
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(163,64,64,0.1)', color: 'var(--danger)', fontSize: '12px', marginBottom: '16px' }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleUpdateAdminPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                Set New Admin Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="New strong password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
              />
            </div>

            <Button3D
              type="submit"
              variant="dark"
              size="md"
              disabled={passwordUpdating}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {passwordUpdating ? 'Updating...' : 'Set Admin Password'}
            </Button3D>
          </form>
        </div>
      </div>
    </div>
  );
}
