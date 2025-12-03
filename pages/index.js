// pages/index.js
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import PriceCard from "./components/PriceCard"; // existing component in pages/components
// Note: PlanCard is optional. If you have PlanCard, you can import similarly.

const sampleResults = [
  { id: "f1", title: "IndiAir", subtitle: "DEL 06:00 → GOA 08:05 · 2h 5m", price: "₹3499", mood: "GOOD" },
  { id: "f2", title: "SkyWays", subtitle: "DEL 09:00 → GOA 11:05 · 2h 5m", price: "₹4299", mood: "FAIR" },
  { id: "f3", title: "BudgetAir", subtitle: "DEL 17:15 → GOA 19:20 · 2h 5m", price: "₹2999", mood: "GOOD" },
];

const nudges = [
  { id: 1, title: "Rain alert — Baga / Calangute", text: "Light rain Saturday evening; prefer inland stays for quiet mornings." },
  { id: 2, title: "Price surge likely next Fri", text: "Searches up for DEL → GOA. Book early to save ~10–18%." },
  { id: 3, title: "Traffic at Delhi T3 (Evening)", text: "Allow 30–45 mins extra to reach the airport." },
];

const trending = [
  { id: "t1", title: "Goa", subtitle: "Perfect weather + off-peak weekday flight deals", priceRange: "₹6,000–₹8,500" },
  { id: "t2", title: "Rishikesh", subtitle: "Rafting season, clear skies", priceRange: "₹3,500–₹5,000" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // 7-day quick chips
  const dateChips = useMemo(() => {
    const out = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        key: i,
        label: d.toLocaleDateString("en-GB", { month: "2-digit", day: "2-digit" }),
        pretty: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return out;
  }, []);

  // filtered results — mock logic (replace with real API)
  const results = useMemo(() => {
    // simple: return sampleResults for flights; otherwise small variations
    if (mode === "flights") return sampleResults;
    if (mode === "trains") {
      return [
        { id: "t1", title: "Konkan Kanya Express · 10111", subtitle: "18:20 → 09:15 · 14h 55m", price: "₹1100" },
        { id: "t2", title: "Jan Shatabdi Express · 12051", subtitle: "13:20 → 03:40 · 14h 20m", price: "₹1350" },
      ];
    }
    // cabs
    return [
      { id: "c1", title: "Local Taxi", subtitle: "ETA: 10 min · Rating: ★ 4.6", price: "₹220" },
      { id: "c2", title: "Ola Mini", subtitle: "ETA: 12 min · Rating: ★ 4.4", price: "₹249" },
    ];
  }, [mode]);

  return (
    <>
      <Head>
        <title>Panchi — Where are we going next?</title>
        <meta name="description" content="Panchi finds cheapest, safest and smartest ways to travel." />
      </Head>

      <main className="page">
        <header className="hero">
          <div className="hero-left">
            <div className="greet">Hey, <strong>Ethen</strong></div>
            <h1 className="headline">Where are we going next?</h1>
            <p className="subhead">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

            <div className="search-row">
              <input
                aria-label="Where to?"
                placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button className="cta" onClick={() => alert("Let Panchi plan — (mock)")} >Let Panchi plan →</button>
            </div>
          </div>

          <div className="hero-right">
            <img src="/panchi-logo.png" alt="Panchi logo" className="logo" />
          </div>
        </header>

        <section className="content">
          <div className="left-col">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Find the best options for <span className="dest">{search || "Goa"}</span></h3>
                  <p className="panel-sub">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>
                </div>

                <div className="mode-meta">
                  <div>Mode: <strong>{mode}</strong></div>
                </div>
              </div>

              <div className="chips">
                {dateChips.map((d, i) => (
                  <button
                    key={d.key}
                    className={`chip ${selectedDateIndex === i ? "active" : ""}`}
                    onClick={() => setSelectedDateIndex(i)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="tabs">
                <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>

              <div className="results" role="list">
                {results.map((r) => (
                  <div key={r.id} className="result-item" role="listitem">
                    {/* Use PriceCard to keep visual consistency */}
                    <PriceCard
                      title={r.title}
                      subtitle={r.subtitle}
                      price={r.price}
                      actionText="Book"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="trending">
              <h4>Trending trips & ideas</h4>
              <div className="trending-grid">
                {trending.map((t) => (
                  <div className="trend" key={t.id}>
                    <div className="trend-header">
                      <div className="tag">Popular</div>
                    </div>
                    <div className="trend-body">
                      <div className="trend-title">{t.title}</div>
                      <div className="trend-sub">{t.subtitle}</div>
                    </div>
                    <div className="trend-footer">
                      <div className="price-range">{t.priceRange}</div>
                      <button className="explore">Explore</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="right-col">
            <div className="nudges">
              <h4>Nudges & alerts</h4>
              {nudges.map((n) => (
                <div key={n.id} className="nudge">
                  <div className="nudge-title">{n.title}</div>
                  <div className="nudge-text">{n.text}</div>
                </div>
              ))}
            </div>

            <div className="community">
              <h5>Community quick takes</h5>
              <div className="take"><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
              <div className="take"><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
            </div>
          </aside>
        </section>
      </main>

      <style jsx>{`
        :root {
          --bg: #f6f8ff;
          --card-bg: #fff;
          --muted: #6b7280;
          --accent-from: #7c4dff;
          --accent-to: #ff68a1;
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg) 0%, #fff 60%);
          padding: 28px 36px;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .hero {
          display: flex;
          gap: 32px;
          align-items: center;
          margin-bottom: 22px;
        }

        .hero-left {
          flex: 1;
        }

        .greet {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .headline {
          font-size: 48px;
          line-height: 1.02;
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .subhead {
          color: var(--muted);
          margin: 0 0 18px 0;
        }

        .search-row {
          display: flex;
          gap: 16px;
          align-items: center;
          width: 100%;
        }

        .search-input {
          flex: 1;
          border-radius: 14px;
          border: 1px solid rgba(16, 24, 40, 0.06);
          padding: 16px 18px;
          font-size: 15px;
          box-shadow: 0 8px 20px rgba(16,24,40,0.04);
          outline: none;
        }

        .cta {
          background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(124,77,255,0.14);
        }

        .hero-right .logo {
          width: 220px;
          height: auto;
          object-fit: contain;
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
        }

        .panel {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 12px 40px rgba(16,24,40,0.06);
        }

        .panel-header {
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:20px;
        }

        .panel-sub { color: var(--muted); margin-top:4px; }

        .chips {
          display:flex;
          gap:10px;
          margin: 18px 0;
          flex-wrap:wrap;
        }

        .chip {
          border-radius: 12px;
          padding: 8px 12px;
          border: 1px solid rgba(16,24,40,0.06);
          background: #fff;
          font-weight:600;
          cursor:pointer;
        }

        .chip.active {
          background: linear-gradient(90deg, rgba(124,77,255,0.1), rgba(255,104,161,0.08));
          border-color: rgba(124,77,255,0.22);
          box-shadow: 0 8px 20px rgba(124,77,255,0.06);
        }

        .tabs { display:flex; gap:8px; margin-bottom: 14px; }
        .tab {
          padding:8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(16,24,40,0.06);
          background:white;
          cursor:pointer;
        }
        .tab.active {
          background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
          color: white;
          font-weight:700;
        }

        .results { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
        .result-item { width:100%; }

        .trending { margin-top:20px; }
        .trending-grid { display:flex; gap:12px; flex-wrap:wrap; }
        .trend {
          background: linear-gradient(180deg, #fff, #fbfbff);
          border-radius:12px;
          padding:12px;
          width: 48%;
          box-shadow: 0 8px 20px rgba(16,24,40,0.04);
        }
        .trend .tag { display:inline-block; background:#f1f1f6; padding:6px 8px; border-radius:8px; font-size:12px; color:var(--muted); margin-bottom:8px; }

        .right-col { position:relative; }
        .nudges, .community {
          background: var(--card-bg);
          padding: 16px;
          border-radius:12px;
          box-shadow: 0 10px 30px rgba(16,24,40,0.04);
          margin-bottom:18px;
        }

        .nudge { border-bottom:1px dashed rgba(16,24,40,0.04); padding:10px 0; }
        .nudge:last-child { border-bottom:none; padding-bottom:0; }
        .nudge-title { font-weight:700; margin-bottom:6px; }
        .nudge-text { color: var(--muted); font-size:14px; }

        /* Responsive */
        @media (max-width: 980px) {
          .content { grid-template-columns: 1fr; }
          .hero { flex-direction: column; align-items: stretch; gap: 18px; }
          .hero-right { display:flex; justify-content:flex-end; }
          .hero-right .logo { width: 160px; }
        }

        @media (max-width: 480px) {
          .headline { font-size: 30px; }
          .search-input { padding: 12px; }
        }
      `}</style>
    </>
  );
}
