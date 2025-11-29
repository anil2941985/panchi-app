// pages/plan.js
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

/**
 * Self-contained Plan page for Panchi
 * - Does NOT require Tailwind or any external CSS
 * - Uses styled-jsx so layout is consistent on Vercel
 * - Replace entire pages/plan.js with this file
 * - Ensure /public/panchi-logo.png (or use /panchi-logo.png placeholder) exists
 */

function mockNudges() {
  return [
    { id: "n1", icon: "☔", title: "Rain alert in Goa this weekend", detail: "Light rain expected on Saturday evening around Baga–Calangute." },
    { id: "n2", icon: "🔥", title: "Flight surge likely for Goa next Friday", detail: "Searches spiking for DEL→GOI; booking early saves money." },
    { id: "n3", icon: "🚦", title: "High traffic near Delhi airport (T3)", detail: "Expect 30–45 min extra drive time 5 PM–8 PM." },
  ];
}
function mockEvents() {
  return [
    { id: "e1", title: "EDM Festival", location: "Vagator, Goa", date: "2025-12-28", level: "HIGH", impact: "Hotels +30%; cab surge likely" },
    { id: "e2", title: "IPL Playoffs (Sample)", location: "Mumbai", date: "2026-05-20", level: "HIGH", impact: "Local transport crowded" },
    { id: "e3", title: "Classical Music Fest", location: "Thiruvananthapuram", date: "2025-11-09", level: "MEDIUM", impact: "Boutique hotels fill fast" },
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
    <div className="page-root">
      <header className="hero">
        <div className="hero-left">
          <div className="greet">Hey, Ethen</div>
          <h1 className="title">Where are we going next?</h1>
          <p className="subtitle">Panchi will find the smartest and cheapest ways to reach your destination — starting with flights in this MVP, and later adding trains, buses and cabs.</p>

          <div className="search-row">
            <input className="dest-input" placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`} />
            <button className="cta">Let Panchi plan →</button>
          </div>
        </div>
        <div className="hero-right">
          <img src="/panchi-logo.png" alt="Panchi logo" className="logo" />
        </div>
      </header>

      <main className="content-grid">
        <section className="left-col">
          <div className="card">
            <div className="card-head">
              <h3>Find the best options for <span className="dest">{dest}</span></h3>
              <div className="mode">Mode: {mode}</div>
            </div>

            <div className="trend-row">
              <div className="trend-block">
                <h4>7-day quick view</h4>
                <div className="trend-list">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    return <div key={i} className="trend-day">{d.toISOString().slice(5, 10)}</div>;
                  })}
                </div>
              </div>

              <div className="actions">
                <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>
            </div>

            <div className="results">
              {mode === "flights" && flights.map(f => (
                <div key={f.id} className="result-row">
                  <div>
                    <div className="carrier">{f.carrier}</div>
                    <div className="route">{f.depart} → {f.arrive} · {f.duration}</div>
                  </div>
                  <div className="price">₹{f.price}</div>
                </div>
              ))}

              {mode === "trains" && trains.map(t => (
                <div key={t.id} className="result-row">
                  <div>
                    <div className="carrier">{t.name} · {t.no}</div>
                    <div className="route">{t.depart} → {t.arrive} · {t.duration}</div>
                  </div>
                  <div className="price">₹{t.price}</div>
                </div>
              ))}

              {mode === "cabs" && cabs.map(c => (
                <div key={c.id} className="result-row">
                  <div>
                    <div className="carrier">{c.provider}</div>
                    <div className="route">ETA: {c.eta} · Rating: {c.rating}</div>
                  </div>
                  <div className="price">₹{c.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Events & crowd alerts</h3>
            <div className="events-list">
              {events.map(ev => (
                <div key={ev.id} className="event">
                  <div className="event-left">
                    <div className="event-level">{ev.level}</div>
                  </div>
                  <div className="event-right">
                    <div className="event-title">{ev.title} · {ev.location}</div>
                    <div className="event-date">{ev.date}</div>
                    <div className="event-impact">{ev.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="right-col">
          <div className="card">
            <h4>Nudges & alerts</h4>
            <ul className="nudges">
              {nudges.map(n => (
                <li key={n.id} className="nudge">
                  <div className="nudge-icon">{n.icon}</div>
                  <div className="nudge-text">
                    <div className="nudge-title">{n.title}</div>
                    <div className="nudge-detail">{n.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h4>Community</h4>
            <div className="community">
              <div><b>Asha</b> — "Loved Baga early morning. Avoid late-night crowds on Sundays."</div>
              <div style={{ marginTop: 8 }}><b>Rajan</b> — "Roads good Oct; check landslip alerts during monsoon."</div>
            </div>
          </div>

          <div className="card">
            <h4>Safety index</h4>
            <div style={{ marginTop: 8 }}>Destination: <b>{dest}</b></div>
            <div className="safety-bar" aria-hidden>
              <div className="safety-fill" style={{ width: "78%" }} />
            </div>
            <div className="small muted">Score: 78 / 100 — Generally safe; avoid late-night beaches during festivals.</div>
          </div>
        </aside>
      </main>

      <style jsx>{`
        .page-root { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; padding: 24px; background: linear-gradient(135deg,#f6f8fb,#fef6f5 60%); min-height:100vh; }
        .hero { display:flex; gap:20px; align-items:flex-start; margin-bottom:18px; }
        .hero-left { flex:1; }
        .greet { color:#374151; margin-bottom:6px; }
        .title { font-size:34px; margin:0 0 8px; line-height:1.05; }
        .subtitle { color:#4b5563; margin-bottom:12px; max-width:900px; }
        .search-row { display:flex; gap:10px; margin-top:12px; }
        .dest-input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #e5e7eb; font-size:14px; }
        .cta { background:linear-gradient(90deg,#4f46e5,#f97316); color:white; border:none; padding:10px 16px; border-radius:10px; font-weight:600; cursor:pointer; }
        .hero-right { display:flex; align-items:center; justify-content:center; width:220px; }
        .logo { max-width:220px; height:auto; }

        .content-grid { display:grid; grid-template-columns: 1fr; gap:20px; }
        @media(min-width:980px) { .content-grid { grid-template-columns: 2fr 360px; } }

        .card { background:white; border-radius:12px; padding:16px; box-shadow: 0 6px 20px rgba(15,23,42,0.06); }
        .card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .dest { color:#0ea5a4; font-weight:700; }
        .trend-row { display:flex; gap:12px; align-items:flex-start; }
        .trend-block { flex:1; }
        .trend-list { display:flex; gap:8px; margin-top:8px; overflow:auto; }
        .trend-day { min-width:64px; padding:14px 6px; border-radius:8px; background:#f3f4f6; text-align:center; font-weight:700; color:#0f172a; }
        .actions { display:flex; gap:8px; align-items:center; }
        .tab { padding:8px 12px; border-radius:8px; border:1px solid #e6e6e6; background:#fff; cursor:pointer; }
        .tab.active { background:#4f46e5; color:#fff; border: none; }

        .results { margin-top:14px; display:flex; flex-direction:column; gap:10px; }
        .result-row { display:flex; justify-content:space-between; align-items:center; padding:12px; border-radius:10px; background:#f8fafc; }
        .carrier { font-weight:700; }
        .route { color:#6b7280; font-size:13px; margin-top:4px; }
        .price { font-weight:800; color:#0f172a; }

        .events-list { margin-top:8px; display:flex; flex-direction:column; gap:10px; }
        .event { display:flex; gap:12px; align-items:flex-start; padding:10px; background:#f9fafb; border-radius:8px; }
        .event-level { min-width:52px; text-align:center; padding:6px 8px; background:#fff; border:1px solid #e6e6e6; border-radius:6px; font-weight:700; color:#111827; }
        .event-title { font-weight:700; }
        .event-impact { margin-top:6px; color:#374151; }

        .nudges { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
        .nudge { display:flex; gap:12px; align-items:flex-start; }
        .nudge-icon { font-size:20px; background:#f8fafc; padding:8px; border-radius:10px; width:44px; height:44px; display:flex; align-items:center; justify-content:center; }
        .nudge-title { font-weight:700; }
        .nudge-detail { color:#6b7280; font-size:13px; margin-top:4px; }

        .right-col .card { margin-bottom:12px; }

        .safety-bar { height:10px; background:#e6e6e6; border-radius:999px; margin-top:8px; overflow:hidden; }
        .safety-fill { height:100%; background:linear-gradient(90deg,#34d399,#10b981); }

        .small { font-size:12px; color:#6b7280; margin-top:8px; }
        .muted { color:#6b7280; }

        /* layout helpers */
        .left-col { display:flex; flex-direction:column; gap:12px; }
        .right-col { display:flex; flex-direction:column; gap:12px; }

      `}</style>
    </div>
  );
}
