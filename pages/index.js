// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const quickPicks = [
    { id: 1, label: "Goa — beaches under ₹5k", slug: "/plan?destination=Goa" },
    { id: 2, label: "Manali — hill escapes", slug: "/plan?destination=Manali" },
    { id: 3, label: "Jaipur — heritage breaks", slug: "/plan?destination=Jaipur" },
  ];

  return (
    <>
      <Head>
        <title>Panchi — Where are we going next?</title>
        <meta name="description" content="Panchi finds the smartest, safest and cheapest ways to reach your destination." />
      </Head>

      <main className="page">
        <header className="hero">
          <div className="hero-inner">
            <div className="brand">
              <img src="/logo.png" alt="Panchi" />
              <div className="brand-text">
                <div className="brand-title">Panchi</div>
                <div className="brand-sub">Your AI-powered wings for every journey</div>
              </div>
            </div>

            <div className="hero-body">
              <h1 className="headline">Where are we going next?</h1>
              <p className="lead">Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.</p>

              <div className="search-row">
                <input
                  className="searchInput"
                  placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Link href={`/plan?destination=${encodeURIComponent(query || "Goa")}`}>
                  <a className="cta" aria-label="Let Panchi plan">Let Panchi plan →</a>
                </Link>
              </div>

            </div>

            <div className="hero-accent" aria-hidden="true" />
          </div>
        </header>

        <section className="container quick-picks">
          <h3>Quick picks</h3>
          <div className="desc">Popular destinations and curated offers for you.</div>

          <div className="quick-pills">
            {quickPicks.map((p) => (
              <Link key={p.id} href={p.slug}>
                <a className="quick-pill">{p.label}</a>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .page { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#0f1724; }
        .hero { padding: 36px 18px 40px; background: linear-gradient(180deg,#f7f9ff 0%, #fff 70%); position:relative; overflow:visible; }
        .hero-inner { max-width:1260px; margin:0 auto; display:flex; gap:24px; align-items:flex-start; justify-content:space-between; }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand img { height:46px; width:auto; object-fit:contain; }
        .brand-text .brand-title { font-weight:700; font-size:18px; }
        .brand-sub { color:#64748b; font-size:13px; margin-top:2px; }

        .hero-body { flex:1; min-width:0; }
        .headline { font-size: clamp(34px, 6vw, 56px); margin:6px 0; line-height:1.02; font-weight:800; color:#0b1220; }
        .lead { color:#475569; margin-bottom:12px; font-size:15px; }

        .search-row { display:flex; gap:14px; align-items:center; margin-top:12px; }
        .searchInput { flex:1; min-width:240px; padding:12px 16px; border-radius:14px; border:1px solid rgba(12,18,55,0.06); box-shadow:0 12px 30px rgba(12,18,55,0.04); background:#fff; }
        .cta { display:inline-block; background:linear-gradient(90deg,#7f3aea 0%, #ff4da6 70%); color:#fff; padding:12px 18px; border-radius:12px; text-decoration:none; font-weight:700; box-shadow:0 18px 40px rgba(127,58,234,0.14); }

        .hero-accent { position:absolute; right:40px; top:34px; width:260px; height:180px; background: radial-gradient(closest-side, rgba(159,76,243,0.18), rgba(255,77,166,0.08) 60%, transparent 70%); filter: blur(18px); border-radius:50%; pointer-events:none; box-shadow:0 20px 50px rgba(159,76,243,0.06); }

        .container { max-width:1260px; margin:24px auto; padding:18px; }
        .quick-picks { padding:22px; border-radius:14px; background:linear-gradient(180deg,#fff,#fff); box-shadow:0 12px 40px rgba(12,18,55,0.04); }
        .quick-picks h3 { margin:0 0 6px; }
        .desc { color:#64748b; margin-bottom:12px; }
        .quick-pills { display:flex; gap:12px; flex-wrap:wrap; }
        .quick-pill { background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:#fff; padding:10px 14px; border-radius:999px; font-weight:700; text-decoration:none; box-shadow:0 10px 30px rgba(127,58,234,0.09); }

        @media (max-width:880px) {
          .hero-inner { flex-direction:column; align-items:flex-start; gap:12px; }
          .hero-accent { right:12px; top:8px; width:160px; height:110px; filter:blur(14px); }
        }
      `}</style>
    </>
  );
}
