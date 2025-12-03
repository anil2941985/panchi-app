// pages/index.js
import React, { useMemo, useState } from "react";
import Head from "next/head";

const sampleResults = [
  { id: "f1", title: "IndiAir", subtitle: "DEL 06:00 → GOA 08:05 · 2h 5m", price: "₹3499", mood: "GOOD" },
  { id: "f2", title: "SkyWays", subtitle: "DEL 09:00 → GOA 11:05 · 2h 5m", price: "₹4299", mood: "FAIR" },
  { id: "f3", title: "BudgetAir", subtitle: "DEL 17:15 → GOA 19:20 · 2h 5m", price: "₹2999", mood: "GOOD" },
];

const nudges = [
  { id: 1, title: "Rain alert — Baga / Calangute", text: "Light rain Sat evening; prefer inland stays for a quiet morning." },
  { id: 2, title: "Price surge likely next Fri", text: "Searches up for DEL → GOA. Book early to save ~10–18%." },
  { id: 3, title: "Traffic at Delhi T3 (Evening)", text: "Allow 30–45 mins extra to reach the airport." },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("flights");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const dateChips = useMemo(() => {
    const out = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({ key: i, label: d.toLocaleDateString("en-GB", { month: "2-digit", day: "2-digit" }) });
    }
    return out;
  }, []);

  return (
    <>
      <Head>
        <title>Panchi — Where are we going next?</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div className="page">
        <header className="top-hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="small">Hey, <strong>Ethen</strong></div>
              <h1 className="main-title">Where are we going next?</h1>
              <p className="subtitle">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

              <div className="search-row">
                <input
                  className="search-input"
                  placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn-gradient" onClick={() => alert("Mock: Let Panchi plan")}>Let Panchi plan →</button>
              </div>
            </div>

            <div className="hero-right">
              {/* logo: replace /panchi-logo.png with your actual public asset if present */}
              <img src="/panchi-logo.png" alt="Panchi logo" className="logo" />
            </div>
          </div>
        </header>

        <main className="container">
          <section className="left-col">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Find the best options for <span className="dest">{search || "Goa"}</span></h2>
                  <p className="muted">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>
                </div>
                <div className="mode-tag">Mode: <strong>{mode}</strong></div>
              </div>

              <div className="date-chips">
                {dateChips.map((d, i) => (
                  <button key={d.key} className={`chip ${i === selectedDateIndex ? "active" : ""}`} onClick={() => setSelectedDateIndex(i)}>{d.label}</button>
                ))}
              </div>

              <div className="tabs">
                <button className={`tab ${mode === "flights" ? "active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                <button className={`tab ${mode === "trains" ? "active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                <button className={`tab ${mode === "cabs" ? "active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
              </div>

              <div className="results">
                {sampleResults.map((r) => (
                  <article key={r.id} className="result-card">
                    <div>
                      <div className="title">{r.title}</div>
                      <div className="meta">{r.subtitle}</div>
                      <div className="mood">Mood: <strong>{r.mood}</strong></div>
                    </div>
                    <div className="price-col">
                      <div className="price">{r.price}</div>
                      <button className="book">Book</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="trending panel">
              <h4>Trending trips & ideas</h4>
              <div className="trend-grid">
                <div className="trend-card">
                  <div className="badge">Popular</div>
                  <h5>Goa</h5>
                  <p className="muted">Perfect weather + off-peak weekday flight deals</p>
                  <div className="bottom"><strong>₹6,000–₹8,500</strong><button className="small-btn">Explore</button></div>
                </div>

                <div className="trend-card">
                  <div className="badge">Popular</div>
                  <h5>Rishikesh</h5>
                  <p className="muted">Great rafting season, clear skies</p>
                  <div className="bottom"><strong>₹3,500–₹5,000</strong><button className="small-btn">Explore</button></div>
                </div>
              </div>
            </div>
          </section>

          <aside className="right-col">
            <div className="panel nudges">
              <h4>Nudges & alerts</h4>
              {nudges.map(n => (
                <div key={n.id} className="nudge">
                  <div className="nudge-title">{n.title}</div>
                  <div className="nudge-text muted">{n.text}</div>
                </div>
              ))}
            </div>

            <div className="panel community">
              <h5>Community quick takes</h5>
              <div className="take"><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
              <div className="take"><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root{
          --accent-from:#7c4dff;
          --accent-to:#ff68a1;
          --muted:#6b7280;
          --card:#ffffff;
        }
        .page { font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:linear-gradient(180deg, #f2f7ff 0%, #fff 40%); min-height:100vh; padding:28px; color:#0f172a; }
        .top-hero{ padding:18px 0 28px; }
        .hero-inner{ display:flex; align-items:center; gap:20px; }
        .hero-left{ flex:1; max-width:980px; }
        .small{ color:var(--muted); margin-bottom:6px; font-size:14px; }
        .main-title{ font-size:44px; margin:0 0 8px; line-height:1.02; }
        .subtitle{ color:var(--muted); margin:0 0 14px; }
        .search-row{ display:flex; gap:12px; align-items:center; margin-top:8px; }
        .search-input{ flex:1; padding:16px 18px; border-radius:14px; border:1px solid rgba(15,23,42,0.06); font-size:15px; box-shadow:0 10px 30px rgba(16,24,40,0.04); }
        .btn-gradient{ background:linear-gradient(90deg,var(--accent-from),var(--accent-to)); color:#fff; border:none; padding:12px 18px; border-radius:12px; font-weight:700; cursor:pointer; box-shadow:0 14px 40px rgba(124,77,255,0.12); }
        .hero-right .logo{ width:220px; height:auto; object-fit:contain; }

        .container{ display:grid; grid-template-columns: 1fr 340px; gap:26px; margin-top:18px; }
        .panel{ background:var(--card); border-radius:14px; padding:18px; box-shadow:0 14px 40px rgba(15,23,42,0.05); }
        .panel-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
        .muted{ color:var(--muted); }

        .date-chips{ display:flex; gap:10px; margin:14px 0; flex-wrap:wrap; }
        .chip{ border-radius:10px; padding:8px 12px; border:1px solid rgba(15,23,42,0.06); background:#fff; cursor:pointer; font-weight:600; }
        .chip.active{ background:transparent; outline:2px solid rgba(124,77,255,0.12); box-shadow:inset 0 1px 0 rgba(255,255,255,0.6); }

        .tabs{ display:flex; gap:8px; margin-bottom:12px; }
        .tab{ padding:8px 12px; border-radius:10px; background:#fff; border:1px solid rgba(15,23,42,0.04); cursor:pointer; }
        .tab.active{ background:linear-gradient(90deg, rgba(124,77,255,0.12), rgba(255,104,161,0.08)); font-weight:700; box-shadow:0 8px 20px rgba(124,77,255,0.06); }

        .results{ display:flex; flex-direction:column; gap:12px; margin-top:8px; }
        .result-card{ display:flex; justify-content:space-between; align-items:center; padding:14px; border-radius:12px; border:1px solid rgba(13,25,50,0.04); background:linear-gradient(180deg,#fff,#fbfdff); }
        .title{ font-weight:700; font-size:16px; }
        .meta{ color:var(--muted); margin-top:6px; font-size:13px; }
        .mood{ margin-top:8px; color:var(--muted); font-size:13px; }

        .price-col{ text-align:right; display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
        .price{ font-weight:800; font-size:18px; }
        .book{ border-radius:8px; padding:8px 10px; border:1px solid rgba(15,23,42,0.06); background:white; cursor:pointer; }

        .trending{ margin-top:14px; }
        .trend-grid{ display:flex; gap:12px; margin-top:10px; flex-wrap:wrap; }
        .trend-card{ width:48%; padding:12px; border-radius:12px; background:linear-gradient(180deg,#fff,#fbfbff); box-shadow:0 8px 24px rgba(15,23,42,0.03); }
        .badge{ background:#f1f1f6; display:inline-block; padding:6px 8px; border-radius:8px; font-size:12px; margin-bottom:8px; color:var(--muted); }
        .bottom{ display:flex; justify-content:space-between; align-items:center; margin-top:10px; }
        .small-btn{ border-radius:8px; padding:6px 10px; border:none; background:linear-gradient(90deg,var(--accent-from),var(--accent-to)); color:#fff; cursor:pointer; }

        .right-col .nudges .nudge{ padding:10px 0; border-bottom:1px dashed rgba(15,23,42,0.03); }
        .right-col .nudges .nudge:last-child{ border-bottom:none; }

        /* responsiveness */
        @media (max-width:1000px){
          .container{ grid-template-columns: 1fr; }
          .hero-inner{ flex-direction:column; align-items:flex-start; }
          .hero-right{ align-self:flex-end; }
        }
        @media (max-width:520px){
          .main-title{ font-size:28px; }
          .hero-right .logo{ width:140px; }
          .trend-card{ width:100% }
        }
      `}</style>
    </>
  );
}
