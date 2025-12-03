// pages/components/HeroBanner.js
import React from "react";

export default function HeroBanner({ small = false }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: small ? 12 : 20,
      borderRadius: 12,
      background: "linear-gradient(90deg,#f5fbff,#fff7fb)",
      boxShadow: "0 10px 40px rgba(120,80,200,0.06)"
    }}>
      <img src="/panchi-logo.png" alt="Panchi" style={{ height: small ? 44 : 72 }} />
      <div>
        <div style={{ fontSize: small ? 16 : 24, fontWeight: 800, color: "#111827" }}>Panchi</div>
        <div style={{ color: "#6b7280" }}>Your AI-powered wings for every journey</div>
      </div>
    </div>
  );
}
