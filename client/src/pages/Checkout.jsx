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

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'JazzCash'
  const [jazzCashTxnId, setJazzCashTxnId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

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

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (paymentMethod === 'JazzCash' && !screenshotFile) {
      setErrorMsg('Please upload your JazzCash payment screenshot to complete order verification.');
      return;
    }

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

      formData.append('paymentMethod', paymentMethod);
      if (jazzCashTxnId) {
        formData.append('jazzCashTransactionId', jazzCashTxnId);
      }
      if (screenshotFile) {
        formData.append('jazzCashScreenshot', screenshotFile);
      }

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

              {/* Payment Methods */}
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
                  2. Select Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* COD Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: paymentMethod === 'COD' ? '1px solid var(--champagne)' : '1px solid var(--hairline)',
                      background: paymentMethod === 'COD' ? 'rgba(212, 167, 106, 0.05)' : 'var(--cloud)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      style={{ width: 'auto', marginTop: '4px' }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>
                        Cash on Delivery (COD)
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>
                        Pay cash upon receiving your tracksuit package anywhere in Pakistan.
                      </p>
                    </div>
                  </label>

                  {/* JazzCash Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: paymentMethod === 'JazzCash' ? '1px solid var(--champagne)' : '1px solid var(--hairline)',
                      background: paymentMethod === 'JazzCash' ? 'rgba(212, 167, 106, 0.05)' : 'var(--cloud)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="JazzCash"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      style={{ width: 'auto', marginTop: '4px' }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>
                        JazzCash Manual Transfer & Screenshot
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>
                        Transfer exact PKR amount and upload receipt screenshot for instant atelier verification.
                      </p>
                    </div>
                  </label>

                  {/* JazzCash Instruction Box */}
                  {paymentMethod === 'JazzCash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        padding: '20px',
                        background: 'rgba(184, 220, 240, 0.15)',
                        border: '1px solid var(--hairline-sky)',
                        borderRadius: '12px',
                        marginTop: '8px',
                      }}
                    >
                      <p className="eyebrow" style={{ color: 'var(--graphite)', marginBottom: '8px' }}>
                        Official JazzCash Account Details:
                      </p>
                      <div style={{ fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                        <p><strong>Account Title:</strong> Tommy Tracksuits Atelier</p>
                        <p><strong>Mobile Account:</strong> 0300-1234567</p>
                        <p><strong>Payable Amount:</strong> <span style={{ color: 'var(--graphite)', fontWeight: 600 }}>{formatPKR(subtotal)}</span></p>
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                          Upload Payment Screenshot *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          style={{ background: 'var(--snow)', padding: '8px', fontSize: '12px' }}
                        />
                        {screenshotPreview && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={screenshotPreview}
                              alt="Payment Proof"
                              style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--hairline)' }}
                            />
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>
                          Transaction ID (TID) (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1029384756"
                          value={jazzCashTxnId}
                          onChange={(e) => setJazzCashTxnId(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
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
                By placing this order, you agree to the Tommy Tracksuits atelier terms & exchange policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
