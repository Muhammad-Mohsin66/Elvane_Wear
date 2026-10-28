import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, ShieldCheck, CheckCircle2, AlertCircle, Heart, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button3D from '../components/Button3D';
import api, { formatPKR } from '../utils/api';

export default function Account() {
  const [searchParams] = useSearchParams();
  const orderSuccessNumber = searchParams.get('orderSuccess');

  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'wishlist'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'rgba(90, 138, 106, 0.1)', color: 'var(--success)', border: 'rgba(90, 138, 106, 0.25)' };
      case 'Dispatched':
        return { bg: 'rgba(184, 220, 240, 0.2)', color: '#2B6CB0', border: 'var(--hairline-sky)' };
      case 'Confirmed':
      case 'Processing':
        return { bg: 'rgba(212, 167, 106, 0.15)', color: 'var(--champagne)', border: 'var(--hairline-accent)' };
      default:
        return { bg: 'var(--cloud)', color: 'var(--ash)', border: 'var(--hairline)' };
    }
  };

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        {/* Order Success Announcement */}
        {orderSuccessNumber && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '20px 24px',
              borderRadius: '16px',
              background: 'rgba(90, 138, 106, 0.12)',
              border: '1px solid rgba(90, 138, 106, 0.3)',
              color: 'var(--success)',
              marginBottom: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <CheckCircle2 size={24} />
            <div>
              <p style={{ fontWeight: 600, fontSize: '15px' }}>Atelier Order Confirmed!</p>
              <p style={{ fontSize: '13px', marginTop: '2px' }}>
                Your order reference is <strong>{orderSuccessNumber}</strong>. We are preparing your tailored tracksuit set for packaging.
              </p>
            </div>
          </motion.div>
        )}

        {/* Account Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
              Client Sanctuary
            </span>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 500,
                color: 'var(--graphite)',
                marginTop: '6px',
              }}
            >
              Welcome, <em style={{ fontStyle: 'italic' }}>{user?.name || 'Client'}</em>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
              Email Status: {user?.isEmailVerified ? 'Verified Client' : 'Pending Verification'} • {user?.email}
            </p>
          </div>

          <Button3D
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
            icon={LogOut}
          >
            Sign Out
          </Button3D>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--hairline)', marginBottom: '36px' }}>
          {['orders', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--champagne)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--graphite)' : 'var(--ash)',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tab === 'orders' ? `Orders (${orders.length})` : 'Atelier Profile'}
            </button>
          ))}
        </div>

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>
                Retrieving your atelier records...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--cloud)', borderRadius: '20px' }}>
                <Package size={36} color="var(--mist)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>No orders placed yet</h3>
                <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '6px', marginBottom: '24px' }}>
                  Explore our luxury minimalist tracksuit sets.
                </p>
                <Button3D variant="primary" onClick={() => navigate('/shop')}>
                  Discover Tracksuits
                </Button3D>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {orders.map((order) => {
                  const badge = getStatusBadge(order.orderStatus);
                  return (
                    <div
                      key={order._id}
                      style={{
                        background: 'var(--snow)',
                        border: '1px solid var(--hairline)',
                        borderRadius: '20px',
                        padding: '28px',
                        boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
                      }}
                    >
                      {/* Order Header */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          borderBottom: '1px solid var(--hairline)',
                          paddingBottom: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <span className="eyebrow" style={{ fontSize: '10px' }}>Order Reference</span>
                          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--graphite)' }}>
                            {order.orderNumber}
                          </p>
                          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Status Badges */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span
                            style={{
                              padding: '5px 14px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              fontWeight: 600,
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {order.orderStatus}
                          </span>

                          {order.paymentMethod === 'JazzCash' && (
                            <span
                              style={{
                                padding: '5px 12px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                background: order.paymentStatus === 'Verified' ? 'rgba(90,138,106,0.1)' : 'rgba(212,167,106,0.1)',
                                color: order.paymentStatus === 'Verified' ? 'var(--success)' : 'var(--champagne)',
                                border: '1px solid var(--hairline)',
                              }}
                            >
                              JazzCash: {order.paymentStatus}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <div>
                              <p style={{ fontWeight: 600, color: 'var(--graphite)' }}>{item.title}</p>
                              <p style={{ fontSize: '11px', color: 'var(--ash)' }}>
                                Color: {item.color} • Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 600 }}>
                              {formatPKR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals & Discounts */}
                      <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div>
                          <p style={{ fontSize: '12px', color: 'var(--ash)' }}>
                            Payment: {order.paymentMethod} • Shipping: White-Glove
                          </p>
                          {order.discountAmount > 0 && (
                            <p style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>
                              Atelier Discount Applied: -{formatPKR(order.discountAmount)} ({order.discountPercent}%)
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="eyebrow" style={{ fontSize: '10px' }}>Total Amount</span>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 600, color: 'var(--graphite)' }}>
                            {formatPKR(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Content */}
        {activeTab === 'profile' && (
          <div style={{ background: 'var(--snow)', border: '1px solid var(--hairline)', borderRadius: '20px', padding: '36px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', marginBottom: '20px' }}>
              Atelier Profile Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>Name</label>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{user?.name}</p>
              </div>
              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>Email</label>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{user?.email}</p>
              </div>
              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>Phone</label>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>Saved Address</label>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>
                  {user?.address?.street ? `${user.address.street}, ${user.address.city}, Pakistan` : 'No address saved yet'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
