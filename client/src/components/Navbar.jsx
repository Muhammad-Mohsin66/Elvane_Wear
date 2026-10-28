import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/announcements/active').then(res => setAnnouncement(res.data)).catch(() => {});
  }, []);

  const navLinks = [
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
              letterSpacing: '0.2em',
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
          padding: '0 40px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${scrolled ? 'var(--hairline)' : 'var(--hairline-sky)'}`,
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          background: scrolled ? 'rgba(250, 250, 250, 0.9)' : 'var(--glacier-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 4px 30px rgba(26, 26, 26, 0.06)' : 'none',
        }}
      >
        {/* Left links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="link-underline"
              style={{
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--ash)',
                display: 'none',
              }}
              id={`nav-${link.name.toLowerCase()}`}
            >
              {link.name}
            </Link>
          ))}
          <style>{`@media (min-width: 768px) { .link-underline { display: inline-block !important; } }`}</style>
        </div>

        {/* Logo */}
        <Link to="/" style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--graphite)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Tommy Tracksuits
          </h1>
        </Link>

        {/* Right icons */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
          {isAuthenticated && (
            <Link to="/wishlist" style={{ color: 'var(--ash)', display: 'flex' }}>
              <Heart size={20} strokeWidth={1.25} />
            </Link>
          )}

          <button
            onClick={toggleCart}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ash)', display: 'flex' }}
          >
            <ShoppingBag size={20} strokeWidth={1.25} />
            {getItemCount() > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: 'var(--champagne)', color: 'var(--snow)',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 10, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {getItemCount()}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to={user?.role === 'superadmin' ? '/super-admin' : user?.role === 'admin' ? '/admin' : '/account'}
                style={{ color: 'var(--ash)', display: 'flex' }}>
                <User size={20} strokeWidth={1.25} />
              </Link>
              <button onClick={() => { logout(); navigate('/'); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ash)', display: 'flex' }}>
                <LogOut size={18} strokeWidth={1.25} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ color: 'var(--ash)', display: 'flex' }}>
              <User size={20} strokeWidth={1.25} />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ash)', display: 'flex' }}
            className="md-hidden"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>
          <style>{`@media (min-width: 768px) { .md-hidden { display: none !important; } }`}</style>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: announcement?.isActive ? 104 : 72,
              left: 0, right: 0,
              background: 'var(--snow)',
              borderBottom: '1px solid var(--hairline)',
              padding: '24px 40px',
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                style={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
