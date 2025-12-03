// pages/plan.js
import React, { useState, useMemo } from "react";

// NOTE: we intentionally do NOT import PriceCard or HeroBird here to avoid
// build-time module resolution errors. If you want PriceCard/PlanCard as separate
// components, make sure they exist at pages/components/PriceCard.jsx (or update import path).

const DAYS = ["29/11", "30/11", "01/12", "02/12", "03/12", "04/12", "05/12"];
const MOCK_FLIGHTS = [
  { id: "f1", airline: "IndiAir", depart: "DEL 06:00", arrive: "GOI 08:05", dur: "2h 5m", price: 3499, mood: "GOOD" },
  { id: "f2", airline: "SkyWays", depart: "DEL 09:00", arrive: "GOI 11:05", dur: "2h 5m", price: 4299, mood: "FAIR" },
  { id: "f3", airline: "BudgetAir", depart: "DEL 17:15", arrive: "GOI 19:20", dur: "2h 5m", price: 2999, mood: "OK" }
];

export default function PlanPage({ query }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [mode, setMode] = useState("flights");
  const [searchQ, setSearchQ] = useState((query && query.destination) || "Goa");

  const results = useMemo(() => {
    if (mode === "flights") return MOCK_FLIGHTS;
    return MOCK_FLIGHTS;
  }, [mode]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, Arial, sans-serif", color: "#111", padding: 24 }}>
      <header style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#666", marginBottom: 8 }}>Hey, <strong>Ethen</strong></div>
          <h1 style={{ fontSize: 44, margin: "6px 0 8px", lineHeight: 1.02 }}>Where are we going next?</h1>
          <p style={{ color: "#666", marginTop: 0 }}>
            Panchi finds the smartest, safest and cheapest ways to reach <strong>{searchQ}</strong> — starting with flights in this MVP.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <input
              aria-label="Where to?"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"'
              style={{
                flex: 1,
                padding: "18px 20px",
                borderRadius: 12,
                boxShadow: "0 6px 18px rgba(20,30,50,0.06)",
                border: "1px solid rgba(10,20,40,0.06)",
                fontSize: 16,
                outline: "none",
              }}
            />
            <button
              onClick={() => { /* future AI trigger */ }}
              style={{
                background: "linear-gradient(90deg,#7b4bff,#ff6aa3)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                boxShadow: "0 8px 22px rgba(123,75,255,0.12)",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Let Panchi plan →
            </button>
          </div>
        </div>

        <div style={{ width: 220, textAlign: "right" }}>
          <img alt="Panchi" src="/panchi-logo.png" style={{ width: 160, height: "auto" }} />
        </div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, marginTop: 28 }}>
        <section>
          <div style={{ padding: 18, borderRadius: 14, background: "white", boxShadow: "0 8px 28px rgba(20,30,50,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>Find the best options for {searchQ}</h2>
                <p style={{ marginTop: 8, color: "#6b7280" }}>
                  Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.
                </p>
              </div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Mode: <strong>{mode}</strong></div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(i)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: selectedDay === i ? "2px solid #7b4bff" : "1px solid rgba(15,20,30,0.06)",
                    background: selectedDay === i ? "linear-gradient(90deg,#f6f0ff,#fff0f6)" : "#fff",
                    cursor: "pointer"
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
              {["flights", "trains", "cabs"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: mode === m ? "none" : "1px solid rgba(15,20,30,0.06)",
                    background: mode === m ? "linear-gradient(90deg,#8f5bff,#ff7ab0)" : "#fff",
                    color: mode === m ? "#fff" : "#111",
                    cursor: "pointer",
                    boxShadow: mode === m ? "0 8px 20px rgba(140,80,255,0.12)" : "none"
                  }}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {results.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 18,
                    borderRadius: 10,
                    border: "1px solid rgba(10,20,40,0.04)",
                    background: "#fff"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.airline}</div>
                    <div style={{ color: "#6b7280", marginTop: 6 }}>{r.depart} → {r.arrive} · {r.dur}</div>
                    <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>Mood: <strong>{r.mood}</strong></div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>₹{r.price}</div>
                    <button
                      onClick={() => alert("Book placeholder")}
                      style={{
                        marginTop: 8,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(10,20,40,0.08)",
                        background: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside>
          <div style={{ padding: 18, borderRadius: 12, background: "white", boxShadow: "0 8px 24px rgba(20,30,50,0.04)" }}>
            <h3 style={{ marginTop: 0 }}>Nudges & alerts</h3>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFFAEB", display: "flex", alignItems: "center", justifyContent: "center" }}>⚠️</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Rain alert — Baga / Calangute</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>Light rain Saturday evening; prefer inland stays for a quiet morning.</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center" }}>🔥</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Price surge likely next Fri</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>Searches up for DEL → GOI. Book early to save ~10–18%.</div>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed rgba(10,20,30,0.06)", paddingTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Community quick takes</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>
                  Asha — "Loved morning at Baga, crowd manageable."<br/>
                  Rajan — "Road diversions in festival season; allow extra time."
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div style={{ padding: 12, borderRadius: 12, background: "#fff", boxShadow: "0 6px 18px rgba(20,30,50,0.04)" }}>
            <h4 style={{ margin: "6px 0" }}>Trending trips & ideas</h4>
            {/* Inline simple trending card — safe fallback when PriceCard component isn't present */}
            <div style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(10,20,40,0.04)", marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>Goa</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>Perfect weather + off-peak weekday flight deals</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>₹6,000–₹8,500</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(10,20,40,0.04)" }}>
              <div style={{ fontWeight: 700 }}>Rishikesh</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>Great rafting season, clear skies</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>₹3,500–₹5,000</div>
            </div>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        body { background: linear-gradient(180deg,#fbfdff 0%, #ffffff 60%); margin: 0; }
        @media (max-width: 900px) {
          main { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
