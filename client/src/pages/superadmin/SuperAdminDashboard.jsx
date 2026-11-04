import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, KeyRound, Activity, BarChart3, TrendingUp, Users,
  ShoppingBag, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw,
  Search, X, UserPlus, Eye, Package, Phone, Mail, MapPin, Truck,
  Calendar, DollarSign, Award, Clock, ChevronRight, Lock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api, { formatPKR } from '../../utils/api';
import Button3D from '../../components/Button3D';
import { useAuthStore } from '../../store/authStore';

const PIPELINE_COLORS = {
  'Pending Review': '#D4A76A',
  'Confirmed': '#3B82F6',
  'Processing': '#8B5CF6',
  'Dispatched': '#0EA5E9',
  'Delivered': '#22C55E',
  'Cancelled': '#EF4444',
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'admins' | 'customers'
  const [period, setPeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const [loading, setLoading] = useState(true);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  // Modal / Selection states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  const [customerSearch, setCustomerSearch] = useState('');

  // Add Admin modal state
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminCreateError, setAdminCreateError] = useState('');
  const [adminCreateSuccess, setAdminCreateSuccess] = useState('');

  // Reset Admin Password modal / state
  const [selectedAdminForPassword, setSelectedAdminForPassword] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes, ordersRes, adminsRes, customersRes] = await Promise.all([
        api.get(`/super-admin/analytics?period=${period}`),
        api.get('/super-admin/audit-logs'),
        api.get('/orders'),
        api.get('/super-admin/admins'),
        api.get('/super-admin/customers'),
      ]);
      setAnalytics(analyticsRes.data);
      setAuditLogs(logsRes.data.logs || []);
      setOrders(ordersRes.data || []);
      setAdminsList(adminsRes.data || []);
      setCustomersList(customersRes.data || []);
    } catch (err) {
      console.error('Super Admin data load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreatingAdmin(true);
    setAdminCreateError('');
    setAdminCreateSuccess('');
    try {
      await api.post('/super-admin/admins', {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
      });
      setAdminCreateSuccess(`Store Admin ${newAdminName} created successfully!`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      // Reload admins and audit logs
      const [adminsRes, logsRes] = await Promise.all([
        api.get('/super-admin/admins'),
        api.get('/super-admin/audit-logs')
      ]);
      setAdminsList(adminsRes.data || []);
      setAuditLogs(logsRes.data.logs || []);
      setTimeout(() => {
        setShowAddAdminModal(false);
        setAdminCreateSuccess('');
      }, 1500);
    } catch (err) {
      setAdminCreateError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleUpdateAdminPassword = async (e) => {
    e.preventDefault();
    if (!selectedAdminForPassword) return;
    setPasswordUpdating(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await api.put('/super-admin/admin-password', {
        adminId: selectedAdminForPassword._id,
        newPassword: adminNewPassword,
      });
      setPasswordSuccess(`Password updated for ${selectedAdminForPassword.name}. Audit packet generated.`);
      setAdminNewPassword('');
      const logsRes = await api.get('/super-admin/audit-logs');
      setAuditLogs(logsRes.data.logs || []);
      setTimeout(() => {
        setSelectedAdminForPassword(null);
        setPasswordSuccess('');
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update admin password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
      // Refresh audit logs
      const logsRes = await api.get('/super-admin/audit-logs');
      setAuditLogs(logsRes.data.logs || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return { bg: 'rgba(212, 167, 106, 0.12)', color: '#B8860B', border: 'rgba(212, 167, 106, 0.3)' };
      case 'Confirmed':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Processing':
        return { bg: 'rgba(147, 51, 234, 0.1)', color: '#7C3AED', border: 'rgba(147, 51, 234, 0.3)' };
      case 'Dispatched':
        return { bg: 'rgba(14, 165, 233, 0.12)', color: '#0284C7', border: 'rgba(14, 165, 233, 0.3)' };
      case 'Delivered':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: '#16A34A', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Cancelled':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'var(--cloud)', color: 'var(--ash)', border: 'var(--hairline)' };
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
      case 'ADMIN_CREATED':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563EB' };
      case 'ADMIN_PASSWORD_CHANGED':
        return { bg: 'rgba(163, 64, 64, 0.15)', color: 'var(--danger)' };
      case 'ORDER_STATUS_UPDATED':
        return { bg: 'rgba(14, 165, 233, 0.15)', color: '#0284C7' };
      default:
        return { bg: 'var(--cloud)', color: 'var(--ash)' };
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(orderSearch) ||
      o.shippingAddress?.city?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(orderSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (orderFilter === 'active') {
      return ['Pending', 'Confirmed', 'Processing'].includes(o.orderStatus);
    }
    if (orderFilter === 'completed') {
      return ['Dispatched', 'Delivered', 'Cancelled'].includes(o.orderStatus);
    }
    return true;
  });

  const filteredCustomers = customersList.filter((c) => {
    const term = customerSearch.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      c.city?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--snow)', color: 'var(--ash)' }}>
        Authenticating Executive Protocols & Feeds...
      </div>
    );
  }

  const pipelineData = analytics?.orderPipeline && analytics.orderPipeline.length > 0
    ? analytics.orderPipeline
    : [{ name: 'All Orders Delivered / Pending', value: analytics?.totalOrders || 1, color: '#D4A76A' }];

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 48px)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src="/logo.png" alt="Elvane Wear" style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
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
            Executive Operations & Governance
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Omnichannel order inspection, store admin governance, registered clients directory, and audit logs.
          </p>
        </div>

        {/* Top actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
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

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'overview', label: 'Executive Overview', icon: BarChart3, count: null },
          { id: 'orders', label: 'Live Store Orders', icon: ShoppingBag, count: orders.length },
          { id: 'admins', label: 'Admin Accounts', icon: KeyRound, count: adminsList.length },
          { id: 'customers', label: 'Client Directory', icon: Users, count: customersList.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '2px solid var(--champagne)' : '2px solid transparent',
                color: isActive ? 'var(--graphite)' : 'var(--ash)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={isActive ? 'var(--champagne)' : 'var(--ash)'} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(212, 167, 106, 0.2)' : 'var(--cloud)',
                    color: isActive ? 'var(--champagne)' : 'var(--ash)',
                    fontWeight: 600,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {/* KPI Overview Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
              <span className="eyebrow" style={{ fontSize: '10px' }}>Total Platform Revenue</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
                {formatPKR(analytics?.totalRevenue || 0)}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--success)' }}>Gross 100% COD Volume (PKR)</span>
            </div>

            <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '18px', border: '1px solid var(--hairline)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
              <span className="eyebrow" style={{ fontSize: '10px' }}>Total Orders</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
                {analytics?.totalOrders || 0}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Nationwide Dispatch</span>
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
              <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Active Client Accounts</span>
            </div>
          </div>

          {/* CHARTS SECTION: Revenue Trajectory + Order Fulfillment Pipeline (replacing JazzCash) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(20px, 3vw, 32px)', marginBottom: '32px' }}>
            {/* Revenue Trajectory */}
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

              <div style={{ height: '300px', width: '100%' }}>
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

            {/* ORDER FULFILLMENT PIPELINE (Replaces COD vs JazzCash chart) */}
            <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: 'clamp(20px, 3.5vw, 32px)', boxShadow: '0 4px 18px rgba(26,26,26,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Fulfillment Pipeline</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(90, 138, 106, 0.12)',
                      color: 'var(--success)',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    100% Cash on Delivery
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginTop: '4px' }}>
                  Live Orders Pipeline
                </h3>
              </div>

              <div style={{ height: '220px', width: '100%', margin: '12px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                      {pipelineData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={PIPELINE_COLORS[entry.name] || '#D4A76A'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--cloud)', borderRadius: '12px', border: '1px solid var(--hairline)', fontSize: '12px', color: 'var(--charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--champagne)" />
                <span>
                  <strong>COD Policy Active:</strong> All customer orders across Pakistan are processed via standard Cash on Delivery. Online payment channels are permanently disabled.
                </span>
              </div>
            </div>
          </div>

          {/* Top Selling Products Leaderboard + Audit Logs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(20px, 3vw, 32px)' }}>
            {/* Top Products */}
            <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Atelier Performance</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>
                    Top Selling Products
                  </h3>
                </div>
                <Award size={20} color="var(--champagne)" />
              </div>

              {!analytics?.topProducts || analytics.topProducts.length === 0 ? (
                <p style={{ color: 'var(--ash)', fontSize: '13px' }}>
                  No product sales recorded yet. Once orders are fulfilled, top grossing luxury tracksuits will display here.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analytics.topProducts.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--cloud)',
                        borderRadius: '12px',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '14px' }}>
                          {idx + 1}. {p.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>
                          Units Sold: <strong>{p.sold}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--graphite)' }}>
                        {formatPKR(p.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit Logs */}
            <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Immutable Records</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>
                    Admin Activity Logs ({auditLogs.length})
                  </h3>
                </div>
                <Activity size={20} color="var(--champagne)" />
              </div>

              {auditLogs.length === 0 ? (
                <p style={{ color: 'var(--ash)', fontSize: '13px' }}>
                  No administrative actions recorded yet. All admin modifications create audit records here.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {auditLogs.slice(0, 15).map((log) => {
                    const badge = getActionBadgeColor(log.actionType);
                    return (
                      <div
                        key={log._id}
                        style={{
                          background: 'var(--cloud)',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          border: '1px solid var(--hairline)',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '9px',
                              fontWeight: 600,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              background: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {log.actionType}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--mist)' }}>
                            {new Date(log.createdAt).toLocaleString('en-PK', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p style={{ color: 'var(--charcoal)', marginBottom: '4px', fontWeight: 500 }}>
                          {log.description}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--ash)' }}>
                          By: {log.adminName} ({log.adminEmail})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: LIVE STORE ORDERS (With Detailed Inspection & Full Dossier) */}
      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {/* Controls: Search + Filter Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', background: 'var(--cloud)', padding: '4px', borderRadius: '999px' }}>
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'active', label: 'Active / In-Transit' },
                { id: 'completed', label: 'Completed / Delivered' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setOrderFilter(pill.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    border: 'none',
                    background: orderFilter === pill.id ? 'var(--graphite)' : 'transparent',
                    color: orderFilter === pill.id ? 'var(--snow)' : 'var(--ash)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: 'clamp(240px, 30vw, 360px)' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ash)' }} />
              <input
                type="text"
                placeholder="Search order #, customer, phone, city..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '999px',
                  border: '1px solid var(--hairline)',
                  background: 'var(--snow)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)' }}>
              <ShoppingBag size={40} color="var(--mist)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--graphite)' }}>
                No Orders Matching Your Criteria
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
                Try adjusting your search terms or filter selection.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.orderStatus);
                return (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      background: 'var(--snow)',
                      borderRadius: '16px',
                      border: '1px solid var(--hairline)',
                      padding: '20px 24px',
                      boxShadow: '0 4px 14px rgba(26,26,26,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--champagne)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
                  >
                    {/* Order Reference & Customer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'var(--cloud)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--champagne)',
                        }}
                      >
                        <Package size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>
                            {order.orderNumber}
                          </span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '10px',
                              fontWeight: 600,
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`,
                            }}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '2px' }}>
                          Client: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone}) • {order.shippingAddress?.city}
                        </div>
                      </div>
                    </div>

                    {/* Items snippet */}
                    <div style={{ fontSize: '13px', color: 'var(--charcoal)', flex: 1, minWidth: '200px' }}>
                      <span style={{ color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items: </span>
                      {order.items?.map((it) => `${it.title} (${it.size}, x${it.quantity})`).join(', ')}
                    </div>

                    {/* Total & Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--ash)', textTransform: 'uppercase' }}>COD Amount</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600, color: 'var(--graphite)' }}>
                          {formatPKR(order.total)}
                        </div>
                      </div>
                      <Button3D variant="outline" size="sm" icon={Eye} onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                        Inspect Dossier
                      </Button3D>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: ADMIN ACCOUNTS & GOVERNANCE */}
      {activeTab === 'admins' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Atelier Personnel</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: 'var(--graphite)' }}>
                Store Admins Directory
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '2px' }}>
                All administrators authorized to manage products, categories, and customer orders.
              </p>
            </div>
            <Button3D variant="dark" size="sm" icon={UserPlus} onClick={() => setShowAddAdminModal(true)}>
              + Add New Admin
            </Button3D>
          </div>

          {/* Security Banner */}
          <div style={{ padding: '16px 20px', background: 'rgba(212, 167, 106, 0.08)', border: '1px solid var(--hairline-accent)', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Lock size={20} color="var(--champagne)" />
            <div style={{ fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.5 }}>
              <strong>Super Admin Custody:</strong> Store Admins do not possess permission to reset their own passwords. As Super Admin, you can provision new store managers and rotate credentials at will.
            </div>
          </div>

          {/* Admins Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {adminsList.map((adm) => (
              <div
                key={adm._id}
                style={{
                  background: 'var(--snow)',
                  borderRadius: '18px',
                  border: '1px solid var(--hairline)',
                  padding: '24px',
                  boxShadow: '0 4px 18px rgba(26,26,26,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '999px',
                          background: 'rgba(212, 167, 106, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--champagne)',
                          fontWeight: 600,
                          fontSize: '16px',
                        }}
                      >
                        {adm.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--graphite)' }}>
                          {adm.name}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--ash)' }}>
                          {adm.email}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: 600,
                        background: 'rgba(90, 138, 106, 0.12)',
                        color: 'var(--success)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Active Admin
                    </span>
                  </div>

                  <div style={{ padding: '12px 14px', background: 'var(--cloud)', borderRadius: '10px', fontSize: '12px', color: 'var(--ash)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                    <div>
                      Account ID: <span style={{ fontFamily: 'monospace', color: 'var(--charcoal)' }}>{adm._id}</span>
                    </div>
                    <div>
                      Provisioned: <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{new Date(adm.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <Button3D
                  variant="outline"
                  size="sm"
                  icon={KeyRound}
                  onClick={() => {
                    setSelectedAdminForPassword(adm);
                    setPasswordSuccess('');
                    setPasswordError('');
                    setAdminNewPassword('');
                  }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Rotate / Change Password
                </Button3D>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: CLIENT DIRECTORY */}
      {activeTab === 'customers' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Clientele Registry</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: 'var(--graphite)' }}>
                Registered Customers ({customersList.length})
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '2px' }}>
                Complete directory of customer accounts, contact details, order frequency, and lifetime spending.
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: 'clamp(240px, 30vw, 360px)' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ash)' }} />
              <input
                type="text"
                placeholder="Search by name, email, city, phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '999px',
                  border: '1px solid var(--hairline)',
                  background: 'var(--snow)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)' }}>
              <Users size={40} color="var(--mist)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--graphite)' }}>
                No Customers Found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
                No registered customers match your search query.
              </p>
            </div>
          ) : (
            <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', overflow: 'hidden', boxShadow: '0 4px 18px rgba(26,26,26,0.03)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--cloud)', borderBottom: '1px solid var(--hairline)', color: 'var(--ash)' }}>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Details</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Orders</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lifetime Spent</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--hairline)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--graphite)' }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ash)' }}>{c.email}</div>
                          {c.totalSpent > 30000 && (
                            <span style={{ display: 'inline-block', marginTop: '4px', padding: '1px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 700, background: 'rgba(212, 167, 106, 0.2)', color: 'var(--champagne)' }}>
                              VIP CLIENT
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--charcoal)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={13} color="var(--ash)" />
                            <span>{c.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--charcoal)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} color="var(--ash)" />
                            <span>{c.city || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--graphite)' }}>
                          {c.totalOrders}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--champagne)', fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }}>
                          {formatPKR(c.totalSpent)}
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--ash)', fontSize: '12px' }}>
                          {new Date(c.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* MODAL 1: ORDER DOSSIER MODAL (Full inspection of selected order) */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 15, 15, 0.65)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'var(--snow)',
                borderRadius: '24px',
                border: '1px solid var(--hairline)',
                padding: 'clamp(20px, 3.5vw, 36px)',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                zIndex: 1,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--hairline)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={20} color="var(--champagne)" />
                    <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Order Dossier</span>
                  </div>
                  <h3 style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: 'var(--graphite)', marginTop: '4px' }}>
                    {selectedOrder.orderNumber}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>
                    Placed on: {new Date(selectedOrder.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: 'var(--cloud)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ash)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Selector */}
              <div style={{ background: 'var(--cloud)', padding: '16px 20px', borderRadius: '16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Fulfillment Status</span>
                  <div style={{ fontSize: '13px', color: 'var(--charcoal)', marginTop: '2px' }}>
                    Current: <strong>{selectedOrder.orderStatus}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--ash)' }}>Change to:</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--hairline)',
                      background: 'var(--snow)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Delivery Address */}
              <div style={{ background: 'var(--snow)', border: '1px solid var(--hairline)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
                <span className="eyebrow" style={{ color: 'var(--champagne)', display: 'block', marginBottom: '10px' }}>
                  Customer & Shipping Address
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ash)' }}>Recipient Name</div>
                    <div style={{ fontWeight: 600, color: 'var(--graphite)' }}>{selectedOrder.shippingAddress?.fullName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ash)' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, color: 'var(--graphite)' }}>{selectedOrder.shippingAddress?.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ash)' }}>City & Postal</div>
                    <div style={{ fontWeight: 600, color: 'var(--graphite)' }}>{selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.postalCode ? `(${selectedOrder.shippingAddress.postalCode})` : ''}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ash)' }}>Street Address</div>
                    <div style={{ color: 'var(--charcoal)' }}>{selectedOrder.shippingAddress?.street}</div>
                  </div>
                </div>
                {selectedOrder.shippingAddress?.specialInstructions && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--cloud)', borderRadius: '8px', fontSize: '12px', color: 'var(--charcoal)' }}>
                    <strong>Delivery Note:</strong> {selectedOrder.shippingAddress.specialInstructions}
                  </div>
                )}
              </div>

              {/* Ordered Products Items */}
              <div style={{ marginBottom: '20px' }}>
                <span className="eyebrow" style={{ color: 'var(--champagne)', display: 'block', marginBottom: '10px' }}>
                  Ordered Items ({selectedOrder.items?.length || 0})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--cloud)',
                        borderRadius: '12px',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', background: 'var(--snow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="var(--ash)" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '13px' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '2px' }}>
                            Color: <strong>{item.color}</strong> • Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--graphite)', fontSize: '14px' }}>
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div style={{ background: 'var(--cloud)', padding: '18px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ash)' }}>
                  <span>Subtotal</span>
                  <span>{formatPKR(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--champagne)', fontWeight: 600 }}>
                    <span>Special Discount Applied</span>
                    <span>-{formatPKR(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ash)' }}>
                  <span>Payment Method</span>
                  <span><strong>100% Cash on Delivery (COD)</strong></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--hairline)', paddingTop: '10px', fontSize: '18px', fontWeight: 700, color: 'var(--graphite)' }}>
                  <span>Total Due at Doorstep</span>
                  <span style={{ color: 'var(--champagne)', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>
                    {formatPKR(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD NEW STORE ADMIN */}
      <AnimatePresence>
        {showAddAdminModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddAdminModal(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 15, 15, 0.65)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'var(--snow)',
                borderRadius: '24px',
                border: '1px solid var(--hairline)',
                padding: 'clamp(20px, 3.5vw, 36px)',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserPlus size={22} color="var(--champagne)" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--graphite)' }}>
                    Provision Store Admin
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddAdminModal(false)}
                  style={{ background: 'var(--cloud)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ash)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--ash)', marginBottom: '20px', lineHeight: 1.5 }}>
                Create a new Store Administrator account. The newly created admin will have write privileges for products and order dispatch.
              </p>

              {adminCreateSuccess && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(90,138,106,0.12)', color: 'var(--success)', fontSize: '12px', marginBottom: '16px' }}>
                  {adminCreateSuccess}
                </div>
              )}

              {adminCreateError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(163,64,64,0.12)', color: 'var(--danger)', fontSize: '12px', marginBottom: '16px' }}>
                  {adminCreateError}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atelier Store Manager"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--hairline)', background: 'var(--snow)' }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Login Email</label>
                  <input
                    type="email"
                    required
                    placeholder="manager@elvanewear.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--hairline)', background: 'var(--snow)' }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Initial Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--hairline)', background: 'var(--snow)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button3D type="button" variant="ghost" size="md" onClick={() => setShowAddAdminModal(false)} style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </Button3D>
                  <Button3D type="submit" variant="dark" size="md" disabled={creatingAdmin} style={{ flex: 1, justifyContent: 'center' }}>
                    {creatingAdmin ? 'Creating...' : 'Create Admin'}
                  </Button3D>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ROTATE ADMIN PASSWORD */}
      <AnimatePresence>
        {selectedAdminForPassword && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdminForPassword(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 15, 15, 0.65)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'var(--snow)',
                borderRadius: '24px',
                border: '1px solid var(--hairline)',
                padding: 'clamp(20px, 3.5vw, 36px)',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <KeyRound size={22} color="var(--champagne)" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--graphite)' }}>
                    Rotate Admin Password
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAdminForPassword(null)}
                  style={{ background: 'var(--cloud)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ash)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--cloud)', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>
                <span className="eyebrow" style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>Target Account</span>
                <strong style={{ color: 'var(--graphite)' }}>{selectedAdminForPassword.name}</strong> ({selectedAdminForPassword.email})
              </div>

              {passwordSuccess && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(90,138,106,0.12)', color: 'var(--success)', fontSize: '12px', marginBottom: '16px' }}>
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(163,64,64,0.12)', color: 'var(--danger)', fontSize: '12px', marginBottom: '16px' }}>
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleUpdateAdminPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Set New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new strong password"
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--hairline)', background: 'var(--snow)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button3D type="button" variant="ghost" size="md" onClick={() => setSelectedAdminForPassword(null)} style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </Button3D>
                  <Button3D type="submit" variant="dark" size="md" disabled={passwordUpdating} style={{ flex: 1, justifyContent: 'center' }}>
                    {passwordUpdating ? 'Updating...' : 'Set Password'}
                  </Button3D>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
