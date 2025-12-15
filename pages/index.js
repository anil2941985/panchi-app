import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Head>
        <title>Panchi – Where are we going next?</title>
      </Head>

      <header className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Panchi" height={48} />
          <div>
            <strong>Panchi</strong>
            <div className="muted">Your AI-powered wings for every journey</div>
          </div>
        </div>

        <div style={{ marginTop: 40, maxWidth: 720 }}>
          <h1 style={{ fontSize: 52, lineHeight: 1.1, marginBottom: 12 }}>
            Where are we going next?
          </h1>
          <p className="muted">
            Panchi synthesizes price, events, weather and community feedback
            to nudge you in real time.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "Goa", "Manali", "Jaipur", "beach under 5k"'
              style={{
                flex: 1,
                minWidth: 260,
                padding: 16,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
              }}
            />

            <Link href={`/plan?destination=${query || "Goa"}`}>
              <button className="gradient-btn">Let Panchi plan →</button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ marginTop: 60 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h3>Quick picks</h3>
          <p className="muted">Popular destinations curated for you.</p>

          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link href="/plan?destination=Goa">
              <span className="gradient-pill">Goa – beaches under ₹5k</span>
            </Link>
            <Link href="/plan?destination=Manali">
              <span className="gradient-pill">Manali – hill escapes</span>
            </Link>
            <Link href="/plan?destination=Jaipur">
              <span className="gradient-pill">Jaipur – heritage breaks</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
