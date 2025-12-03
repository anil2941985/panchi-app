// pages/index.js
import React, { useMemo, useState } from "react";
import PriceCard from "../components/PriceCard";
import PlanCard from "../components/PlanCard";

const MOCK_FLIGHTS = [
  { id: "f1", airline: "IndiAir", depart: "DEL 06:00", arrive: "GOI 08:05", duration: "2h 5m", price: 3499, mood: "GOOD" },
  { id: "f2", airline: "SkyWays", depart: "DEL 09:00", arrive: "GOI 11:05", duration: "2h 5m", price: 4299, mood: "FAIR" },
  { id: "f3", airline: "BudgetAir", depart: "DEL 17:15", arrive: "GOI 19:20", duration: "2h 5m", price: 2999, mood: "GOOD" }
];

const NUDGES = [
  { icon: "⚠️", title: "Rain alert — Baga / Calangute", txt: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
  { icon: "🔥", title: "Price surge likely next Fri", txt: "Searches spiking for DEL → GOI. Book early to save ~10–18%." },
  { icon: "🚦", title: "Traffic at Delhi T3 (Evening)", txt: "Allow 30–45 mins extra to reach the airport." }
];

export default function Home() {
  const [query, setQuery] = useState("Goa");
  const [selectedDate, setSelectedDate] = useState(0);
  const dates = useMemo(() => {
    const base = new Date();
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base.getTime() + i * 24 * 60 * 60 * 1000);
      arr.push({ key: i, label: d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" }) });
    }
    return arr;
  }, []);

  // simple filter: if query contains "Goa" show all flights; otherwise same mock
  const results = useMemo(() => {
    if (!query) return MOCK_FLIGHTS;
    return MOCK_FLIGHTS.filter((f) => query.trim() === "" || `${f.airline} ${f.depart} ${f.arrive}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="page-root">
      <header className="header">
        <div className="logo-row">
          <div className="logo-wrap" aria-hidden>
            {/* lightweight logo svg */}
            <svg width="160" height="60" viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#00b4d8" />
                  <stop offset="0.5" stopColor="#7c4dff" />
                  <stop offset="1" stopColor="#ff8a65" />
                </linearGradient>
              </defs>
              <g transform="translate(6,6)">
                <ellipse cx="16" cy="22" rx="14" ry="12" fill="url(#g1)" />
                <path d="M30 12 Q44 4 58 12 Q46 22 30 12Z" fill="#ffcc80" opacity="0.95" />
                <text x="76" y="30" fontFamily="Inter, Arial" fontSize="28" fill="#3b3b3b" fontWeight="700">panchi</text>
              </g>
            </svg>
          </div>
          <nav className="top-nav">
            <a href="/explore">Explore</a>
            <a href="/plans">Plans</a>
            <a href="/community">Community</a>
          </nav>
        </div>

        <div className="hero">
          <div className="hero-content">
            <p className="greet">Hey, <strong>Ethen</strong></p>
            <h1 className="hero-title">Where are we going next?</h1>
            <p className="hero-sub">Panchi will find the smartest, safest and cheapest ways to reach <strong>Goa</strong> — starting with flights in this MVP.</p>

            <div className="search-row">
              <input
                aria-label="Where to?"
                className="search"
                placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="cta"
                onClick={() => {
                  // quick UI-only action
                  // in real app this would navigate to /plan?destination=...
                  window.location.href = `/plan?destination=${encodeURIComponent(query || "Goa")}`;
                }}
              >
                Let Panchi plan →
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="left-col">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>Find the best options for <span className="muted">Goa</span></h2>
                <p className="muted small">Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.</p>
              </div>

              <div className="mode-block">
                <span className="mode-label">Mode:</span> <strong>flights</strong>
              </div>
            </div>

            <div className="date-row">
              {dates.map((d) => (
                <button
                  key={d.key}
                  className={`pill ${selectedDate === d.key ? "active" : ""}`}
                  onClick={() => setSelectedDate(d.key)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="mode-tabs">
              <button className="tab active">Flights</button>
              <button className="tab">Trains</button>
              <button className="tab">Cabs</button>
            </div>

            <div className="results">
              {results.length === 0 && <div className="empty">No matching results — try another query.</div>}

              {results.map((r) => (
                // Using PriceCard if available — fallback UI if component not present
                <div key={r.id} className="result-row">
                  {typeof PriceCard !== "undefined" ? (
                    <PriceCard flight={r} />
                  ) : (
                    <div className="fallback-card">
                      <div className="title">{r.airline}</div>
                      <div className="meta">{r.depart} → {r.arrive} · {r.duration}</div>
                      <div className="mood">Mood: <strong>{r.mood}</strong></div>
                      <div className="price-cta">
                        <div className="price">₹{r.price}</div>
                        <button className="ghost">Book</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Trending trips & ideas</h3>
            <div className="cards-row">
              <PlanCard title="Goa" subtitle="Perfect weather + off-peak weekday flight deals" range="₹6,000–₹8,500" />
              <PlanCard title="Rishikesh" subtitle="Great rafting season, clear skies" range="₹3,500–₹5,000" />
            </div>
          </div>
        </section>

        <aside className="right-col">
          <div className="nudge-panel">
            <h4>Nudges & alerts</h4>
            <ul>
              {NUDGES.map((n, i) => (
                <li key={i} className="nudge">
                  <div className="n-icon">{n.icon}</div>
                  <div>
                    <div className="n-title">{n.title}</div>
                    <div className="n-txt">{n.txt}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="community">
            <h5>Community quick takes</h5>
            <div className="quote"><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
            <div className="quote"><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        :root {
          --bg: #f6f9ff;
          --panel: #ffffff;
          --muted: #6b7280;
          --accent1: linear-gradient(90deg,#7c4dff,#ff6b9a);
        }
        .page-root { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #111827; background: var(--bg); min-height: 100vh; }
        .header { padding: 28px 32px 10px; }
        .logo-row { display:flex; justify-content:space-between; align-items:center; gap:20px; }
        .top-nav a { margin-left: 18px; color:#374151; text-decoration:none; font-weight:600; opacity:0.9; }
        .hero { margin-top: 8px; padding: 28px; border-radius: 18px; background: linear-gradient(180deg, rgba(124,77,255,0.06), rgba(255,107,154,0.02)); box-shadow: 0 8px 30px rgba(12,15,20,0.04); }
        .hero-content { max-width:1240px; }
        .greet { color: var(--muted); margin:0 0 6px; }
        .hero-title { font-size:44px; margin:0 0 8px; line-height:1.02;}
        .hero-sub { margin:0 0 18px; color:var(--muted); }
        .search-row { display:flex; gap:16px; align-items:center; margin-top:10px; }
        .search { flex:1; padding:20px 18px; border-radius:14px; border:1px solid rgba(16,24,40,0.06); background: #fff; box-shadow: 0 6px 18px rgba(12,15,20,0.02); font-size:16px; }
        .cta { padding:12px 20px; border-radius:12px; border: none; background: var(--accent1); color:white; font-weight:700; cursor:pointer; box-shadow: 0 8px 24px rgba(124,77,255,0.18); }

        .container { display:grid; grid-template-columns: 1fr 340px; gap:28px; padding:28px 32px; max-width:1240px; margin:0 auto; align-items:start; }
        .left-col { }
        .right-col { }
        .panel { background:var(--panel); border-radius:14px; padding:20px; box-shadow: 0 10px 30px rgba(12,15,20,0.04); margin-bottom:18px; }
        .panel-head { display:flex; justify-content:space-between; align-items:center; gap:8px; }
        .muted { color:var(--muted); }
        .small { font-size:13px; }

        .date-row { display:flex; gap:8px; flex-wrap:wrap; margin:14px 0; }
        .pill { border:1px solid rgba(16,24,40,0.06); background:#fff; padding:8px 12px; border-radius:10px; cursor:pointer; box-shadow: 0 6px 18px rgba(12,15,20,0.02); }
        .pill.active { border-color: #7c4dff; box-shadow: 0 8px 26px rgba(124,77,255,0.08); color:#7c4dff; font-weight:700; }

        .mode-tabs { margin: 12px 0 18px; display:flex; gap:12px; }
        .tab { padding:8px 12px; border-radius:10px; border:1px solid rgba(16,24,40,0.06); background: #fff; cursor:pointer; }
        .tab.active { background: var(--accent1); color:white; box-shadow: 0 8px 24px rgba(124,77,255,0.14); border:none; }

        .results { margin-top:8px; display:flex; flex-direction:column; gap:12px; }
        .result-row { }
        .fallback-card { padding:18px; border-radius:10px; background: #fbfdff; display:flex; justify-content:space-between; align-items:center; }
        .fallback-card .title { font-weight:700; font-size:16px; }
        .fallback-card .meta { color:var(--muted); margin-top:6px; font-size:13px; }
        .price-cta { display:flex; gap:12px; align-items:center; }
        .price { font-weight:700; font-size:18px; }
        .ghost { border:1px solid rgba(16,24,40,0.08); background:transparent; padding:8px 12px; border-radius:8px; cursor:pointer; }

        .cards-row { display:flex; gap:12px; margin-top:10px; flex-wrap:wrap; }
        .nudge-panel h4, .community h5 { margin:0 0 10px 0; }
        .nudge { display:flex; gap:12px; padding:12px 10px; border-radius:10px; background:#fff; margin-bottom:10px; align-items:flex-start; box-shadow: 0 6px 18px rgba(12,15,20,0.02); }
        .n-icon { width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:linear-gradient(90deg,#fff,#fff); border-radius:8px; }
        .n-title { font-weight:700; }

        .community { margin-top:20px; padding:16px; border-radius:10px; background:#fff; box-shadow: 0 6px 18px rgba(12,15,20,0.02); }
        .quote { color:var(--muted); margin-bottom:8px; }

        /* responsive */
        @media (max-width: 980px) {
          .container { grid-template-columns: 1fr; padding:18px; }
          .right-col { order: 2; }
        }
      `}</style>
    </div>
  );
}
