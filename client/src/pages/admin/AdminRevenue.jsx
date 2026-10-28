import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Truck, CheckCircle2, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api, { formatPKR } from '../../utils/api';

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats/revenue?period=daily');
        setStats(data);
      } catch (err) {
        console.error('Failed to load revenue stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '60px', color: 'var(--ash)', textAlign: 'center' }}>Calculating financials...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ color: 'var(--champagne)' }}>
          Commercial Summary
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: 'var(--graphite)', marginTop: '4px' }}>
          Revenue Overview
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ash)', marginTop: '4px' }}>
          Real-time metrics for store transactions, sales volume, and fulfillment status in PKR.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Total Sales (PKR)</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {formatPKR(stats?.totalRevenue || 0)}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>Gross billings</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Orders Placed</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {stats?.totalOrders || 0}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Complete 2-piece sets</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Delivered / Dispatched</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--graphite)', marginTop: '8px' }}>
            {stats?.deliveredOrders || 0}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--ash)' }}>Full customer handover</span>
        </div>

        <div style={{ background: 'var(--snow)', padding: '24px', borderRadius: '16px', border: '1px solid var(--hairline)', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Payment Split</span>
          <div style={{ marginTop: '10px', fontSize: '13px' }}>
            <p>COD: <strong>{stats?.codOrders || 0}</strong></p>
            <p style={{ marginTop: '2px' }}>JazzCash: <strong>{stats?.jazzCashOrders || 0}</strong></p>
          </div>
        </div>
      </div>

      {/* Revenue Graph */}
      <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', marginBottom: '36px', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginBottom: '24px' }}>
          30-Day Revenue Trend (PKR)
        </h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.revenueChart || []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--champagne)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--glacier-sky)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="var(--mist)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--mist)" fontSize={11} tickLine={false} tickFormatter={(val) => `Rs.${val / 1000}k`} />
              <Tooltip formatter={(value) => [formatPKR(value), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="var(--champagne)" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Tracksuits */}
      <div style={{ background: 'var(--snow)', borderRadius: '20px', border: '1px solid var(--hairline)', padding: '32px', boxShadow: '0 4px 16px rgba(26,26,26,0.03)' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', marginBottom: '20px' }}>
          Top Performing Tracksuit Sets
        </h3>
        {stats?.topProducts?.length === 0 ? (
          <p style={{ color: 'var(--ash)', fontSize: '13px' }}>Sales data will populate as orders are completed.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats?.topProducts?.map((tp, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--cloud)', borderRadius: '10px', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: 'var(--graphite)' }}>{tp.title}</span>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--ash)' }}>{tp.totalSold} sets sold</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 600 }}>{formatPKR(tp.totalRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
