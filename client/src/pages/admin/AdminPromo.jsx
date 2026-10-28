import React, { useState, useEffect } from 'react';
import { Megaphone, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import Button3D from '../../components/Button3D';

export default function AdminPromo() {
  const [text, setText] = useState('');
  const [discountPercent, setDiscountPercent] = useState(15);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const { data } = await api.get('/announcements/active');
        if (data) {
          setText(data.text);
          setDiscountPercent(data.discountPercent || 15);
          setIsActive(data.isActive);
        }
      } catch (err) {
        console.error('Failed to load announcement', err);
      }
    };
    fetchPromo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.post('/announcements', {
        text,
        isActive,
        discountPercent: Number(discountPercent),
      });
      setSuccessMsg('Storewide announcement updated & broadcast to the storefront.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update announcement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
          Storewide Broadcast
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: 'var(--graphite)', marginTop: '4px' }}>
          Promo Banner & Discount News
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
          Configure the top announcement bar visible to all visitors. Customers note the promotional discount and it is applied to their order bill upon review.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            background: 'rgba(90, 138, 106, 0.1)',
            border: '1px solid rgba(90, 138, 106, 0.25)',
            color: 'var(--success)',
            fontSize: '13px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div style={{ marginBottom: '32px' }}>
        <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
          Live Banner Preview
        </label>
        <div
          style={{
            background: isActive ? 'var(--accent-gradient)' : 'var(--cloud)',
            color: isActive ? 'var(--graphite)' : 'var(--mist)',
            padding: '10px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            border: '1px solid var(--hairline-sky)',
          }}
        >
          {text || 'SEASONAL PRIVILEGE — 15% OFF APPLIED ON FINAL BILL'}
          {!isActive && ' (INACTIVE)'}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--snow)',
          border: '1px solid var(--hairline)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
            Announcement Bar Text
          </label>
          <input
            type="text"
            required
            placeholder="e.g. WINTER ATELIER DROP: 15% DISCOUNT ON ALL ORDERS — APPLIED ON BILL"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div>
          <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
            Reference Discount Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
          <span style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px', display: 'block' }}>
            Used as a guide when the Admin adjusts individual order bills.
          </span>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--graphite)' }}>
              Enable Announcement on Public Website
            </span>
          </label>
        </div>

        <div style={{ marginTop: '8px' }}>
          <Button3D type="submit" variant="primary" size="md" disabled={saving}>
            {saving ? 'Transmitting...' : 'Save & Publish Banner'}
          </Button3D>
        </div>
      </form>
    </div>
  );
}
