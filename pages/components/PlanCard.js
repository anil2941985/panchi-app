// pages/components/PlanCard.js
import React from "react";

export default function PlanCard({ title = "Plan", subtitle, children }) {
  return (
    <div style={{
      borderRadius: 14,
      background: "linear-gradient(180deg,#fff,#fbfcff)",
      padding: 20,
      boxShadow: "0 10px 30px rgba(20,30,50,0.06)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {subtitle && <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}
