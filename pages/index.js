// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const quick = [
    { id: 1, label: "Goa — beaches under ₹5k", slug: "/plan?destination=Goa" },
    { id: 2, label: "Manali — hill escapes", slug: "/plan?destination=Manali" },
    { id: 3, label: "Jaipur — heritage breaks", slug: "/plan?destination=Jaipur" },
  ];

  return (
    <>
      <Head>
        <title>Panchi — Where are we going next?</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div className="page">
        <header className="hero">
          <div className="hero-inner">
            <div className="brand">
              <img src="/logo.png" alt="Panchi" className="logo" />
              <div className="brand-text">
                <div className="brand-title">Panchi</div>
                <div className="brand-tag">Your AI-powered wings for every journey</div>
              </div>
            </div>

            <h1 className="headline">Where are we going next?</h1>
            <p className="sub">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

            <div className="search-row">
              <input
                className="search"
                placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"'
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Link href={`/plan?destination=${encodeURIComponent(q || "Goa")}`}>
                <a className="cta">Let Panchi plan →</a>
              </Link>
            </div>
          </div>

          <div className="hero-accent" aria-hidden />
        </header>

        <main className="main">
          <section className="left">
            <div className="panel quick">
              <div className="panel-head">
                <h3>Quick picks</h3>
                <p className="muted">Popular destinations and curated offers for you.</p>
              </div>

              <div className="pills">
                {quick.map((p) => (
                  <Link key={p.id} href={p.slug}>
                    <a className="pill">{p.label}</a>
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel results">
              <h3>Find the best options for Goa</h3>
              <div className="fake-results">
                <div className="result">
                  <div>
                    <div className="carrier">IndiAir</div>
                    <div className="times">DEL 06:00 → Goa 08:05 · 2h 5m</div>
                    <div className="mood">Mood: <strong>GOOD</strong></div>
                  </div>
                  <div className="price">₹3499</div>
                </div>

                <div className="result">
                  <div>
                    <div className="carrier">SkyWays</div>
                    <div className="times">DEL 09:00 → Goa 11:05 · 2h 5m</div>
                    <div className="mood">Mood: <strong>FAIR</strong></div>
                  </div>
                  <div className="price">₹4299</div>
                </div>
              </div>
            </div>
          </section>

          <aside className="right">
            <div className="nudges">
              <h4>Nudges & alerts</h4>
              <ul>
                <li><strong>Rain alert — Baga / Calangute</strong><div className="muted">Light rain Saturday evening; prefer inland stays for a quiet morning.</div></li>
                <li><strong>Price surge likely next Fri</strong><div className="muted">Searches spiking for DEL → GOI. Book early to save ~10–18%.</div></li>
                <li><strong>Traffic at Delhi T3 (Evening)</strong><div className="muted">Allow 30–45 mins extra to reach the airport.</div></li>
              </ul>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :global(body){ margin:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial; background:linear-gradient(180deg,#f8fbff 0%, #fff 50%, #fff8f9 100%); color:#071226; }

        .hero { padding:28px 20px 10px; position:relative; overflow:visible; }
        .hero-inner { max-width:1200px; margin:0 auto; }
        .brand { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
        .logo { height:48px; width:auto; object-fit:contain; }
        .brand-title { font-weight:800; }
        .brand-tag { color:#6b7788; font-size:12px; }

        .headline { font-size:clamp(34px,6vw,64px); margin:6px 0; line-height:1; }
        .sub { color:#64748b; margin:0 0 18px; }

        .search-row { display:flex; gap:12px; align-items:center; max-width:1200px; }
        .search { flex:1; padding:16px 18px; background:#fff; border-radius:14px; border:1px solid rgba(6,20,40,0.06); box-shadow:0 18px 48px rgba(15,30,60,0.04); font-size:15px; }
        .cta { display:inline-block; padding:12px 18px; border-radius:12px; background:linear-gradient(90deg,#8e44ff,#ff4da6); color:#fff; font-weight:700; text-decoration:none; box-shadow:0 12px 38px rgba(142,68,255,0.12); }

        .hero-accent { position:absolute; right:40px; top:18px; width:220px; height:160px; border-radius:18px; background:linear-gradient(180deg, rgba(158,76,243,0.14), rgba(255,77,166,0.07)); box-shadow:0 30px 70px rgba(158,76,243,0.06); pointer-events:none; }

        .main { max-width:1200px; margin:28px auto; display:grid; grid-template-columns:1fr 340px; gap:24px; padding:0 20px 60px; align-items:start; }
        .panel { background:#fff; padding:18px; border-radius:14px; box-shadow:0 20px 60px rgba(12,18,55,0.04); }

        .quick .pills { display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; }
        .pill { padding:10px 14px; border-radius:999px; background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; font-weight:700; text-decoration:none; box-shadow:0 10px 36px rgba(159,76,243,0.08); }

        .results h3 { margin:0 0 10px; }
        .result { display:flex; justify-content:space-between; align-items:center; padding:16px; border-radius:10px; background:#fbfcff; margin-bottom:14px; box-shadow: inset 0 -1px 0 rgba(12,18,55,0.02); }
        .carrier { font-weight:700; }
        .times, .mood { color:#64748b; font-size:13px; margin-top:6px; }
        .price { font-weight:800; color:#0b1220; }

        .nudges h4 { margin-top:0; }
        .nudges ul { padding-left:18px; margin:0; }
        .muted { color:#64748b; font-size:13px; margin-top:6px; }

        @media (max-width:980px) {
          .main { grid-template-columns:1fr; }
          .hero-accent { display:none; }
        }
      `}</style>
    </>
  );
}
