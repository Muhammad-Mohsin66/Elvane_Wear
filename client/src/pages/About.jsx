import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px' }}>
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            The Atelier Manifesto
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '12px',
              marginBottom: '24px',
              lineHeight: 1.05,
            }}
          >
            Engineered for movement. <br />
            Designed for <em style={{ fontStyle: 'italic' }}>stillness</em>.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ash)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            Tommy Tracksuits was born from an uncompromising rebellion against the disposable nature of mass athletic wear.
          </p>
        </div>

        {/* Narrative Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontSize: '16px', lineHeight: 1.85, color: 'var(--charcoal)' }}>
          <div style={{ background: 'var(--cloud)', padding: '48px', borderRadius: '24px', border: '1px solid var(--hairline)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', marginBottom: '16px' }}>
              The Single Complete Set Rule
            </h3>
            <p>
              In high fashion tailoring, no master tailor would ever recommend pairing an exquisite suit jacket with an alien pair of trousers. We hold the tracksuit to the identical standard of sartorial integrity. Every Tommy Tracksuit is strictly designed and sold as a harmonious 1-piece tracksuit set.
            </p>
            <p style={{ marginTop: '16px' }}>
              From initial fabric spinning to precision dyeing in single-batch dye lots, the jacket and trousers live as one entity—balanced in GSM weight, tensile stretch, and monochrome tone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '36px', borderRadius: '20px', background: 'var(--snow)', border: '1px solid var(--hairline)' }}>
              <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Provenance</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginTop: '8px', marginBottom: '12px' }}>
                Noble Natural Fibers
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--ash)', lineHeight: 1.7 }}>
                Australian Extra-Fine Merino Wool, Italian Cashmere blends, and Egyptian Long-Staple Pima Cotton. Natural thermoregulation that breathes with your body.
              </p>
            </div>

            <div style={{ padding: '36px', borderRadius: '20px', background: 'var(--snow)', border: '1px solid var(--hairline)' }}>
              <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Architecture</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginTop: '8px', marginBottom: '12px' }}>
                Concealed Engineering
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--ash)', lineHeight: 1.7 }}>
                Internal French seams, invisible zip garages, heavy-gauge custom ribbing, and weighted hem anchors that maintain the sculptural silhouette whether stationary or moving.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Button3D variant="primary" size="lg" onClick={() => navigate('/shop')}>
            Explore the 10 Atelier Sets
          </Button3D>
        </div>
      </div>
    </div>
  );
}
