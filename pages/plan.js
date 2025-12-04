// pages/plan.js
import Head from "next/head";
import Link from "next/link";
import React, { useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

// fallback mock train/flight data — safe for static builds
const MOCK = {
  destination: "Goa",
  mood: "GOOD",
  flights: [
    {
      id: "f1",
      airline: "IndiAir",
      depart: "DEL 06:00",
      arrive: "GOI 08:05",
      dur: "2h 5m",
      price: 3499,
      mood: "GOOD",
    },
    {
      id: "f2",
      airline: "SkyWays",
      depart: "DEL 09:00",
      arrive: "GOI 11:05",
      dur: "2h 5m",
      price: 4299,
      mood: "FAIR",
    },
    {
      id: "f3",
      airline: "BudgetAir",
      depart: "DEL 17:15",
      arrive: "GOI 19:20",
      dur: "2h 5m",
      price: 2999,
      mood: "CAUTIOUS",
    },
  ],
  nudges: [
    { title: "Rain alert — Baga / Calangute", text: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
    { title: "Price surge likely next Fri", text: "Searches spiking for DEL → GOI. Book early to save ~10–18%." },
  ],
};

export default function Plan() {
  const router = useRouter();
  const { destination = "Goa" } = router.query;

  const { data, error } = useSWR(`/api/plan?destination=${destination}`, fetcher, {
    refreshInterval: 0,
  });

  const plan = data?.plan || MOCK;
  const flights = plan.flights || [];

  const best = useMemo(() => flights[0] || null, [flights]);

  return (
    <>
      <Head>
        <title>Plan — {destination || "Destination"} | Panchi</title>
      </Head>

      <div className="wrap">
        <header className="top">
          <div className="header-left">
            <img src="/panchi-logo.svg" alt="Panchi" className="logo" />
            <div className="brandText">
              <div className="title">Panchi</div>
              <div className="tag">Your AI-powered wings for every journey</div>
            </div>
          </div>
          <div className="header-right">
            <div className="destination">Where to: <strong>{destination}</strong></div>
            <Link href="/"><a className="homeLink">Explore</a></Link>
          </div>
        </header>

        <main className="mainGrid">
          <section className="leftCol">
            <div className="sectionCard">
              <h2>Find the best options for {destination}</h2>
              <p className="lead">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>

              <div className="controls">
                <div className="dates">
                  {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map((d,i)=>(
                    <button key={d} className={`pill ${i===0 ? "active" : ""}`}>{d}</button>
                  ))}
                </div>
                <div className="modeTabs">
                  <button className="tab active">Flights</button>
                  <button className="tab">Trains</button>
                  <button className="tab">Cabs</button>
                </div>
              </div>

              <div className="list">
                {flights.map((f) => (
                  <article key={f.id} className="resultCard">
                    <div className="info">
                      <div className="airline">{f.airline}</div>
                      <div className="meta">{f.depart} → {f.arrive} · {f.dur}</div>
                      <div className="mood">Mood: <strong>{f.mood}</strong></div>
                    </div>
                    <div className="ctaBlock">
                      <div className="price">₹{f.price}</div>
                      <button className="book">Book</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="rightCol">
            <div className="sideCard">
              <h4>Nudges & alerts</h4>
              <ul>
                {plan.nudges?.map((n,idx)=>(
                  <li key={idx}><strong>{n.title}</strong><div className="small">{n.text}</div></li>
                ))}
              </ul>
              <h5>Community quick takes</h5>
              <div className="comm">Asha — "Loved morning at Baga, crowd manageable."</div>
            </div>

            {best && (
              <div className="sideCard promo">
                <h4>Cheapest option</h4>
                <div className="best">
                  <div><strong>{best.airline}</strong></div>
                  <div className="meta">{best.depart} → {best.arrive} · {best.dur}</div>
                  <div className="priceBig">₹{best.price}</div>
                  <button className="book">Book (placeholder)</button>
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root{
          --grad: linear-gradient(90deg,#722ed1,#ff4da6);
          --bg: #f5f7fb;
        }
        .wrap{ background:var(--bg); min-height:100vh; padding-bottom:48px; }
        .top{ display:flex; justify-content:space-between; align-items:center; padding:28px 48px }
        .header-left{ display:flex; gap:14px; align-items:center }
        .logo{ width:84px }
        .brandText .title{ font-size:20px; font-weight:700 }
        .brandText .tag{ color:#6b7280; font-size:13px }
        .header-right{ text-align:right }
        .destination{ font-size:14px; color:#374151 }

        .mainGrid{ display:flex; gap:28px; padding:0 48px; align-items:flex-start }
        .leftCol{ flex:1 }
        .rightCol{ width:360px; display:flex; flex-direction:column; gap:18px }

        .sectionCard{ background:#fff; border-radius:14px; padding:22px; box-shadow: 0 12px 40px rgba(12,18,55,0.06) }
        h2{ margin:0 0 8px; font-size:20px }
        .lead{ color:#6b7280; margin-bottom:12px }

        .controls{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }
        .dates{ display:flex; gap:10px; flex-wrap:wrap }
        .pill{ background:#f3f4f6; border-radius:12px; padding:8px 12px; border:none; font-weight:600 }
        .pill.active{ background:var(--grad); color:white; box-shadow: 0 12px 30px rgba(124,58,237,0.12) }

        .modeTabs .tab{ margin-left:8px; padding:8px 10px; border-radius:10px; border:none; background:#fff; box-shadow:0 8px 20px rgba(16,24,40,0.02) }
        .modeTabs .active{ background:var(--grad); color:#fff }

        .list{ margin-top:10px; }
        .resultCard{ display:flex; justify-content:space-between; align-items:center; padding:16px; border-radius:10px; background: linear-gradient(180deg,#fff,#fbfbfe); margin-bottom:10px; box-shadow: 0 8px 24px rgba(16,24,40,0.04) }
        .airline{ font-weight:700; font-size:16px }
        .meta{ color:#6b7280; font-size:13px; margin-top:6px }
        .mood{ margin-top:8px; color:#374151; font-weight:600; font-size:12px }

        .priceBlock, .ctaBlock{ text-align:right }
        .price{ font-weight:800; font-size:18px }
        .priceBig{ font-weight:900; font-size:24px; margin:10px 0 }
        .book{ padding:8px 12px; border-radius:10px; border:1px solid rgba(16,24,40,0.06); background:#fff; cursor:pointer }

        .sideCard{ background:#fff; border-radius:12px; padding:16px; box-shadow: 0 12px 40px rgba(16,24,40,0.04) }
        .sideCard h4{ margin:0 0 12px }
        .sideCard ul{ padding-left:0; list-style:none }
        .sideCard li{ margin-bottom:12px }

        .promo .best{ text-align:center; padding:12px; background:linear-gradient(180deg,#fff,#fcfbff); border-radius:8px }
        .comm{ color:#374151; margin-top:8px }

        @media (max-width: 900px){
          .mainGrid{ flex-direction:column; padding:0 18px }
          .rightCol{ width:100% }
          .top{ padding:18px }
        }
      `}</style>
    </>
  );
}
