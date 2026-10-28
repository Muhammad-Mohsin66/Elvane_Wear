import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Button3D({
  children,
  onClick,
  variant = 'primary', // 'primary', 'outline', 'dark', 'ghost'
  className = '',
  style = {},
  disabled = false,
  type = 'button',
  icon: Icon = null,
  size = 'md', // 'sm', 'md', 'lg'
  ...props
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull between -8px and 8px
    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;
    x.set(Math.max(-10, Math.min(10, distanceX)));
    y.set(Math.max(-8, Math.min(8, distanceY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getPadding = () => {
    if (size === 'sm') return '10px 22px';
    if (size === 'lg') return '18px 44px';
    return '14px 34px';
  };

  const getFontSize = () => {
    if (size === 'sm') return '11px';
    if (size === 'lg') return '13px';
    return '12px';
  };

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--cta-gradient)',
          color: 'var(--graphite)',
          boxShadow: '0 8px 24px -6px rgba(212, 167, 106, 0.45), 0 2px 0 rgba(190, 140, 75, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        };
      case 'dark':
        return {
          background: 'var(--graphite)',
          color: 'var(--snow)',
          boxShadow: '0 10px 28px -6px rgba(26, 26, 26, 0.35), 0 2px 0 rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        };
      case 'outline':
        return {
          background: 'rgba(255, 255, 255, 0.65)',
          color: 'var(--graphite)',
          border: '1px solid var(--hairline-accent)',
          boxShadow: '0 4px 16px -4px rgba(26, 26, 26, 0.05)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--charcoal)',
          border: '1px solid transparent',
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: smoothX,
        y: smoothY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '999px',
        padding: getPadding(),
        fontSize: getFontSize(),
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        ...getStyles(),
        ...style,
      }}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group ${className}`}
      {...props}
    >
      {/* 3D Diagonal light sweep reflection */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transform: 'skewX(-25deg)',
          pointerEvents: 'none',
          transition: 'left 0.75s ease-out',
        }}
        className="group-hover:left-[160%]"
      />
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={1.5} />}
      <span>{children}</span>
    </motion.button>
  );
}
