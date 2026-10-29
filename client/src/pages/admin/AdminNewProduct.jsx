import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Upload, Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import Button3D from '../../components/Button3D';

const MASTER_COLORS = [
  { name: 'Cream / Ecru', hex: '#F5F0E8', defaultModel: '/images/products/p1-cream-model.jpg', defaultArticle: '/images/products/p1-cream-flat.jpg' },
  { name: 'Obsidian Black', hex: '#1A1A2E', defaultModel: '/images/products/p1-black-model.jpg', defaultArticle: '/images/products/p1-black-flat.jpg' },
  { name: 'Glacier Sky Blue', hex: '#B8DCF0', defaultModel: '/images/products/p11-blue-model.jpg', defaultArticle: '/images/products/p11-blue-flat.jpg' },
  { name: 'Warm Champagne', hex: '#D4A76A', defaultModel: '/images/products/p12-champagne-model.jpg', defaultArticle: '/images/products/p12-champagne-flat.jpg' },
  { name: 'Graphite Grey', hex: '#2D2D2D', defaultModel: '/images/products/p5-charcoal-model.jpg', defaultArticle: '/images/products/p5-charcoal-flat.jpg' },
  { name: 'Sahara Sand', hex: '#C2B280', defaultModel: '/images/products/p6-tan-model.jpg', defaultArticle: '/images/products/p6-tan-flat.jpg' },
  { name: 'Forest Olive', hex: '#556B2F', defaultModel: '/images/products/p7-olive-model.jpg', defaultArticle: '/images/products/p7-olive-flat.jpg' },
  { name: 'Ivory White', hex: '#FFFFF0', defaultModel: '/images/products/p3-chalk-model.jpg', defaultArticle: '/images/products/p3-chalk-flat.jpg' },
  { name: 'Midnight Navy', hex: '#191970', defaultModel: '/images/products/p3-navy-model.jpg', defaultArticle: '/images/products/p3-navy-flat.jpg' },
  { name: 'Vintage Burgundy', hex: '#6B2737', defaultModel: '/images/products/p1-burgundy-model.jpg', defaultArticle: '/images/products/p1-burgundy-flat.jpg' },
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

  // Active Color Swatches toggled by Admin (with image associations)
  const [activeColors, setActiveColors] = useState([
    {
      name: 'Cream / Ecru',
      hex: '#F5F0E8',
      active: true,
      modelImage: '/images/products/p1-cream-model.jpg',
      articleImage: '/images/products/p1-cream-flat.jpg',
      imageUrl: '/images/products/p1-cream-model.jpg',
    },
    {
      name: 'Obsidian Black',
      hex: '#1A1A2E',
      active: true,
      modelImage: '/images/products/p1-black-model.jpg',
      articleImage: '/images/products/p1-black-flat.jpg',
      imageUrl: '/images/products/p1-black-model.jpg',
    },
  ]);

  // Custom Color Builder state
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#4A6B82');
  const [uploadingKey, setUploadingKey] = useState('');

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
      setActiveColors([
        ...activeColors,
        {
          name: col.name,
          hex: col.hex,
          active: true,
          modelImage: col.defaultModel || '',
          articleImage: col.defaultArticle || '',
          imageUrl: col.defaultModel || '',
        },
      ]);
    }
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    if (!customColorName.trim()) return;
    const exists = activeColors.find(
      (c) => c.name.toLowerCase() === customColorName.trim().toLowerCase()
    );
    if (exists) return;
    setActiveColors([
      ...activeColors,
      {
        name: customColorName.trim(),
        hex: customColorHex,
        active: true,
        modelImage: '',
        articleImage: '',
        imageUrl: '',
      },
    ]);
    setCustomColorName('');
  };

  const updateColorImage = (colorName, field, value) => {
    setActiveColors((prev) =>
      prev.map((c) => {
        if (c.name === colorName) {
          const updated = { ...c, [field]: value };
          if (field === 'modelImage' && !c.imageUrl) updated.imageUrl = value;
          return updated;
        }
        return c;
      })
    );
  };

  const handleFileUpload = async (colorName, field, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingKey(`${colorName}-${field}`);
    try {
      const { data } = await api.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateColorImage(colorName, field, data.url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingKey('');
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
      // Gather primary product gallery images from active colors
      const galleryImages = [];
      activeColors.forEach((c) => {
        if (c.modelImage && !galleryImages.includes(c.modelImage)) galleryImages.push(c.modelImage);
        if (c.articleImage && !galleryImages.includes(c.articleImage)) galleryImages.push(c.articleImage);
      });

      const payload = {
        title,
        slug,
        price: Number(price),
        category,
        description,
        fabric,
        care,
        inventoryCount: Number(inventoryCount),
        images: galleryImages,
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

            {/* Custom Color Creator */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--hairline)' }}>
              <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '8px' }}>
                Or Add Custom Color Variant
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Custom Color (e.g. Sage Green)"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  style={{ width: '220px', height: '40px', fontSize: '12.5px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    title="Choose Color Hex"
                  />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--graphite)' }}>{customColorHex}</span>
                </div>
                <Button3D
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomColor}
                  icon={Plus}
                >
                  Add Custom Color
                </Button3D>
              </div>
            </div>

            {/* Color Variant Visuals & Images Section (Requested by User) */}
            {activeColors.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: 'var(--graphite)' }}>
                      Color Variant Images & Visual Assets
                    </h4>
                    <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
                      Customer Hover Display
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--ash)' }}>
                    When customers hover over a color swatch dot on the storefront, the tracksuit card updates to that color's image below.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeColors.map((col) => {
                    const isUploadingModel = uploadingKey === `${col.name}-modelImage`;
                    const isUploadingArticle = uploadingKey === `${col.name}-articleImage`;

                    return (
                      <div
                        key={col.name}
                        style={{
                          background: 'var(--cloud)',
                          border: '1px solid var(--hairline)',
                          borderRadius: '16px',
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        {/* Color Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                backgroundColor: col.hex,
                                border: '1.5px solid rgba(0,0,0,0.2)',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                              }}
                            />
                            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>
                              {col.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'monospace' }}>
                              ({col.hex})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleColor(col)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--mist)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Remove color variant"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Image Input 1: Primary / Model Image */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center' }}>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--graphite)', display: 'block', marginBottom: '4px' }}>
                              Primary / Model Photo (Front Display & Color Hover)
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="/images/products/p1-cream-model.jpg or https://..."
                                value={col.modelImage || ''}
                                onChange={(e) => updateColorImage(col.name, 'modelImage', e.target.value)}
                                style={{ flex: 1, height: '42px', fontSize: '12px' }}
                              />
                              <label
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '0 14px',
                                  height: '42px',
                                  borderRadius: '10px',
                                  background: isUploadingModel ? 'var(--ash)' : 'var(--snow)',
                                  border: '1px solid var(--hairline)',
                                  color: 'var(--graphite)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: isUploadingModel ? 'not-allowed' : 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <Upload size={13} />
                                <span>{isUploadingModel ? 'Uploading...' : 'Upload File'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  disabled={isUploadingModel}
                                  onChange={(e) => handleFileUpload(col.name, 'modelImage', e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Thumbnail Preview */}
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '10px',
                              background: '#F0ECE4',
                              border: '1px solid var(--hairline)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {col.modelImage ? (
                              <img
                                src={col.modelImage}
                                alt="Model preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <ImageIcon size={18} color="var(--mist)" />
                            )}
                          </div>
                        </div>

                        {/* Image Input 2: Flat-lay / Article Image */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center' }}>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>
                              Article / Garment Flat-Lay Photo (Card Hover View)
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="/images/products/p1-cream-flat.jpg or https://..."
                                value={col.articleImage || ''}
                                onChange={(e) => updateColorImage(col.name, 'articleImage', e.target.value)}
                                style={{ flex: 1, height: '42px', fontSize: '12px' }}
                              />
                              <label
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '0 14px',
                                  height: '42px',
                                  borderRadius: '10px',
                                  background: isUploadingArticle ? 'var(--ash)' : 'var(--snow)',
                                  border: '1px solid var(--hairline)',
                                  color: 'var(--graphite)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: isUploadingArticle ? 'not-allowed' : 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <Upload size={13} />
                                <span>{isUploadingArticle ? 'Uploading...' : 'Upload File'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  disabled={isUploadingArticle}
                                  onChange={(e) => handleFileUpload(col.name, 'articleImage', e.target.files?.[0])}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Thumbnail Preview */}
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '10px',
                              background: '#F0ECE4',
                              border: '1px solid var(--hairline)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {col.articleImage ? (
                              <img
                                src={col.articleImage}
                                alt="Article preview"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <ImageIcon size={18} color="var(--mist)" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
