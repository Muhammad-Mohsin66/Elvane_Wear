import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Truck, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import Button3D from '../components/Button3D';

export default function ReturnsPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Client Care Guarantee
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '12px',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}
          >
            Returns & <em style={{ fontStyle: 'italic', color: 'var(--champagne)' }}>Exchange Policy</em>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ash)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
            Every Elvane Wear tracksuit is crafted to perfection. If the silhouette, fit, or drape does not exceed your expectations, our 7-day complimentary concierge exchange is at your service.
          </p>
        </div>

        {/* 3 Pillars of Our Exchange Guarantee */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              background: 'var(--cloud)',
              padding: '32px 28px',
              borderRadius: '20px',
              border: '1px solid var(--hairline)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
                marginBottom: '20px',
              }}
            >
              <RotateCcw size={20} color="var(--champagne)" />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', color: 'var(--graphite)' }}>
              7-Day Size Exchange
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.65 }}>
              Try your set at home. If you require a different size (XS to XXL) or another colorway, request an exchange within 7 days of delivery.
            </p>
          </div>

          <div
            style={{
              background: 'var(--cloud)',
              padding: '32px 28px',
              borderRadius: '20px',
              border: '1px solid var(--hairline)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
                marginBottom: '20px',
              }}
            >
              <Truck size={20} color="var(--champagne)" />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', color: 'var(--graphite)' }}>
              Doorstep Reverse Pickup
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.65 }}>
              Nationwide across Karachi, Lahore, Islamabad, and all cities. Our courier handles the pickup from your doorstep seamlessly.
            </p>
          </div>

          <div
            style={{
              background: 'var(--cloud)',
              padding: '32px 28px',
              borderRadius: '20px',
              border: '1px solid var(--hairline)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
                marginBottom: '20px',
              }}
            >
              <ShieldCheck size={20} color="var(--champagne)" />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', color: 'var(--graphite)' }}>
              100% Complete Set Rule
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: 1.65 }}>
              Because each tracksuit is engineered as a matching 2-piece ensemble, size or color exchanges are processed for the complete set (Jacket + Trouser).
            </p>
          </div>
        </div>

        {/* Detailed Guidelines Card */}
        <div
          style={{
            background: 'var(--snow)',
            borderRadius: '24px',
            border: '1px solid var(--hairline)',
            padding: ' clamp(24px, 5vw, 48px)',
            marginBottom: '40px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '30px',
              color: 'var(--graphite)',
              marginBottom: '20px',
            }}
          >
            Exchange Guidelines & Eligibility
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', lineHeight: 1.8, color: 'var(--charcoal)' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <div>
                <strong style={{ color: 'var(--graphite)' }}>Original Atelier Condition:</strong> The tracksuit set must be unworn, unwashed, unaltered, and free of fragrances, lint, or pet hair, with all original Elvane Wear security tags and packaging intact.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <div>
                <strong style={{ color: 'var(--graphite)' }}>7-Day Notice Period:</strong> The exchange request must be initiated within 7 calendar days from the date tracking marks your parcel as "Delivered".
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <div>
                <strong style={{ color: 'var(--graphite)' }}>Single Set Integrity:</strong> To preserve exact dye-lot matching and fabric weave consistency, individual tops or trousers cannot be swapped separately. Both pieces must be returned together.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="var(--champagne)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <div>
                <strong style={{ color: 'var(--graphite)' }}>Defective or Damaged In Transit:</strong> In the rare instance an item arrives damaged or with a tailoring discrepancy, contact our concierge within 48 hours with a photo. We provide an immediate free priority replacement.
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step How to Initiate Exchange */}
        <div
          style={{
            background: 'var(--cloud)',
            borderRadius: '24px',
            border: '1px solid var(--hairline)',
            padding: 'clamp(24px, 5vw, 48px)',
            marginBottom: '48px',
          }}
        >
          <span className="eyebrow" style={{ color: 'var(--champagne)', display: 'block', marginBottom: '8px' }}>
            Concierge Workflow
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '30px',
              color: 'var(--graphite)',
              marginBottom: '32px',
            }}
          >
            How to Request Your Exchange
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--snow)', border: '1px solid var(--hairline)' }}>
              <span style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--champagne)', display: 'block', marginBottom: '6px' }}>
                01
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--graphite)' }}>
                Reach Out to Concierge
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--ash)', lineHeight: 1.6 }}>
                Contact us via WhatsApp or our Contact portal with your Order ID (e.g. #ELV-1024) and the new size or color desired.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--snow)', border: '1px solid var(--hairline)' }}>
              <span style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--champagne)', display: 'block', marginBottom: '6px' }}>
                02
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--graphite)' }}>
                Pack the Tracksuit
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--ash)', lineHeight: 1.6 }}>
                Place the unworn tracksuit set (jacket + trousers) safely back into its original protective box along with tags.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--snow)', border: '1px solid var(--hairline)' }}>
              <span style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--champagne)', display: 'block', marginBottom: '6px' }}>
                03
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--graphite)' }}>
                Doorstep Swap
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--ash)', lineHeight: 1.6 }}>
                Our courier rider collects the parcel from your address and delivers your fresh replacement set within 3-4 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Assistance Call to Action */}
        <div
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'var(--snow)',
            borderRadius: '20px',
            border: '1px solid var(--hairline-accent)',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              color: 'var(--graphite)',
              marginBottom: '10px',
            }}
          >
            Need Help With Sizing or Exchange?
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--ash)', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Our dedicated Atelier Client Advisors are available Monday through Saturday (10 AM – 8 PM PKT).
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button3D variant="primary" size="md" onClick={() => navigate('/contact')} icon={MessageSquare}>
              Contact Concierge
            </Button3D>
            <Button3D variant="outline" size="md" onClick={() => navigate('/shop')}>
              Explore Atelier Collection
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  );
}

