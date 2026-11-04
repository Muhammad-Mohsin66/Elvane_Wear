import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Mail, Phone, Clock, CheckCircle2,
  AlertCircle, Search, Trash2, ArrowUpRight, Filter, RefreshCw, X
} from 'lucide-react';
import api from '../../utils/api';
import Button3D from '../../components/Button3D';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'Pending' | 'In Review' | 'Resolved'
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Body scroll lock when detail modal is open
  useEffect(() => {
    if (selectedInquiry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedInquiry]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { data } = await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      setInquiries((prev) => prev.map((inq) => (inq._id === id ? data : inq)));
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete inquiry');
    }
  };

  // Filter & Search
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = activeFilter === 'all' || inq.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = inquiries.filter((i) => i.status === 'Pending').length;
  const inReviewCount = inquiries.filter((i) => i.status === 'In Review').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
            Customer Support & Concierge
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 400,
              color: 'var(--graphite)',
              marginTop: '4px',
            }}
          >
            Client Inquiries & Support Tickets
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
            Inquiries submitted through the storefront contact form and routed to <strong>elvane.wears@gmail.com</strong>.
          </p>
        </div>

        <Button3D variant="ghost" size="sm" onClick={fetchInquiries} disabled={loading} style={{ gap: '8px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button3D>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--snow)', padding: '20px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Total Inquiries</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: '4px 0 0', color: 'var(--graphite)' }}>
            {inquiries.length}
          </h2>
        </div>

        <div style={{ background: 'var(--snow)', padding: '20px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <span className="eyebrow" style={{ fontSize: '10px', color: '#D4A76A' }}>Action Needed (Pending)</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: '4px 0 0', color: '#B8860B' }}>
            {pendingCount}
          </h2>
        </div>

        <div style={{ background: 'var(--snow)', padding: '20px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <span className="eyebrow" style={{ fontSize: '10px', color: '#3B82F6' }}>In Review</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: '4px 0 0', color: '#2563EB' }}>
            {inReviewCount}
          </h2>
        </div>

        <div style={{ background: 'var(--snow)', padding: '20px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <span className="eyebrow" style={{ fontSize: '10px', color: '#16A34A' }}>Resolved</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', margin: '4px 0 0', color: '#16A34A' }}>
            {resolvedCount}
          </h2>
        </div>
      </div>

      {/* Search & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'Pending', 'In Review', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: activeFilter === tab ? 'var(--graphite)' : 'var(--hairline)',
                background: activeFilter === tab ? 'var(--graphite)' : 'var(--snow)',
                color: activeFilter === tab ? 'var(--snow)' : 'var(--charcoal)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab === 'all' ? `All (${inquiries.length})` : `${tab} (${inquiries.filter((i) => i.status === tab).length})`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} color="var(--ash)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '999px',
              border: '1px solid var(--hairline)',
              background: 'var(--snow)',
              fontSize: '13px',
            }}
          />
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ash)', fontSize: '14px' }}>
            Loading inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <MessageSquare size={36} color="var(--champagne)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: 'var(--graphite)' }}>
              No inquiries found
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
              {searchQuery ? 'Try matching another name or keyword.' : 'All incoming customer messages will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--cloud)', borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message Excerpt</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ash)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => {
                  const statusColors = {
                    Pending: { bg: 'rgba(212, 167, 106, 0.15)', text: '#B8860B' },
                    'In Review': { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563EB' },
                    Resolved: { bg: 'rgba(34, 197, 94, 0.12)', text: '#16A34A' },
                  }[inq.status] || { bg: 'var(--cloud)', text: 'var(--ash)' };

                  return (
                    <tr
                      key={inq._id}
                      style={{ borderBottom: '1px solid var(--hairline)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onClick={() => setSelectedInquiry(inq)}
                      className="hover:bg-black/[0.02]"
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--graphite)', display: 'block' }}>{inq.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--ash)' }}>{inq.email}</span>
                        {inq.phone && <div style={{ fontSize: '11px', color: 'var(--charcoal)', marginTop: '2px' }}>{inq.phone}</div>}
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--graphite)' }}>
                        {inq.subject}
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--charcoal)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inq.message}
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--ash)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(inq.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <br />
                        <span style={{ fontSize: '11px' }}>{new Date(inq.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>

                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: statusColors.bg,
                            color: statusColors.text,
                          }}
                        >
                          {inq.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <a
                            href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)} — Elvane Wear Concierge`}
                            target="_blank"
                            rel="noreferrer"
                            title="Reply via Email"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--hairline)',
                              background: 'var(--snow)',
                              color: 'var(--graphite)',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              textDecoration: 'none',
                              fontWeight: 500,
                            }}
                          >
                            <Mail size={12} />
                            Reply
                          </a>

                          <button
                            onClick={() => handleDelete(inq._id)}
                            title="Delete"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--ash)',
                              padding: '6px',
                              cursor: 'pointer',
                              borderRadius: '6px',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Dossier Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 15, 15, 0.65)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'var(--snow)',
                borderRadius: '24px',
                border: '1px solid var(--hairline)',
                padding: 'clamp(20px, 3.5vw, 36px)',
                width: '100%',
                maxWidth: '640px',
                maxHeight: '90vh',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                zIndex: 1,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--hairline)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Customer Inquiry Ticket</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: 'var(--graphite)', marginTop: '4px' }}>
                    {selectedInquiry.subject}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--ash)' }}>
                    Submitted: {new Date(selectedInquiry.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  style={{ background: 'var(--cloud)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ash)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Client Info Grid */}
              <div style={{ background: 'var(--cloud)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontSize: '13px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Sender Name</span>
                  <div style={{ fontWeight: 600, color: 'var(--graphite)', marginTop: '2px' }}>{selectedInquiry.name}</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Sender Email</span>
                  <div style={{ fontWeight: 600, color: 'var(--graphite)', marginTop: '2px' }}>
                    <a href={`mailto:${selectedInquiry.email}`} style={{ color: '#B8860B', textDecoration: 'none' }}>
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="eyebrow" style={{ fontSize: '10px' }}>Contact Phone</span>
                    <div style={{ color: 'var(--graphite)', marginTop: '2px' }}>
                      <a href={`tel:${selectedInquiry.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Target Store Inbox</span>
                  <div style={{ color: 'var(--ash)', marginTop: '2px' }}>elvane.wears@gmail.com</div>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '24px' }}>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Customer Message</span>
                <div style={{ background: 'var(--snow)', border: '1px solid var(--hairline)', borderRadius: '14px', padding: '18px 20px', fontSize: '14px', lineHeight: 1.7, color: 'var(--graphite)', whiteSpace: 'pre-line' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Governance */}
              <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="eyebrow" style={{ fontSize: '11px' }}>Ticket Status:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                    disabled={updatingId === selectedInquiry._id}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--hairline)',
                      background: 'var(--snow)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--graphite)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)} — Elvane Wear Support&body=Dear ${encodeURIComponent(selectedInquiry.name)},%0D%0A%0D%0AThank you for contacting Elvane Wear regarding "${encodeURIComponent(selectedInquiry.subject)}".%0D%0A%0D%0A`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button3D variant="primary" size="sm" style={{ gap: '6px' }}>
                      <Mail size={14} />
                      Reply via Email
                    </Button3D>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
