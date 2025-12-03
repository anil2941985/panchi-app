// pages/components/PriceCard.jsx
import React from "react";

export default function PriceCard({ item = {}, onBook }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      background: "#fff",
      border: "1px solid rgba(16,24,40,0.04)",
      boxShadow: "0 8px 20px rgba(10,20,40,0.04)"
    }}>
      <div style={{ maxWidth: "72%" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{item.airline}</div>
        <div style={{ marginTop: 6, color: "#6b7280", fontSize: 13 }}>{item.depart} → {item.arrive} · {item.dur}</div>
        <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Mood: <strong>{item.mood}</strong></div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>₹{item.price}</div>
        <button onClick={() => onBook && onBook(item)} style={{
          marginTop: 8,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid rgba(10,20,40,0.08)",
          background: "#fff",
          cursor: "pointer",
        }}>Book</button>
      </div>
    </div>
  );
}
