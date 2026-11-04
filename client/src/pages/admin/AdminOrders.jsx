import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Check, X, Tag, Filter, Clock, Search, ZoomIn, MapPin,
  Phone, Mail, User, Package, Calendar, Printer, ExternalLink,
  ShieldCheck, CreditCard, ChevronRight, FileText
} from 'lucide-react';
import api, { formatPKR } from '../../utils/api';
import Button3D from '../../components/Button3D';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('active'); // 'active' | 'completed' | 'all'
  const [search, setSearch] = useState('');

  // Selected Order for Detail View Modal
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);

  // JazzCash Modal State
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [selectedOrderForVerification, setSelectedOrderForVerification] = useState(null);

  // Discount Modal State
  const [discountModalOrder, setDiscountModalOrder] = useState(null);
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [updatingDiscount, setUpdatingDiscount] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      // If modal is open, keep its state in sync with fresh data
      if (selectedDetailOrder) {
        const refreshed = data.find((o) => o._id === selectedDetailOrder._id);
        if (refreshed) setSelectedDetailOrder(refreshed);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedDetailOrder || discountModalOrder || selectedScreenshot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDetailOrder, discountModalOrder, selectedScreenshot]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleVerifyPayment = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/verify-payment`, { paymentStatus: status });
      setSelectedScreenshot(null);
      setSelectedOrderForVerification(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountModalOrder) return;
    setUpdatingDiscount(true);
    try {
      await api.put(`/orders/${discountModalOrder._id}/discount`, {
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
        discountAmount: discountAmount ? Number(discountAmount) : undefined,
      });
      setDiscountModalOrder(null);
      setDiscountPercent('');
      setDiscountAmount('');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply bill discount');
    } finally {
      setUpdatingDiscount(false);
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.phone?.includes(search) ||
      order.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'active') {
      return ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);
    }
    if (filterTab === 'completed') {
      return ['Dispatched', 'Delivered', 'Cancelled'].includes(order.orderStatus);
    }
    return true;
  });

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Fulfillment Management
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 36px)', color: 'var(--graphite)', marginTop: '4px' }}>
            Store Orders
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Manage client orders, dispatch COD parcels nationwide, and view customer order details.
          </p>
        </div>

        {/* Search */}
        <div style={{ background: 'var(--cloud)', borderRadius: '999px', border: '1px solid var(--hairline)', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '100%' }}>
          <Search size={15} color="var(--ash)" />
          <input
            type="text"
            placeholder="Search ref, customer, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '13px', width: '240px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '28px' }}>
        {[
          { key: 'active', label: 'Ongoing / Active Orders' },
          { key: 'completed', label: 'Dispatched & Completed' },
          { key: 'all', label: 'All Orders' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
              cursor: 'pointer',
              background: filterTab === tab.key ? 'var(--graphite)' : 'var(--cloud)',
              color: filterTab === tab.key ? 'var(--snow)' : 'var(--charcoal)',
              border: filterTab === tab.key ? '1px solid var(--graphite)' : '1px solid var(--hairline)',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>Loading Orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--cloud)', borderRadius: '16px', color: 'var(--ash)' }}>
          No orders found matching this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((order) => {
            const stColor = getStatusColor(order.orderStatus);
            return (
              <div
                key={order._id}
                onClick={() => setSelectedDetailOrder(order)}
                style={{
                  background: 'var(--snow)',
                  border: '1px solid var(--hairline)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  boxShadow: '0 4px 16px rgba(26,26,26,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--champagne)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(212, 167, 106, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hairline)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,26,26,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--hairline)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--champagne)' }}>ORDER REF</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: '999px',
                          background: stColor.bg,
                          color: stColor.color,
                          border: `1px solid ${stColor.border}`,
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--graphite)', marginTop: '2px' }}>
                      {order.orderNumber}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>
                      Client: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone}) • {order.shippingAddress?.city}
                    </p>
                  </div>

                  {/* Right side controls */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}
                    onClick={(e) => e.stopPropagation()} // Prevent opening detail modal when interacting with dropdown
                  >
                    <label className="eyebrow" style={{ fontSize: '10px' }}>Status:</label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'var(--cloud)',
                        cursor: 'pointer',
                        border: '1px solid var(--hairline)',
                        outline: 'none',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Manual Bill Discount Button */}
                    <button
                      onClick={() => {
                        setDiscountModalOrder(order);
                        setDiscountPercent(order.discountPercent || '');
                        setDiscountAmount(order.discountAmount || '');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(212, 167, 106, 0.1)',
                        border: '1px solid var(--hairline-accent)',
                        color: 'var(--champagne)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      title="Adjust Discount on bill"
                    >
                      <Tag size={12} />
                      <span>Adjust Bill Discount</span>
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedDetailOrder(order)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'var(--graphite)',
                        color: 'var(--snow)',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <Eye size={13} />
                      <span>Order Details</span>
                    </button>
                  </div>
                </div>

                {/* Items Summary Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--cloud)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, color: 'var(--graphite)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </p>
                        <p style={{ color: 'var(--ash)', marginTop: '2px', fontSize: '11px' }}>
                          Color: <strong>{item.color}</strong> • Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong>
                        </p>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '13px' }}>
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial & Payment Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--hairline)' }}>
                  {/* Payment info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--charcoal)' }}>
                      Payment: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</strong>
                    </span>

                    {order.paymentMethod === 'JazzCash' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: order.paymentStatus === 'Verified' ? 'rgba(90,138,106,0.1)' : 'rgba(212,167,106,0.1)',
                            color: order.paymentStatus === 'Verified' ? 'var(--success)' : 'var(--champagne)',
                            fontWeight: 600,
                          }}
                        >
                          {order.paymentStatus}
                        </span>

                        {order.jazzCashScreenshot && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedScreenshot(order.jazzCashScreenshot);
                              setSelectedOrderForVerification(order);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'none',
                              border: 'none',
                              color: 'var(--champagne)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <ZoomIn size={12} />
                            <span>View Screenshot</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Subtotal, Discount & Total */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                    {order.discountAmount > 0 && (
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                        Discount: -{formatPKR(order.discountAmount)} ({order.discountPercent}%)
                      </span>
                    )}
                    <span className="eyebrow" style={{ fontSize: '10px' }}>Final Total:</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: 'var(--graphite)' }}>
                      {formatPKR(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ORDER DETAILS DOSSIER MODAL (FULL SCREEN CENTERED)    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedDetailOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailOrder(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(18, 20, 24, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 140,
              }}
            />

            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(16px, 3vw, 32px)',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  maxWidth: '780px',
                  width: '100%',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                  padding: 'clamp(24px, 4vw, 36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--hairline)', paddingBottom: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="eyebrow" style={{ color: 'var(--champagne)', fontSize: '10px' }}>
                        CUSTOMER ORDER DETAILS
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: '999px',
                          ...getStatusColor(selectedDetailOrder.orderStatus),
                        }}
                      >
                        {selectedDetailOrder.orderStatus}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--graphite)', margin: 0 }}>
                      {selectedDetailOrder.orderNumber}
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>
                        Placed on {new Date(selectedDetailOrder.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDetailOrder(null)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--cloud)',
                      border: '1px solid var(--hairline)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--ash)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--graphite)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--cloud)';
                      e.currentTarget.style.color = 'var(--ash)';
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Status Bar & Actions */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: 'var(--cloud)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal)' }}>Change Order Status:</span>
                    <select
                      value={selectedDetailOrder.orderStatus}
                      onChange={(e) => handleStatusChange(selectedDetailOrder._id, e.target.value)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: '#FFFFFF',
                        border: '1px solid var(--hairline)',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setDiscountModalOrder(selectedDetailOrder);
                        setDiscountPercent(selectedDetailOrder.discountPercent || '');
                        setDiscountAmount(selectedDetailOrder.discountAmount || '');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: '#FFFFFF',
                        border: '1px solid var(--hairline-accent)',
                        color: 'var(--champagne)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Tag size={12} />
                      <span>Adjust Discount</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: '#FFFFFF',
                        border: '1px solid var(--hairline)',
                        color: 'var(--graphite)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Printer size={12} />
                      <span>Print Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Customer & Shipping 2-Col Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  {/* Customer Info Card */}
                  <div style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--hairline)', background: '#FAFAFA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--champagne)' }}>
                      <User size={16} />
                      <span className="eyebrow" style={{ fontSize: '11px' }}>Customer Contact</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>Client Full Name</span>
                        <strong style={{ color: 'var(--graphite)', fontSize: '14px' }}>
                          {selectedDetailOrder.shippingAddress?.fullName || 'N/A'}
                        </strong>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>Phone Number</span>
                        <a
                          href={`tel:${selectedDetailOrder.shippingAddress?.phone}`}
                          style={{ color: 'var(--graphite)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Phone size={13} color="var(--champagne)" />
                          <span>{selectedDetailOrder.shippingAddress?.phone || 'N/A'}</span>
                        </a>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>Account Email</span>
                        <span style={{ color: 'var(--graphite)', wordBreak: 'break-all' }}>
                          {selectedDetailOrder.user?.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Card */}
                  <div style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--hairline)', background: '#FAFAFA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--champagne)' }}>
                      <MapPin size={16} />
                      <span className="eyebrow" style={{ fontSize: '11px' }}>Shipping Address</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>Street Address</span>
                        <strong style={{ color: 'var(--graphite)', lineHeight: 1.4 }}>
                          {selectedDetailOrder.shippingAddress?.street || 'N/A'}
                        </strong>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>City</span>
                          <span style={{ color: 'var(--graphite)', fontWeight: 500 }}>
                            {selectedDetailOrder.shippingAddress?.city || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>Postal Code</span>
                          <span style={{ color: 'var(--graphite)', fontWeight: 500 }}>
                            {selectedDetailOrder.shippingAddress?.zip || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>State / Country</span>
                        <span style={{ color: 'var(--graphite)' }}>
                          {selectedDetailOrder.shippingAddress?.state || 'Pakistan'}, {selectedDetailOrder.shippingAddress?.country || 'Pakistan'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Package size={16} color="var(--champagne)" />
                    <span className="eyebrow" style={{ fontSize: '11px' }}>
                      Ordered Articles ({selectedDetailOrder.items?.length || 0})
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedDetailOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '14px',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          background: '#FAFAFA',
                          border: '1px solid var(--hairline)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                          )}
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--graphite)', margin: 0 }}>
                              {item.title}
                            </h4>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px', color: 'var(--ash)' }}>
                              <span>Color: <strong style={{ color: 'var(--graphite)' }}>{item.color}</strong></span>
                              <span>•</span>
                              <span>Size: <strong style={{ color: 'var(--graphite)' }}>{item.size}</strong></span>
                              <span>•</span>
                              <span>Qty: <strong style={{ color: 'var(--graphite)' }}>{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block' }}>
                            {formatPKR(item.price)} × {item.quantity}
                          </span>
                          <strong style={{ fontSize: '14px', color: 'var(--graphite)' }}>
                            {formatPKR(item.price * item.quantity)}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Grand Total Card */}
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%)',
                    border: '1px solid var(--hairline-accent)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
                    {/* Payment Mode */}
                    <div>
                      <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--champagne)' }}>Payment Channel</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <CreditCard size={16} color="var(--graphite)" />
                        <strong style={{ fontSize: '14px', color: 'var(--graphite)' }}>
                          {selectedDetailOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : selectedDetailOrder.paymentMethod}
                        </strong>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: selectedDetailOrder.paymentStatus === 'Verified' ? 'rgba(34,197,94,0.15)' : 'rgba(212,167,106,0.2)',
                            color: selectedDetailOrder.paymentStatus === 'Verified' ? 'var(--success)' : 'var(--champagne)',
                          }}
                        >
                          {selectedDetailOrder.paymentStatus}
                        </span>
                      </div>

                      {selectedDetailOrder.paymentMethod === 'JazzCash' && selectedDetailOrder.jazzCashScreenshot && (
                        <button
                          onClick={() => {
                            setSelectedScreenshot(selectedDetailOrder.jazzCashScreenshot);
                            setSelectedOrderForVerification(selectedDetailOrder);
                          }}
                          style={{
                            marginTop: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--champagne)',
                            background: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            border: '1px solid var(--hairline-accent)',
                            cursor: 'pointer',
                          }}
                        >
                          <ZoomIn size={12} />
                          <span>Inspect JazzCash Proof</span>
                        </button>
                      )}
                    </div>

                    {/* Breakdown Totals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ash)' }}>
                        <span>Subtotal:</span>
                        <span>{formatPKR(selectedDetailOrder.subtotal)}</span>
                      </div>

                      {selectedDetailOrder.discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                          <span>Discount Applied ({selectedDetailOrder.discountPercent}%):</span>
                          <span>-{formatPKR(selectedDetailOrder.discountAmount)}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ash)' }}>
                        <span>Courier Shipping:</span>
                        <span style={{ color: 'var(--success)', fontWeight: 500 }}>Free Standard Delivery</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--hairline)', paddingTop: '8px', marginTop: '4px' }}>
                        <span className="eyebrow" style={{ fontSize: '11px' }}>Final Amount Payable:</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: 'var(--graphite)' }}>
                          {formatPKR(selectedDetailOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button3D
                    variant="dark"
                    size="md"
                    onClick={() => setSelectedDetailOrder(null)}
                  >
                    Done & Close
                  </Button3D>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. MANUAL BILL DISCOUNT ADJUSTMENT MODAL (PERFECT CENTER) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {discountModalOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDiscountModalOrder(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(18, 20, 24, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 160,
              }}
            />

            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 170,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  background: 'var(--snow)',
                  borderRadius: '24px',
                  padding: '32px',
                  maxWidth: '480px',
                  width: '100%',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--hairline)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={18} color="var(--champagne)" />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: 0 }}>
                      Adjust Order Bill Discount
                    </h3>
                  </div>
                  <button
                    onClick={() => setDiscountModalOrder(null)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--cloud)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--ash)', marginBottom: '20px', lineHeight: 1.5 }}>
                  Apply promotional discount percentage (e.g. 15% from storewide announcement) or fixed PKR reduction to <strong>{discountModalOrder.orderNumber}</strong>.
                </p>

                <div style={{ padding: '14px 18px', background: 'var(--cloud)', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Original Bill Subtotal:</span>
                  <strong style={{ fontSize: '15px' }}>{formatPKR(discountModalOrder.subtotal)}</strong>
                </div>

                <form onSubmit={handleApplyDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 15"
                      value={discountPercent}
                      onChange={(e) => {
                        setDiscountPercent(e.target.value);
                        if (e.target.value) {
                          const calculated = Math.round(discountModalOrder.subtotal * (Number(e.target.value) / 100));
                          setDiscountAmount(calculated);
                        } else {
                          setDiscountAmount('');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--hairline)',
                        background: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                      Or Fixed PKR Amount (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2500"
                      value={discountAmount}
                      onChange={(e) => {
                        setDiscountAmount(e.target.value);
                        if (e.target.value) {
                          const calculatedPct = Math.round((Number(e.target.value) / discountModalOrder.subtotal) * 100);
                          setDiscountPercent(calculatedPct);
                        } else {
                          setDiscountPercent('');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--hairline)',
                        background: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <Button3D
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={updatingDiscount}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {updatingDiscount ? 'Recalculating...' : 'Apply & Save Bill'}
                    </Button3D>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 3. JAZZCASH SCREENSHOT VERIFICATION (PERFECT CENTER)     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedScreenshot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScreenshot(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(18, 20, 24, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 160,
              }}
            />

            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 170,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  background: 'var(--snow)',
                  borderRadius: '24px',
                  padding: '32px',
                  maxWidth: '520px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--hairline)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', margin: 0 }}>
                    Verify JazzCash Payment Proof
                  </h3>
                  <button
                    onClick={() => setSelectedScreenshot(null)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--cloud)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--ash)', marginBottom: '16px' }}>
                  Order: <strong>{selectedOrderForVerification?.orderNumber}</strong> • Total Payable: <strong>{formatPKR(selectedOrderForVerification?.total)}</strong>
                  {selectedOrderForVerification?.jazzCashTransactionId && (
                    <span> • TID: <strong>{selectedOrderForVerification.jazzCashTransactionId}</strong></span>
                  )}
                </p>

                {/* Zoomable Image Preview */}
                <div
                  style={{
                    maxHeight: '380px',
                    overflow: 'auto',
                    borderRadius: '12px',
                    background: 'var(--cloud)',
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <img
                    src={selectedScreenshot}
                    alt="Customer Screenshot"
                    style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={() => handleVerifyPayment(selectedOrderForVerification._id, 'Verified')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '999px',
                      background: 'var(--success)',
                      color: '#FFF',
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Payment
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(selectedOrderForVerification._id, 'Rejected')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '999px',
                      background: 'var(--cloud)',
                      color: 'var(--danger)',
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      border: '1px solid var(--hairline)',
                      cursor: 'pointer',
                    }}
                  >
                    Reject Proof
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
