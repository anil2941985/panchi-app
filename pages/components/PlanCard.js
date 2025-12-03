// pages/components/PlanCard.js
import React from "react";

export default function PlanCard({ title = "Goa", subtitle, children }) {
  return (
    <div style={{
      borderRadius: 12,
      background: "linear-gradient(180deg,#fff,#fbfbff)",
      padding: 18,
      boxShadow: "0 8px 28px rgba(20,30,50,0.06)"
    }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}
