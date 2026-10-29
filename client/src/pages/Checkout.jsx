import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button3D from '../components/Button3D';
import api, { formatPKR } from '../utils/api';

export default function Checkout() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zip, setZip] = useState(user?.address?.zip || '');

  // Payment Method: Strictly Cash on Delivery (COD)
  const paymentMethod = 'COD';

  // Active Store Announcement Promo
  const [announcement, setAnnouncement] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
    api.get('/announcements/active').then((res) => setAnnouncement(res.data)).catch(() => {});
  }, [items, navigate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append(
        'items',
        JSON.stringify(
          items.map((it) => ({
            product: it.product,
            color: it.color,
            size: it.size,
            quantity: it.quantity,
          }))
        )
      );

      formData.append(
        'shippingAddress',
        JSON.stringify({
          fullName,
          phone,
          street,
          city,
          state,
          zip,
          country: 'Pakistan',
        })
      );

      formData.append('paymentMethod', 'COD');

      const { data } = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearCart();
      navigate('/account?orderSuccess=' + data.orderNumber);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please review details.');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = getSubtotal();

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Checkout Gateway
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 500,
              color: 'var(--graphite)',
              marginTop: '6px',
            }}
          >
            Finalize Your <em style={{ fontStyle: 'italic' }}>Atelier Order</em>
          </h1>
        </div>

        {/* Storewide Promotion Note (No coupon input box, as per spec) */}
        {announcement?.isActive && (
          <div
            style={{
              background: 'var(--cloud)',
              border: '1px solid var(--hairline-accent)',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
            }}
          >
            <Sparkles size={18} color="var(--champagne)" />
            <div style={{ fontSize: '13px', color: 'var(--charcoal)' }}>
              <strong>Active Privileges: </strong>
              <span>{announcement.text}</span>
              <span style={{ color: 'var(--ash)', display: 'block', fontSize: '11px', marginTop: '2px' }}>
                * Store discounts are audited & applied directly by the Admin team on your final order bill.
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'rgba(163, 64, 64, 0.1)',
              border: '1px solid rgba(163, 64, 64, 0.25)',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '28px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(24px, 4vw, 48px)', alignItems: 'start' }}>
            {/* Left Column: Shipping & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Shipping Address */}
              <div
                style={{
                  background: 'var(--snow)',
                  border: '1px solid var(--hairline)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
                }}
              >
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginBottom: '20px' }}>
                  1. Delivery Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Farooq"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Contact Phone (For Courier)</label>
                    <input
                      type="tel"
                      required
                      placeholder="03XX-XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Street Address / House / Flat</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 42, Street 12, Phase 6 DHA"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lahore / Karachi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 54000"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods - Strictly COD */}
              <div
                style={{
                  background: 'var(--snow)',
                  border: '1px solid var(--hairline)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: 0 }}>
                    2. Payment Method
                  </h3>
                  <span
                    style={{
                      background: 'rgba(212, 167, 106, 0.12)',
                      color: 'var(--champagne)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: '1px solid rgba(212, 167, 106, 0.3)',
                    }}
                  >
                    100% Cash on Delivery
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '18px',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--champagne)',
                    background: 'linear-gradient(135deg, rgba(212, 167, 106, 0.06) 0%, rgba(184, 220, 240, 0.08) 100%)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--snow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--hairline-sky)',
                      boxShadow: '0 4px 12px rgba(26,26,26,0.04)',
                      flexShrink: 0,
                    }}
                  >
                    <Truck size={24} color="var(--champagne)" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--graphite)', margin: 0 }}>
                        Cash on Delivery (COD)
                      </p>
                      <CheckCircle size={16} color="var(--champagne)" />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6, margin: '6px 0 12px 0' }}>
                      Pay in cash directly to the courier agent when your handcrafted tracksuit package arrives at your doorstep anywhere in Pakistan.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--ash)', borderTop: '1px solid var(--hairline)', paddingTop: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} color="var(--champagne)" /> No Advance Payment Required
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} color="var(--champagne)" /> Parcel Handover at Doorstep
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={14} color="var(--champagne)" /> Express 2-4 Day Nationwide Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div
              style={{
                position: 'sticky',
                top: '100px',
                background: 'var(--snow)',
                border: '1px solid var(--hairline)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: 'var(--card-3d-shadow)',
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginBottom: '20px' }}>
                Order Summary ({items.length} Sets)
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--graphite)' }}>{item.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--ash)' }}>
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600 }}>
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ash)' }}>
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ash)' }}>
                  <span>White-Glove Shipping</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free (Pakistan)</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: '1px solid var(--hairline)',
                    paddingTop: '16px',
                    marginTop: '6px',
                  }}
                >
                  <span className="eyebrow" style={{ fontSize: '12px', color: 'var(--graphite)' }}>Total (PKR)</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--graphite)' }}>
                    {formatPKR(subtotal)}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '28px' }}>
                <Button3D
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Transmitting Order...' : 'Confirm Atelier Order'}
                </Button3D>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--mist)', textAlign: 'center', marginTop: '16px' }}>
                By placing this order, you agree to the Elvane Wear atelier terms & exchange policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
