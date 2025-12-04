// pages/plan.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        const res = await fetch(`/api/plans?destination=${encodeURIComponent(destination)}`);
        if (!res.ok) throw new Error("no-api");
        const json = await res.json();
        setPlans(json.plans || []);
      } catch (e) {
        // Mock fallback so build never fails
        setPlans([
          { id: 1, airline: "IndiAir", from: "DEL 06:00", to: `${destination} 08:05`, duration: "2h 5m", mood: "GOOD", price: 3499 },
          { id: 2, airline: "SkyWays", from: "DEL 09:00", to: `${destination} 11:05`, duration: "2h 5m", mood: "FAIR", price: 4299 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [destination, mode]);

  return (
    <>
      <Head><title>Plan — {destination} | Panchi</title></Head>

      <div className="wrap">
        <div className="top">
          <div className="brand">
            <img src="/logo.png" alt="Panchi" />
            <div>
              <div className="brand-title">Panchi</div>
              <div className="brand-sub">Your AI-powered wings for every journey</div>
            </div>
          </div>

          <div className="hero-title">
            <h1>Where are we going next?</h1>
            <p>Panchi will find the smartest, safest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.</p>
          </div>
        </div>

        <div className="layout">
          <main className="content">
            <div className="panel">
              <div className="panel-head">
                <h3>Find the best options for {destination}</h3>
                <div className="mode">Mode: <strong>{mode}</strong></div>
              </div>

              <div className="controls">
                <div className="dates">
                  {dates.map((d,i) => (
                    <button key={d} className={`date ${i===activeDate ? "active" : ""}`} onClick={()=>setActiveDate(i)}>{d}</button>
                  ))}
                </div>

                <div className="modes">
                  <button className={`m ${mode==='flights'?'active':''}`} onClick={()=>setMode('flights')}>Flights</button>
                  <button className={`m ${mode==='trains'?'active':''}`} onClick={()=>setMode('trains')}>Trains</button>
                  <button className={`m ${mode==='cabs'?'active':''}`} onClick={()=>setMode('cabs')}>Cabs</button>
                </div>
              </div>

              <div className="results">
                {loading ? <div className="loading">Loading options…</div> : plans.map(p => (
                  <div className="plan-card" key={p.id}>
                    <div className="left">
                      <div className="carrier">{p.airline}</div>
                      <div className="times">{p.from} → {p.to} · {p.duration}</div>
                      <div className="mood">Mood: <strong>{p.mood}</strong></div>
                    </div>
                    <div className="right">
                      <div className="price">₹{p.price}</div>
                      <button className="book">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="sidebar">
            <div className="panel side">
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

      <style jsx>{`
        :global(body){ margin:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial; background:linear-gradient(180deg,#fbfdff 0%, #fff 48%, #fff7f5 100%); color:#071226; }
        .wrap{ max-width:1200px; margin:20px auto; padding:18px; }
        .top{ display:flex; gap:18px; align-items:flex-start; margin-bottom:14px; }
        .brand img{ height:44px; margin-right:10px; }
        .brand-title{ font-weight:800; }
        .brand-sub{ font-size:13px; color:#6b7788; }

        .hero-title h1{ font-size:44px; margin:0; }
        .hero-title p{ color:#64748b; margin-top:6px; }

        .layout{ display:grid; grid-template-columns:1fr 320px; gap:20px; margin-top:10px; }
        .panel{ background:#fff; padding:18px; border-radius:12px; box-shadow:0 18px 60px rgba(12,18,55,0.04); }
        .panel-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .dates{ display:flex; gap:10px; flex-wrap:wrap; }
        .date{ padding:8px 12px; border-radius:10px; border:0; background:#f1f5f9; cursor:pointer; }
        .date.active{ background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 12px 36px rgba(159,76,243,0.12); }

        .m{ padding:8px 12px; border-radius:10px; border:0; background:#f1f5f9; cursor:pointer; }
        .m.active{ background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; box-shadow:0 12px 36px rgba(159,76,243,0.12); }

        .plan-card{ display:flex; justify-content:space-between; align-items:center; padding:16px; border-radius:12px; background:#fbfcff; margin-bottom:12px; }
        .carrier{ font-weight:700; }
        .times,.mood{ color:#64748b; font-size:13px; margin-top:6px; }
        .price{ font-weight:800; }
        .book{ padding:8px 12px; border-radius:8px; border:1px solid rgba(12,18,55,0.06); background:white; cursor:pointer; }

        .muted{ color:#64748b; font-size:13px; margin-top:6px; }
        @media (max-width:980px){
          .layout{ grid-template-columns:1fr; }
        }
      `}</style>
    </>
  );
}
