import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import Button3D from '../components/Button3D';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
            Direct Atelier <em style={{ fontStyle: 'italic' }}>Inquiries</em>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ash)', marginTop: '8px' }}>
            Our bespoke concierge responds to private inquiries within 12 business hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {/* Contact Details */}
          <div style={{ background: 'var(--cloud)', borderRadius: '24px', padding: '44px 36px', border: '1px solid var(--hairline)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', marginBottom: '24px' }}>
              Atelier Headquarters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <MapPin size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Location</p>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                    Tommy Tracksuits Atelier Suite<br />
                    Gulberg III, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Phone size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Direct Concierge</p>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)' }}>+92 300 1234567</p>
                  <p style={{ fontSize: '12px', color: 'var(--ash)' }}>Mon – Sat, 10:00 – 19:00 PKT</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Mail size={20} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>Electronic Correspondence</p>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)' }}>concierge@tommytracksuits.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'var(--snow)', borderRadius: '24px', padding: '44px 36px', border: '1px solid var(--hairline)', boxShadow: 'var(--card-3d-shadow)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px' }}>Correspondence Received</h3>
                <p style={{ fontSize: '14px', color: 'var(--ash)', marginTop: '8px' }}>
                  Thank you. An atelier representative will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Sizing, Bespoke Order, Courier"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How may our atelier assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <Button3D type="submit" variant="primary" size="md" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Inquiry
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
