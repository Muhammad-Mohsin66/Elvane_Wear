import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, Tag, Filter, Clock, Search, ZoomIn } from 'lucide-react';
import api, { formatPKR } from '../../utils/api';
import Button3D from '../../components/Button3D';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('active'); // 'active' | 'completed' | 'all'
  const [search, setSearch] = useState('');

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
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
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
            Atelier Orders
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Manage client orders, review JazzCash payment receipts, and adjust bill discounts.
          </p>
        </div>

        {/* Search */}
        <div style={{ background: 'var(--cloud)', borderRadius: '999px', border: '1px solid var(--hairline)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '100%' }}>
          <Search size={14} color="var(--ash)" />
          <input
            type="text"
            placeholder="Search order ref, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '13px', width: '200px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Filter Tabs (Horizontal scroll on mobile) */}
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
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>Loading Orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--cloud)', borderRadius: '16px', color: 'var(--ash)' }}>
          No orders found matching this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                background: 'var(--snow)',
                border: '1px solid var(--hairline)',
                borderRadius: '16px',
                padding: '24px 28px',
                boxShadow: '0 4px 16px rgba(26,26,26,0.03)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--hairline)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Order Ref</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--graphite)' }}>{order.orderNumber}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--ash)' }}>
                    Client: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone}) • {order.shippingAddress?.city}
                  </p>
                </div>

                {/* Status Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      width: 'auto',
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
                    }}
                  >
                    <Tag size={12} />
                    <span>Adjust Bill Discount</span>
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'var(--cloud)', borderRadius: '10px', fontSize: '12px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--graphite)' }}>{item.title}</p>
                    <p style={{ color: 'var(--ash)', marginTop: '2px' }}>
                      Color: {item.color} • Size: {item.size} • Qty: {item.quantity} • {formatPKR(item.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Financial & Payment Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--hairline)' }}>
                {/* Payment info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--charcoal)' }}>
                    Payment: <strong>{order.paymentMethod}</strong>
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
                          onClick={() => {
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
          ))}
        </div>
      )}

      {/* JAZZCASH SCREENSHOT VERIFICATION MODAL */}
      <AnimatePresence>
        {selectedScreenshot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScreenshot(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(6px)', zIndex: 120 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--snow)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '520px',
                width: '90%',
                zIndex: 130,
                boxShadow: 'var(--card-3d-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>
                  Verify JazzCash Payment Proof
                </h3>
                <button onClick={() => setSelectedScreenshot(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  ✕
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
          </>
        )}
      </AnimatePresence>

      {/* MANUAL BILL DISCOUNT ADJUSTMENT MODAL */}
      <AnimatePresence>
        {discountModalOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDiscountModalOrder(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(6px)', zIndex: 120 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--snow)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '460px',
                width: '90%',
                zIndex: 130,
                boxShadow: 'var(--card-3d-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>
                  Adjust Order Bill Discount
                </h3>
                <button onClick={() => setDiscountModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--ash)', marginBottom: '20px' }}>
                Apply promotional discount percentage (e.g. 15% from storewide announcement) or fixed PKR reduction to {discountModalOrder.orderNumber}.
              </p>

              <div style={{ padding: '12px 16px', background: 'var(--cloud)', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
                <span>Original Subtotal: </span>
                <strong>{formatPKR(discountModalOrder.subtotal)}</strong>
              </div>

              <form onSubmit={handleApplyDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Discount Percentage (%)</label>
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
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Or Fixed PKR Amount (Rs.)</label>
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
                      }
                    }}
                  />
                </div>

                <div style={{ marginTop: '12px' }}>
                  <Button3D type="submit" variant="primary" size="md" disabled={updatingDiscount} style={{ width: '100%', justifyContent: 'center' }}>
                    {updatingDiscount ? 'Recalculating...' : 'Apply & Save Bill'}
                  </Button3D>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
