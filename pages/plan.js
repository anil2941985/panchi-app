// pages/plan.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

function DatePill({ label, active, onClick }) {
  return (
    <button className={`date-pill ${active ? "active" : ""}`} onClick={onClick}>
      {label}
      <style jsx>{`
        .date-pill { background:#f1f5f9; border-radius:12px; padding:8px 12px; border:0; font-weight:600; cursor:pointer; }
        .date-pill.active { background: linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 8px 30px rgba(159,76,243,0.12); }
      `}</style>
    </button>
  );
}

function PlanCard({ item }) {
  return (
    <div className="plan-card">
      <div>
        <div className="carrier">{item.airline}</div>
        <div className="time">{item.from} {item.depart} → {item.to} {item.arrive} · {item.duration}</div>
        <div className="mood">Mood: <strong>{item.mood}</strong></div>
      </div>

      <div className="price-block">
        <div className="price">₹{item.price}</div>
        <button className="book">Book</button>
      </div>

      <style jsx>{`
        .plan-card { display:flex; justify-content:space-between; gap:18px; padding:20px; border-radius:12px; background:#fff; box-shadow:0 8px 20px rgba(12,18,55,0.04); margin-bottom:16px; align-items:center;}
        .carrier { font-weight:700; font-size:18px; margin-bottom:6px;}
        .time { color:#475569; font-size:14px; margin-bottom:8px;}
        .mood { color:#64748b; font-size:13px;}
        .price-block { text-align:right; display:flex; flex-direction:column; gap:8px; align-items:flex-end;}
        .price { font-weight:800; font-size:18px; }
        .book { border-radius:10px; border:1px solid rgba(12,18,55,0.08); background:#fff; padding:8px 12px; cursor:pointer;}
      `}</style>
    </div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const { destination = "Goa" } = router.query;
  const [dateIndex, setDateIndex] = useState(0);
  const [mode, setMode] = useState("flights");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const dates = ["29/11","30/11","01/12","02/12","03/12","04/12","05/12"];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // try fetch from API (if you have one)
        const res = await fetch(`/api/plans?destination=${encodeURIComponent(destination)}`);
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        // fallback mock data
        setPlans([
          { id:1, airline:"IndiAir", from:"DEL 06:00", depart:"", to:"Goa 08:05", arrive:"", duration:"2h 5m", mood:"GOOD", price:3499 },
          { id:2, airline:"SkyWays", from:"DEL 09:00", depart:"", to:"Goa 11:05", arrive:"", duration:"2h 5m", mood:"FAIR", price:4299 },
          { id:3, airline:"BudgetAir", from:"DEL 17:15", depart:"", to:"Goa 19:20", arrive:"", duration:"2h 5m", mood:"FAIR", price:2999 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [destination, mode]);

  return (
    <>
      <Head>
        <title>Plan — {destination} | Panchi</title>
      </Head>

      <main className="page">
        <div className="container">
          <div className="headerRow">
            <div className="brandLeft">
              <img src="/logo.png" alt="Panchi" />
              <div>
                <div className="brandName">Panchi</div>
                <div className="brandTag">Your AI-powered wings for every journey</div>
              </div>
            </div>

            <div className="pageTitle">
              <h1>Where are we going next?</h1>
              <p className="subtitle">Panchi will find the smartest, safest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.</p>
            </div>
          </div>

          <div className="contentRow">
            <div className="left">
              <div className="panel">
                <div className="panel-head">
                  <h3>Find the best options for {destination}</h3>
                  <div className="mode">Mode: <strong>{mode}</strong></div>
                </div>

                <div className="dates">
                  {dates.map((d, idx) => (
                    <DatePill key={d} label={d} active={idx===dateIndex} onClick={() => setDateIndex(idx)} />
                  ))}
                </div>

                <div className="modes" style={{marginTop:14}}>
                  <button className={`tab ${mode==='flights'?'active':''}`} onClick={() => setMode('flights')}>Flights</button>
                  <button className={`tab ${mode==='trains'?'active':''}`} onClick={() => setMode('trains')}>Trains</button>
                  <button className={`tab ${mode==='cabs'?'active':''}`} onClick={() => setMode('cabs')}>Cabs</button>
                </div>

                <div style={{marginTop:18}}>
                  {loading && <div className="loading">Loading options…</div>}
                  {!loading && plans.map((p) => <PlanCard key={p.id} item={p} />)}
                </div>
              </div>
            </div>

            <aside className="right">
              <div className="sidebar">
                <h4>Nudges & alerts</h4>
                <ul>
                  <li><strong>Rain alert — Baga / Calangute</strong><div className="muted">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                  <li><strong>Price surge likely next Fri</strong><div className="muted">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                  <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="muted">Allow 30–45 mins extra to reach the airport.</div></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container { max-width:1200px; margin:28px auto; padding:18px; }
        .headerRow { display:flex; gap:18px; align-items:flex-start; }
        .brandLeft { display:flex; gap:12px; align-items:center; }
        .brandLeft img { height:42px; }
        .brandName { font-weight:700; }
        .brandTag { color:#64748b; font-size:13px; }

        .pageTitle { flex:1; }
        .pageTitle h1 { margin:6px 0; font-size:40px; }
        .subtitle { color:#64748b; margin-top:6px; }

        .contentRow { display:flex; gap:22px; margin-top:18px; align-items:flex-start; }
        .left { flex:1; }
        .panel { background:#fff; border-radius:12px; padding:18px; box-shadow:0 12px 40px rgba(12,18,55,0.04); }
        .panel-head { display:flex; justify-content:space-between; align-items:center; }
        .dates { margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; }
        .tab { margin-top:12px; border:0; background:#f1f5f9; padding:8px 12px; border-radius:10px; cursor:pointer; margin-right:8px; }
        .tab.active { background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 8px 30px rgba(159,76,243,0.12); }

        .right { width:320px; }
        .sidebar { padding:18px; border-radius:12px; background:#fff; box-shadow:0 12px 40px rgba(12,18,55,0.04); }
        .sidebar h4 { margin:0 0 8px 0; }
        .muted { color:#64748b; font-size:13px; margin-top:6px; }

        .loading { color:#64748b; padding:12px 0; }

        @media (max-width:980px) {
          .contentRow { flex-direction:column; }
          .right { width:100%; }
        }
      `}</style>
    </>
  );
}
