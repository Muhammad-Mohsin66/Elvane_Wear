import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard3D from '../components/ProductCard3D';
import api from '../utils/api';

const categories = [
  'All Sets',
  'Essential Set',
  'Heavyweight Set',
  'Velour Set',
  'Cashmere Set',
  'Limited Edition',
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Sets';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All Sets') {
          params.category = selectedCategory;
        }
        if (sortOption) {
          params.sort = sortOption;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }

        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch collection', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortOption, searchQuery]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All Sets') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ background: 'var(--snow)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '0 clamp(20px, 3.5vw, 48px)' }}>
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '32px' }}>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            The Full Spectrum
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '12px',
              marginBottom: '16px',
            }}
          >
            The Atelier <em style={{ fontStyle: 'italic' }}>Collection</em>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ash)', maxWidth: '540px', margin: '0 auto' }}>
            Complete 2-piece tracksuit sets engineered in limited editions. Hand-selected fibers, precision ribbing, and balanced monochrome palettes.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            position: 'sticky',
            top: '76px',
            zIndex: 35,
            background: 'rgba(250, 250, 250, 0.92)',
            backdropFilter: 'blur(16px)',
            padding: '16px 0',
            borderBottom: '1px solid var(--hairline)',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                maxWidth: '100%',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    background: selectedCategory === cat ? 'var(--graphite)' : 'var(--cloud)',
                    color: selectedCategory === cat ? 'var(--snow)' : 'var(--charcoal)',
                    border: selectedCategory === cat ? '1px solid var(--graphite)' : '1px solid var(--hairline)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--cloud)',
                  borderRadius: '999px',
                  border: '1px solid var(--hairline)',
                  padding: '4px 14px',
                }}
              >
                <Search size={14} color="var(--mist)" />
                <input
                  type="text"
                  placeholder="Search set..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '6px 8px',
                    fontSize: '12px',
                    width: '130px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Sort Selector */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'var(--cloud)',
                  border: '1px solid var(--hairline)',
                  cursor: 'pointer',
                  color: 'var(--charcoal)',
                  width: 'auto',
                }}
              >
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Count Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <span className="eyebrow" style={{ fontSize: '11px' }}>
            Showing {products.length} Tracksuit Sets
          </span>
          <span style={{ fontSize: '12px', color: 'var(--ash)', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
            All prices in PKR (Rs.) • Tax included
          </span>
        </div>

        {/* 3D Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--ash)' }}>
            Curating collection...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--ash)' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--graphite)' }}>
              No sets found matching this selection.
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Try selecting "All Sets" or adjusting your search filter.
            </p>
          </div>
        ) : (
          <div className="atelier-product-grid">
            {products.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
