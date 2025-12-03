// pages/components/PlanCard.js
import React from 'react';

export default function PlanCard({ summary = {} }) {
  // summary: { query, mode, date }
  const { query = 'your trip', mode = 'flights', date = null } = summary;

  return (
    <div className="plan-card" role="region" aria-label="Plan summary">
      <div className="plan-head">
        <div>
          <div className="muted small">Plan for</div>
          <div className="big">{query}</div>
        </div>
        <div className="badge">
          <div className="line">Mode</div>
          <div className="bold">{mode}</div>
        </div>
      </div>

      <div className="plan-body">
        <div className="row">
          <div className="label">Best travel day</div>
          <div className="value">{date || 'Anytime — flexible'}</div>
        </div>

        <div className="row">
          <div className="label">Nudges</div>
          <div className="value">Check weather & events — avoid peak nights</div>
        </div>

        <div className="cta-row">
          <button className="btn-outline">Save plan</button>
          <button className="btn-primary">Open details →</button>
        </div>
      </div>

      <style jsx>{`
        .plan-card {
          background: linear-gradient(180deg,#ffffff, #fbfbff);
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(16,24,40,0.06);
          margin-bottom: 12px;
        }
        .plan-head { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .muted.small { color:#6b7280; font-size:12px; }
        .big { font-weight:700; font-size:18px; margin-top:6px; }
        .badge { text-align:right; }
        .badge .line { font-size:12px; color:#70767a; }
        .badge .bold { font-weight:700; color:#111827; }

        .plan-body { margin-top:12px; }
        .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed rgba(16,24,40,0.03); }
        .label { color:#6b7280; }
        .value { font-weight:600; color:#111827; }

        .cta-row { display:flex; gap:8px; margin-top:12px; }
        .btn-outline { background:#fff; border:1px solid rgba(16,24,40,0.06); padding:8px 12px; border-radius:10px; cursor:pointer; }
        .btn-primary { background: linear-gradient(90deg,#7a4fff,#ff6fb4); color:#fff; padding:8px 12px; border-radius:10px; border:none; cursor:pointer; }
        @media (max-width:640px){ .plan-card{padding:12px} .big{font-size:16px} }
      `}</style>
    </div>
  `);
}
