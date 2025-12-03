// /components/PriceCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * PriceCard - defensive / server-safe card used in plan page.
 * Handles missing data during build-time (prerender).
 */

export default function PriceCard({ item = {}, onBook }) {
  // defensive getters with defaults
  const airline = item?.airline ?? 'Unknown';
  const depart = item?.depart ?? '—';
  const arrive = item?.arrive ?? '—';
  const duration = item?.duration ?? '';
  const price = item?.price ?? '—';
  const classInfo = item?.class ?? '';
  const rating = item?.rating ?? null;

  return (
    <div
      className="price-card"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px',
        borderRadius: 12,
        boxShadow:
          '0 6px 18px rgba(9,30,66,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
        background: '#fff',
        marginBottom: 16,
      }}
    >
      <div style={{ maxWidth: '75%' }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{airline}</div>
        <div style={{ color: '#666', fontSize: 13 }}>
          {depart} → {arrive} {duration ? `· ${duration}` : ''}
        </div>
        <div style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
          {classInfo} {rating ? `· Rating: ⭐ ${rating}` : ''}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>₹{price}</div>
        <button
          onClick={() => onBook && onBook(item)}
          aria-label={`Book ${airline}`}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(16,24,40,0.08)',
            background: '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(16,24,40,0.04)',
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
}

PriceCard.propTypes = {
  item: PropTypes.object,
  onBook: PropTypes.func,
};
