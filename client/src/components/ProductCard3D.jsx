import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatPKR } from '../utils/api';

// Luxury Tracksuit Vector Silhouette Fallback
function TracksuitSilhouette({ hex, title }) {
  const color = hex || '#B8DCF0';
  const cleanId = (color || 'def').replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 45%, rgba(229, 193, 137, 0.12) 0%, #F5F3EE 80%)',
        padding: '20px',
        zIndex: 2,
      }}
    >
      <svg
        viewBox="0 0 200 250"
        style={{
          width: '78%',
          height: '78%',
          filter: 'drop-shadow(0 14px 24px rgba(26,26,26,0.12))',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <defs>
          <linearGradient id={`grad-${cleanId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.88" />
          </linearGradient>
        </defs>

        {/* Top: Hoodie with Raglan Sleeves */}
        <path
          d="M 70 36 C 80 30, 120 30, 130 36 L 175 62 C 184 68, 180 82, 168 87 L 154 92 L 154 130 C 154 135, 150 138, 145 138 L 55 138 C 50 138, 46 135, 46 130 L 46 92 L 32 87 C 20 82, 16 68, 25 62 Z"
          fill={`url(#grad-${cleanId})`}
          stroke="rgba(26, 26, 26, 0.22)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Hood Collar */}
        <path
          d="M 76 38 C 90 48, 110 48, 124 38"
          fill="none"
          stroke="rgba(26, 26, 26, 0.18)"
          strokeWidth="1.8"
        />

        {/* Golden Drawstrings */}
        <line x1="94" y1="44" x2="94" y2="78" stroke="#D4A76A" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="106" y1="44" x2="106" y2="78" stroke="#D4A76A" strokeWidth="2.4" strokeLinecap="round" />

        {/* Bottom: Tracksuit Trousers */}
        <path
          d="M 50 144 L 150 144 C 152 144, 153 146, 152 148 L 142 232 C 141 236, 137 239, 132 239 L 112 239 C 108 239, 105 236, 105 232 L 105 178 C 105 176, 95 176, 95 178 L 95 232 C 95 236, 92 239, 88 239 L 68 239 C 63 239, 59 236, 58 232 L 48 148 C 47 146, 48 144, 50 144 Z"
          fill={`url(#grad-${cleanId})`}
          stroke="rgba(26, 26, 26, 0.22)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Ankle Cuffs Details */}
        <rect x="62" y="228" width="22" height="5" rx="2.5" fill="rgba(26, 26, 26, 0.2)" />
        <rect x="116" y="228" width="22" height="5" rx="2.5" fill="rgba(26, 26, 26, 0.2)" />
      </svg>
    </div>
  );
}

export default function ProductCard3D({ product }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const isWishlisted = user?.wishlist?.some(
    (id) => (typeof id === 'string' ? id : id?._id) === product._id
  );

  // Available active colors
  const availableColors = (product.colors && product.colors.length > 0)
    ? product.colors.filter((c) => c.active !== false)
    : [
        { name: 'Sky Blue', hex: '#B8DCF0', active: true },
        { name: 'Ivory White', hex: '#FFFFF0', active: true },
        { name: 'Obsidian Black', hex: '#1A1A2E', active: true },
      ];

  // Active color based on hover / selection
  const currentActiveIndex = hoveredColorIndex !== null ? hoveredColorIndex : selectedColorIndex;
  const activeColor = availableColors[currentActiveIndex] || availableColors[0] || {};

  // Primary model photo and secondary flat-lay photo for the active color
  const modelImageSrc =
    activeColor.modelImage ||
    activeColor.imageUrl ||
    activeColor.articleImage ||
    product.images?.[0] ||
    '';

  const articleImageSrc =
    activeColor.articleImage ||
    activeColor.imageUrl ||
    activeColor.modelImage ||
    product.images?.[1] ||
    modelImageSrc;

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
          {modelImageSrc && !imageError ? (
            <>
              <img
                key={`model-${activeColor.name}-${modelImageSrc}`}
                src={modelImageSrc}
                alt={`${product.title} - ${activeColor.name}`}
                loading="lazy"
                onError={() => setImageError(true)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  opacity: (isHovered && hoveredColorIndex === null) ? 0 : 1,
                  transform: (isHovered && hoveredColorIndex === null) ? 'scale(1.04)' : 'scale(1)',
                  transition: 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s ease',
                  zIndex: 2,
                }}
              />

              {/* 2. Hover View: Pure Article Without Face (Flat-lay / Studio Garment) */}
              <img
                key={`flat-${activeColor.name}-${articleImageSrc}`}
                src={articleImageSrc}
                alt={`${product.title} garment flat-lay - ${activeColor.name}`}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '16px',
                  background: '#F9F8F5',
                  opacity: (isHovered && hoveredColorIndex === null) ? 1 : 0,
                  transform: (isHovered && hoveredColorIndex === null) ? 'scale(1)' : 'scale(0.96)',
                  transition: 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s ease',
                  zIndex: 3,
                }}
              />
            </>
          ) : (
            <TracksuitSilhouette hex={activeColor.hex} title={product.title} />
          )}

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

            {/* Interactive Color Swatch Variety Dots (Enlarged to 20px with instant hover preview) */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {availableColors.map((color, i) => {
                const isSelected = selectedColorIndex === i;
                const isHoveredSwatch = hoveredColorIndex === i;
                const isHighlighted = isHoveredSwatch || (hoveredColorIndex === null && isSelected);
                return (
                  <button
                    key={color.name || i}
                    type="button"
                    title={`${color.name} (Hover to preview ${color.name})`}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredColorIndex(i);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setHoveredColorIndex(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(i);
                    }}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: '1.5px solid rgba(26, 26, 26, 0.18)',
                      padding: 0,
                      cursor: 'pointer',
                      boxShadow: isHighlighted
                        ? '0 0 0 2px #FFFFFF, 0 0 0 4px var(--champagne)'
                        : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transform: isHighlighted ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                      outline: 'none',
                      position: 'relative',
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

          {/* Active Color Name Sub-label with Dynamic Color Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--ash)',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: activeColor.hex || '#EDE8DF',
                border: '1px solid rgba(26, 26, 26, 0.2)',
                display: 'inline-block',
                transition: 'background-color 0.2s ease',
              }}
            />
            <span style={{ color: 'var(--graphite)', fontWeight: 500 }}>
              {activeColor.name || 'Signature Set'}
            </span>
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
