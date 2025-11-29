// pages/plan.js
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

/*
  Plan page (refined visuals)
  - Single-file replacement using styled-jsx
  - Responsive, colorful, ripple effects, icons inline
  - Uses mocked data arrays (same structure as earlier)
*/

const MOCK_FLIGHTS = [
  { id: "f1", carrier: "IndiAir", depart: "DEL 06:00", arrive: "GOI 08:05", dur: "2h 5m", price: 3499 },
  { id: "f2", carrier: "SkyWays", depart: "DEL 09:00", arrive: "GOI 11:05", dur: "2h 5m", price: 4299 },
  { id: "f3", carrier: "BudgetAir", depart: "DEL 17:15", arrive: "GOI 19:20", dur: "2h 5m", price: 2999 },
];

const MOCK_TRAINS = [
  { id: "t1", name: "Konkan Kanya Express · 10111", dept: "18:20", arr: "09:15", dur: "14h 55m", price: 1100 },
  { id: "t2", name: "Jan Shatabdi Express · 12051", dept: "13:20", arr: "03:40", dur: "14h 20m", price: 1350 },
  { id: "t3", name: "Vande Bharat Express · 22229", dept: "06:10", arr: "19:45", dur: "13h 35m", price: 1850 },
];

const MOCK_CABS = [
  { id: "c1", label: "Local Taxi", eta: "10 min", rating: 4.6, price: 220 },
  { id: "c2", label: "Ola Mini", eta: "12 min", rating: 4.4, price: 249 },
  { id: "c3", label: "Uber Go", eta: "9 min", rating: 4.5, price: 265 },
];

const NUDGES = [
  { id: 1, title: "Rain alert — Baga / Calangute", body: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
  { id: 2, title: "Price surge likely next Fri", body: "Searches up for DEL → GOI. Book early to save ~10–18%." },
  { id: 3, title: "Traffic at Delhi T3 (Evening)", body: "Allow 30–45 mins extra to reach the airport." },
];

function get7Days() {
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    arr.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return arr;
}

export default function PlanPage() {
  const router = useRouter();
  const { destination: destQuery } = router.query || {};
  const destination = Array.isArray(destQuery) ? destQuery[0] : destQuery || "Goa";

  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const [selectedDate, setSelectedDate] = useState(get7Days()[0].iso);
  const [results, setResults] = useState([]);
  const [userName] = useState("Ethen");

  const seven = useMemo(() => get7Days(), []);

  useEffect(() => {
    if (mode === "flights") setResults(MOCK_FLIGHTS);
    if (mode === "trains") setResults(MOCK_TRAINS);
    if (mode === "cabs") setResults(MOCK_CABS);
  }, [mode]);

  function handleBook(item) {
    // placeholder action
    alert(`Booking placeholder → ${item.carrier || item.name || item.label} — ₹${item.price}`);
  }

  function computeVerdict() {
    if (destination.toLowerCase().includes("goa")) {
      return { label: "GOOD", text: "Weather pleasant; weekend may have short showers. Best weekday deals." };
    }
    return { label: "NEUTRAL", text: "Check events and local transport before booking." };
  }
  const verdict = computeVerdict();

  return (
    <div className="root">
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="greet">Hey, <strong>{userName}</strong></div>
            <h1 className="hero-title">Where are we going next?</h1>
            <p className="hero-sub">Panchi finds the smartest, safest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.</p>

            <div className="hero-controls">
              <div className="input-wrap">
                <svg className="search-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden><path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM4 9.5C4 6.46 6.46 4 9.5 4S15 6.46 15 9.5 12.54 15 9.5 15 4 12.54 4 9.5z"/></svg>
                <input value={destination} readOnly className="search-input" placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"' />
              </div>

              <button className="cta" onClick={() => router.push("/")}>Let Panchi plan →</button>
            </div>
          </div>

          <div className="hero-right">
            {/* logo (ensure /public/panchi-logo.png exists) */}
            <img className="logo" src="/panchi-logo.png" alt="Panchi" />
          </div>
        </div>
      </header>

      <main className="container">
        <section className="left">
          <div className="card hero-card">
            <div className="card-head">
              <div>
                <h3>Find the best options for {destination}</h3>
                <div className="muted">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</div>
              </div>
              <div className="verdict">
                <div className="verdict-tag">{verdict.label}</div>
                <div className="verdict-text">{verdict.text}</div>
              </div>
            </div>

            <div className="controls-row">
              <div className="chips-row" role="tablist">
                {seven.map((d) => (
                  <button
                    key={d.iso}
                    className={`chip ${selectedDate === d.iso ? "active" : ""}`}
                    onClick={(e) => {
                      const el = e.currentTarget;
                      // ripple
                      el.classList.remove("ripple");
                      void el.offsetWidth;
                      el.classList.add("ripple");
                      setSelectedDate(d.iso);
                    }}
                  >
                    <div className="chip-day">{d.label}</div>
                    <div className="chip-week">{d.weekday}</div>
                    <span className="ripple-circle" />
                  </button>
                ))}
              </div>

              <div className="mode-tabs">
                <button className={`mode ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`mode ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`mode ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>
            </div>

            <div className="results">
              {mode === "flights" && MOCK_FLIGHTS.map((f) => (
                <div key={f.id} className="result-row">
                  <div>
                    <div className="res-title">{f.carrier}</div>
                    <div className="muted small">{f.depart} → {f.arrive} · {f.dur}</div>
                  </div>

                  <div className="res-right">
                    <div className="price">₹{f.price}</div>
                    <button className="outline" onClick={() => handleBook(f)}>Book</button>
                  </div>
                </div>
              ))}

              {mode === "trains" && MOCK_TRAINS.map((t) => (
                <div key={t.id} className="result-row">
                  <div>
                    <div className="res-title">{t.name}</div>
                    <div className="muted small">{t.dept} → {t.arr} · {t.dur}</div>
                  </div>

                  <div className="res-right">
                    <div className="price">₹{t.price}</div>
                    <button className="outline" onClick={() => handleBook(t)}>Book</button>
                  </div>
                </div>
              ))}

              {mode === "cabs" && MOCK_CABS.map((c) => (
                <div key={c.id} className="result-row">
                  <div>
                    <div className="res-title">{c.label}</div>
                    <div className="muted small">ETA: {c.eta} · Rating: ★ {c.rating}</div>
                  </div>

                  <div className="res-right">
                    <div className="price">₹{c.price}</div>
                    <button className="outline" onClick={() => handleBook(c)}>Book</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card events">
            <h4>Events & crowd alerts</h4>
            <div className="event-item">
              <strong>HIGH</strong> — Sunburn-esque EDM Festival, Vagator, Goa · 2025-12-28<br />
              High crowding · Hotels +30% · Cab surge likely.<br />
              <em>Panchi: Book hotels + cabs if attending; avoid beachfront stays.</em>
            </div>

            <div className="event-item">
              <strong>HIGH</strong> — IPL Playoffs (sample), Mumbai · 2026-05-20<br />
              High demand · local transport crowded.<br />
              <em>Panchi: Plan arrival buffers for stadiums.</em>
            </div>
          </div>
        </section>

        <aside className="right">
          <div className="card nudges">
            <h4>Nudges & alerts</h4>
            {NUDGES.map((n) => (
              <div key={n.id} className="nudge">
                <div className="nudge-ico">⚠️</div>
                <div>
                  <div className="nudge-title">{n.title}</div>
                  <div className="muted small">{n.body}</div>
                </div>
              </div>
            ))}

            <div className="community">
              <h5>Community quick takes</h5>
              <div className="muted small">Asha — "Loved morning at Baga, crowd manageable."</div>
              <div className="muted small">Rajan — "Road diversions in festival season; allow time."</div>
            </div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        :root{
          --card-bg: #fff;
          --muted: #6b7280;
          --glass: rgba(255,255,255,0.6);
        }
        .root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#111; }
        .hero {
          background: linear-gradient(180deg, rgba(127,92,255,0.06), rgba(255,94,149,0.03));
          padding: 34px 26px;
          border-bottom: 1px solid rgba(0,0,0,0.02);
        }
        .hero-inner { max-width: 1280px; margin: 0 auto; display:flex; gap:18px; align-items:flex-start; }
        .hero-left { flex:1; min-width:0; }
        .greet { color:var(--muted); font-size:14px; margin-bottom:6px; }
        .hero-title { margin:0; font-size:44px; line-height:1; letter-spacing: -0.01em; }
        .hero-sub { margin:6px 0 18px; color:var(--muted); }
        .hero-controls { display:flex; gap:14px; align-items:center; }

        .input-wrap { display:flex; align-items:center; gap:10px; background: #fff; border-radius:12px; padding:10px 12px; box-shadow: 0 8px 22px rgba(18,20,40,0.04); flex:1; }
        .search-ico { opacity:0.7 }
        .search-input { border:0; outline:0; font-size:15px; width:100%; padding:8px 4px; background:transparent; }
        .cta { background: linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%); color:#fff; padding:10px 18px; border-radius:12px; border:0; box-shadow:0 10px 22px rgba(127,92,255,0.12); cursor:pointer; font-weight:600; }
        .hero-right { width:180px; display:flex; justify-content:flex-end; align-items:flex-start; }
        .logo { width:140px; height:auto; object-fit:contain; }

        .container { max-width:1280px; margin:26px auto; padding: 0 18px; display:grid; grid-template-columns: 1fr 340px; gap:20px; align-items:start; }

        .card { background:var(--card-bg); border-radius:14px; padding:18px; box-shadow: 0 10px 30px rgba(12,12,30,0.04); }
        .hero-card { overflow:visible; }

        .card-head { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
        .muted { color:var(--muted); }
        .small { font-size:13px; margin-top:6px; }

        .verdict { max-width:360px; text-align:right; }
        .verdict-tag { display:inline-block; padding:6px 10px; border-radius:999px; background:linear-gradient(90deg,#E9E5FF,#FEE9F3); color:#4b2bd4; font-weight:700; margin-bottom:6px; }
        .verdict-text { color:var(--muted); font-size:13px; }

        .controls-row { margin-top:18px; display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap; }
        .chips-row { display:flex; gap:10px; flex-wrap:wrap; }

        .chip { position:relative; border-radius:12px; padding:10px 12px; background:#fff; border:1px solid rgba(14,16,22,0.06); cursor:pointer; overflow:hidden; transition: transform .14s ease, box-shadow .18s ease; display:flex; flex-direction:column; align-items:center; min-width:68px; }
        .chip .chip-day { font-weight:600; }
        .chip .chip-week { font-size:11px; color:var(--muted); margin-top:4px; }
        .chip.active { border-color: #7F5CFF; box-shadow: 0 8px 24px rgba(127,92,255,0.12); transform:translateY(-4px); }
        .chip.ripple::after { content:""; position:absolute; left:50%; top:50%; width:10px; height:10px; background:rgba(127,92,255,0.14); border-radius:50%; transform:translate(-50%,-50%) scale(1); animation:ripple .6s ease; }
        @keyframes ripple { from { transform:translate(-50%,-50%) scale(1); opacity:1 } to { transform:translate(-50%,-50%) scale(12); opacity:0 } }

        .mode-tabs { display:flex; gap:8px; align-items:center; }
        .mode { padding:10px 14px; border-radius:10px; border:1px solid rgba(12,12,30,0.05); background:#fff; cursor:pointer; font-weight:600; }
        .mode.active { background: linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%); color:#fff; box-shadow:0 8px 20px rgba(127,92,255,0.12); border: none; }

        .results { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
        .result-row { display:flex; justify-content:space-between; align-items:center; padding:16px; border-radius:10px; background:#FBFBFC; }
        .res-title { font-weight:700; font-size:16px; }
        .res-right { text-align:right; display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
        .price { font-weight:800; font-size:18px; }
        .outline { background:#fff; border:1px solid rgba(12,12,30,0.06); padding:8px 10px; border-radius:8px; cursor:pointer; }

        .events { margin-top:18px; }
        .event-item { margin-bottom:12px; color:var(--muted); font-size:14px; }

        .nudges .nudge { display:flex; gap:12px; align-items:flex-start; margin-bottom:12px; }
        .nudge-ico { width:44px; height:44px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:#FEF6F9; font-size:18px; }
        .nudge-title { font-weight:700; }

        /* responsive */
        @media (max-width: 980px) {
          .container { grid-template-columns: 1fr; }
          .hero-title { font-size:36px; }
          .hero-right { display:none; }
          .verdict { text-align:left; margin-top:12px; }
        }

        /* small screens */
        @media (max-width: 480px) {
          .hero-title { font-size:28px; }
          .chips-row { gap:8px; }
          .chip { padding:8px 10px; min-width:62px; }
        }
      `}</style>
    </div>
  );
}
