import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatPKR } from '../utils/api';
import Button3D from './Button3D';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getSubtotal, getItemCount } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else if (!user?.isEmailVerified) {
      navigate('/verify-email?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 26, 26, 0.45)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 90,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '460px',
              background: 'var(--snow)',
              boxShadow: '-10px 0 40px rgba(26, 26, 26, 0.15)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--hairline)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} strokeWidth={1.5} color="var(--champagne)" />
                <h3 style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                  Your Atelier Bag ({getItemCount()})
                </h3>
              </div>
              <button
                onClick={closeCart}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ash)',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {items.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '16px',
                    color: 'var(--ash)',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'var(--cloud)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--hairline)',
                    }}
                  >
                    <ShoppingBag size={28} strokeWidth={1.2} color="var(--mist)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: 'var(--graphite)' }}>
                      Your bag is empty
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
                      Explore our tailored luxury tracksuit sets.
                    </p>
                  </div>
                  <Button3D
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                  >
                    Explore Collection
                  </Button3D>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={`${item.product}-${item.color}-${item.size}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      background: 'var(--cloud)',
                      borderRadius: '12px',
                      border: '1px solid var(--hairline)',
                      position: 'relative',
                    }}
                  >
                    {/* Small Tracksuit swatch representation */}
                    <div
                      style={{
                        width: '74px',
                        height: '90px',
                        borderRadius: '8px',
                        background: 'var(--snow)',
                        border: '1px solid var(--hairline)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <svg width="44" height="60" viewBox="0 0 100 130" fill="none">
                        <path
                          d="M32 18 C38 12, 62 12, 68 18 L86 36 C89 39, 87 45, 83 47 L76 50 L75 72 L25 72 L24 50 L17 47 Z"
                          fill="var(--charcoal)"
                        />
                        <path d="M28 80 L72 80 L66 128 L56 128 L51 96 L47 128 L34 128 Z" fill="var(--charcoal)" />
                      </svg>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4
                            style={{
                              fontSize: '15px',
                              fontFamily: "'Cormorant Garamond', serif",
                              fontWeight: 600,
                              color: 'var(--graphite)',
                              marginRight: '8px',
                            }}
                          >
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--mist)',
                              cursor: 'pointer',
                              padding: '2px',
                            }}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '2px' }}>
                          Color: <strong>{item.color}</strong> · Size: <strong>{item.size}</strong>
                        </p>
                      </div>

                      {/* Quantity & Item Total */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--snow)',
                            borderRadius: '999px',
                            padding: '3px 8px',
                            border: '1px solid var(--hairline)',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                              color: 'var(--charcoal)',
                              display: 'flex',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--charcoal)',
                              display: 'flex',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '17px',
                            fontWeight: 600,
                            color: 'var(--graphite)',
                          }}
                        >
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Gate */}
            {items.length > 0 && (
              <div
                style={{
                  padding: '24px 28px',
                  borderTop: '1px solid var(--hairline)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow">Estimated Total (PKR)</span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '24px',
                      fontWeight: 600,
                      color: 'var(--graphite)',
                    }}
                  >
                    {formatPKR(getSubtotal())}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: 'var(--ash)',
                  }}
                >
                  <ShieldCheck size={14} color="var(--success)" />
                  <span>Complimentary White-Glove Courier Across Pakistan</span>
                </div>

                <Button3D
                  variant="primary"
                  onClick={handleCheckoutClick}
                  style={{ width: '100%', justifyContent: 'center' }}
                  icon={ArrowRight}
                >
                  Proceed to Checkout
                </Button3D>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
