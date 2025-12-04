// pages/index.js
import Head from "next/head";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

const mockHero = {
  tagline: "Your AI-powered wings for every journey",
  suggestions: ['Goa', 'Manali', 'Jaipur', 'beach under 5k'],
};

export default function Home() {
  // Try server API, fallback to mock — keeps build safe
  const { data: apiData, error } = useSWR("/api/hero", fetcher, {
    refreshInterval: 0,
  });
  const hero = apiData?.hero || mockHero;

  return (
    <>
      <Head>
        <title>Panchi — Plan your trip</title>
        <meta name="description" content="Panchi - smartest travel nudges" />
      </Head>

      <div className="page">
        <header className="hero">
          <div className="hero-left">
            <div className="logoRow">
              <img src="/panchi-logo.svg" alt="Panchi" className="logo" />
              <div className="brand">
                <div className="brand-title">Panchi</div>
                <div className="brand-sub">{hero.tagline}</div>
              </div>
            </div>

            <h1 className="title">Where are we going next?</h1>
            <p className="subtitle">
              Panchi finds the smartest, safest and cheapest ways to reach your
              destination — starting with flights in this MVP.
            </p>

            <div className="searchRow">
              <input
                aria-label="destination"
                className="search"
                placeholder={`Try "${hero.suggestions.join('", "')}"`}
                id="destination"
              />
              <Link href="/plan?destination=Goa">
                <a className="cta">Let Panchi plan →</a>
              </Link>
            </div>
          </div>

          <div className="hero-right">
            {/* big gradient card / optional mascot area */}
            <div className="hero-card">
              <div className="hero-gradient" />
            </div>
          </div>
        </header>

        <main className="contentWrap">
          <section className="mainPanel">
            <div className="sectionCard">
              <div className="sectionHead">
                <h3>Find the best options for Goa</h3>
                <div className="modeHint">Mode: <strong>flights</strong></div>
              </div>

              <div className="datePills">
                {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map((d, i) => (
                  <button key={d} className={`pill ${i===0 ? "active" : ""}`}>{d}</button>
                ))}
              </div>

              <div className="tabs">
                <button className="tab active">Flights</button>
                <button className="tab">Trains</button>
                <button className="tab">Cabs</button>
              </div>

              <div className="listPlaceholder">
                {/* quick local mock list to preview UI */}
                <div className="priceRow card">
                  <div>
                    <div className="air">IndiAir</div>
                    <div className="meta">DEL 06:00 → Goa 08:05 · 2h 5m</div>
                    <div className="mood">Mood: GOOD</div>
                  </div>
                  <div className="priceBlock">
                    <div className="price">₹3499</div>
                    <button className="bookBtn">Book</button>
                  </div>
                </div>

                <div className="priceRow card">
                  <div>
                    <div className="air">SkyWays</div>
                    <div className="meta">DEL 09:00 → Goa 11:05 · 2h 5m</div>
                    <div className="mood">Mood: FAIR</div>
                  </div>
                  <div className="priceBlock">
                    <div className="price">₹4299</div>
                    <button className="bookBtn">Book</button>
                  </div>
                </div>

                <div className="priceRow card">
                  <div>
                    <div className="air">BudgetAir</div>
                    <div className="meta">DEL 17:15 → Goa 19:20 · 2h 5m</div>
                    <div className="mood">Mood: CAUTIOUS</div>
                  </div>
                  <div className="priceBlock">
                    <div className="price">₹2999</div>
                    <button className="bookBtn">Book</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="sidePanel">
            <div className="sideCard">
              <h4>Nudges & alerts</h4>
              <ul className="alerts">
                <li><strong>Rain alert — Baga / Calangute</strong><div className="small">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                <li><strong>Price surge likely next Fri</strong><div className="small">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="small">Allow 30–45 mins extra to reach the airport.</div></li>
              </ul>

              <h5>Community quick takes</h5>
              <div className="community">
                <div><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
                <div><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root{
          --grad-a: linear-gradient(120deg,#6c3cc0 0%, #ff6fb5 60%);
          --bg: #f6f8fb;
          --card: #fff;
          --muted: #6b7280;
        }
        .page { background: var(--bg); min-height:100vh; font-family:Inter,system-ui,Arial; color:#0f172a; }
        .hero { display:flex; gap:32px; align-items:flex-start; padding:36px 48px; position:relative; }
        .logoRow{ display:flex; gap:14px; align-items:center; margin-bottom:8px}
        .logo{ width:92px; height:auto }
        .brand-title{ font-weight:700; font-size:20px }
        .brand-sub{ color:var(--muted); font-size:13px; margin-top:2px }
        .hero-left{ flex:1; min-width:350px }
        .hero-right{ width:300px; display:flex; justify-content:flex-end; align-items:center; }
        .hero-card{ width:100%; height:120px; border-radius:18px; box-shadow: 0 10px 30px rgba(99, 64, 255, 0.12); overflow:hidden; }
        .hero-gradient{ width:100%; height:100%; background: var(--grad-a); opacity:0.92; }

        .title{ font-size:48px; margin:6px 0 8px; font-weight:800; line-height:1.02; }
        .subtitle{ color:var(--muted); margin-bottom:18px; font-size:16px; }

        .searchRow{ display:flex; gap:16px; align-items:center }
        .search{ flex:1; padding:18px 20px; border-radius:12px; border:none; box-shadow: 0 6px 20px rgba(16, 24, 40, 0.04); font-size:16px }
        .cta{ display:inline-block; padding:12px 20px; border-radius:12px; background:linear-gradient(90deg,#7f3aea,#ff4da6); color:white; font-weight:700; text-decoration:none; box-shadow: 0 6px 18px rgba(127,58,234,0.18) }

        .contentWrap{ display:flex; gap:28px; padding:28px 48px; align-items:flex-start }
        .mainPanel{ flex:1; }
        .sidePanel{ width:360px; }

        .sectionCard{ background:var(--card); border-radius:16px; padding:22px; box-shadow: 0 12px 40px rgba(16,24,40,0.06) }
        .sectionHead{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px }
        .sectionHead h3{ margin:0 }
        .modeHint{ color:var(--muted); font-size:14px }

        .datePills{ display:flex; gap:10px; margin:8px 0 14px; flex-wrap:wrap }
        .pill{ background:#f3f4f6; border-radius:12px; border:none; padding:8px 12px; font-weight:600; box-shadow:inset 0 -1px 0 rgba(0,0,0,0.02) }
        .pill.active{ background:linear-gradient(90deg,#7f3aea,#ff4da6); color:white; box-shadow: 0 6px 20px rgba(127,58,234,0.12) }

        .tabs{ display:flex; gap:12px; margin-bottom:14px; }
        .tab{ background:#fff; border-radius:12px; border:1px solid #eef2ff; padding:8px 12px; box-shadow: 0 6px 20px rgba(16,24,40,0.02) }
        .tab.active{ background:linear-gradient(90deg,#7f3aea,#ff4da6); color:#fff; }

        .listPlaceholder{ margin-top:8px }
        .priceRow{ display:flex; justify-content:space-between; align-items:center; padding:18px; border-radius:12px; margin-bottom:12px; background: linear-gradient(180deg,#ffffff,#fbfbfe); border:1px solid rgba(15,23,42,0.04) }
        .card{ box-shadow: 0 10px 30px rgba(16,24,40,0.04) }
        .air{ font-weight:700; font-size:18px }
        .meta{ color:var(--muted); font-size:13px; margin-top:6px }
        .mood{ margin-top:8px; color:#374151; font-weight:600; font-size:12px }

        .priceBlock{ text-align:right }
        .price{ font-weight:800; font-size:20px; margin-bottom:8px }
        .bookBtn{ background:#fff; border-radius:8px; padding:8px 12px; border:1px solid rgba(16,24,40,0.06); cursor:pointer }

        .sideCard{ background:var(--card); padding:18px; border-radius:12px; box-shadow: 0 12px 40px rgba(16,24,40,0.04) }
        .alerts li{ margin-bottom:12px; list-style:none }
        .small{ color:var(--muted); margin-top:6px; font-size:13px }

        /* responsive */
        @media (max-width: 900px){
          .hero{ padding:22px 18px; flex-direction:column }
          .hero-right{ display:none }
          .contentWrap{ flex-direction:column; padding:18px }
          .sidePanel{ width:auto; order:2 }
          .mainPanel{ order:1 }
        }
      `}</style>
    </>
  );
}
