import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard3D from '../components/ProductCard3D';
import Button3D from '../components/Button3D';
import api, { formatPKR } from '../utils/api';

const HERO_SLIDES = [
  {
    image: '/images/hero/hero-1.jpg',
    badge: 'Atelier Cashmere Edition • 01',
    edition: 'Pure Mongolian Cashmere • 380 GSM',
  },
  {
    image: '/images/hero/hero-2.jpg',
    badge: 'Architectural Charcoal & Slate • 02',
    edition: 'Tailored Zip Hoodie Set • Double-Faced Cotton',
  },
  {
    image: '/images/hero/hero-3.jpg',
    badge: 'Sandstone Camel Merino • 03',
    edition: 'Quiet Luxury Drape • 100% Merino Wool',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcement, setAnnouncement] = useState(null);
  const navigate = useNavigate();

  // Parallax for Hero text
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  // Automated background slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/announcements/active').then(res => setAnnouncement(res.data)).catch(() => {});
  }, []);

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

  const navOffset = announcement?.isActive ? 104 : 72;

  return (
    <div style={{ background: 'var(--snow)', overflowX: 'hidden' }}>
      {/* LUXURY EDITORIAL HERO SHOWCASE WITH MALE MODEL BACKGROUND IMAGES (BELOW NAVBAR) */}
      <section
        ref={heroRef}
        style={{
          minHeight: `calc(100vh - ${navOffset}px)`,
          marginTop: `${navOffset}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          padding: '40px 24px 36px',
          overflow: 'hidden',
          background: '#0D0D0D',
        }}
      >
        {/* Full-bleed Crystal-Clear Animated Background Carousel (Confined below navbar) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${HERO_SLIDES[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 12%',
              }}
            />
          </AnimatePresence>

          {/* Bottom Gradient Scrim strictly for text contrast without obscuring the male model */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '56%',
              background: 'linear-gradient(0deg, rgba(10, 10, 10, 0.94) 0%, rgba(10, 10, 10, 0.6) 48%, rgba(10, 10, 10, 0.08) 80%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Center Editorial Typography & Buttons at Full Bottom */}
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            textAlign: 'center',
            maxWidth: '860px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* Collection Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              marginBottom: '14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Sparkles size={13} color="#E5C189" />
            <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 600 }}>
              {HERO_SLIDES[currentSlide].badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(44px, 6.8vw, 86px)',
              fontWeight: 400,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              marginBottom: '12px',
              textShadow: '0 2px 25px rgba(0, 0, 0, 0.7)',
            }}
          >
            Luxury in <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#E5C189' }}>motion</em>.
          </motion.h1>

          {/* Subtitle wording */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              marginBottom: '26px',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.7)',
            }}
          >
            Engineered for movement. Designed for stillness. Complete, minimalist tracksuit sets crafted from pure cashmere, merino, and double-faced organic cotton.
          </motion.p>

          {/* Buttons lowered & positioned at bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '28px',
            }}
          >
            <Button3D
              size="lg"
              variant="primary"
              onClick={() => navigate('/shop')}
              icon={ArrowRight}
            >
              Explore Collection
            </Button3D>

            <button
              onClick={() => navigate('/about')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 28px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
            >
              The Atelier Story
            </button>
          </motion.div>

          {/* Background Slideshow Controls & Progress Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              aria-label="Previous slide"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    height: '4px',
                    width: currentSlide === idx ? '32px' : '10px',
                    borderRadius: '999px',
                    background: currentSlide === idx ? '#E5C189' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURED COLLECTION GRID */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 32px)' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          <span className="eyebrow" style={{ marginBottom: '12px' }}>
            Pure Minimalist Form
          </span>
          <h2
            style={{
              fontSize: 'clamp(30px, 4.5vw, 56px)',
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

        {/* 3-Column 3D Grid with fluid columns */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>
            Curating Atelier Sets...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(20px, 3vw, 36px)',
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
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
          padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 32px)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          {/* Architectural Graphic */}
          <div
            style={{
              background: 'var(--snow)',
              borderRadius: '24px',
              border: '1px solid var(--hairline)',
              padding: 'clamp(24px, 5vw, 48px)',
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
              We rejected the premise of fast athleisure. Elvane Wear was founded on a singular conviction: that a tracksuit can possess the same tailoring prestige, architectural rigor, and fabric pedigree as bespoke Savile Row tailoring.
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
              When you purchase an Elvane Wear tracksuit, you receive a meticulously proportioned top and trouser, dyed in identical dye lots to guarantee chromatic perfection. Designed with concealed zips, French seams, and ribbed hems.
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
