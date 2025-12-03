// pages/index.js
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// dynamic import for animated hero (avoid SSR problems if the component uses window/animations)
const HeroBird = dynamic(() => import('./components/HeroBird').catch(() => () => null), {
  ssr: false,
});

// Static imports (defensive) — adjust path if you moved components to repo root
let HeaderComp = null;
let PriceCard = null;
let PlanCard = null;

try {
  /* eslint-disable global-require */
  HeaderComp = require('./components/Header').default || null;
  PriceCard = require('./components/PriceCard').default || null;
  PlanCard = require('./components/PlanCard').default || null;
  /* eslint-enable global-require */
} catch (e) {
  // if components are missing we'll still render a safe UI
  HeaderComp = HeaderComp || null;
  PriceCard = PriceCard || null;
  PlanCard = PlanCard || null;
}

export default function Home() {
  // UI state
  const [query, setQuery] = useState('Goa');
  const [mode, setMode] = useState('flights'); // flights | trains | cabs
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Mock 7-day dates (quick demo)
  const dates = useMemo(() => {
    const arr = [];
    const start = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push({
        key: d.toISOString().slice(5, 10).replace('-', '/'), // MM/DD
        label: d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' }),
        date: d.toISOString().slice(0, 10),
      });
    }
    return arr;
  }, []);

  // Mock offers / prices (replace with real api later)
  const mockFlights = [
    { id: 'f1', airline: 'IndiAir', depart: 'DEL 06:00', arrive: 'GOI 08:05', duration: '2h 5m', price: 3499, class: 'Economy', rating: 4.2 },
    { id: 'f2', airline: 'SkyWays', depart: 'DEL 09:00', arrive: 'GOI 11:05', duration: '2h 5m', price: 4299, class: 'Economy', rating: 4.1 },
    { id: 'f3', airline: 'BudgetAir', depart: 'DEL 17:15', arrive: 'GOI 19:20', duration: '2h 5m', price: 2999, class: 'Economy', rating: 3.9 },
  ];

  const nudges = [
    { id: 'n1', title: 'Rain alert — Baga / Calangute', body: 'Light rain Saturday evening; prefer inland stays for a quiet morning.' },
    { id: 'n2', title: 'Price surge likely next Fri', body: 'Searches up for DEL → GOI. Book early to save ~10–18%.' },
    { id: 'n3', title: 'Traffic at Delhi T3 (Evening)', body: 'Allow 30–45 mins extra to reach the airport.' },
  ];

  function handleBook(item) {
    // placeholder — replace with real booking flow
    // eslint-disable-next-line no-alert
    alert(`Book clicked for ${item?.airline || 'Unknown'} — ₹${item?.price ?? '—'}`);
  }

  function handlePlan() {
    // placeholder for "Let Panchi plan" AI flow
    // eslint-disable-next-line no-alert
    alert(`Panchi planning for "${query}" on ${dates[selectedDateIndex].date} (${mode})`);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          {HeaderComp ? <HeaderComp /> : <div className="brand">Hey, <strong>Ethen</strong></div>}
          <div className="hero-wrap">
            <HeroBird />
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="title">Where are we going next?</h1>
          <p className="subtitle">
            Panchi finds the smartest, safest and cheapest ways to reach <strong>{query || 'your destination'}</strong> — starting with flights in this MVP.
          </p>

          <div className="search-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`}
              className="search-input"
              aria-label="Where to?"
            />
            <button className="plan-btn" onClick={handlePlan}>Let Panchi plan →</button>
          </div>
        </section>

        <section className="content">
          <div className="left">
            <div className="card info-card">
              <div className="card-header">
                <div>
                  <h2>Find the best options for {query || 'your trip'}</h2>
                  <p className="muted">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>
                </div>

                <div className="mode-label">Mode: <strong>{mode}</strong></div>
              </div>

              <div className="date-row">
                {dates.map((d, idx) => (
                  <button
                    key={d.key}
                    className={`date-chip ${selectedDateIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedDateIndex(idx)}
                    aria-pressed={selectedDateIndex === idx}
                  >
                    {d.key}
                  </button>
                ))}
              </div>

              <div className="mode-tabs">
                <button className={`tab ${mode === 'flights' ? 'active' : ''}`} onClick={() => setMode('flights')}>Flights</button>
                <button className={`tab ${mode === 'trains' ? 'active' : ''}`} onClick={() => setMode('trains')}>Trains</button>
                <button className={`tab ${mode === 'cabs' ? 'active' : ''}`} onClick={() => setMode('cabs')}>Cabs</button>
              </div>

              <div className="results">
                {/* If you have PlanCard component you can render it here */}
                {PlanCard ? <PlanCard summary={{ query, mode, date: dates[selectedDateIndex]?.date }} /> : null}

                <div className="list">
                  {/* Render PriceCard if available, else fallback to inline simple row */}
                  {mockFlights.map((f) => (
                    PriceCard ? (
                      <PriceCard key={f.id} item={f} onBook={handleBook} />
                    ) : (
                      <div key={f.id} className="simple-row">
                        <div>
                          <div className="airline">{f.airline}</div>
                          <div className="route muted">{f.depart} → {f.arrive} · {f.duration}</div>
                        </div>
                        <div className="price-area">
                          <div className="price">₹{f.price}</div>
                          <button className="book-small" onClick={() => handleBook(f)}>Book</button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="right">
            <div className="nudges card">
              <h3>Nudges & alerts</h3>
              {nudges.map((n) => (
                <div key={n.id} className="nudge">
                  <div className="n-title">{n.title}</div>
                  <div className="n-body muted">{n.body}</div>
                </div>
              ))}

              <div className="community card small-card">
                <h4>Community quick takes</h4>
                <p className="muted">Asha — "Loved morning at Baga, crowd manageable."</p>
                <p className="muted">Rajan — "Road diversions in festival season; allow extra time."</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <style jsx>{`
        .page {
          background: linear-gradient(180deg, rgba(250,250,253,1) 0%, rgba(244,249,255,1) 100%);
          min-height: 100vh;
          color: #0f1724;
          font-family: Inter, system-ui, -apple-system, "Helvetica Neue", Arial;
        }
        .topbar {
          padding: 20px 28px;
        }
        .topbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand { font-size: 14px; color: #333; }
        .hero-wrap { width: 140px; height: 60px; display:flex; align-items:center; justify-content:center; }

        .container { max-width: 1200px; margin: 0 auto; padding: 18px; }

        .hero { padding: 12px 0 20px 0; }
        .title { font-size: 48px; margin: 6px 0; line-height: 1.02; }
        .subtitle { color: #58606a; margin-bottom: 18px; }

        .search-row { display:flex; gap:14px; align-items:center; margin-top: 12px; }
        .search-input {
          flex: 1;
          padding: 18px 20px;
          border-radius: 14px;
          border: none;
          box-shadow: 0 6px 20px rgba(12,28,52,0.06);
          font-size: 16px;
        }
        .plan-btn {
          background: linear-gradient(90deg,#7a4fff,#ff6fb4);
          border: none;
          color: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(122,79,255,0.18);
          cursor: pointer;
          font-weight: 600;
        }

        .content { display: grid; grid-template-columns: 1fr 340px; gap: 22px; margin-top: 18px; align-items: start; }
        .left { }
        .right { }

        .card { background: #fff; border-radius: 14px; padding: 20px; box-shadow: 0 10px 30px rgba(16,24,40,0.06); }
        .info-card { padding: 18px; }

        .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; }
        .muted { color:#6b7280; font-size: 14px; }

        .date-row { display:flex; gap:10px; margin: 10px 0 12px 0; flex-wrap:wrap; }
        .date-chip {
          background: #f3f5f9;
          border-radius: 12px;
          padding: 8px 12px;
          border: 1px solid rgba(16,24,40,0.04);
          cursor: pointer;
        }
        .date-chip.active {
          background: linear-gradient(90deg,#efedf7,#f6e7ff);
          border: 1px solid rgba(124,58,237,0.2);
          box-shadow: 0 6px 18px rgba(124,58,237,0.12);
        }

        .mode-tabs { margin: 12px 0; display:flex; gap:8px; }
        .tab {
          background: #fff;
          border: 1px solid rgba(16,24,40,0.06);
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
        }
        .tab.active {
          background: linear-gradient(90deg,#9b6bff,#ff8fb6);
          color: #fff;
        }

        .list { margin-top: 10px; }

        /* simple fallback row */
        .simple-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding: 16px;
          border-radius: 10px;
          background: #fbfcfe;
          margin-bottom: 12px;
          border: 1px solid rgba(16,24,40,0.02);
        }
        .price-area { text-align:right; min-width:120px; }
        .price { font-weight:700; margin-bottom:6px; }
        .book-small { padding:8px 10px; border-radius:8px; border:1px solid rgba(16,24,40,0.06); background:#fff; cursor:pointer; }

        .nudges .nudge { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(16,24,40,0.04); }
        .n-title { font-weight:700; }
        .community { margin-top: 18px; padding: 12px; border-radius: 10px; background:#fff; }

        /* responsive */
        @media (max-width: 980px) {
          .content { grid-template-columns: 1fr; }
          .hero-wrap { display:none; }
          .title { font-size: 32px; }
        }
      `}</style>
    </div>
  );
}
