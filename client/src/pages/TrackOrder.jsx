import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, MapPin, Phone, Truck, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import api, { formatPKR } from '../utils/api';
import Button3D from '../components/Button3D';
import OrderTimelineTracker from '../components/OrderTimelineTracker';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [orderQuery, setOrderQuery] = useState(searchParams.get('order') || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (orderRef) => {
    if (!orderRef || !orderRef.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const cleanRef = orderRef.trim().toUpperCase();
      const { data } = await api.get(`/orders/track/${cleanRef}`);
      setOrderData(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Order reference not found. Please verify your order number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramRef = searchParams.get('order');
    if (paramRef) {
      setOrderQuery(paramRef);
      fetchTracking(paramRef);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTracking(orderQuery);
  };

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '110px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(212, 167, 106, 0.15)',
              border: '1px solid var(--hairline-accent)',
              color: 'var(--champagne)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '12px',
            }}
          >
            <Truck size={12} />
            <span>Fulfillment Dispatch Tracking</span>
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              color: 'var(--graphite)',
              marginBottom: '12px',
            }}
          >
            Track Your <em style={{ fontStyle: 'italic' }}>Order</em>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ash)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Enter your order reference number (e.g. <span style={{ fontFamily: 'monospace', color: 'var(--graphite)' }}>TT-MW2B47K9-RQSW</span>) from your confirmation email or SMS to view real-time nationwide dispatch status.
          </p>
        </div>

        {/* Search Bar Card */}
        <div
          style={{
            background: 'var(--snow)',
            borderRadius: '20px',
            border: '1px solid var(--hairline)',
            padding: '28px clamp(20px, 3.5vw, 36px)',
            boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
            marginBottom: '32px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ash)' }} />
              <input
                type="text"
                required
                placeholder="Enter order reference # (e.g. TT-MW2B47K9-RQSW)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  borderRadius: '12px',
                  border: '1px solid var(--hairline)',
                  background: 'var(--cloud)',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                }}
              />
            </div>
            <Button3D type="submit" variant="primary" size="md" disabled={loading} style={{ minWidth: '130px', justifyContent: 'center' }}>
              {loading ? 'Locating...' : 'Track Parcel'}
            </Button3D>
          </form>

          {errorMsg && (
            <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: 'var(--danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Results Card */}
        <AnimatePresence>
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--snow)',
                borderRadius: '24px',
                border: '1px solid var(--hairline)',
                padding: 'clamp(24px, 4vw, 40px)',
                boxShadow: '0 8px 30px rgba(26,26,26,0.04)',
              }}
            >
              {/* Top Details Strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--hairline)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Order Reference</span>
                  <h3 style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color: 'var(--graphite)', marginTop: '4px' }}>
                    {orderData.orderNumber}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--ash)' }}>
                    Booked on {new Date(orderData.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Delivery Destination</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--graphite)', marginTop: '4px' }}>
                    {orderData.recipientName ? `${orderData.recipientName} • ` : ''}{orderData.city}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>
                    100% Cash on Delivery
                  </span>
                </div>
              </div>

              {/* Visual Progress Timeline Stepper */}
              <OrderTimelineTracker
                status={orderData.orderStatus}
                createdAt={orderData.createdAt}
                updatedAt={orderData.updatedAt}
              />

              {/* Status Explanation Box */}
              <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'var(--cloud)', border: '1px solid var(--hairline)', margin: '20px 0', fontSize: '13px', lineHeight: 1.6, color: 'var(--charcoal)' }}>
                {orderData.orderStatus === 'Pending' && (
                  <p>
                    ⏳ <strong>Order Pending Review:</strong> We have received your order and are currently verifying inventory availability. Our store atelier will confirm your booking shortly.
                  </p>
                )}
                {orderData.orderStatus === 'Confirmed' && (
                  <p>
                    ✅ <strong>Order Confirmed:</strong> Your tracksuit set has been approved and verified. It is currently being scheduled for luxury tailored packaging.
                  </p>
                )}
                {orderData.orderStatus === 'Processing' && (
                  <p>
                    📦 <strong>In Tailored Packaging:</strong> Your order is undergoing final quality inspection and being packed with signature Elvane Wear seals for courier pickup.
                  </p>
                )}
                {orderData.orderStatus === 'Dispatched' && (
                  <p>
                    🚚 <strong>In Transit Across Pakistan:</strong> Your parcel has been handed over to our courier partner. Expect doorstep delivery within 2-4 business days. Please keep cash ready for payment upon delivery.
                  </p>
                )}
                {orderData.orderStatus === 'Delivered' && (
                  <p>
                    🎉 <strong>Delivered Successfully:</strong> Your parcel has been delivered and payment received at your doorstep. Thank you for choosing Elvane Wear!
                  </p>
                )}
                {orderData.orderStatus === 'Cancelled' && (
                  <p>
                    ⚠️ <strong>Order Cancelled:</strong> This order has been cancelled. Please contact customer support for assistance.
                  </p>
                )}
              </div>

              {/* Items in Parcel */}
              <div style={{ marginTop: '24px' }}>
                <span className="eyebrow" style={{ color: 'var(--champagne)', display: 'block', marginBottom: '12px' }}>
                  Items in Parcel ({orderData.items?.length || 0})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orderData.items?.map((it, idx) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {it.image ? (
                          <img src={it.image} alt={it.title} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <div style={{ width: '44px', height: '44px', background: 'var(--snow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={18} color="var(--ash)" />
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '13px' }}>{it.title}</p>
                          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>
                            Color: {it.color} • Size: {it.size} • Qty: {it.quantity}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '14px' }}>
                        {it.price ? formatPKR(it.price * it.quantity) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Action */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--hairline)', paddingTop: '20px', marginTop: '24px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Total Cash on Delivery</span>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: 'var(--champagne)' }}>
                    {formatPKR(orderData.total)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button3D variant="outline" size="sm" onClick={() => navigate('/shop')}>
                    Explore More Tracksuits
                  </Button3D>
                  <Button3D variant="ghost" size="sm" onClick={() => navigate('/contact')}>
                    Need Help?
                  </Button3D>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

