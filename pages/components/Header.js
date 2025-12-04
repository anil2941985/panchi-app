// components/Header.js
import React from "react";

export default function Header({ onSearch }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <div className="brand">
            {/* Use PNG logo file (public/logo.png). Adjust path if needed. */}
            <img src="/logo.png" alt="Panchi" />
          </div>
          <div className="brand-text">
            <p className="brand-title">Panchi</p>
            <p className="brand-sub">Your AI-powered wings for every journey</p>
          </div>
        </div>

        <div style={{flex:1, marginLeft:24, marginRight:18}}>
          <h1 className="headline">Where are we going next?</h1>
          <p className="subtitle">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

          <div className="searchRow" style={{marginTop:12}}>
            <div className="searchInput" role="search" aria-label="Search destination">
              <input type="text" placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"' />
            </div>
            <button className="cta" onClick={onSearch}>Let Panchi plan →</button>
          </div>
        </div>

        {/* accent (purely decorative — CSS controls look) */}
        <div className="hero-accent" aria-hidden="true" />
      </div>
    </header>
  );
}
