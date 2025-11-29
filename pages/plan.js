// pages/plan.js
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

/**
 * Panchi - Plan page (Style B: Modern gradient + rounded cards)
 * Replace entire pages/plan.js with this file.
 * Ensure /public/panchi-logo.png exists (or update img src).
 */

/* ---------------------------
   Mock data helpers
   --------------------------- */
const makeNudges = () => [
  { id: "n1", emoji: "☔", title: "Rain alert — Baga / Calangute", text: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
  { id: "n2", emoji: "🔥", title: "Price surge likely next Fri", text: "Searches up for DEL→GOI. Book early to save ~10–18%." },
  { id: "n3", emoji: "🚦", title: "Traffic at Delhi T3 (Evening)", text: "Allow 30–45 mins extra to reach the airport." },
];

const makeEvents = () => [
  { id: "e1", level: "HIGH", title: "EDM Festival", where: "Vagator, Goa", date: "2025-12-28", impact: "Hotels +30%; local crowding; cab surge likely" },
  { id: "e2", level: "HIGH", title: "IPL Playoffs (sample)", where: "Mumbai", date: "2026-05-20", impact: "High transport demand; book early" },
  { id: "e3", level: "MED", title: "Classical Music Fest", where: "Thiruvananthapuram", date: "2025-11-09", impact: "Boutique hotels fill fast" },
];

const makeFlights = (dest = "Goa") => [
  { id: "f1", carrier: "IndiAir", depart: "DEL 06:00", arrive: `${dest} 08:05`, dur: "2h 5m", price: 3499 },
  { id: "f2", carrier: "SkyWays", depart: "DEL 09:00", arrive: `${dest} 11:05`, dur: "2h 5m", price: 4299 },
  { id: "f3", carrier: "BudgetAir", depart: "DEL 17:15", arrive: `${dest} 19:20`, dur: "2h 5m", price: 2999 },
];

const makeTrains = () => [
  { id: "t1", name: "Konkan Kanya Express", no: "10111", depart: "18:20", arrive: "09:15", dur: "14h 55m", price: 1100 },
  { id: "t2", name: "Jan Shatabdi", no: "12051", depart: "13:20", arrive: "03:40", dur: "14h 20m", price: 1350 },
  { id: "t3", name: "Vande Bharat", no: "22229", depart: "06:10", arrive: "19:45", dur: "13h 35m", price: 1850 },
];

const makeCabs = () => [
  { id: "c1", prov: "Local Taxi", eta: "10m", rating: 4.6, price: 220 },
  { id: "c2", prov: "Ola Mini", eta: "12m", rating: 4.4, price: 249 },
  { id: "c3", prov: "Uber Go", eta: "9m", rating: 4.5, price: 265 },
];

/* ---------------------------
   Component
   --------------------------- */
export default function PlanPage() {
  const router = useRouter();
  const destination = (router.query.destination && String(router.query.destination)) || "Goa";

  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const nudges = useMemo(() => makeNudges(), []);
  const events = useMemo(() => makeEvents(), []);
  const flights = useMemo(() => makeFlights(destination), [destination]);
  const trains = useMemo(() => makeTrains(), []);
  const cabs = useMemo(() => makeCabs(), []);

  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <div className="greeting">Hey, <strong>Ethen</strong></div>
          <h1 className="headline">Where are we going next?</h1>
          <p className="subhead">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP, and later adding trains, buses and cabs.</p>

          <div className="search-wrap">
            <input className="search" placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`} />
            <button className="btn-cta">Let Panchi plan →</button>
          </div>
        </div>

        <div className="header-right">
          <img src="/panchi-logo.png" alt="Panchi logo" className="logo" />
        </div>
      </header>

      <main className="content">
        <section className="left-col">
          <div className="card hero-card">
            <div className="card-top">
              <div>
                <h2 className="card-title">Find the best options for <span className="dest">{destination}</span></h2>
                <div className="card-sub">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</div>
              </div>
              <div className="mode-ind">Mode: <strong>{mode}</strong></div>
            </div>

            <div className="date-strip" role="tablist" aria-label="7-day view">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const label = d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
                return <div key={i} className="date-pill">{label}</div>;
              })}
            </div>

            <div className="tabs">
              <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
              <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
              <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
            </div>

            <div className="results">
              {mode === "flights" && flights.map(f => (
                <div className="result" key={f.id}>
                  <div className="result-left">
                    <div className="res-title">{f.carrier}</div>
                    <div className="res-sub">{f.depart} → {f.arrive} · {f.dur}</div>
                  </div>
                  <div className="result-right">₹{f.price}</div>
                </div>
              ))}

              {mode === "trains" && trains.map(t => (
                <div className="result" key={t.id}>
                  <div className="result-left">
                    <div className="res-title">{t.name} · {t.no}</div>
                    <div className="res-sub">{t.depart} → {t.arrive} · {t.dur}</div>
                  </div>
                  <div className="result-right">₹{t.price}</div>
                </div>
              ))}

              {mode === "cabs" && cabs.map(c => (
                <div className="result" key={c.id}>
                  <div className="result-left">
                    <div className="res-title">{c.prov}</div>
                    <div className="res-sub">ETA: {c.eta} · ★ {c.rating}</div>
                  </div>
                  <div className="result-right">₹{c.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card events-card">
            <h3 className="section-h">Events & crowd alerts</h3>
            <div className="events">
              {events.map(ev => (
                <div className="event" key={ev.id}>
                  <div className={`badge ${ev.level === "HIGH" ? "high" : ev.level === "MED" ? "med" : "low"}`}>{ev.level}</div>
                  <div>
                    <div className="ev-title">{ev.title} · <span className="muted">{ev.where}</span></div>
                    <div className="ev-date">{ev.date}</div>
                    <div className="ev-impact">{ev.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card trending-card">
            <h3 className="section-h">Trending trips & ideas</h3>
            <div className="trending-grid">
              <div className="trip-card">
                <div className="trip-tag">Popular</div>
                <div className="trip-title">Goa</div>
                <div className="trip-meta">Perfect weather + off-peak flight deals</div>
                <div className="trip-price">₹6,000–₹8,500</div>
                <button className="trip-btn">Explore</button>
              </div>

              <div className="trip-card">
                <div className="trip-tag">Popular</div>
                <div className="trip-title">Rishikesh</div>
                <div className="trip-meta">Great rafting season, clear skies</div>
                <div className="trip-price">₹3,500–₹5,000</div>
                <button className="trip-btn">Explore</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="right-col">
          <div className="card nudges-card">
            <h4 className="section-h">Nudges & alerts</h4>
            <ul className="nudges-list">
              {nudges.map(n => (
                <li key={n.id} className="nudge-item">
                  <div className="n-emoji">{n.emoji}</div>
                  <div>
                    <div className="n-title">{n.title}</div>
                    <div className="n-text muted">{n.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card community-card">
            <h4 className="section-h">Community quick takes</h4>
            <div className="comm">
              <div className="comm-item"><b>Asha</b> — "Loved morning at Baga, crowd low before 8am."</div>
              <div className="comm-item"><b>Rajan</b> — "Roads clear in Oct. Check live advisories during monsoon."</div>
            </div>
          </div>

          <div className="card safety-card">
            <h4 className="section-h">Safety index</h4>
            <div className="s-bar"><div className="s-fill" style={{ width: "78%" }} /></div>
            <div className="muted small">Score: 78 / 100 · Avoid late-night beaches during festivals</div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        :root {
          --bg: #fbfbfe;
          --muted: #6b7280;
          --card-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          --radius: 14px;
          --grad-start: #6d28d9;
          --grad-end: #fb7185;
        }

        .page { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: var(--bg); min-height:100vh; padding:30px; box-sizing:border-box; }

        /* Header */
        .header { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:22px; }
        .header-left { flex:1; background: linear-gradient(180deg,#fff,#fff); padding:22px; border-radius:var(--radius); box-shadow:var(--card-shadow); }
        .header-right { width:220px; display:flex; justify-content:flex-end; }
        .logo { width:160px; height:auto; object-fit:contain; }

        .greeting { color:var(--muted); font-size:14px; margin-bottom:6px; }
        .headline { font-size:32px; line-height:1.03; margin:2px 0 8px; }
        .subhead { color:var(--muted); margin:0 0 12px; }

        .search-wrap { display:flex; gap:12px; align-items:center; }
        .search { flex:1; padding:12px 14px; border-radius:12px; border:1px solid #eef2ff; background:#fff; font-size:15px; box-shadow:inset 0 1px 0 rgba(0,0,0,0.02); }
        .btn-cta { background:linear-gradient(90deg,var(--grad-start),var(--grad-end)); color:white; padding:11px 18px; border-radius:12px; border:none; font-weight:700; cursor:pointer; box-shadow:0 8px 20px rgba(107,70,193,0.12); }

        /* Layout */
        .content { display:grid; grid-template-columns: 1fr 340px; gap:22px; align-items:start; margin-top:16px; }

        .card { background:white; border-radius:12px; padding:16px; box-shadow:var(--card-shadow); }

        /* Left column */
        .left-col .hero-card { padding:18px; }
        .card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
        .card-title { margin:0; font-size:20px; }
        .card-sub { color:var(--muted); margin-top:6px; }

        .mode-ind { color:var(--muted); font-size:14px; white-space:nowrap; }

        .date-strip { display:flex; gap:10px; margin:14px 0 12px; overflow:auto; padding-bottom:6px; }
        .date-pill { background:#f6f7fb; padding:8px 12px; border-radius:10px; font-weight:700; min-width:68px; text-align:center; }

        .tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tab {
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8f9fc;
  cursor: pointer;
  font-weight: 600;
  color: #374151; /* visible on all themes */
  transition: all 0.25s ease;
}

.tab:hover {
  background: #eef1f7;
}

.tab.active {
  background: linear-gradient(90deg, #7a5cf4, #ff6fb1);
  color: #ffffff !important;
  border: none;
  box-shadow: 0 8px 18px rgba(107, 70, 193, 0.18);
}
        .results { display:flex; flex-direction:column; gap:10px; margin-top:8px; }

        .result { display:flex; justify-content:space-between; align-items:center; padding:14px; background:#fbfcff; border-radius:10px; border:1px solid #f1f5f9; }
        .res-title { font-weight:800; }
        .res-sub { color:var(--muted); margin-top:6px; font-size:13px; }
        .result-right { font-weight:800; font-size:16px; }

        .events-card .events { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
        .event { display:flex; gap:12px; align-items:flex-start; }
        .badge { min-width:56px; text-align:center; padding:10px; border-radius:8px; font-weight:800; color:white; }
        .badge.high { background:#ef4444; }
        .badge.med { background:#f59e0b; }
        .badge.low { background:#10b981; }

        .ev-title { font-weight:700; }
        .ev-date, .ev-impact { color:var(--muted); font-size:13px; margin-top:6px; }

        .trending-grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:8px; }
        .trip-card { background: linear-gradient(90deg, rgba(99,102,241,0.08), rgba(251,113,133,0.06)); padding:12px; border-radius:10px; position:relative; }
        .trip-tag { position:absolute; right:12px; top:12px; background:#fff; padding:6px 8px; border-radius:8px; font-weight:700; font-size:12px; box-shadow:0 6px 16px rgba(15,23,42,0.04); }
        .trip-title { font-weight:800; font-size:16px; }
        .trip-meta { color:var(--muted); margin-top:6px; font-size:13px; }
        .trip-price { margin-top:10px; font-weight:800; }
        .trip-btn { margin-top:10px; padding:8px 12px; border-radius:10px; border:none; background:linear-gradient(90deg,var(--grad-start),var(--grad-end)); color:#fff; cursor:pointer; }

        /* Right column */
        .right-col .nudges-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
        .nudge-item { display:flex; gap:12px; align-items:flex-start; }
        .n-emoji { font-size:20px; background:#f6f7fb; padding:10px; border-radius:10px; min-width:44px; display:flex; align-items:center; justify-content:center; }
        .n-title { font-weight:700; }
        .n-text { font-size:13px; color:var(--muted); margin-top:4px; }

        .community-card .comm { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
        .comm-item { background:#fff; padding:10px; border-radius:8px; border:1px solid #f1f5f9; }

        .s-bar { height:10px; background:#f3f4f6; border-radius:999px; margin:10px 0; overflow:hidden; }
        .s-fill { height:100%; background: linear-gradient(90deg,#34d399,#10b981); border-radius:999px; }

        /* Responsive */
        @media (max-width: 960px) {
          .content { grid-template-columns: 1fr; }
          .header { flex-direction:column; gap:12px; }
          .header-right { width:100%; display:flex; justify-content:flex-end; }
          .logo { width:140px; }
          .trending-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 520px) {
          .headline { font-size:22px; }
          .logo { width:120px; }
          .result { padding:12px; }
          .trip-btn { width:100%; }
        }
      `}</style>
    </div>
  );
}
