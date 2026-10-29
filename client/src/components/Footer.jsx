import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--cloud)',
        borderTop: '1px solid var(--hairline)',
        paddingTop: '64px',
        paddingBottom: '40px',
        marginTop: '80px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* Value Props Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--hairline)',
            marginBottom: '48px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
              }}
            >
              <Truck size={18} color="var(--champagne)" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--graphite)' }}>Nationwide Delivery</p>
              <p style={{ fontSize: '11px', color: 'var(--ash)' }}>Karachi, Lahore, Islamabad & beyond</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
              }}
            >
              <ShieldCheck size={18} color="var(--champagne)" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--graphite)' }}>Atelier Guarantee</p>
              <p style={{ fontSize: '11px', color: 'var(--ash)' }}>100% Complete 2-Piece Sets</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
              }}
            >
              <Clock size={18} color="var(--champagne)" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--graphite)' }}>Cash on Delivery (COD)</p>
              <p style={{ fontSize: '11px', color: 'var(--ash)' }}>Pay upon doorstep arrival</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--snow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--hairline-sky)',
              }}
            >
              <Sparkles size={18} color="var(--champagne)" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--graphite)' }}>Curated Fabrics</p>
              <p style={{ fontSize: '11px', color: 'var(--ash)' }}>Cashmere, Merino & Pima Cotton</p>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            paddingBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo.jpg"
                alt="Elvane Wear Logo"
                style={{
                  height: '46px',
                  width: 'auto',
                  borderRadius: '6px',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                }}
              />
              <h2
                style={{
                  fontSize: '26px',
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--graphite)',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Elvane <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--champagne)' }}>Wear</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                fontStyle: 'italic',
                color: 'var(--ash)',
                maxWidth: '380px',
                lineHeight: 1.4,
              }}
            >
              "Engineered for movement. Designed for stillness."
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--ash)',
                marginTop: '16px',
                maxWidth: '420px',
                lineHeight: 1.6,
              }}
            >
              A high-fashion luxury atelier dedicated exclusively to complete, minimalist tracksuit sets crafted from the finest natural fibers.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="eyebrow" style={{ marginBottom: '16px', color: 'var(--graphite)' }}>
              Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/shop" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  All Tracksuit Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Cashmere Set" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Cashmere-Blend Series
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Heavyweight Set" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Heavyweight Merino
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Velour Set" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Velour & Lounge Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="eyebrow" style={{ marginBottom: '16px', color: 'var(--graphite)' }}>
              Concierge
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/about" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Brand Atelier Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Customer Care & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/account" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Client Portal & Orders
                </Link>
              </li>
              <li>
                <Link to="/login" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="eyebrow" style={{ marginBottom: '16px', color: 'var(--graphite)' }}>
              Governance
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/admin" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/super-admin" className="link-underline" style={{ fontSize: '13px', color: 'var(--ash)' }}>
                  Super Admin Executive
                </Link>
              </li>
              <li style={{ marginTop: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: 'var(--snow)',
                    border: '1px solid var(--hairline)',
                    fontSize: '11px',
                    color: 'var(--charcoal)',
                    fontWeight: 600,
                  }}
                >
                  PKR (Rs.) Storefront
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '32px',
            borderTop: '1px solid var(--hairline)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--ash)',
          }}
        >
          <p>© {new Date().getFullYear()} Elvane Wear. Crafted for high-fashion excellence.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Cash on Delivery (Nationwide)</span>
            <span>•</span>
            <span>Inspection Before Payment</span>
            <span>•</span>
            <span>100% Authentic Set Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
