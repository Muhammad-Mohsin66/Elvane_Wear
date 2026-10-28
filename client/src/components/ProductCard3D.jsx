import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatPKR } from '../utils/api';

export default function ProductCard3D({ product }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const navigate = useNavigate();

  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const isWishlisted = user?.wishlist?.some(
    (id) => (typeof id === 'string' ? id : id?._id) === product._id
  );

  // Active color based on hover / selection
  const activeColor = product.colors?.[selectedColorIndex] || product.colors?.[0] || {};
  const modelImageSrc = activeColor.modelImage || product.images?.[0] || '/images/hero/hero-1.jpg';
  const articleImageSrc = activeColor.articleImage || product.images?.[1] || modelImageSrc;

  // Motion values for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 22, stiffness: 240, mass: 0.15 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Tilt degrees between -7deg and 7deg for smooth editorial feel
  const rotateX = useTransform(smoothY, [0, 1], [7, -7]);
  const rotateY = useTransform(smoothX, [0, 1], [-7, 7]);

  // Glare position
  const glareX = useTransform(smoothX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothY, [0, 1], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / rect.width;
    const clientY = (e.clientY - rect.top) / rect.height;
    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const chosenColor = activeColor.name || product.colors?.[0]?.name || 'Default';
    const firstSize = product.sizes?.find((s) => s.active)?.name || 'M';
    addItem(product, chosenColor, firstSize, 1);
    openCart();
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        position: 'relative',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: '#FFFFFF',
          border: '1px solid var(--hairline)',
          borderRadius: '16px',
          padding: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease',
          boxShadow: isHovered ? 'var(--card-3d-shadow)' : '0 8px 24px -8px rgba(26, 26, 26, 0.05)',
          borderColor: isHovered ? 'var(--champagne)' : 'var(--hairline)',
        }}
        whileTap={{ scale: 0.985 }}
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        {/* Dynamic Sheen/Glare Overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            pointerEvents: 'none',
            background: isHovered
              ? `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.35) 0%, rgba(229, 193, 137, 0.12) 40%, transparent 80%)`
              : 'none',
            zIndex: 10,
            transform: 'translateZ(15px)',
          }}
        />

        {/* Floating Badges (TranslateZ 45px) */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: 22,
            zIndex: 20,
            transform: 'translateZ(45px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {product.isNewArrival && (
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(26, 26, 26, 0.08)',
                padding: '4px 9px',
                borderRadius: '999px',
                fontSize: '9.5px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--graphite)',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              New
            </span>
          )}
          {product.isBestseller && (
            <span
              style={{
                background: '#FAF6ED',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--champagne)',
                padding: '4px 9px',
                borderRadius: '999px',
                fontSize: '9.5px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A682D',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              Bestseller
            </span>
          )}
        </div>

        {/* Floating Wishlist Button (TranslateZ 35px) */}
        <motion.button
          onClick={handleWishlistClick}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 20,
            transform: 'translateZ(35px)',
            background: isWishlisted ? 'rgba(232, 196, 184, 0.95)' : 'rgba(255, 255, 255, 0.92)',
            border: '1px solid var(--hairline)',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.08)',
            color: isWishlisted ? 'var(--danger)' : 'var(--graphite)',
            transition: 'background 0.2s ease',
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} strokeWidth={1.5} fill={isWishlisted ? 'var(--danger)' : 'none'} />
        </motion.button>

        {/* Product Image Frame: Dual-Image (Model vs. Garment without Face) */}
        <div
          style={{
            width: '100%',
            height: '340px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: '#F6F5F2',
            transform: 'translateZ(30px)',
          }}
        >
          {/* Subtle Ambient Sky-Champagne Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(229, 193, 137, 0.08) 0%, transparent 70%)',
              opacity: isHovered ? 1 : 0.4,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* 1. Default View: Male Model Wearing Tracksuit */}
          <img
            src={modelImageSrc}
            alt={`${product.title} on model`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              opacity: isHovered ? 0 : 1,
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              zIndex: 2,
            }}
          />

          {/* 2. Hover View: Pure Article Without Face (Flat-lay / Studio Garment) */}
          <img
            src={articleImageSrc}
            alt={`${product.title} garment flat-lay`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px',
              background: '#F9F8F5',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              zIndex: 3,
            }}
          />

          {/* Visual indicator tag when hovering: "Garment View" */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 15,
              background: 'rgba(26, 26, 26, 0.75)',
              color: '#FFFFFF',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '999px',
              backdropFilter: 'blur(6px)',
              pointerEvents: 'none',
              opacity: isHovered ? 0.9 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Article View
          </div>

          {/* Quick Actions Hover Drawer (TranslateZ 35px) */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 12 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              gap: 6,
              zIndex: 25,
              transform: 'translateZ(35px)',
            }}
          >
            <button
              onClick={handleQuickAdd}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--champagne)',
                borderRadius: '999px',
                padding: '9px 12px',
                fontSize: '10.5px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--graphite)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(26, 26, 26, 0.12)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--graphite)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.96)';
                e.currentTarget.style.color = 'var(--graphite)';
              }}
            >
              <ShoppingBag size={12} strokeWidth={1.8} />
              <span>Quick Add</span>
            </button>
          </motion.div>
        </div>

        {/* Card Metadata / Typography */}
        <div style={{ marginTop: '14px', padding: '0 2px' }}>
          {/* Category & Interactive Color Swatches */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span className="eyebrow" style={{ fontSize: '9.5px', color: 'var(--ash)' }}>
              {product.category}
            </span>

            {/* Interactive Color Swatch Variety Dots */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {product.colors
                ?.filter((c) => c.active)
                .map((color, i) => {
                  const isSelected = selectedColorIndex === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      title={`${color.name} (Hover to display color)`}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setSelectedColorIndex(i);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColorIndex(i);
                      }}
                      style={{
                        width: isSelected ? 14 : 12,
                        height: isSelected ? 14 : 12,
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        border: '1px solid rgba(26, 26, 26, 0.2)',
                        padding: 0,
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 0 0 2px #FFFFFF, 0 0 0 3.5px var(--champagne)'
                          : 'none',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                        outline: 'none',
                      }}
                    />
                  );
                })}
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: '17px',
              fontWeight: 500,
              fontFamily: "'Cormorant Garamond', serif",
              color: 'var(--graphite)',
              marginBottom: '6px',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Active Color Name Sub-label */}
          <div style={{ fontSize: '11px', color: 'var(--mist)', marginBottom: '6px' }}>
            {activeColor.name || 'Signature Color'}
          </div>

          {/* Price & Set Specification */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              paddingTop: '2px',
              borderTop: '1px solid rgba(26, 26, 26, 0.05)',
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '19px',
                fontWeight: 600,
                color: 'var(--graphite)',
              }}
            >
              {formatPKR(product.price)}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--ash)',
                fontStyle: 'italic',
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Complete 2-Piece Set
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
