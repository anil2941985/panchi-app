// pages/plan.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

function DateButton({ label, active, onClick }) {
  return (
    <button className={`date-btn ${active ? "active" : ""}`} onClick={onClick}>
      {label}
      <style jsx>{`
        .date-btn { border-radius:12px; padding:8px 12px; border:0; background:#f1f5f9; cursor:pointer; }
        .date-btn.active { background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 10px 30px rgba(159,76,243,0.12); }
      `}</style>
    </button>
  );
}

function PlanCard({ item }) {
  return (
    <div className="plan">
      <div className="plan-left">
        <div className="carrier">{item.airline}</div>
        <div className="times">{item.from} → {item.to} · {item.duration}</div>
        <div className="mood">Mood: <strong>{item.mood}</strong></div>
      </div>
      <div className="plan-right">
        <div className="price">₹{item.price}</div>
        <button className="book">Book</button>
      </div>

      <style jsx>{`
        .plan { display:flex; justify-content:space-between; align-items:center; gap:14px; padding:18px; background:#fff; border-radius:12px; box-shadow:0 12px 36px rgba(12,18,55,0.04); margin-bottom:12px; }
        .carrier { font-weight:700; font-size:16px; }
        .times { color:#64748b; margin-top:6px; font-size:13px; }
        .mood { margin-top:8px; color:#64748b; font-size:13px; }
        .price { font-weight:800; font-size:18px; margin-bottom:6px; }
        .book { border-radius:10px; padding:8px 12px; border:1px solid rgba(12,18,55,0.08); background:white; cursor:pointer; }
      `}</style>
    </div>
  );
}

export default function Plan() {
  const router = useRouter();
  const { destination = "Goa" } = router.query;
  const dates = ["29/11","30/11","01/12","02/12","03/12","04/12","05/12"];
  const [activeDate, setActiveDate] = useState(0);
  const [mode, setMode] = useState("flights");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // try real API (if available)
        const res = await fetch(`/api/plans?destination=${encodeURIComponent(destination)}`);
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        setPlans(data.plans || []);
      } catch(e) {
        // fallback mock
        setPlans([
          { id: 1, airline: "IndiAir", from: "DEL 06:00", to: `${destination} 08:05`, duration: "2h 5m", mood: "GOOD", price: 3499 },
          { id: 2, airline: "SkyWays", from: "DEL 09:00", to: `${destination} 11:05`, duration: "2h 5m", mood: "FAIR", price: 4299 },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, [destination, mode]);

  return (
    <>
      <Head><title>Plan — {destination} | Panchi</title></Head>

      <main className="wrap">
        <div className="top-hero">
          <div className="brand">
            <img src="/logo.png" alt="Panchi" />
            <div>
              <div className="brand-title">Panchi</div>
              <div className="brand-sub">Your AI-powered wings for every journey</div>
            </div>
          </div>

          <div className="hero-text">
            <h1>Where are we going next?</h1>
            <p>Panchi will find the smartest, safest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.</p>
          </div>
        </div>

        <div className="layout">
          <section className="main">
            <div className="panel">
              <div className="panel-header">
                <h3>Find the best options for {destination}</h3>
                <div className="mode">Mode: <strong>{mode}</strong></div>
              </div>

              <div className="controls">
                <div className="dates">
                  {dates.map((d,i) => <DateButton key={d} label={d} active={i===activeDate} onClick={() => setActiveDate(i)} />)}
                </div>

                <div className="modes">
                  <button className={`mode-btn ${mode==='flights'?'active':''}`} onClick={()=>setMode('flights')}>Flights</button>
                  <button className={`mode-btn ${mode==='trains'?'active':''}`} onClick={()=>setMode('trains')}>Trains</button>
                  <button className={`mode-btn ${mode==='cabs'?'active':''}`} onClick={()=>setMode('cabs')}>Cabs</button>
                </div>
              </div>

              <div className="results">
                {loading && <div className="loading">Loading options…</div>}
                {!loading && plans.map(p => <PlanCard key={p.id} item={p} />)}
              </div>
            </div>
          </section>

          <aside className="sidebar">
            <div className="side-panel">
              <h4>Nudges & alerts</h4>
              <ul>
                <li><strong>Rain alert — Baga / Calangute</strong><div className="muted">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                <li><strong>Price surge likely next Fri</strong><div className="muted">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="muted">Allow 30–45 mins extra to reach the airport.</div></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        :global(body){ margin:0; background:linear-gradient(180deg,#fbfdff 0%, #fff 48%, #fffaf3 100%); font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial; color:#0b1220; }

        .wrap { max-width:1200px; margin:20px auto; padding:18px; }
        .top-hero { display:flex; gap:18px; align-items:flex-start; margin-bottom:12px; }
        .brand img { height:42px; margin-right:10px; }
        .brand-title { font-weight:700; }
        .brand-sub { font-size:13px; color:#60708a; }

        .hero-text h1 { margin:6px 0; font-size:40px; }
        .hero-text p { color:#6b788f; margin-top:6px; }

        .layout { display:grid; grid-template-columns: 1fr 340px; gap:20px; align-items:start; margin-top:12px; }

        .main .panel { background:#fff; padding:18px; border-radius:12px; box-shadow:0 12px 36px rgba(12,18,55,0.04); }
        .panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .controls { display:flex; gap:18px; align-items:center; flex-wrap:wrap; margin-bottom:12px; }
        .dates { display:flex; gap:10px; flex-wrap:wrap; }
        .mode-btn { border-radius:12px; padding:8px 12px; border:0; background:#f1f5f9; cursor:pointer; }
        .mode-btn.active { background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 8px 28px rgba(159,76,243,0.12); }

        .results { margin-top:8px; }

        .sidebar .side-panel { background:#fff; padding:16px; border-radius:12px; box-shadow:0 12px 36px rgba(12,18,55,0.04); }
        .muted { color:#64748b; font-size:13px; margin-top:6px; }

        @media (max-width:980px) {
          .layout { grid-template-columns: 1fr; }
          .sidebar { order:2; }
        }
      `}</style>
    </>
  );
}
