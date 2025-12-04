// pages/plan.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Simple inline PriceCard — self-contained to avoid imports
 */
function PriceCard({ airline, depart, arrive, price, mood }) {
  return (
    <div className="planItem" role="article" aria-label={`${airline} ${depart} ${arrive}`}>
      <div>
        <div style={{ fontWeight: 700 }}>{airline}</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>{depart} → {arrive}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Mood: {mood}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="planPrice">₹{price}</div>
        <button className="btnBook" style={{ marginTop: 8 }}>Book</button>
      </div>
    </div>
  );
}

/**
 * Embedded decorative HeroBlob (same as index)
 */
function HeroBlob() {
  return (
    <div className="hero-blob" aria-hidden>
      <svg viewBox="0 0 400 260" width="400" height="260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1b" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd6f0" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#caa7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b3f0ff" stopOpacity="0.85" />
          </linearGradient>
          <filter id="blurMeB" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>
        <g filter="url(#blurMeB)">
          <path
            d="M84 12c45-8 110 2 156 28 46 26 74 84 60 134-14 50-71 80-120 90-49 9-99-6-142-30C20 201 3 146 15 106 27 66 44 28 84 12z"
            fill="url(#g1b)"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const q = router.query.destination || "Goa";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  // Try to fetch real API; fallback to mock if it fails
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Replace this endpoint with your real API: /api/search?destination=...
        const res = await fetch(`/api/search?destination=${encodeURIComponent(q)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data?.results)) {
          setResults(data.results);
          setLoading(false);
          return;
        }
        throw new Error("bad-data");
      } catch (err) {
        // fallback mock data
        setResults([
          { id: "r1", airline: "IndiAir", depart: "DEL 06:00", arrive: "Goa 08:05 · 2h 5m", price: 3499, mood: "GOOD" },
          { id: "r2", airline: "SkyWays", depart: "DEL 09:00", arrive: "Goa 11:05 · 2h 5m", price: 4299, mood: "FAIR" },
          { id: "r3", airline: "BudgetAir", depart: "DEL 17:15", arrive: "Goa 19:20 · 2h 5m", price: 2999, mood: "GOOD" },
        ]);
        setLoading(false);
      }
    }
    load();
  }, [q]);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <img src="/images/panchi-default.png" alt="Panchi" />
            <div>
              <div style={{ fontWeight: 700 }}>Panchi</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>Your AI-powered wings for every journey</div>
            </div>
          </div>
        </div>

        <h1 className="headline">Where are we going next?</h1>
        <p className="subtitle">Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.</p>

        <div className="searchRow">
          <div className="searchInput">
            <input defaultValue={q} placeholder='Try "Goa", "Manali", "Jaipur"' />
          </div>
          <button className="cta" onClick={() => router.push(`/plan?destination=${encodeURIComponent(q)}`)}>Let Panchi plan →</button>
        </div>

        <HeroBlob />
      </header>

      <main className="container">
        <section className="card">
          <h3>Find the best options for {q}</h3>
          <p style={{ color: "#6b7280" }}>Mode: <strong>flights</strong></p>

          <div style={{ marginTop: 12 }}>
            <button className="datePill active">29/11</button>
            <button className="datePill">30/11</button>
            <button className="datePill">01/12</button>
            <div style={{ marginTop: 12 }}>
              <button className="tab active">Flights</button>
              <button className="tab">Trains</button>
              <button className="tab">Cabs</button>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            {loading && <div style={{ color: "#6b7280" }}>Loading options…</div>}

            {!loading && results.length === 0 && (
              <div style={{ color: "#6b7280" }}>No results found for {q}.</div>
            )}

            {!loading && results.map(r => (
              <PriceCard
                key={r.id || r.airline + r.price}
                airline={r.airline}
                depart={r.depart}
                arrive={r.arrive}
                price={r.price}
                mood={r.mood || "UNKNOWN"}
              />
            ))}
          </div>
        </section>

        <aside className="nudges">
          <h4>Nudges & alerts</h4>
          <ul>
            <li><strong>Rain alert — Baga / Calangute</strong><div style={{ color: "#6b7280" }}>Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
            <li style={{ marginTop: 10 }}><strong>Price surge likely next Fri</strong><div style={{ color: "#6b7280" }}>Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
            <li style={{ marginTop: 10 }}><strong>Traffic at Delhi T3 (Evening)</strong><div style={{ color: "#6b7280" }}>Allow 30–45 mins extra to reach the airport during evening rush.</div></li>
          </ul>
        </aside>
      </main>

      <style jsx global>{`
        :root{
          --accentA: #7f3aea;
          --accentB: #ff4da6;
          --bg-start: #f6faff;
          --bg-end: #fff6fb;
        }
        html,body,#__next{height:100%}
        body{margin:0;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;background:
           radial-gradient(600px 240px at 6% 8%, rgba(127,58,234,0.04), transparent 10%),
           radial-gradient(460px 180px at 92% 10%, rgba(255,77,166,0.03), transparent 8%),
           linear-gradient(180deg, var(--bg-start), var(--bg-end));}
        .hero{padding:36px 48px;position:relative;overflow:visible}
        .hero-inner{display:flex;align-items:center;justify-content:space-between}
        .brand{display:flex;gap:12px;align-items:center}
        .brand img{height:54px;width:auto}
        .headline{font-size:56px;margin:6px 0 6px 0;color:#0f172a;font-weight:800}
        .subtitle{color:#6b7280;margin:0 0 20px 0}
        .searchRow{display:flex;gap:16px;align-items:center;margin-top:12px}
        .searchInput{flex:1;background:#fff;border-radius:14px;padding:12px 14px;box-shadow:0 8px 30px rgba(12,18,55,0.04);border:1px solid rgba(12,18,55,0.03)}
        .searchInput input{border:0;outline:0;width:100%;font-size:16px}
        .cta{display:inline-flex;align-items:center;padding:12px 18px;border-radius:12px;background:linear-gradient(90deg,var(--accentA) 0%,var(--accentB) 70%);color:#fff;border:0;font-weight:700;cursor:pointer;box-shadow:0 14px 40px rgba(127,58,234,0.12)}
        .hero-blob{position:absolute;right:48px;top:18px;width:320px;height:210px;pointer-events:none;opacity:.95}
        .container{display:grid;grid-template-columns:1fr 360px;gap:28px;padding:20px 48px 80px}
        .card{background:#fff;border-radius:16px;padding:22px;box-shadow:0 10px 30px rgba(12,18,55,0.04);border:1px solid rgba(12,18,55,0.03)}
        .nudges{background:#fff;border-radius:16px;padding:18px;box-shadow:0 10px 30px rgba(12,18,55,0.04);border:1px solid rgba(12,18,55,0.03)}
        .datePill{display:inline-block;padding:8px 12px;margin-right:8px;border-radius:12px;background:rgba(9,10,11,0.03);color:#0f172a;border:1px solid rgba(12,18,55,0.04);font-weight:600;cursor:pointer}
        .datePill.active{color:#fff;background:linear-gradient(90deg,var(--accentA),var(--accentB));box-shadow:0 18px 50px rgba(127,58,234,0.14);border:none}
        .tab{display:inline-block;padding:8px 12px;margin-right:8px;border-radius:12px;border:1px solid rgba(12,18,55,0.04);background:transparent;font-weight:600;cursor:pointer}
        .tab.active{background:linear-gradient(90deg,#9f4cf3 0%, #ff6fb2 70%);color:white;box-shadow:0 12px 40px rgba(127,58,234,0.12);transform:translateY(-2px)}
        .planItem{display:flex;align-items:center;gap:16px;justify-content:space-between;padding:18px;margin:14px 0;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.95));box-shadow:0 6px 20px rgba(12,18,55,0.03);border:1px solid rgba(12,18,55,0.03)}
        .planPrice{font-weight:800;font-size:20px}
        .btnBook{background:#fff;border-radius:8px;padding:8px 10px;border:1px solid rgba(12,18,55,0.06);box-shadow:0 4px 10px rgba(12,18,55,0.03);cursor:pointer}
        @media (max-width:980px){ .container{grid-template-columns:1fr} .hero-blob{display:none} .headline{font-size:34px} }
      `}</style>
    </div>
  );
}
