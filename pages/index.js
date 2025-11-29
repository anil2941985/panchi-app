// pages/index.js
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Header from "./components/Header"; // path for your Header placed under pages/components/Header.js

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dates = useMemo(() => {
    // 7-day quick chips
    const d = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      d.push(dt);
    }
    return d;
  }, []);

  const mockFlights = [
    { id: "f1", name: "IndiAir", depart: "DEL 06:00", arrive: "Goa 08:05", duration: "2h 5m", price: 3499 },
    { id: "f2", name: "SkyWays", depart: "DEL 09:00", arrive: "Goa 11:05", duration: "2h 5m", price: 4299 },
    { id: "f3", name: "BudgetAir", depart: "DEL 17:15", arrive: "Goa 19:20", duration: "2h 5m", price: 2999 },
  ];

  const nudges = [
    { id: 1, title: "Rain alert — Baga / Calangute", body: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
    { id: 2, title: "Price surge likely next Fri", body: "Searches up for DEL → GOI. Book early to save ~10–18%." },
    { id: 3, title: "Traffic at Delhi T3 (Evening)", body: "Allow 30–45 mins extra to reach the airport." },
  ];

  const community = [
    { id: 1, name: "Asha", text: "Loved morning at Baga, crowd manageable." },
    { id: 2, name: "Rajan", text: "Roads good during monsoon but choose inland stays." },
  ];

  function handlePlan(query) {
    if (!query || !query.trim()) {
      alert("Type a location and press Let Panchi plan");
      return;
    }
    // In MVP: navigate to plan page with destination param
    router.push(`/plan?destination=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <Header userName="Ethen" onPlan={handlePlan} />

      <main className="main">
        <div className="container">
          <section className="left-col">
            <div className="panel">
              <div className="subhead-row">
                <h2>Find the best options for Goa</h2>
                <div className="mode-tag">Mode: <strong>{mode}</strong></div>
              </div>

              <p className="lead">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>

              <div className="date-chips">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    className={`chip ${d.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
                    onClick={() => setSelectedDate(d)}
                  >
                    {d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })}
                  </button>
                ))}
              </div>

              <div className="mode-tabs">
                <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>

              {/* Results list (mock) */}
              <div className="results">
                {mode === "flights" && mockFlights.map(f => (
                  <article className="result-card" key={f.id}>
                    <div className="result-left">
                      <div className="result-title">{f.name}</div>
                      <div className="result-sub">{f.depart} → {f.arrive} · {f.duration}</div>
                    </div>
                    <div className="result-right">
                      <div className="price">₹{f.price}</div>
                      <button className="book">Book</button>
                    </div>
                  </article>
                ))}

                {mode === "trains" && (
                  <article className="result-card">
                    <div className="result-left">
                      <div className="result-title">Konkan Kanya Express · 10111</div>
                      <div className="result-sub">18:20 → 09:15 · 14h 55m</div>
                    </div>
                    <div className="result-right">
                      <div className="price">₹1100</div>
                      <button className="book">Book</button>
                    </div>
                  </article>
                )}

                {mode === "cabs" && (
                  <article className="result-card">
                    <div className="result-left">
                      <div className="result-title">Local Taxi (Airport)</div>
                      <div className="result-sub">ETA 10 min · Rating ★ 4.6</div>
                    </div>
                    <div className="result-right">
                      <div className="price">₹220</div>
                      <button className="book">Book</button>
                    </div>
                  </article>
                )}
              </div>
            </div>

            <div className="panel events">
              <h3>Events & crowd alerts</h3>
              <ul className="alerts">
                <li><strong>HIGH</strong> Sunburn-esque EDM Festival — Vagator, Goa · 2025-12-28 · Panchi: Book hotels + cabs now.</li>
                <li><strong>HIGH</strong> IPL Playoffs (Sample) — Mumbai · 2026-05-20 · Panchi: plan longer arrival buffers.</li>
                <li><strong>MEDIUM</strong> Classical Music Fest — Thiruvananthapuram · 2025-11-09.</li>
                <li><strong>HIGH</strong> Grand Durga Visarjan — Kolkata · 2025-10-08 · Avoid processions; use metro.</li>
              </ul>
            </div>
          </section>

          <aside className="right-col">
            <div className="sticky">
              <div className="nudges panel">
                <h4>Nudges & alerts</h4>
                {nudges.map(n => (
                  <div key={n.id} className="nudge">
                    <div className="nudge-title">{n.title}</div>
                    <div className="nudge-body">{n.body}</div>
                  </div>
                ))}
              </div>

              <div className="community panel">
                <h4>Community quick takes</h4>
                {community.map(c => (
                  <div key={c.id} className="comm">
                    <strong>{c.name}</strong> — <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .main {
          padding: 20px;
          background: linear-gradient(180deg, rgba(247,247,249,1), rgba(255,255,255,1));
        }
        .container {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 28px;
        }
        .left-col { }
        .right-col { }

        .panel {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(15,23,42,0.04);
          margin-bottom: 20px;
        }

        .subhead-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap: 16px;
        }
        .subhead-row h2 { margin: 0; font-size: 20px; }
        .mode-tag { color:#374151; font-size: 14px; }

        .lead { color:#6b7280; margin-top: 6px; }

        .date-chips { margin: 12px 0; display:flex; gap:8px; flex-wrap:wrap; }
        .chip {
          background:#f3f4f6;
          border-radius:10px;
          padding:8px 12px;
          border:1px solid transparent;
          cursor:pointer;
        }
        .chip.active { background:#fff; border:1px solid #e6e9ef; box-shadow: 0 8px 20px rgba(15,23,42,0.04); }

        .mode-tabs { display:flex; gap:10px; margin-bottom: 12px; }
        .tab {
          border-radius: 10px;
          padding:8px 14px;
          background: #f3f4f6;
          border: 1px solid transparent;
          cursor:pointer;
        }
        .tab.active { background: linear-gradient(90deg,#7a5cf4,#ff6fb1); color:#fff; font-weight:700; }

        .results { margin-top:8px; display:flex; flex-direction:column; gap:12px; }

        .result-card {
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#f8fafc;
          border-radius:10px;
          padding:16px;
          border: 1px solid #eef2f6;
        }
        .result-left { max-width: 70%; }
        .result-title { font-weight:700; }
        .result-sub { color:#6b7280; margin-top:6px; }

        .result-right { text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .price { font-weight:800; font-size:18px; }
        .book {
          padding:8px 12px;
          border-radius:8px;
          background: white;
          border: 1px solid #e6e9ef;
          cursor:pointer;
        }

        .events .alerts { list-style: none; padding:0; margin:0; color:#374151; }
        .events .alerts li { padding:8px 0; border-bottom: 1px dashed #eef2f6; }

        .sticky { position: sticky; top: 22px; display:flex; flex-direction:column; gap:12px; }
        .nudges .nudge { padding:10px 0; border-bottom:1px solid #f3f4f6; }
        .nudge-title { font-weight:700; }
        .nudge-body { color:#6b7280; }

        .community .comm { padding:10px 0; border-bottom:1px dashed #f3f4f6; color:#374151; }

        @media (max-width: 980px) {
          .container { grid-template-columns: 1fr; }
          .right-col { order: 2; }
          .left-col { order: 1; }
          .sticky { position: static; }
        }
      `}</style>
    </>
  );
}
