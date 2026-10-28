import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import api from '../utils/api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/announcements/active').then(res => setAnnouncement(res.data)).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcement?.isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: 'var(--accent-gradient)',
              textAlign: 'center',
              padding: '8px 16px',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--graphite)',
              fontWeight: 500,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 51,
            }}
          >
            {announcement.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.nav
        style={{
          position: 'fixed',
          top: announcement?.isActive ? 32 : 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '0 clamp(16px, 4vw, 40px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid rgba(26, 26, 26, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 4px 30px rgba(26, 26, 26, 0.06)' : '0 2px 10px rgba(26, 26, 26, 0.02)',
        }}
      >
        {/* Left: Brand Logo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <img
              src="/logo.jpg"
              alt="Elvane Wear Logo"
              style={{
                height: '38px',
                width: 'auto',
                borderRadius: '4px',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
              }}
            />
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--graphite)',
                margin: 0,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              Elvane <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--champagne)' }}>Wear</span>
            </h1>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div
          className="hidden md:flex items-center justify-center gap-8"
          style={{
            flex: 2,
            textAlign: 'center',
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="link-underline"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--graphite)' : 'var(--ash)',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: '4px 0',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions & Mobile Hamburger */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 2vw, 20px)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
          }}
        >
          {isAuthenticated && (
            <Link to="/wishlist" style={{ color: 'var(--ash)', display: 'flex' }} className="hidden sm:flex" title="Wishlist">
              <Heart size={20} strokeWidth={1.25} />
            </Link>
          )}

          <button
            onClick={toggleCart}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--graphite)', display: 'flex' }}
            title="Shopping Bag"
          >
            <ShoppingBag size={20} strokeWidth={1.25} />
            {getItemCount() > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  background: 'var(--champagne)',
                  color: 'var(--snow)',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getItemCount()}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to={user?.role === 'superadmin' ? '/super-admin' : user?.role === 'admin' ? '/admin' : '/account'}
                style={{ color: 'var(--ash)', display: 'flex' }}
                title="Account"
              >
                <User size={20} strokeWidth={1.25} />
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ash)', display: 'flex' }}
                className="hidden sm:flex"
                title="Sign Out"
              >
                <LogOut size={18} strokeWidth={1.25} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ color: 'var(--ash)', display: 'flex' }} title="Sign In">
              <User size={20} strokeWidth={1.25} />
            </Link>
          )}

          {/* Mobile hamburger toggle button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--graphite)',
              padding: '6px',
            }}
            className="flex md:hidden items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: announcement?.isActive ? 104 : 72,
              left: 0, right: 0,
              background: 'rgba(250, 250, 250, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--hairline)',
              padding: '24px 32px 32px',
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 20px 40px rgba(26,26,26,0.08)',
            }}
          >
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 14,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--charcoal)',
                  fontWeight: 500,
                  padding: '4px 0',
                }}
              >
                {link.name}
              </Link>
            ))}

            <div style={{ height: '1px', background: 'var(--hairline)', margin: '4px 0' }} />

            {/* Additional Mobile Navigation Utilities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 13, color: 'var(--ash)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Heart size={16} strokeWidth={1.5} />
                <span>Private Wishlist</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'superadmin' ? '/super-admin' : user?.role === 'admin' ? '/admin' : '/account'}
                    onClick={() => setMobileOpen(false)}
                    style={{ fontSize: 13, color: 'var(--ash)', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <User size={16} strokeWidth={1.5} />
                    <span>Client Portal ({user?.name})</span>
                  </Link>

                  {(user?.role === 'admin' || user?.role === 'superadmin') && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      style={{ fontSize: 13, color: 'var(--champagne)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                    >
                      <Shield size={16} strokeWidth={1.5} />
                      <span>Admin Management Portal</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate('/');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '4px',
                    }}
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{ fontSize: 13, color: 'var(--graphite)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <User size={16} strokeWidth={1.5} />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
