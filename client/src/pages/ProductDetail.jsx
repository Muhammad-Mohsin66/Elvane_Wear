import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronDown, Star, Check, Ruler } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Button3D from '../components/Button3D';
import api, { formatPKR } from '../utils/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('model'); // 'model' | 'flat'

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const isWishlisted = user?.wishlist?.some(
    (id) => (typeof id === 'string' ? id : id?._id) === product?._id
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data);
        // Default to first active color & size
        const firstActiveColor = data.colors?.find((c) => c.active)?.name || '';
        const firstActiveSize = data.sizes?.find((s) => s.active)?.name || '';
        setSelectedColor(firstActiveColor);
        setSelectedSize(firstActiveSize);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;
    addItem(product, selectedColor, selectedSize, quantity);
    openCart();
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleWishlist(product._id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      setReviewComment('');
      // Reload product to get new review
      const { data } = await api.get(`/products/slug/${slug}`);
      setProduct(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)' }}>
        Loading Atelier Piece...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px' }}>Product Not Found</h2>
        <Button3D variant="outline" onClick={() => navigate('/shop')}>
          Return to Collection
        </Button3D>
      </div>
    );
  }

  const activeColorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];
  const primaryHex = activeColorObj?.hex || '#EDE9E3';

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>/</span>
          <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>Collection</span>
          <span>/</span>
          <span style={{ color: 'var(--graphite)' }}>{product.title}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'start' }}>
          {/* Left Column: Interactive 3D Product Canvas & Showcase */}
          <div>
            {/* Badges & View Mode Toggle — Above the image on mobile */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {product.isNewArrival && (
                  <span style={{ background: 'rgba(247, 246, 243, 1)', padding: '6px 14px', borderRadius: '999px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, border: '1px solid var(--hairline)' }}>
                    New Release
                  </span>
                )}
                {product.isBestseller && (
                  <span style={{ background: 'var(--glacier-glass)', border: '1px solid var(--champagne)', padding: '6px 14px', borderRadius: '999px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                    Atelier Bestseller
                  </span>
                )}
              </div>

              {/* View Mode Toggle: Model vs Article Flat-Lay */}
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  background: 'rgba(247, 246, 243, 1)',
                  padding: '4px',
                  borderRadius: '999px',
                  border: '1px solid var(--hairline)',
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveViewMode('model')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: activeViewMode === 'model' ? 'var(--graphite)' : 'transparent',
                    color: activeViewMode === 'model' ? '#FFFFFF' : 'var(--graphite)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  On Model
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('flat')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: activeViewMode === 'flat' ? 'var(--graphite)' : 'transparent',
                    color: activeViewMode === 'flat' ? '#FFFFFF' : 'var(--graphite)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Garment Flat-Lay
                </button>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: 'clamp(380px, 56vh, 620px)',
                borderRadius: '24px',
                background: '#F7F6F3',
                border: '1px solid var(--hairline-sky)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--card-3d-shadow)',
              }}
            >
              {/* Image Rendering: Model or Flat-Lay */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedColor}-${activeViewMode}`}
                  src={
                    activeViewMode === 'model'
                      ? (activeColorObj?.modelImage || product.images?.[0] || '/images/hero/hero-1.jpg')
                      : (activeColorObj?.articleImage || product.images?.[1] || activeColorObj?.modelImage || '/images/hero/hero-1.jpg')
                  }
                  alt={`${product.title} - ${selectedColor}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: activeViewMode === 'model' ? 'cover' : 'contain',
                    objectPosition: 'center 15%',
                    padding: activeViewMode === 'flat' ? '32px' : 0,
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Preview Selector Below Main View */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <div
                onClick={() => setActiveViewMode('model')}
                style={{
                  flex: 1,
                  height: '90px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeViewMode === 'model' ? '2px solid var(--champagne)' : '1px solid var(--hairline)',
                  position: 'relative',
                  background: '#F5F5F3',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={activeColorObj?.modelImage || product.images?.[0]}
                  alt="Model View"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 6,
                    fontSize: '9px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#FFF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Editorial View
                </span>
              </div>

              <div
                onClick={() => setActiveViewMode('flat')}
                style={{
                  flex: 1,
                  height: '90px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeViewMode === 'flat' ? '2px solid var(--champagne)' : '1px solid var(--hairline)',
                  position: 'relative',
                  background: '#F8F7F4',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={activeColorObj?.articleImage || product.images?.[1] || activeColorObj?.modelImage}
                  alt="Flat-lay View"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 6,
                    fontSize: '9px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#FFF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Garment View
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Variant Pickers & Purchase Gate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--champagne)', display: 'block', marginBottom: '8px' }}>
                {product.category} • Complete Tracksuit Set
              </span>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 500,
                  color: 'var(--graphite)',
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}
              >
                {product.title}
              </h1>

              {/* Price Tag */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '34px',
                    fontWeight: 600,
                    color: 'var(--graphite)',
                  }}
                >
                  {formatPKR(product.price)}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Includes Top & Trousers
                </span>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--charcoal)', lineHeight: 1.8 }}>
                {product.description}
              </p>
            </div>

            {/* COLOR SELECTOR (Only Admin-Activated Colors) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="eyebrow">
                  Color: <strong style={{ color: 'var(--graphite)' }}>{selectedColor}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.colors
                  ?.filter((c) => c.active)
                  .map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isSelected ? '1px solid var(--graphite)' : '1px solid var(--hairline)',
                          background: isSelected ? 'rgba(26, 26, 26, 0.05)' : 'var(--snow)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            border: '1px solid rgba(26,26,26,0.2)',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--graphite)', fontWeight: isSelected ? 600 : 400 }}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* SIZE SELECTOR (Only Admin-Activated Sizes) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="eyebrow">
                  Size: <strong style={{ color: 'var(--graphite)' }}>{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    color: 'var(--champagne)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.sizes
                  ?.filter((s) => s.active)
                  .map((size) => {
                    const isSelected = selectedSize === size.name;
                    return (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          background: isSelected ? 'var(--graphite)' : 'var(--cloud)',
                          color: isSelected ? 'var(--snow)' : 'var(--graphite)',
                          border: isSelected ? '1px solid var(--graphite)' : '1px solid var(--hairline)',
                        }}
                      >
                        {size.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '12px' }}>
              <Button3D
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                style={{ flex: 1, justifyContent: 'center' }}
                icon={ShoppingBag}
              >
                Add Set to Bag
              </Button3D>

              <motion.button
                onClick={handleWishlistClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '999px',
                  border: '1px solid var(--hairline-accent)',
                  background: isWishlisted ? 'rgba(232, 196, 184, 0.4)' : 'var(--snow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isWishlisted ? 'var(--danger)' : 'var(--graphite)',
                }}
                title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} strokeWidth={1.5} fill={isWishlisted ? 'var(--danger)' : 'none'} />
              </motion.button>
            </div>

            {/* ASSURANCES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '12px', background: 'var(--cloud)', border: '1px solid var(--hairline)', fontSize: '12px', color: 'var(--ash)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} color="var(--success)" />
                <span>Single Complete 2-Piece Tracksuit Set (Jacket + Trouser)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={14} color="var(--champagne)" />
                <span>100% Cash on Delivery (COD) Nationwide</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => navigate('/returns')}
                title="Click to view full Return & Exchange Policy"
              >
                <RotateCcw size={14} color="var(--champagne)" />
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Complimentary 7-Day Size Exchange Service
                </span>
              </div>
            </div>

            {/* ACCORDIONS */}
            <div style={{ borderTop: '1px solid var(--hairline)', marginTop: '16px' }}>
              {/* Accordion 1: Details & Fit */}
              <div style={{ borderBottom: '1px solid var(--hairline)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                  style={{
                    width: '100%',
                    padding: '18px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--graphite)',
                  }}
                >
                  <span>Details & Tailored Fit</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'details' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div style={{ paddingBottom: '18px', fontSize: '13px', color: 'var(--ash)', lineHeight: 1.7 }}>
                    Designed with an engineered relaxed posture. Structured dropped shoulders with a tapered leg silhouette. Invisible zipped pockets on both top and joggers. Concealed drawstrings with brushed champagne-gold aglets.
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Care */}
              <div style={{ borderBottom: '1px solid var(--hairline)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'materials' ? '' : 'materials')}
                  style={{
                    width: '100%',
                    padding: '18px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--graphite)',
                  }}
                >
                  <span>Materials & Atelier Care</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'materials' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
                {openAccordion === 'materials' && (
                  <div style={{ paddingBottom: '18px', fontSize: '13px', color: 'var(--ash)', lineHeight: 1.7 }}>
                    <p><strong>Fabric Composition:</strong> {product.fabric || '100% Luxury Fiber Blend'}</p>
                    <p style={{ marginTop: '6px' }}><strong>Care Instructions:</strong> {product.care || 'Hand wash cold or gentle cycle. Lay flat to dry.'}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Return & Exchange Policy */}
              <div style={{ borderBottom: '1px solid var(--hairline)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? '' : 'returns')}
                  style={{
                    width: '100%',
                    padding: '18px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--graphite)',
                  }}
                >
                  <span>Complimentary 7-Day Returns & Exchanges</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'returns' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
                {openAccordion === 'returns' && (
                  <div style={{ paddingBottom: '18px', fontSize: '13px', color: 'var(--ash)', lineHeight: 1.7 }}>
                    <p>
                      Enjoy peace of mind with our 7-day exchange window. If your tracksuit set requires another size or colorway, we coordinate a seamless doorstep pickup across Pakistan. Items must be unworn with original tags attached.
                    </p>
                    <p style={{ marginTop: '10px' }}>
                      <span
                        onClick={() => navigate('/returns')}
                        style={{
                          color: 'var(--champagne)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Read full Return & Exchange Guidelines →
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS & STAR RATING SECTION */}
        <section style={{ marginTop: '120px', borderTop: '1px solid var(--hairline)', paddingTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <span className="eyebrow">Client Perspectives</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: 'var(--graphite)', marginTop: '8px' }}>
                Atelier Reviews ({product.reviews?.length || 0})
              </h2>
            </div>
            {product.averageRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', color: 'var(--champagne)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.round(product.averageRating) ? 'var(--champagne)' : 'none'}
                      stroke="var(--champagne)"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{product.averageRating.toFixed(1)} / 5</span>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
            {product.reviews?.length === 0 ? (
              <p style={{ color: 'var(--ash)', fontSize: '14px', gridColumn: 'span 2' }}>
                No reviews yet for this set. Be the first to share your atelier experience.
              </p>
            ) : (
              product.reviews?.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'var(--cloud)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>{rev.name}</span>
                    <div style={{ display: 'flex', color: 'var(--champagne)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? 'var(--champagne)' : 'none'} stroke="var(--champagne)" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6 }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div style={{ maxWidth: '600px', background: 'var(--cloud)', padding: '32px', borderRadius: '20px', border: '1px solid var(--hairline)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginBottom: '16px' }}>
              Leave an Atelier Review
            </h3>

            {reviewSuccess ? (
              <p style={{ color: 'var(--success)', fontSize: '13px' }}>
                Thank you! Your verified review has been submitted.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star
                          size={20}
                          fill={star <= reviewRating ? 'var(--champagne)' : 'none'}
                          stroke="var(--champagne)"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Your Experience</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the fabric feel, drape, and sizing..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <div>
                  <Button3D type="submit" variant="primary" size="sm" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                  </Button3D>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.5)', backdropFilter: 'blur(4px)', zIndex: 110 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--snow)',
                borderRadius: '20px',
                padding: '36px',
                maxWidth: '600px',
                width: '90%',
                zIndex: 120,
                border: '1px solid var(--hairline)',
                boxShadow: 'var(--card-3d-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px' }}>Atelier Tracksuit Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ash)' }}>
                  ✕
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ash)', marginBottom: '20px' }}>
                All measurements are in inches. Each set is designed with a modern relaxed silhouette.
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--ash)' }}>
                    <th style={{ padding: '8px' }}>Size</th>
                    <th style={{ padding: '8px' }}>Chest</th>
                    <th style={{ padding: '8px' }}>Top Length</th>
                    <th style={{ padding: '8px' }}>Waist</th>
                    <th style={{ padding: '8px' }}>Inseam</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', chest: '36-38', len: '26', waist: '28-30', in: '29' },
                    { size: 'S', chest: '38-40', len: '27', waist: '30-32', in: '30' },
                    { size: 'M', chest: '40-42', len: '28', waist: '32-34', in: '30.5' },
                    { size: 'L', chest: '42-44', len: '29', waist: '34-36', in: '31' },
                    { size: 'XL', chest: '44-46', len: '30', waist: '36-38', in: '31.5' },
                    { size: 'XXL', chest: '46-48', len: '31', waist: '38-40', in: '32' },
                  ].map((row) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid var(--hairline)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{row.size}</td>
                      <td style={{ padding: '10px 8px' }}>{row.chest}</td>
                      <td style={{ padding: '10px 8px' }}>{row.len}</td>
                      <td style={{ padding: '10px 8px' }}>{row.waist}</td>
                      <td style={{ padding: '10px 8px' }}>{row.in}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
