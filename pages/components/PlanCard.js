// pages/components/PlanCard.js
import React from "react";

/**
 * Simple, server-safe PlanCard component.
 * Exports a default React component that is safe for Next.js prerender.
 *
 * Props:
 *  - title (string)
 *  - subtitle (string)
 *  - range (string)
 *  - tag (string) optional
 */

export default function PlanCard({ title = "Place", subtitle = "", range = "", tag = "Popular" }) {
  return (
    <div className="plan-card" role="article" aria-label={title}>
      <div className="left">
        <div className="meta">
          <span className="tag">{tag}</span>
        </div>
        <div className="title">{title}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>

      <div className="right">
        <div className="range">{range}</div>
        <button className="explore" aria-label={`Explore ${title}`}>Explore</button>
      </div>

      <style jsx>{`
        .plan-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,252,0.9));
          box-shadow: 0 12px 30px rgba(12,15,20,0.04);
          border: 1px solid rgba(16,24,40,0.04);
          min-width: 220px;
        }

        .left { display:flex; flex-direction:column; gap:6px; flex:1; min-width:0; }
        .meta { display:flex; gap:8px; align-items:center; }
        .tag {
          display:inline-block;
          padding:6px 8px;
          font-size:12px;
          border-radius:999px;
          background:linear-gradient(90deg,#f3f2ff,#f9e7ff);
          color:#5b21b6;
          font-weight:700;
        }

        .title { font-weight:800; font-size:16px; color:#0f172a; line-height:1.05; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .subtitle { color:#6b7280; font-size:13px; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .range { font-weight:700; color:#0f172a; font-size:14px; }
        .explore {
          background: linear-gradient(90deg, #7c4dff, #ff6b9a);
          color:white;
          padding:8px 12px;
          border-radius:10px;
          border:none;
          font-weight:700;
          cursor:pointer;
          box-shadow: 0 10px 22px rgba(124,77,255,0.14);
        }

        @media (max-width: 640px) {
          .plan-card { padding:10px; gap:12px; }
          .title { font-size:15px; }
          .range { font-size:13px; }
        }
      `}</style>
    </div>
  );
}
