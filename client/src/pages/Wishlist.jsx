import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ProductCard3D from '../components/ProductCard3D';
import Button3D from '../components/Button3D';
import api from '../utils/api';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/auth/wishlist');
        setWishlistProducts(data);
      } catch (err) {
        console.error('Failed to load wishlist', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user?.wishlist]);

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '20px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Curated Privileges
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '10px',
            }}
          >
            Your Private <em style={{ fontStyle: 'italic' }}>Wishlist</em>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ash)', marginTop: '8px' }}>
            Archived tracksuit sets saved for future atelier acquisitions.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--ash)' }}>
            Retrieving saved items...
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: 'var(--cloud)', borderRadius: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <Heart size={36} color="var(--mist)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px' }}>Your wishlist is empty</h3>
            <p style={{ fontSize: '14px', color: 'var(--ash)', marginTop: '6px', marginBottom: '28px' }}>
              Explore the collection and click the heart icon on any tracksuit set to save it here.
            </p>
            <Button3D variant="primary" onClick={() => navigate('/shop')} icon={ArrowRight}>
              Explore Collection
            </Button3D>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
            }}
          >
            {wishlistProducts.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
