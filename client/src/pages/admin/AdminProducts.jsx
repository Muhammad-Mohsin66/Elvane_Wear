import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2, Check, X, ShieldAlert, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import api, { formatPKR } from '../../utils/api';
import Button3D from '../../components/Button3D';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(0);

  // Color & Image Governance Modal
  const [colorModalProduct, setColorModalProduct] = useState(null);
  const [modalColors, setModalColors] = useState([]);
  const [savingColors, setSavingColors] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/admin/all');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleColor = async (product, colorName) => {
    const updatedColors = product.colors.map((c) =>
      c.name === colorName ? { ...c, active: !c.active } : c
    );
    try {
      await api.put(`/products/${product._id}`, {
        colors: JSON.stringify(updatedColors),
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle color');
    }
  };

  const handleToggleSize = async (product, sizeName) => {
    const updatedSizes = product.sizes.map((s) =>
      s.name === sizeName ? { ...s, active: !s.active } : s
    );
    try {
      await api.put(`/products/${product._id}`, {
        sizes: JSON.stringify(updatedSizes),
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle size');
    }
  };

  const handleSaveInventory = async (productId) => {
    try {
      await api.put(`/products/${productId}`, {
        inventoryCount: inventoryValue,
      });
      setEditingInventoryId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update inventory count');
    }
  };

  const handleModalFileUpload = async (colorName, field, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingKey(`${colorName}-${field}`);
    try {
      const { data } = await api.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModalColors((prev) =>
        prev.map((c) => {
          if (c.name === colorName) {
            const updated = { ...c, [field]: data.url };
            if (field === 'modelImage' && !c.imageUrl) updated.imageUrl = data.url;
            return updated;
          }
          return c;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image file');
    } finally {
      setUploadingKey('');
    }
  };

  const handleUpdateModalColor = (colorName, field, value) => {
    setModalColors((prev) =>
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

  const handleSaveModalColors = async () => {
    if (!colorModalProduct) return;
    setSavingColors(true);
    try {
      await api.put(`/products/${colorModalProduct._id}`, {
        colors: JSON.stringify(modalColors),
      });
      setColorModalProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update color variant visuals');
    } finally {
      setSavingColors(false);
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action will generate an audit log.`)) {
      return;
    }
    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '32px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Catalog Governance
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 36px)', color: 'var(--graphite)', marginTop: '4px' }}>
            Atelier Tracksuits ({products.length})
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Toggle active colors & sizes for customer visibility, adjust backend stock counts, and manage catalog.
          </p>
        </div>

        <Button3D
          variant="primary"
          size="md"
          onClick={() => navigate('/admin/new-product')}
          icon={Plus}
        >
          Add New Tracksuit Set
        </Button3D>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ash)' }}>Loading Catalog...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--cloud)', borderRadius: '16px' }}>
          No tracksuit products found. Click "+ Add New Tracksuit Set" to create one.
        </div>
      ) : (
        <div
          style={{
            background: 'var(--snow)',
            borderRadius: '20px',
            border: '1px solid var(--hairline)',
            boxShadow: '0 4px 20px rgba(26,26,26,0.03)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--cloud)', borderBottom: '1px solid var(--hairline)', color: 'var(--ash)' }}>
                  <th style={{ padding: '16px 20px' }}>Tracksuit Set</th>
                  <th style={{ padding: '16px 20px' }}>Category</th>
                  <th style={{ padding: '16px 20px' }}>Price (PKR)</th>
                  <th style={{ padding: '16px 20px' }}>Active Colors (Click to Toggle)</th>
                  <th style={{ padding: '16px 20px' }}>Active Sizes (Click to Toggle)</th>
                  <th style={{ padding: '16px 20px' }}>Backend Stock</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--hairline)', transition: 'background 0.2s ease' }}>
                    {/* Title */}
                    <td style={{ padding: '18px 20px' }}>
                      <p style={{ fontWeight: 600, color: 'var(--graphite)', fontSize: '14px' }}>{product.title}</p>
                      <span style={{ fontSize: '11px', color: 'var(--ash)' }}>/{product.slug}</span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '18px 20px' }}>
                      <span className="eyebrow" style={{ fontSize: '10px' }}>{product.category}</span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '18px 20px', fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 600 }}>
                      {formatPKR(product.price)}
                    </td>

                    {/* Active Colors with Quick Toggle */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {product.colors?.map((col) => (
                          <button
                            key={col.name}
                            onClick={() => handleToggleColor(product, col.name)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              background: col.active ? 'var(--snow)' : 'var(--cloud)',
                              border: col.active ? '1px solid var(--graphite)' : '1px dashed var(--mist)',
                              opacity: col.active ? 1 : 0.5,
                              cursor: 'pointer',
                            }}
                            title={`Click to ${col.active ? 'disable' : 'enable'} for customers`}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.hex }} />
                            <span>{col.name}</span>
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Active Sizes with Quick Toggle */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {product.sizes?.map((sz) => (
                          <button
                            key={sz.name}
                            onClick={() => handleToggleSize(product, sz.name)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              background: sz.active ? 'var(--graphite)' : 'var(--cloud)',
                              color: sz.active ? 'var(--snow)' : 'var(--mist)',
                              border: sz.active ? '1px solid var(--graphite)' : '1px dashed var(--mist)',
                            }}
                            title={`Click to ${sz.active ? 'disable' : 'enable'} size`}
                          >
                            {sz.name}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Backend Inventory Stock */}
                    <td style={{ padding: '18px 20px' }}>
                      {editingInventoryId === product._id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="0"
                            value={inventoryValue}
                            onChange={(e) => setInventoryValue(Number(e.target.value))}
                            style={{ width: '70px', padding: '4px 8px', fontSize: '12px' }}
                          />
                          <button
                            onClick={() => handleSaveInventory(product._id)}
                            style={{ background: 'var(--success)', color: '#FFF', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditingInventoryId(null)}
                            style={{ background: 'var(--cloud)', border: '1px solid var(--hairline)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: product.inventoryCount < 10 ? 'var(--danger)' : 'var(--graphite)' }}>
                            {product.inventoryCount} units
                          </span>
                          <button
                            onClick={() => {
                              setEditingInventoryId(product._id);
                              setInventoryValue(product.inventoryCount);
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--ash)', cursor: 'pointer', padding: '2px' }}
                            title="Edit stock count"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setColorModalProduct(product);
                            setModalColors(product.colors || []);
                          }}
                          style={{
                            background: 'var(--snow)',
                            border: '1px solid var(--hairline)',
                            borderRadius: '8px',
                            color: 'var(--graphite)',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            fontWeight: 600,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          }}
                          title="Configure color images for this tracksuit"
                        >
                          <ImageIcon size={13} />
                          <span>Color Images</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product._id, product.title)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--mist)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Delete Product Set"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Color Variant Images Editor Modal */}
      {colorModalProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26, 26, 26, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setColorModalProduct(null)}
        >
          <div
            style={{
              background: 'var(--snow)',
              borderRadius: '24px',
              border: '1px solid var(--hairline)',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Visual Assets Governance</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--graphite)', marginTop: '4px' }}>
                  {colorModalProduct.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '2px' }}>
                  Assign primary and flat-lay photos for each color variant. When customers hover over the color dot on the storefront, the card will display this image.
                </p>
              </div>
              <button
                onClick={() => setColorModalProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mist)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Colors list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {modalColors.map((col) => {
                const isUploadingModel = uploadingKey === `${col.name}-modelImage`;
                const isUploadingArticle = uploadingKey === `${col.name}-articleImage`;

                return (
                  <div
                    key={col.name}
                    style={{
                      background: 'var(--cloud)',
                      borderRadius: '16px',
                      border: '1px solid var(--hairline)',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: col.hex, border: '1px solid rgba(0,0,0,0.2)' }} />
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--graphite)' }}>{col.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'monospace' }}>({col.hex})</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: col.active ? 'var(--forest)' : 'var(--ash)', fontWeight: 600 }}>
                        {col.active ? '● Active on Store' : '○ Inactive'}
                      </span>
                    </div>

                    {/* Primary Photo */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--graphite)', display: 'block', marginBottom: '3px' }}>
                          Primary / Model Photo (Front Display & Color Hover)
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="/images/products/... or URL"
                            value={col.modelImage || ''}
                            onChange={(e) => handleUpdateModalColor(col.name, 'modelImage', e.target.value)}
                            style={{ flex: 1, height: '38px', fontSize: '12px' }}
                          />
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0 12px',
                              height: '38px',
                              borderRadius: '8px',
                              background: isUploadingModel ? 'var(--ash)' : 'var(--snow)',
                              border: '1px solid var(--hairline)',
                              color: 'var(--graphite)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Upload size={12} />
                            <span>{isUploadingModel ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleModalFileUpload(col.name, 'modelImage', e.target.files?.[0])}
                            />
                          </label>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          background: '#F0ECE4',
                          border: '1px solid var(--hairline)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {col.modelImage ? (
                          <img src={col.modelImage} alt="Model" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <ImageIcon size={16} color="var(--mist)" />
                        )}
                      </div>
                    </div>

                    {/* Flat-lay Photo */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ash)', display: 'block', marginBottom: '3px' }}>
                          Article / Flat-lay Photo (Card Hover View)
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="/images/products/... or URL"
                            value={col.articleImage || ''}
                            onChange={(e) => handleUpdateModalColor(col.name, 'articleImage', e.target.value)}
                            style={{ flex: 1, height: '38px', fontSize: '12px' }}
                          />
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0 12px',
                              height: '38px',
                              borderRadius: '8px',
                              background: isUploadingArticle ? 'var(--ash)' : 'var(--snow)',
                              border: '1px solid var(--hairline)',
                              color: 'var(--graphite)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Upload size={12} />
                            <span>{isUploadingArticle ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleModalFileUpload(col.name, 'articleImage', e.target.files?.[0])}
                            />
                          </label>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          background: '#F0ECE4',
                          border: '1px solid var(--hairline)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {col.articleImage ? (
                          <img src={col.articleImage} alt="Article" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <ImageIcon size={16} color="var(--mist)" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button3D variant="outline" size="md" onClick={() => setColorModalProduct(null)}>
                Cancel
              </Button3D>
              <Button3D variant="primary" size="md" disabled={savingColors} onClick={handleSaveModalColors}>
                {savingColors ? 'Saving...' : 'Save Color Visuals'}
              </Button3D>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
