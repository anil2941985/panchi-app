// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");

  const picks = [
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

      <main className="root">
        <header className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="brand">
                <img src="/logo.png" alt="Panchi" className="logo" />
                <div className="brand-text">
                  <div className="brand-name">Panchi</div>
                  <div className="brand-tag">Your AI-powered wings for every journey</div>
                </div>
              </div>

              <h1 className="title">Where are we going next?</h1>
              <p className="subtitle">Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.</p>

              <div className="search-row">
                <input
                  aria-label="Search destination"
                  placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"'
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="search"
                />
                <Link href={`/plan?destination=${encodeURIComponent(q || "Goa")}`}>
                  <a className="cta">Let Panchi plan →</a>
                </Link>
              </div>
            </div>

            {/* decorative gradient panel kept subtle and anchored, not floating */}
            <div className="hero-accent" aria-hidden="true" />
          </div>
        </header>

        <section className="container picks">
          <div className="panel">
            <div className="panel-head">
              <h3>Quick picks</h3>
              <p className="panel-desc">Popular destinations and curated offers for you.</p>
            </div>

            <div className="pills">
              {picks.map((p) => (
                <Link key={p.id} href={p.slug}>
                  <a className="pill">{p.label}</a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        :global(body) { margin:0; background:linear-gradient(180deg,#fbfdff 0%, #fff 40%, #fffafa 100%); font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#0b1220; }

        .root { min-height:100vh; }

        .hero { padding:28px 20px 36px; }
        .hero-inner { max-width:1200px; margin:0 auto; display:flex; gap:28px; align-items:flex-start; position:relative; }

        .hero-left { flex:1; min-width:0; }
        .brand { display:flex; gap:12px; align-items:center; margin-bottom:6px; }
        .logo { height:46px; width:auto; object-fit:contain; }
        .brand-name { font-weight:700; }
        .brand-tag { color:#60708a; font-size:13px; margin-top:2px; }

        .title { font-size:clamp(32px,5vw,56px); margin:4px 0 6px; line-height:1.03; font-weight:800; }
        .subtitle { color:#6b788f; margin:0 0 14px; }

        .search-row { display:flex; gap:12px; align-items:center; margin-top:10px; }
        .search { flex:1; padding:14px 16px; border-radius:14px; border:1px solid rgba(12,18,55,0.06); background:#fff; box-shadow:0 12px 30px rgba(12,18,55,0.04); font-size:15px; }
        .cta { padding:12px 18px; background:linear-gradient(90deg,#7f3aea 0%, #ff4da6 70%); color:white; border-radius:12px; text-decoration:none; font-weight:700; box-shadow:0 10px 30px rgba(127,58,234,0.12); }

        /* subtle, anchored accent (not floating over content) */
        .hero-accent { width:200px; height:160px; border-radius:22px; background:linear-gradient(180deg, rgba(159,76,243,0.16), rgba(255,77,166,0.08)); margin-left:12px; box-shadow:0 18px 40px rgba(159,76,243,0.06); }

        .container { max-width:1200px; margin:28px auto; padding:0 20px; }
        .panel { background:#fff; border-radius:14px; padding:18px 22px; box-shadow:0 20px 60px rgba(12,18,55,0.04); display:flex; flex-direction:column; gap:14px; }
        .panel-head { display:flex; justify-content:space-between; align-items:center; gap:16px; }
        .panel-desc { color:#7b8799; margin:0; }

        .pills { display:flex; gap:12px; flex-wrap:wrap; margin-top:6px; }
        .pill { background:linear-gradient(90deg,#9f4cf3,#ff6fb2); color:white; padding:10px 14px; border-radius:999px; font-weight:700; text-decoration:none; box-shadow:0 8px 28px rgba(159,76,243,0.09); }

        @media (max-width:880px) {
          .hero-inner { flex-direction:column; align-items:flex-start; }
          .hero-accent { display:none; }
          .panel-head { flex-direction:column; align-items:flex-start; gap:8px; }
        }
      `}</style>
    </>
  );
}
