// pages/index.js
import Head from "next/head";
import Link from "next/link";
import React from "react";

function Logo({ size = 92 }) {
  // PNG-only approach (as requested). If the PNG is missing, a text fallback shows.
  const height = Math.round(size * 0.56);
  return (
    <div style={{ width: size, height, display: "flex", alignItems: "center" }}>
      <img
        src="/panchi-logo.png"
        alt="Panchi"
        width={size}
        height={height}
        style={{ objectFit: "contain", display: "block", userSelect: "none" }}
        onError={(e) => {
          // if PNG missing, hide image and append a text fallback
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentNode;
          if (parent && !parent.querySelector(".logoFallback")) {
            const txt = document.createElement("div");
            txt.className = "logoFallback";
            txt.textContent = "Panchi";
            txt.style.fontWeight = "700";
            txt.style.color = "#0f172a";
            txt.style.fontSize = "18px";
            txt.style.fontFamily = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial";
            parent.appendChild(txt);
          }
        }}
      />
    </div>
  );
}

export default function Home() {
  const dates = ["29/11", "30/11", "01/12", "02/12", "03/12", "04/12", "05/12"];
  const mockResults = [
    {
      id: "r1",
      airline: "IndiAir",
      depart: "DEL 06:00",
      arrive: "Goa 08:05",
      duration: "2h 5m",
      mood: "GOOD",
      price: "₹3499",
    },
    {
      id: "r2",
      airline: "SkyWays",
      depart: "DEL 09:00",
      arrive: "Goa 11:05",
      duration: "2h 5m",
      mood: "FAIR",
      price: "₹4299",
    },
  ];

  return (
    <>
      <Head>
        <title>Panchi — Where are we going next?</title>
        <meta name="description" content="Panchi finds the smartest, safest and cheapest ways to reach your destination." />
      </Head>

      <div className="page">
        <header className="hero">
          <div className="heroLeft">
            <div className="brandRow">
              <div className="logoWrap">
                <Logo size={92} />
              </div>
              <div className="brandText">
                <div className="brandName">Panchi</div>
                <div className="brandLine">Your AI-powered wings for every journey</div>
              </div>
            </div>

            <h1 className="headline">Where are we going next?</h1>
            <p className="lead">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

            <div className="searchRow">
              <input
                aria-label="destination"
                placeholder={`Try "Goa", "Manali", "Jaipur", "beach under 5k"`}
                className="searchInput"
              />
              <Link href="/plan?destination=Goa">
                <a className="cta" role="button">Let Panchi plan →</a>
              </Link>
            </div>
          </div>

          {/* deliberate omission of decorative top-right box to avoid placeholder artifact */}
        </header>

        <main className="container" role="main">
          <section className="content" aria-labelledby="find-heading">
            <div className="card" id="find-heading">
              <div className="cardHead">
                <h3>Find the best options for Goa</h3>
                <div className="mode">Mode: <strong>flights</strong></div>
              </div>

              <div className="dateRow" role="tablist" aria-label="7-day quick view">
                {dates.map((d, i) => (
                  <button aria-selected={i === 0} key={d} className={`datePill ${i === 0 ? "active" : ""}`}>
                    {d}
                  </button>
                ))}
              </div>

              <div className="tabs" role="tablist" aria-label="transport modes">
                <button className="tab active">Flights</button>
                <button className="tab">Trains</button>
                <button className="tab">Cabs</button>
              </div>

              <div className="results" aria-live="polite">
                {mockResults.map((r) => (
                  <article className="resultCard" key={r.id}>
                    <div>
                      <div className="air">{r.airline}</div>
                      <div className="meta">{r.depart} → {r.arrive} · {r.duration}</div>
                      <div className="mood">Mood: {r.mood}</div>
                    </div>
                    <div className="right">
                      <div className="price">{r.price}</div>
                      <button className="book" aria-label={`Book ${r.airline} for ${r.price}`}>Book</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="sidebar" aria-labelledby="alerts-heading">
            <div className="sideCard">
              <h4 id="alerts-heading">Nudges & alerts</h4>
              <ul>
                <li><strong>Rain alert — Baga / Calangute</strong><div className="small">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                <li><strong>Price surge likely next Fri</strong><div className="small">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="small">Allow 30–45 mins extra to reach the airport.</div></li>
              </ul>

              <div style={{height:12}} />

              <h5>Community quick takes</h5>
              <p className="small"><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</p>
              <p className="small"><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</p>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root{
          --bg-start: #f3f8ff;
          --bg-end: #fffafc;
          --accentA: #7f3aea;
          --accentB: #ff4da6;
          --muted: #6b7280;
          --card: #fff;
        }

        .page{
          min-height:100vh;
          background:
            radial-gradient(600px 200px at 8% 10%, rgba(127,58,234,0.04), transparent 6%),
            linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #0f172a;
        }

        .hero{
          display:flex;
          justify-content:space-between;
          gap:24px;
          padding:36px 56px 12px 56px;
          align-items:flex-start;
        }
        .brandRow{ display:flex; gap:12px; align-items:center; margin-bottom:6px; }
        .brandText .brandName{ font-weight:700; font-size:18px }
        .brandText .brandLine{ color:var(--muted); font-size:13px }

        .headline{ font-size:48px; margin:6px 0 8px; font-weight:800; line-height:1.02; }
        .lead{ color:var(--muted); margin-bottom:18px; max-width:780px }

        .searchRow{ display:flex; gap:14px; align-items:center; margin-top:12px }
        .searchInput{
          flex:1;
          padding:16px 18px;
          border-radius:12px;
          border:none;
          box-shadow: 0 10px 30px rgba(12,18,55,0.04);
          background: white;
          font-size:16px;
        }

        .cta{
          display:inline-block;
          background: linear-gradient(90deg,var(--accentA),var(--accentB));
          color:white;
          padding:12px 18px;
          border-radius:12px;
          font-weight:800;
          text-decoration:none;
          box-shadow: 0 18px 48px rgba(127,58,234,0.16);
          border: 1px solid rgba(255,255,255,0.12);
          min-width:160px;
          text-align:center;
        }

        .container{ display:flex; gap:28px; padding:26px 56px 80px 56px; align-items:flex-start; }
        .content{ flex:1 }
        .sidebar{ width:340px }

        .card{ background:var(--card); padding:20px; border-radius:14px; box-shadow: 0 12px 40px rgba(12,18,55,0.06) }
        .cardHead{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .cardHead h3{ margin:0 }
        .mode{ color:var(--muted); font-size:14px }

        .dateRow{ display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap }
        .datePill{ border-radius:12px; padding:8px 12px; background:#f3f4f6; border:none; font-weight:600; cursor:pointer }
        .datePill.active{ background: linear-gradient(90deg,var(--accentA),var(--accentB)); color:#fff }

        .tabs{ display:flex; gap:10px; margin-bottom:12px }
        .tab{ padding:8px 12px; border-radius:10px; border:none; background:white; box-shadow: 0 8px 20px rgba(12,18,55,0.03); cursor:pointer }
        .tab.active{ background: linear-gradient(90deg,var(--accentA),var(--accentB)); color:white }

        .results{ margin-top:12px }
        .resultCard{
          display:flex; justify-content:space-between; align-items:center;
          background: linear-gradient(180deg,#fff,#fbfbfe);
          padding:16px; border-radius:12px; margin-bottom:12px; box-shadow: 0 8px 28px rgba(12,18,55,0.04);
        }
        .air{ font-weight:700; font-size:16px }
        .meta{ color:var(--muted); font-size:13px; margin-top:6px }
        .mood{ margin-top:8px; color:#374151; font-weight:600; font-size:12px }

        .right{ text-align:right }
        .price{ font-weight:900; font-size:18px; margin-bottom:8px }
        .book{ padding:8px 12px; border-radius:10px; background:white; border:1px solid rgba(12,18,55,0.06); cursor:pointer }

        .sideCard{ background:white; padding:16px; border-radius:12px; box-shadow: 0 12px 40px rgba(12,18,55,0.04) }
        .sideCard h4{ margin:0 0 12px }

        .small{ color:var(--muted); margin-top:6px; font-size:13px }

        @media (max-width: 980px){
          .hero{ flex-direction:column; padding:20px }
          .container{ flex-direction:column; padding:16px }
          .sidebar{ width:100% }
        }
      `}</style>
    </>
  );
}
