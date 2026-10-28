import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import api from '../../utils/api';
import Button3D from '../../components/Button3D';

const MASTER_COLORS = [
  { name: 'Cream / Ecru', hex: '#F5F0E8' },
  { name: 'Obsidian Black', hex: '#1A1A2E' },
  { name: 'Glacier Sky Blue', hex: '#B8DCF0' },
  { name: 'Warm Champagne', hex: '#D4A76A' },
  { name: 'Graphite Grey', hex: '#2D2D2D' },
  { name: 'Sahara Sand', hex: '#C2B280' },
  { name: 'Forest Olive', hex: '#556B2F' },
  { name: 'Ivory White', hex: '#FFFFF0' },
  { name: 'Midnight Navy', hex: '#191970' },
];

const MASTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminNewProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Essential Set');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [care, setCare] = useState('');
  const [inventoryCount, setInventoryCount] = useState(25);

  // Active Color Swatches toggled by Admin
  const [activeColors, setActiveColors] = useState([
    { name: 'Cream / Ecru', hex: '#F5F0E8', active: true },
    { name: 'Obsidian Black', hex: '#1A1A2E', active: true },
  ]);

  // Active Sizes toggled by Admin
  const [activeSizes, setActiveSizes] = useState([
    { name: 'S', active: true },
    { name: 'M', active: true },
    { name: 'L', active: true },
  ]);

  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const toggleColor = (col) => {
    const exists = activeColors.find((c) => c.name === col.name);
    if (exists) {
      setActiveColors(activeColors.filter((c) => c.name !== col.name));
    } else {
      setActiveColors([...activeColors, { name: col.name, hex: col.hex, active: true }]);
    }
  };

  const toggleSize = (sz) => {
    const exists = activeSizes.find((s) => s.name === sz);
    if (exists) {
      setActiveSizes(activeSizes.filter((s) => s.name !== sz));
    } else {
      setActiveSizes([...activeSizes, { name: sz, active: true }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeColors.length === 0) {
      setErrorMsg('Please activate at least 1 color for this tracksuit set');
      return;
    }
    if (activeSizes.length === 0) {
      setErrorMsg('Please activate at least 1 size for this tracksuit set');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        price: Number(price),
        category,
        description,
        fabric,
        care,
        inventoryCount: Number(inventoryCount),
        colors: JSON.stringify(activeColors),
        sizes: JSON.stringify(activeSizes),
        isFeatured,
        isNewArrival,
        isBestseller,
      };

      await api.post('/products', payload);
      navigate('/admin/products');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create tracksuit set');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/products')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--ash)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Products</span>
      </button>

      <div style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
          Atelier Creation
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: 'var(--graphite)', marginTop: '4px' }}>
          Add New Tracksuit Set
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
          Remember: tracksuits are sold exclusively as complete 1-piece sets (Top + Trouser).
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'rgba(163, 64, 64, 0.1)',
            border: '1px solid rgba(163, 64, 64, 0.25)',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Core Attributes */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>General Information</h3>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Set Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. The Atelier Cashmere-Blend Tracksuit"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Slug (URL identifier)</label>
              <input
                type="text"
                required
                placeholder="the-atelier-cashmere"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Category Series *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ height: '46px' }}
              >
                <option value="Essential Set">Essential Set</option>
                <option value="Heavyweight Set">Heavyweight Set</option>
                <option value="Velour Set">Velour Set</option>
                <option value="Cashmere Set">Cashmere Set</option>
                <option value="Limited Edition">Limited Edition</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Price in PKR (Rs.) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 19500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Backend Stock Quantity * (Hidden from clients)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 50"
                value={inventoryCount}
                onChange={(e) => setInventoryCount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the silhouette, hand feel, and design accents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Fabric Composition</label>
              <input
                type="text"
                placeholder="e.g. 70% Pima Cotton, 30% Cashmere | 380 GSM"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
              />
            </div>

            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Care Instructions</label>
              <input
                type="text"
                placeholder="e.g. Dry clean or cold wool cycle. Lay flat."
                value={care}
                onChange={(e) => setCare(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Interactive Color & Size Activator */}
        <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>Active Variants Configurator</h3>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '-12px' }}>
            Toggle ON the exact colors and sizes that customers can see and order on the storefront.
          </p>

          {/* Color Activator */}
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              Master Color Palette (Selected: {activeColors.length})
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MASTER_COLORS.map((col) => {
                const isActive = activeColors.some((c) => c.name === col.name);
                return (
                  <button
                    type="button"
                    key={col.name}
                    onClick={() => toggleColor(col)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--snow)' : 'var(--cloud)',
                      border: isActive ? '1.5px solid var(--graphite)' : '1px dashed var(--hairline)',
                      cursor: 'pointer',
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: col.hex, border: '1px solid rgba(0,0,0,0.15)' }} />
                    <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>{col.name}</span>
                    {isActive && <Check size={12} color="var(--graphite)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Activator */}
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              Master Sizes (Selected: {activeSizes.length})
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MASTER_SIZES.map((sz) => {
                const isActive = activeSizes.some((s) => s.name === sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: isActive ? 'var(--graphite)' : 'var(--cloud)',
                      color: isActive ? 'var(--snow)' : 'var(--ash)',
                      border: isActive ? '1px solid var(--graphite)' : '1px dashed var(--hairline)',
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Badges */}
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Editorial Flags</label>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span>Mark as "New Release"</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span>Mark as "Bestseller"</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span>Feature on Homepage 3D Carousel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button3D
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {submitting ? 'Publishing Tracksuit Set...' : 'Publish Tracksuit to Atelier'}
          </Button3D>
        </div>
      </form>
    </div>
  );
}
