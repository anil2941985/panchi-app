import React from "react";

export default function PlanCard({ title, subtitle, price, onBook }) {
  return (
    <div className="result-card" role="article">
      <div className="r-left">
        <div className="r-title">{title}</div>
        <div className="r-sub">{subtitle}</div>
      </div>

      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <div className="r-price">₹{price}</div>
        <button className="r-book" onClick={onBook}>Book</button>
      </div>
    </div>
  );
}
