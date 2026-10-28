import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard3D from '../components/ProductCard3D';
import Button3D from '../components/Button3D';
import api, { formatPKR } from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const navigate = useNavigate();

  // Parallax for Hero
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  // Mouse tilt for hero floating frames
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const leftFrameRotateX = useTransform(smoothMouseY, [-300, 300], [6, -6]);
  const leftFrameRotateY = useTransform(smoothMouseX, [-300, 300], [-8, 8]);
  const rightFrameRotateX = useTransform(smoothMouseY, [-300, 300], [-6, 6]);
  const rightFrameRotateY = useTransform(smoothMouseX, [-300, 300], [8, -8]);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setFeaturedProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
  };

  return (
    <div style={{ background: 'var(--snow)', overflowX: 'hidden' }}>
      {/* 3D HERO SHOWCASE (100vh) */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '120px 24px 60px',
          perspective: '1200px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(184, 220, 240, 0.35) 0%, rgba(250, 250, 250, 0.8) 60%, var(--snow) 100%)',
        }}
      >
        {/* Subtle Ambient Sky-Blue & Champagne Halo */}
        <div
          style={{
            position: 'absolute',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'var(--sky-ambient-glow)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />

        {/* Left Asymmetric Floating 3D Tracksuit Frame */}
        <motion.div
          style={{
            position: 'absolute',
            left: '4%',
            top: '24%',
            width: '260px',
            height: '350px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--hairline-sky)',
            borderRadius: '20px',
            boxShadow: 'var(--card-3d-shadow)',
            padding: '20px',
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            rotateX: leftFrameRotateX,
            rotateY: leftFrameRotateY,
            transformStyle: 'preserve-3d',
            zIndex: 10,
          }}
          className="lg-frame-left"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="eyebrow" style={{ fontSize: '9px' }}>Atelier Cashmere</span>
            <span style={{ fontSize: '11px', color: 'var(--champagne)', fontWeight: 600 }}>01 / 10</span>
          </div>
          {/* Mini Tracksuit Graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
            <svg width="120" height="150" viewBox="0 0 100 130" fill="none">
              <path d="M32 18 C38 12, 62 12, 68 18 L86 36 C89 39, 87 45, 83 47 L76 50 L75 72 L25 72 L24 50 L17 47 Z" fill="#F5F0E8" stroke="#1A1A1A" strokeWidth="1" />
              <line x1="46" y1="26" x2="46" y2="44" stroke="#D4A76A" strokeWidth="1.2" />
              <line x1="54" y1="26" x2="54" y2="44" stroke="#D4A76A" strokeWidth="1.2" />
              <path d="M28 80 L72 80 L71 124 L56 124 L51 96 L47 124 L34 124 Z" fill="#F5F0E8" stroke="#1A1A1A" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, color: 'var(--graphite)' }}>
              Cashmere 380 GSM
            </p>
            <p style={{ fontSize: '11px', color: 'var(--ash)' }}>Complete tailored silhouette</p>
          </div>
        </motion.div>

        {/* Right Asymmetric Floating 3D Tracksuit Frame */}
        <motion.div
          style={{
            position: 'absolute',
            right: '4%',
            bottom: '18%',
            width: '270px',
            height: '360px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--hairline-accent)',
            borderRadius: '20px',
            boxShadow: 'var(--card-3d-shadow)',
            padding: '20px',
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            rotateX: rightFrameRotateX,
            rotateY: rightFrameRotateY,
            transformStyle: 'preserve-3d',
            zIndex: 10,
          }}
          className="lg-frame-right"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="eyebrow" style={{ fontSize: '9px' }}>Glacier Merino</span>
            <span style={{ fontSize: '11px', color: 'var(--champagne)', fontWeight: 600 }}>02 / 10</span>
          </div>
          {/* Mini Tracksuit Graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
            <svg width="120" height="150" viewBox="0 0 100 130" fill="none">
              <path d="M32 18 C38 12, 62 12, 68 18 L86 36 C89 39, 87 45, 83 47 L76 50 L75 72 L25 72 L24 50 L17 47 Z" fill="#B8DCF0" stroke="#1A1A1A" strokeWidth="1" />
              <line x1="46" y1="26" x2="46" y2="44" stroke="#D4A76A" strokeWidth="1.2" />
              <line x1="54" y1="26" x2="54" y2="44" stroke="#D4A76A" strokeWidth="1.2" />
              <path d="M28 80 L72 80 L71 124 L56 124 L51 96 L47 124 L34 124 Z" fill="#B8DCF0" stroke="#1A1A1A" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600, color: 'var(--graphite)' }}>
              100% Merino Wool
            </p>
            <p style={{ fontSize: '11px', color: 'var(--ash)' }}>Natural climate regulation</p>
          </div>
        </motion.div>

        <style>{`
          @media (min-width: 1024px) {
            .lg-frame-left, .lg-frame-right { display: flex !important; }
          }
        `}</style>

        {/* Center Editorial Typography & Magnetic CTA */}
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            textAlign: 'center',
            maxWidth: '820px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid var(--hairline-sky)',
              marginBottom: '28px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={13} color="var(--champagne)" />
            <span className="eyebrow" style={{ fontSize: '10px' }}>
              The New Collection • 10 Signature Sets
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(46px, 7.5vw, 96px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--graphite)',
              marginBottom: '24px',
            }}
          >
            Luxury in <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--champagne)' }}>motion</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              lineHeight: 1.7,
              color: 'var(--ash)',
              maxWidth: '560px',
              marginBottom: '40px',
            }}
          >
            Engineered for movement. Designed for stillness. Complete, minimalist tracksuit sets crafted from pure cashmere, merino, and double-faced organic cotton.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Button3D
              size="lg"
              variant="primary"
              onClick={() => navigate('/shop')}
              icon={ArrowRight}
            >
              Explore Collection
            </Button3D>

            <Button3D
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
            >
              The Atelier Story
            </Button3D>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED COLLECTION GRID */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 32px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          <span className="eyebrow" style={{ marginBottom: '12px' }}>
            Pure Minimalist Form
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 500,
              fontFamily: "'Cormorant Garamond', serif",
              color: 'var(--graphite)',
              marginBottom: '16px',
            }}
          >
            Signature <em style={{ fontStyle: 'italic' }}>Atelier</em> Sets
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ash)', maxWidth: '520px' }}>
            Sold exclusively as complete two-piece tracksuit sets. Every piece is tailored to harmonize silhouette, drape, and tactile comfort.
          </p>
        </div>

        {/* 3-Column 3D Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>
            Curating Atelier Sets...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Button3D
            variant="outline"
            size="md"
            onClick={() => navigate('/shop')}
            icon={ArrowUpRight}
          >
            View All 10 Sets
          </Button3D>
        </div>
      </section>

      {/* BRAND STORY STRIP */}
      <section
        style={{
          background: 'var(--cloud)',
          borderTop: '1px solid var(--hairline)',
          borderBottom: '1px solid var(--hairline)',
          padding: '120px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Architectural Graphic */}
          <div
            style={{
              background: 'var(--snow)',
              borderRadius: '24px',
              border: '1px solid var(--hairline)',
              padding: '48px',
              boxShadow: 'var(--card-3d-shadow)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'var(--sky-ambient-glow)',
                filter: 'blur(50px)',
              }}
            />
            <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
              Philosophy of Reduction
            </span>
            <h3
              style={{
                fontSize: '36px',
                fontFamily: "'Cormorant Garamond', serif",
                marginTop: '16px',
                marginBottom: '20px',
                lineHeight: 1.15,
              }}
            >
              "Where comfort meets <em style={{ fontStyle: 'italic' }}>couture</em>."
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--ash)', lineHeight: 1.8 }}>
              We rejected the premise of fast athleisure. Tommy Tracksuits was founded on a singular conviction: that a tracksuit can possess the same tailoring prestige, architectural rigor, and fabric pedigree as bespoke Savile Row tailoring.
            </p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '24px' }}>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--graphite)' }}>
                  100%
                </p>
                <p style={{ fontSize: '11px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Natural Fibers
                </p>
              </div>
              <div style={{ width: '1px', background: 'var(--hairline)' }} />
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 600, color: 'var(--graphite)' }}>
                  PKR
                </p>
                <p style={{ fontSize: '11px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Direct Atelier Pricing
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span className="eyebrow">The Atelier Standard</span>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontFamily: "'Cormorant Garamond', serif",
                lineHeight: 1.15,
              }}
            >
              No separates. Only harmonious, intentional <em style={{ fontStyle: 'italic' }}>monochrome sets</em>.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--ash)', lineHeight: 1.8 }}>
              When you purchase a Tommy Tracksuit, you receive a meticulously proportioned top and trouser, dyed in identical dye lots to guarantee chromatic perfection. Designed with concealed zips, French seams, and ribbed hems.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Button3D variant="dark" onClick={() => navigate('/shop')}>
                Explore the Atelier
              </Button3D>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL QUOTE & NEWSLETTER */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 32px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: 'var(--champagne)', marginBottom: '16px', display: 'block' }}>
          Atelier Newsletter
        </span>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 400,
            marginBottom: '16px',
          }}
        >
          Privileged access to limited seasonal <em style={{ fontStyle: 'italic' }}>releases</em>.
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ash)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
          Be the first to know when archive editions drop and when seasonal privileges are applied.
        </p>

        {newsletterSuccess ? (
          <div
            style={{
              padding: '16px 24px',
              borderRadius: '999px',
              background: 'rgba(90, 138, 106, 0.1)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              border: '1px solid rgba(90, 138, 106, 0.2)',
            }}
          >
            <CheckCircle size={16} />
            <span>Thank you. Your address has been added to our private register.</span>
          </div>
        ) : (
          <form
            onSubmit={handleNewsletterSubmit}
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '0 auto',
              background: 'var(--cloud)',
              padding: '6px',
              borderRadius: '999px',
              border: '1px solid var(--hairline-accent)',
              boxShadow: '0 8px 30px rgba(26, 26, 26, 0.04)',
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '12px 20px',
                fontSize: '13px',
                outline: 'none',
                flex: 1,
              }}
            />
            <Button3D type="submit" variant="primary" size="sm">
              Subscribe
            </Button3D>
          </form>
        )}
      </section>
    </div>
  );
}
