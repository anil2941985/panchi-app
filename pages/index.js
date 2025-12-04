// pages/index.js
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

function Logo({ size = 88 }) {
  // show external logo if available; if error, show inline fallback
  const [ok, setOk] = useState(true);
  return (
    <>
      {ok ? (
        <img
          src="/panchi-logo.svg"
          alt="Panchi"
          width={size}
          height="auto"
          onError={() => setOk(false)}
          style={{ display: "block", objectFit: "contain" }}
        />
      ) : (
        // Inline SVG fallback (small, crisp, colorful)
        <svg
          width={size}
          height={Math.round(size * 0.6)}
          viewBox="0 0 120 72"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#3db3ff" />
              <stop offset="1" stopColor="#ff6fb5" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stopColor="#ffd36f" />
              <stop offset="1" stopColor="#ff6fb5" />
            </linearGradient>
          </defs>

          {/* stylized bird mark */}
          <g transform="translate(6,6)">
            <path d="M10 30 C20 5, 55 5, 70 22 C82 36, 68 54, 46 46 C35 41, 28 36, 10 30 Z" fill="url(#g1)" />
            <path d="M66 18 C84 8, 102 16, 100 34 C99 45, 90 52, 78 45 C70 40, 68 30, 66 18 Z" fill="url(#g2)" opacity="0.95" />
          </g>

          {/* text - simple */}
          <g transform="translate(78,46)">
            <text x="0" y="6" fontFamily="Inter, Roboto, Arial" fontSize="12" fontWeight="700" fill="#24303a">
              panchi
            </text>
          </g>
        </svg>
      )}
    </>
  );
}

export default function Home() {
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
                <a className="cta">Let Panchi plan →</a>
              </Link>
            </div>
          </div>

          {/* decorative top-right gradient shape (no empty box) */}
          <div className="heroDecor" aria-hidden="true"></div>
        </header>

        <main className="container">
          <section className="content">
            <div className="card">
              <div className="cardHead">
                <h3>Find the best options for Goa</h3>
                <div className="mode">Mode: <strong>flights</strong></div>
              </div>

              <div className="dateRow">
                {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map((d,i)=>(
                  <button className={`datePill ${i===0 ? "active" : ""}`} key={d}>{d}</button>
                ))}
              </div>

              <div className="tabs">
                <button className="tab active">Flights</button>
                <button className="tab">Trains</button>
                <button className="tab">Cabs</button>
              </div>

              <div className="results">
                <div className="resultCard">
                  <div>
                    <div className="air">IndiAir</div>
                    <div className="meta">DEL 06:00 → Goa 08:05 · 2h 5m</div>
                    <div className="mood">Mood: GOOD</div>
                  </div>
                  <div className="right">
                    <div className="price">₹3499</div>
                    <button className="book">Book</button>
                  </div>
                </div>

                <div className="resultCard">
                  <div>
                    <div className="air">SkyWays</div>
                    <div className="meta">DEL 09:00 → Goa 11:05 · 2h 5m</div>
                    <div className="mood">Mood: FAIR</div>
                  </div>
                  <div className="right">
                    <div className="price">₹4299</div>
                    <button className="book">Book</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="sidebar">
            <div className="sideCard">
              <h4>Nudges & alerts</h4>
              <ul>
                <li><strong>Rain alert — Baga / Calangute</strong><div className="small">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                <li><strong>Price surge likely next Fri</strong><div className="small">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="small">Allow 30–45 mins extra to reach the airport.</div></li>
              </ul>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root{
          --bg-start: #f8fbff;
          --bg-end: #fff6fb;
          --accentA: #7f3aea;
          --accentB: #ff4da6;
          --muted: #6b7280;
          --card: #fff;
        }

        /* page bg - soft gradient + faint radial */
        .page{
          min-height:100vh;
          background: radial-gradient(1000px 400px at 10% 10%, rgba(127,58,234,0.05), transparent 8%),
                      linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #0f172a;
        }

        .hero{
          display:flex;
          justify-content:space-between;
          gap:24px;
          padding:36px 56px;
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
          font-weight:700;
          text-decoration:none;
          box-shadow: 0 12px 36px rgba(127,58,234,0.12);
        }

        /* decorative top-right shape */
        .heroDecor{
          width:320px;
          height:120px;
          border-radius:18px;
          background: linear-gradient(180deg, rgba(127,58,234,0.06), rgba(255,77,166,0.045));
          box-shadow: 0 20px 60px rgba(127,58,234,0.04);
        }

        .container{ display:flex; gap:28px; padding:26px 56px; align-items:flex-start; }
        .content{ flex:1 }
        .sidebar{ width:340px }

        .card{ background:var(--card); padding:20px; border-radius:14px; box-shadow: 0 12px 40px rgba(12,18,55,0.06) }
        .cardHead{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .mode{ color:var(--muted); font-size:14px }

        .dateRow{ display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap }
        .datePill{ border-radius:12px; padding:8px 12px; background:#f3f4f6; border:none; font-weight:600 }
        .datePill.active{ background: linear-gradient(90deg,var(--accentA),var(--accentB)); color:#fff }

        .tabs{ display:flex; gap:10px; margin-bottom:12px }
        .tab{ padding:8px 12px; border-radius:10px; border:none; background:white; box-shadow: 0 8px 20px rgba(12,18,55,0.03) }
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
        .book{ padding:8px 12px; border-radius:10px; background:white; border:1px solid rgba(12,18,55,0.06) }

        .sideCard{ background:white; padding:16px; border-radius:12px; box-shadow: 0 12px 40px rgba(12,18,55,0.04) }
        .sideCard h4{ margin:0 0 12px }

        .small{ color:var(--muted); margin-top:6px; font-size:13px }

        /* responsive */
        @media (max-width: 980px){
          .hero{ flex-direction:column; padding:20px }
          .heroDecor{ display:none }
          .container{ flex-direction:column; padding:16px }
          .sidebar{ width:100% }
        }
      `}</style>
    </>
  );
}
