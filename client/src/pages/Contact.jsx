import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Button3D from '../components/Button3D';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

export default function Contact() {
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await api.post('/inquiries', formData);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send inquiry. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Client Concierge
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '12px',
            }}
          >
            Get in Touch <em style={{ fontStyle: 'italic' }}>With Us</em>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ash)', marginTop: '8px' }}>
            Our customer support team typically responds within 12 business hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {/* Contact Details */}
          <div style={{ background: 'var(--cloud)', borderRadius: '24px', padding: '44px 36px', border: '1px solid var(--hairline)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', marginBottom: '24px' }}>
              Head Office & Support
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <MapPin size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Location</p>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                    Elvane Wear Headquarters<br />
                    Gulberg III, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Phone size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Customer Care</p>
                  <a href="tel:+923001234567" style={{ fontSize: '14px', color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 500 }}>
                    +92 300 1234567
                  </a>
                  <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>Mon – Sat, 10:00 – 19:00 PKT</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Mail size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Electronic Correspondence</p>
                  <a
                    href="mailto:elvane.wears@gmail.com"
                    style={{ fontSize: '14px', color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    elvane.wears@gmail.com
                  </a>
                  <p style={{ fontSize: '12px', color: 'var(--ash)', marginTop: '2px' }}>Direct Store Concierge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'var(--snow)', borderRadius: '24px', padding: '44px 36px', border: '1px solid var(--hairline)', boxShadow: 'var(--card-3d-shadow)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px' }}>Message Received</h3>
                <p style={{ fontSize: '14px', color: 'var(--ash)', marginTop: '8px', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.name}</strong>! Your inquiry regarding <em>"{formData.subject}"</em> has been dispatched to our team at <strong>elvane.wears@gmail.com</strong>.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Button3D
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: '', message: '' });
                    }}
                  >
                    Send Another Inquiry
                  </Button3D>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {errorMsg && (
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: 'var(--danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Sizing, Order Status, Delivery, or Complaint"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <Button3D
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {submitting ? 'Sending Inquiry...' : 'Send Inquiry'}
                  </Button3D>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
