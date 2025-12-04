// pages/index.js
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/**
 * Inline HeroBlob component (self-contained so we don't depend on other files)
 */
function HeroBlob() {
  return (
    <div className="hero-blob" aria-hidden>
      <svg viewBox="0 0 400 260" width="400" height="260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd6f0" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#caa7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b3f0ff" stopOpacity="0.85" />
          </linearGradient>
          <filter id="blurMe" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>
        <g filter="url(#blurMe)">
          <path
            d="M84 12c45-8 110 2 156 28 46 26 74 84 60 134-14 50-71 80-120 90-49 9-99-6-142-30C20 201 3 146 15 106 27 66 44 28 84 12z"
            fill="url(#g1)"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  function goToPlan() {
    router.push("/plan?destination=Goa");
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            {/* default PNG logo: put file at /public/images/panchi-default.png */}
            <img src="/images/panchi-default.png" alt="Panchi" />
            <div>
              <div style={{ fontWeight: 700 }}>Panchi</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>Your AI-powered wings for every journey</div>
            </div>
          </div>
          {/* decorative area (was the old top-right box) - kept intentionally empty */}
          <div className="hero-right-placeholder" />
        </div>

        <h1 className="headline">Where are we going next?</h1>
        <p className="subtitle">Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.</p>

        <div className="searchRow">
          <div className="searchInput" role="search">
            <input
              id="dest"
              defaultValue=""
              placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"'
              aria-label="Search destination"
            />
          </div>

          <button className="cta" onClick={goToPlan}>
            Let Panchi plan →
          </button>
        </div>

        <HeroBlob />
      </header>

      <main className="container single">
        <section className="card hero-cards">
          <h3>Quick picks</h3>
          <p style={{ color: "#6b7280" }}>Popular destinations and curated offers for you.</p>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/plan?destination=Goa"><a className="pill">Goa — beaches under ₹5k</a></Link>
            <Link href="/plan?destination=Manali"><a className="pill">Manali — hill escapes</a></Link>
            <Link href="/plan?destination=Jaipur"><a className="pill">Jaipur — heritage breaks</a></Link>
          </div>
        </section>
      </main>

      <style jsx global>{`
        :root{
          --accentA: #7f3aea;
          --accentB: #ff4da6;
          --bg-start: #f6faff;
          --bg-end: #fff6fb;
        }
        html,body,#__next{height:100%}
        body{
          margin:0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background:
            radial-gradient(600px 240px at 6% 8%, rgba(127,58,234,0.04), transparent 10%),
            radial-gradient(460px 180px at 92% 10%, rgba(255,77,166,0.03), transparent 8%),
            linear-gradient(180deg, var(--bg-start), var(--bg-end));
          -webkit-font-smoothing:antialiased;
        }
        .hero{
          padding: 36px 48px;
          position: relative;
          overflow: visible;
        }
        .hero-inner{display:flex;align-items:center;justify-content:space-between}
        .brand{display:flex;gap:12px;align-items:center}
        .brand img{height:54px;width:auto;display:block}
        .headline{font-size:56px;margin:6px 0 6px 0;color:#0f172a;font-weight:800}
        .subtitle{color:#6b7280;margin:0 0 20px 0}
        .searchRow{display:flex;gap:16px;align-items:center;margin-top:12px}
        .searchInput{flex:1;background:#fff;border-radius:14px;padding:12px 14px;box-shadow:0 8px 30px rgba(12,18,55,0.04);border:1px solid rgba(12,18,55,0.03)}
        .searchInput input{border:0;outline:0;width:100%;font-size:16px}
        .cta{display:inline-flex;align-items:center;padding:12px 18px;border-radius:12px;background:linear-gradient(90deg,var(--accentA) 0%,var(--accentB) 70%);color:#fff;border:0;font-weight:700;cursor:pointer;box-shadow:0 14px 40px rgba(127,58,234,0.12)}
        .hero-blob{position:absolute;right:48px;top:18px;width:320px;height:210px;pointer-events:none;opacity:.95}
        .container{display:grid;grid-template-columns:1fr;gap:28px;padding:20px 48px 80px}
        .card{background:#fff;border-radius:12px;padding:18px;box-shadow:0 10px 30px rgba(12,18,55,0.04);border:1px solid rgba(12,18,55,0.03)}
        .pill{display:inline-block;padding:8px 12px;background:linear-gradient(90deg,#9f4cf3,#ff6fb2);color:#fff;border-radius:10px;text-decoration:none;font-weight:700}
        @media (min-width:980px){ .container{grid-template-columns:1fr 360px} .single .card{grid-column:span 2}}
      `}</style>
    </div>
  );
}
