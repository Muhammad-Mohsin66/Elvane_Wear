import React from 'react';
import { ShoppingBag, ShieldCheck, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'Pending', label: 'Order Placed', desc: 'Order received & recorded', icon: ShoppingBag },
  { id: 'Confirmed', label: 'Confirmed', desc: 'Verified by Store Atelier', icon: ShieldCheck },
  { id: 'Processing', label: 'Packaging', desc: 'Quality checked & packed', icon: Package },
  { id: 'Dispatched', label: 'In-Transit', desc: 'On courier dispatch nationwide', icon: Truck },
  { id: 'Delivered', label: 'Delivered', desc: 'Doorstep arrival & COD paid', icon: CheckCircle2 },
];

export default function OrderTimelineTracker({ status, createdAt, updatedAt }) {
  if (status === 'Cancelled') {
    return (
      <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
        <AlertCircle size={20} color="#DC2626" />
        <div>
          <strong style={{ color: '#DC2626', fontSize: '13px', display: 'block' }}>Order Cancelled</strong>
          <span style={{ fontSize: '12px', color: 'var(--ash)' }}>
            This order has been cancelled. If you have questions or need to re-order, please contact support.
          </span>
        </div>
      </div>
    );
  }

  const getStepIndex = (st) => {
    switch (st) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Dispatched': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(status);

  return (
    <div style={{ margin: '20px 0', padding: '20px', background: 'var(--cloud)', borderRadius: '16px', border: '1px solid var(--hairline)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--champagne)' }}>
          Live Fulfillment Timeline
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ash)', fontWeight: 500 }}>
          {status === 'Delivered'
            ? 'Delivered to Doorstep'
            : status === 'Dispatched'
            ? 'Estimated Doorstep Arrival: 2-3 Days'
            : status === 'Confirmed'
            ? 'Verified — Moving to Packaging'
            : 'Order Pending Verification'}
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            right: '20px',
            height: '3px',
            background: 'var(--mist)',
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        {/* Active Connecting Fill Line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            width: `${(currentIdx / (TIMELINE_STEPS.length - 1)) * 92}%`,
            height: '3px',
            background: 'linear-gradient(90deg, var(--champagne), var(--graphite))',
            transition: 'width 0.4s ease',
            zIndex: 0,
          }}
        />

        {/* Step Nodes */}
        {TIMELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <div
              key={step.id}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '76px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  background: isCurrent
                    ? 'var(--graphite)'
                    : isCompleted
                    ? 'var(--champagne)'
                    : 'var(--snow)',
                  color: isCurrent || isCompleted ? 'var(--snow)' : 'var(--mist)',
                  border: isCurrent
                    ? '3px solid rgba(212, 167, 106, 0.4)'
                    : isCompleted
                    ? '2px solid var(--champagne)'
                    : '2px solid var(--hairline)',
                  boxShadow: isCurrent ? '0 0 12px rgba(26,26,26,0.18)' : 'none',
                }}
              >
                <Icon size={16} />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                  color: isCurrent ? 'var(--graphite)' : isCompleted ? 'var(--charcoal)' : 'var(--ash)',
                  marginTop: '8px',
                  lineHeight: 1.2,
                }}
              >
                {step.label}
              </span>

              <span
                style={{
                  fontSize: '9px',
                  color: 'var(--ash)',
                  marginTop: '3px',
                  display: 'none', // Shown on wider views
                }}
                className="timeline-subtext"
              >
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

