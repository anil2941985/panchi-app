// pages/plan.js
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

/**
 * Panchi - Plan page (mobile-first)
 * - Self-contained: uses styled-jsx (no Tailwind required)
 * - Mobile-first responsive styles: optimized for phones, expands for tablets/desktops
 * - Replace entire pages/plan.js with this file
 * - Make sure /public/panchi-logo.png exists (or replace image src)
 */

/* ---------------------------
   Mock data helpers
   --------------------------- */
function mockNudges() {
  return [
    { id: "n1", icon: "☔", title: "Rain alert in Goa this weekend", detail: "Light rain expected on Saturday evening around Baga–Calangute." },
    { id: "n2", icon: "🔥", title: "Flight surge likely for Goa next Friday", detail: "Searches spiking for DEL→GOI; booking early can save 10–18%." },
    { id: "n3", icon: "🚦", title: "High traffic near Delhi airport (T3)", detail: "Expect 30–45 min extra drive time 5 PM–8 PM." },
  ];
}
function mockEvents() {
  return [
    { id: "e1", title: "EDM Festival", location: "Vagator, Goa", date: "2025-12-28", level: "HIGH", impact: "Hotels +30%; cab surge likely" },
    { id: "e2", title: "IPL Playoffs (Sample)", location: "Mumbai", date: "2026-05-20", level: "HIGH", impact: "Local transport crowded" },
    { id: "e3", title: "Classical Music Fest", location: "Thiruvananthapuram", date: "2025-11-09", level: "MEDIUM", impact: "Boutique hotels fill quickly" },
  ];
}
function mockFlights(dest) {
  return [
    { id: "f1", carrier: "IndiAir", depart: "DEL 06:00", arrive: `${dest} 08:05`, duration: "2h 5m", price: 3499 },
    { id: "f2", carrier: "SkyWays", depart: "DEL 09:00", arrive: `${dest} 11:05`, duration: "2h 5m", price: 4299 },
    { id: "f3", carrier: "BudgetAir", depart: "DEL 17:15", arrive: `${dest} 19:20`, duration: "2h 5m", price: 2999 },
  ];
}
function mockTrains() {
  return [
    { id: "t1", name: "Konkan Kanya Express", no: "10111", depart: "18:20", arrive: "09:15", duration: "14h 55m", price: 1100 },
    { id: "t2", name: "Jan Shatabdi", no: "12051", depart: "13:20", arrive: "03:40", duration: "14h 20m", price: 1350 },
    { id: "t3", name: "Vande Bharat", no: "22229", depart: "06:10", arrive: "19:45", duration: "13h 35m", price: 1850 },
  ];
}
function mockCabs() {
  return [
    { id: "c1", provider: "Local Taxi", eta: "10 min", rating: 4.6, price: 220 },
    { id: "c2", provider: "Ola Mini", eta: "12 min", rating: 4.4, price: 249 },
    { id: "c3", provider: "Uber Go", eta: "9 min", rating: 4.5, price: 265 },
  ];
}

/* ---------------------------
   Page
   --------------------------- */
export default function PlanPage() {
  const router = useRouter();
  const dest = (router.query.destination && String(router.query.destination)) || "Goa";
  const [mode, setMode] = useState("flights");
  const nudges = useMemo(() => mockNudges(), []);
  const events = useMemo(() => mockEvents(), []);
  const flights = useMemo(() => mockFlights(dest), [dest]);
  const trains = useMemo(() => mockTrains(), []);
  const cabs = useMemo(() => mockCabs(), []);

  return (
    <div className="root">
      <header className="hero">
        <div className="hero-top">
          <div className="greet">Hey, <strong>Ethen</strong></div>
          <img src="/panchi-logo.png" alt="Panchi logo" className="logo" />
        </div>

        <h1 className="title">Where are we going next?</h1>
        <p className="subtitle">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP, and later adding trains, buses and cabs.</p>

        <div className="search-row">
          <input className="dest-input" placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`} />
          <button className="cta">Let Panchi plan →</button>
        </div>
      </header>

      <main className="main-grid">
        <section className="main-col">
          <div className="card small-gap">
            <div className="card-head">
              <div>
                <h2 className="card-title">Find the best options for <span className="dest">{dest}</span></h2>
                <div className="muted">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</div>
              </div>
              <div className="mode-indicator">Mode: <strong>{mode}</strong></div>
            </div>

            <div className="controls-row">
              <div className="trend-compact">
                <div className="trend-title">7-day quick view</div>
                <div className="trend-strip">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    return <div key={i} className="trend-day">{d.toISOString().slice(5, 10)}</div>;
                  })}
                </div>
              </div>

              <div className="tabs">
                <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>
            </div>

            <div className="results">
              {mode === "flights" && flights.map(f => (
                <div key={f.id} className="result">
                  <div>
                    <div className="result-title">{f.carrier}</div>
                    <div className="result-sub">{f.depart} → {f.arrive} · {f.duration}</div>
                  </div>
                  <div className="result-price">₹{f.price}</div>
                </div>
              ))}

              {mode === "trains" && trains.map(t => (
                <div key={t.id} className="result">
                  <div>
                    <div className="result-title">{t.name} · {t.no}</div>
                    <div className="result-sub">{t.depart} → {t.arrive} · {t.duration}</div>
                  </div>
                  <div className="result-price">₹{t.price}</div>
                </div>
              ))}

              {mode === "cabs" && cabs.map(c => (
                <div key={c.id} className="result">
                  <div>
                    <div className="result-title">{c.provider}</div>
                    <div className="result-sub">ETA: {c.eta} · Rating: {c.rating}</div>
                  </div>
                  <div className="result-price">₹{c.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Events & crowd alerts</h3>
            <div className="events">
              {events.map(ev => (
                <div className="event" key={ev.id}>
                  <div className="event-left">{ev.level}</div>
                  <div className="event-right">
                    <div className="event-title">{ev.title} — {ev.location}</div>
                    <div className="event-date">{ev.date}</div>
                    <div className="event-impact">{ev.impact}</div>
                    <div className="panchi-advice">Panchi: {ev.impact.includes("Hotels") ? "Book early & avoid beachfront stays if crowds matter." : "Check local advisories."}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="side-col">
          <div className="card">
            <h4 className="section-title">Nudges & alerts</h4>
            <ul className="nudges">
              {nudges.map(n => (
                <li key={n.id} className="nudge">
                  <div className="n-icon">{n.icon}</div>
                  <div className="n-body">
                    <div className="n-title">{n.title}</div>
                    <div className="n-detail">{n.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h4 className="section-title">Community quick takes</h4>
            <div className="community">
              <div className="comm-item"><b>Asha</b> — "Loved Baga early morning; avoid late-night crowds."</div>
              <div className="comm-item"><b>Rajan</b> — "Roads good in Oct; check landslip alerts during monsoon."</div>
            </div>
          </div>

          <div className="card">
            <h4 className="section-title">Safety index</h4>
            <div className="s-bar"><div className="s-fill" style={{ width: "78%" }} /></div>
            <div className="muted small">Score: 78 / 100 — Generally safe; avoid late-night beaches during festivals.</div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        /* Mobile-first base */
        .root { font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial; color:#0b1220; background:linear-gradient(180deg,#fbfbfd,#fff); min-height:100vh; padding:16px; }
        .hero { background:linear-gradient(90deg,#fff,#fff); border-radius:12px; padding:14px; margin-bottom:14px; box-shadow:0 6px 18px rgba(12,18,30,0.06); }
        .hero-top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .greet { font-size:14px; color:#374151; }
        .logo { width:140px; height:auto; object-fit:contain; }
        .title { font-size:22px; margin:10px 0 6px; line-height:1.05; font-weight:700; }
        .subtitle { font-size:14px; color:#4b5563; margin:0 0 12px; max-width:100%; }
        .search-row { display:flex; gap:8px; }
        .dest-input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #e6e6e6; font-size:14px; }
        .cta { background:linear-gradient(90deg,#4f46e5,#fb7185); color:white; border:none; padding:10px 12px; border-radius:10px; font-weight:600; cursor:pointer; min-width:110px; }

        .main-grid { display:block; }
        .main-col { margin-top:12px; }
        .side-col { margin-top:12px; }

        .card { background:white; padding:12px; border-radius:10px; box-shadow:0 6px 18px rgba(12,18,30,0.04); margin-bottom:12px; }
        .small-gap { padding-bottom:8px; }

        .card-head { display:flex; justify-content:space-between; align-items:center; gap:10px; }
        .card-title { font-size:18px; margin:0 0 6px; }
        .muted { color:#6b7280; font-size:13px; }

        .controls-row { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
        .trend-compact { width:100%; }
        .trend-title { font-size:13px; color:#374151; margin-bottom:8px; }
        .trend-strip { display:flex; gap:8px; overflow:auto; padding-bottom:6px; }
        .trend-day { min-width:64px; text-align:center; background:#f3f4f6; padding:10px 6px; border-radius:8px; font-weight:700; }

        .tabs { display:flex; gap:8px; }
        .tab { padding:8px 12px; border-radius:8px; border:1px solid #e6e6e6; background:white; font-weight:600; cursor:pointer; flex:1; text-align:center; }
        .tab.active { background:linear-gradient(90deg,#4f46e5,#fb7185); color:white; border:none; }

        .results { display:flex; flex-direction:column; gap:10px; margin-top:12px; }
        .result { display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:12px; border-radius:8px; }
        .result-title { font-weight:700; }
        .result-sub { color:#6b7280; font-size:13px; margin-top:4px; }
        .result-price { font-weight:800; }

        .section-title { font-weight:700; margin-bottom:8px; }

        .events { display:flex; flex-direction:column; gap:10px; }
        .event { display:flex; gap:10px; background:#fff; padding:10px; border-radius:8px; align-items:flex-start; border:1px solid #eef2f6; }
        .event-left { min-width:56px; text-align:center; font-weight:800; color:#111827; background:#f8fafc; padding:8px; border-radius:8px; }
        .event-title { font-weight:700; }
        .event-impact { margin-top:6px; color:#374151; font-size:13px; }
        .panchi-advice { margin-top:6px; color:#0ea5a4; font-weight:600; font-size:13px; }

        .nudges { display:flex; flex-direction:column; gap:10px; list-style:none; padding:0; margin:0; }
        .nudge { display:flex; gap:12px; align-items:flex-start; }
        .n-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:10px; font-size:20px; }
        .n-title { font-weight:700; }
        .n-detail { color:#6b7280; margin-top:4px; font-size:13px; }

        .community { display:flex; flex-direction:column; gap:8px; font-size:14px; color:#374151; }
        .s-bar { background:#eef2f6; height:10px; border-radius:999px; margin:8px 0; overflow:hidden; }
        .s-fill { height:100%; background:linear-gradient(90deg,#34d399,#10b981); }

        .small { font-size:12px; color:#6b7280; }

        /* Tablet & up: two-column layout */
        @media (min-width: 760px) {
          .main-grid { display:grid; grid-template-columns: 1fr 360px; gap:18px; align-items:start; }
          .logo { width:180px; }
          .title { font-size:28px; }
          .subtitle { font-size:15px; }
          .controls-row { flex-direction:row; align-items:center; justify-content:space-between; }
          .tabs { width:auto; flex:0 0 320px; display:flex; gap:8px; }
        }

        /* Desktop: slightly wider */
        @media (min-width: 1100px) {
          .root { padding:28px; }
          .logo { width:220px; }
          .title { font-size:34px; }
          .dest-input { font-size:15px; padding:12px; }
          .cta { padding:12px 18px; }
        }
      `}</style>
    </div>
  );
}
