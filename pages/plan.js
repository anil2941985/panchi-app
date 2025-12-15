import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Plan() {
  const { query } = useRouter();
  const destination = query.destination || "Goa";

  const [mode, setMode] = useState("flights");

  return (
    <>
      <Head>
        <title>Panchi – Plan for {destination}</title>
      </Head>

      <header className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Panchi" height={44} />
          <div>
            <strong>Panchi</strong>
            <div className="muted">Your AI-powered wings for every journey</div>
          </div>
        </div>

        <h1 style={{ marginTop: 32, fontSize: 44 }}>
          Where are we going next?
        </h1>
        <p className="muted">
          Panchi will find the smartest, safest and cheapest ways to reach{" "}
          <strong>{destination}</strong>.
        </p>
      </header>

      <main
        className="container"
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 24,
        }}
      >
        <section className="panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Best options for {destination}</h3>
            <span className="muted">Mode: {mode}</span>
          </div>

          <div className="tabs" style={{ marginTop: 16 }}>
            <button
              className={`tab ${mode === "flights" ? "active" : ""}`}
              onClick={() => setMode("flights")}
            >
              Flights
            </button>
            <button
              className={`tab ${mode === "trains" ? "active" : ""}`}
              onClick={() => setMode("trains")}
            >
              Trains
            </button>
            <button
              className={`tab ${mode === "cabs" ? "active" : ""}`}
              onClick={() => setMode("cabs")}
            >
              Cabs
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
              <strong>IndiAir</strong>
              <div className="muted">DEL 06:00 → {destination} 08:05 · 2h 5m</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>₹3499</div>
            </div>

            <div className="panel" style={{ padding: 16 }}>
              <strong>SkyWays</strong>
              <div className="muted">DEL 09:00 → {destination} 11:05 · 2h 5m</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>₹4299</div>
            </div>
          </div>
        </section>

        <aside className="panel" style={{ padding: 24 }}>
          <h4>Nudges & alerts</h4>
          <ul className="muted">
            <li><strong>Rain alert:</strong> Light rain expected near beaches</li>
            <li><strong>Price surge:</strong> Demand increasing for this route</li>
            <li><strong>Traffic:</strong> Evening congestion near departure hub</li>
          </ul>
        </aside>
      </main>

      <style jsx>{`
        @media (max-width: 900px) {
          main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
    }
