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
        setFeaturedProducts(data.slice(0, 12));
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

      {/* FEATURED COLLECTION GRID (4 Columns Across, Covering Full Width) */}
      <section style={{ maxWidth: '1680px', margin: '0 auto', padding: 'clamp(60px, 7vw, 100px) clamp(20px, 3.5vw, 48px)' }}>
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
          <p style={{ fontSize: '15px', color: 'var(--ash)', maxWidth: '560px' }}>
            Sold exclusively as complete two-piece tracksuit sets. Every piece is tailored to harmonize silhouette, drape, and tactile comfort.
          </p>
        </div>

        {/* 4-Column 3D Grid with Full Space Utilization */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>
            Curating Atelier Sets...
          </div>
        ) : (
          <div className="atelier-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '54px' }}>
          <Button3D
            variant="outline"
            size="md"
            onClick={() => navigate('/shop')}
            icon={ArrowUpRight}
          >
            Explore All Atelier Sets
          </Button3D>
        </div>
      </section>

      {/* PROMOTIONAL BANNER — Dynamic Discount from Admin Announcement */}
      {announcement?.isActive && announcement?.discountPercent > 0 && (
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: '#0D0D0D',
          }}
        >
          {/* Multiple Model Images Strip */}
          <div
            className="promo-model-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              width: '100%',
              height: 'clamp(340px, 50vw, 560px)',
            }}
          >
            {[
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333563/elvena_wear/products/1-model.jpg', bg: '#E5EAE7' },
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333568/elvena_wear/products/2-model.jpg', bg: '#E8E2D8' },
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333575/elvena_wear/products/3.1-model.jpg', bg: '#EADFD8' },
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333585/elvena_wear/products/5-model.jpg', bg: '#D8D8D8' },
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333577/elvena_wear/products/3.2-model.jpg', bg: '#DFE1E0' },
              { src: 'https://res.cloudinary.com/up56alno/image/upload/v1793333597/elvena_wear/products/7.2-model.jpg', bg: '#E2E2E0' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: item.bg,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                }}
                onClick={() => navigate('/shop')}
              >
                <img
                  src={item.src}
                  alt={`Elvane Wear Collection ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Sale Banner Overlay — Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(20px, 4vw, 48px)',
              padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px)',
              background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F0EA 100%)',
            }}
          >
            {/* Left: Sale Title */}
            <div style={{ textAlign: 'center', flex: '1 1 280px' }}>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  color: 'var(--graphite)',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                }}
              >
                Seasonal<br />
                Privilege<br />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  fontWeight: 800,
                  background: 'var(--cta-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.04em',
                }}>
                  SALE
                </span>
              </motion.h2>
            </div>

            {/* Center: CTA Button */}
            <div style={{ flex: '0 1 auto', textAlign: 'center' }}>
              <Button3D
                variant="dark"
                size="lg"
                onClick={() => navigate('/shop')}
                icon={ArrowRight}
              >
                Shop All
              </Button3D>
            </div>

            {/* Right: Discount Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: '1 1 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: 'var(--cta-gradient)',
                  borderRadius: '20px',
                  padding: 'clamp(24px, 3vw, 40px) clamp(32px, 4vw, 56px)',
                  textAlign: 'center',
                  boxShadow: '0 20px 60px -15px rgba(212, 167, 106, 0.45)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />
                <p style={{
                  fontSize: 'clamp(11px, 1.4vw, 14px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--graphite)',
                  marginBottom: '4px',
                  position: 'relative',
                }}>
                  Limited Time Only
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(36px, 5.5vw, 56px)',
                  fontWeight: 900,
                  color: 'var(--graphite)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  position: 'relative',
                }}>
                  FLAT {announcement.discountPercent}% OFF
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

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
