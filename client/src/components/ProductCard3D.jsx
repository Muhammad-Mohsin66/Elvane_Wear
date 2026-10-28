import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatPKR } from '../utils/api';

export default function ProductCard3D({ product }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const isWishlisted = user?.wishlist?.some(
    (id) => (typeof id === 'string' ? id : id?._id) === product._id
  );

  // Motion values for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.15 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Tilt degrees between -8deg and 8deg
  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);

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
    // Use first active color and size
    const firstColor = product.colors?.find((c) => c.active)?.name || 'Default';
    const firstSize = product.sizes?.find((s) => s.active)?.name || 'M';
    addItem(product, firstColor, firstSize, 1);
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

  // Color gradient background for image preview fallback
  const primaryColorHex = product.colors?.[0]?.hex || '#EDE9E3';

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
          background: 'var(--snow)',
          border: '1px solid var(--hairline)',
          borderRadius: '16px',
          padding: '16px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease',
          boxShadow: isHovered ? 'var(--card-3d-shadow)' : '0 10px 30px -10px rgba(26, 26, 26, 0.04)',
          borderColor: isHovered ? 'var(--hairline-sky)' : 'var(--hairline)',
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
              ? `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.4) 0%, rgba(184, 220, 240, 0.15) 40%, transparent 80%)`
              : 'none',
            zIndex: 10,
            transform: 'translateZ(15px)',
          }}
        />

        {/* Floating Badges (TranslateZ 45px) */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            zIndex: 20,
            transform: 'translateZ(45px)',
            display: 'flex',
            gap: '8px',
          }}
        >
          {product.isNewArrival && (
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--hairline-sky)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--graphite)',
                fontWeight: 600,
              }}
            >
              New
            </span>
          )}
          {product.isBestseller && (
            <span
              style={{
                background: 'var(--glacier-glass)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--champagne)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--graphite)',
                fontWeight: 600,
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
            top: 26,
            right: 26,
            zIndex: 20,
            transform: 'translateZ(35px)',
            background: isWishlisted ? 'rgba(232, 196, 184, 0.9)' : 'rgba(255, 255, 255, 0.85)',
            border: '1px solid var(--hairline)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.08)',
            color: isWishlisted ? 'var(--danger)' : 'var(--graphite)',
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} strokeWidth={1.5} fill={isWishlisted ? 'var(--danger)' : 'none'} />
        </motion.button>

        {/* Product Image Frame (TranslateZ 30px) */}
        <div
          style={{
            width: '100%',
            height: 360,
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--cloud)',
            transform: 'translateZ(30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Subtle Ambient Sky-Champagne Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--sky-ambient-glow)',
              opacity: isHovered ? 0.9 : 0.4,
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Luxury Tracksuit Visual / Illustration representation */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            {/* Minimalist Architectural Tracksuit Silhouette Icon & Swatch */}
            <svg
              width="180"
              height="240"
              viewBox="0 0 100 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                filter: 'drop-shadow(0 16px 24px rgba(26,26,26,0.12))',
              }}
            >
              {/* Hoodie/Top */}
              <path
                d="M32 18 C38 12, 62 12, 68 18 L86 36 C89 39, 87 45, 83 47 L76 50 L75 72 C75 74, 73 76, 71 76 L29 76 C27 76, 25 74, 25 72 L24 50 L17 47 C13 45, 11 39, 14 36 Z"
                fill={primaryColorHex}
                stroke="rgba(26,26,26,0.15)"
                strokeWidth="1.2"
              />
              {/* Hood Collar Fold */}
              <path
                d="M40 18 C46 24, 54 24, 60 18 C56 28, 44 28, 40 18 Z"
                fill="rgba(255,255,255,0.25)"
              />
              {/* Tonal Drawstrings */}
              <line x1="46" y1="26" x2="46" y2="44" stroke="var(--champagne)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="54" y1="26" x2="54" y2="44" stroke="var(--champagne)" strokeWidth="1.2" strokeLinecap="round" />
              {/* Trousers / Joggers */}
              <path
                d="M28 80 L72 80 C74 80, 75 81, 75 83 L71 124 C71 126, 69 128, 66 128 L56 128 C54 128, 53 126, 53 124 L51 96 L49 96 L47 124 C47 126, 46 128, 44 128 L34 128 C31 128, 29 126, 29 124 L25 83 C25 81, 26 80, 28 80 Z"
                fill={primaryColorHex}
                stroke="rgba(26,26,26,0.15)"
                strokeWidth="1.2"
              />
              {/* Ribbed ankle cuffs */}
              <rect x="34" y="125" width="10" height="3" rx="1.5" fill="rgba(26,26,26,0.18)" />
              <rect x="56" y="125" width="10" height="3" rx="1.5" fill="rgba(26,26,26,0.18)" />
            </svg>

            {/* Quick Actions Hover Drawer (TranslateZ 35px) */}
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                gap: 8,
                zIndex: 25,
                transform: 'translateZ(35px)',
              }}
            >
              <button
                onClick={handleQuickAdd}
                style={{
                  flex: 1,
                  background: 'rgba(250, 250, 250, 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--hairline-accent)',
                  borderRadius: '999px',
                  padding: '10px 14px',
                  fontSize: '11px',
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
                  boxShadow: '0 6px 20px rgba(26, 26, 26, 0.08)',
                }}
              >
                <ShoppingBag size={13} strokeWidth={1.5} />
                <span>Quick Add</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Card Metadata / Typography */}
        <div style={{ marginTop: '16px', padding: '0 4px' }}>
          {/* Category & Color indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span className="eyebrow" style={{ fontSize: '10px' }}>
              {product.category}
            </span>

            {/* Color Swatch Dots */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {product.colors
                ?.filter((c) => c.active)
                .slice(0, 4)
                .map((color, i) => (
                  <span
                    key={i}
                    title={color.name}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: '1px solid rgba(26, 26, 26, 0.15)',
                      display: 'inline-block',
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 500,
              fontFamily: "'Cormorant Garamond', serif",
              color: 'var(--graphite)',
              marginBottom: '6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.title}
          </h3>

          {/* Price & Set Specification */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '20px',
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
