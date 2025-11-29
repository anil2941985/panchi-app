import React, { useState } from "react";

export default function Header({ userName = "there", onPlan }) {
  const [q, setQ] = useState("");

  const handlePlan = () => {
    if (onPlan) onPlan(q);
  };

  return (
    <div className="header-row">
      <div className="header-left">
        <div className="small-muted" style={{ marginBottom: 6 }}>
          Hey, <strong style={{ color: "#0f1724" }}>{userName}</strong>
        </div>

        <h1 className="h1">Where are we going next?</h1>

        <p className="lead">
          Panchi finds the smartest, safest and cheapest ways to reach your
          destination — starting with flights in this MVP, and later adding
          trains, buses and cabs.
        </p>

        <div className="search-row" style={{ marginTop: 6 }}>
          <input
            className="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={'Try "Goa", "Manali", "Jaipur" or "beach under 5k"'}
          />

          <button className="header-cta" onClick={handlePlan}>
            Let Panchi plan →
          </button>
        </div>
      </div>

      <div className="header-right">
        <img src="/panchi-logo.png" alt="Panchi" style={{ height: 64 }} />
      </div>
    </div>
  );
}
