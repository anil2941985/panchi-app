// pages/plan.js
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/*
  Plan page for Panchi MVP
  - reads ?destination=...
  - shows 7-day chips, mode tabs, nudges & events, trending cards
  - displays mock cheapest options for selected mode and date
*/

const MOCK_FLIGHTS = [
  { id: "f1", carrier: "IndiAir", depart: "DEL 06:00", arrive: "GOI 08:05", dur: "2h 5m", price: 3499 },
  { id: "f2", carrier: "SkyWays", depart: "DEL 09:00", arrive: "GOI 11:05", dur: "2h 5m", price: 4299 },
  { id: "f3", carrier: "BudgetAir", depart: "DEL 17:15", arrive: "GOI 19:20", dur: "2h 5m", price: 2999 },
];

const MOCK_TRAINS = [
  { id: "t1", name: "Konkan Kanya Express · 10111", dept: "18:20", arr: "09:15", dur: "14h 55m", price: 1100 },
  { id: "t2", name: "Jan Shatabdi Express · 12051", dept: "13:20", arr: "03:40", dur: "14h 20m", price: 1350 },
  { id: "t3", name: "Vande Bharat Express · 22229", dept: "06:10", arr: "19:45", dur: "13h 35m", price: 1850 },
];

const MOCK_CABS = [
  { id: "c1", label: "Local Taxi", eta: "10 min", rating: 4.6, price: 220 },
  { id: "c2", label: "Ola Mini", eta: "12 min", rating: 4.4, price: 249 },
  { id: "c3", label: "Uber Go", eta: "9 min", rating: 4.5, price: 265 },
];

const NUDGES = [
  { id: 1, title: "Rain alert — Baga / Calangute", body: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
  { id: 2, title: "Price surge likely next Fri", body: "Searches up for DEL → GOI. Book early to save ~10–18%." },
  { id: 3, title: "Traffic at Delhi T3 (Evening)", body: "Allow 30–45 mins extra to reach the airport." },
];

function getSevenDays() {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
    });
  }
  return out;
}

export default function Plan() {
  const router = useRouter();
  const { destination: destQuery } = router.query || {};
  const destination = Array.isArray(destQuery) ? destQuery[0] : destQuery || "Goa";

  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const [selectedDate, setSelectedDate] = useState(getSevenDays()[0].iso);
  const [results, setResults] = useState([]);
  const [userName] = useState("Ethen"); // placeholder; replace with auth later

  const seven = useMemo(() => getSevenDays(), []);

  useEffect(() => {
    // update results according to mode
    if (mode === "flights") setResults(MOCK_FLIGHTS);
    if (mode === "trains") setResults(MOCK_TRAINS);
    if (mode === "cabs") setResults(MOCK_CABS);
  }, [mode]);

  function handleBook(item) {
    // placeholder booking action
    alert(`Booking placeholder for ${item.carrier || item.name || item.label} — ₹${item.price}`);
  }

  function handlePlanAgain() {
    router.push(`/`);
  }

  // small "verdict" based on example conditions (mock)
  function computeVerdict() {
    // example simple logic:
    if (destination.toLowerCase().includes("goa")) {
      return {
        label: "GOOD",
        text: "Weather looks pleasant; some weekend rain patches. Best deals arrive on weekdays.",
      };
    }
    return {
      label: "NEUTRAL",
      text: "Check hotels and events for local surges before booking.",
    };
  }

  const verdict = computeVerdict();

  return (
    <div className="page-root" style={{ padding: 24 }}>
      <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#666" }}>Hey, <strong>{userName}</strong></div>
          <h1 style={{ margin: "6px 0 4px" }}>Where are we going next?</h1>
          <p style={{ marginTop: 0, color: "#666" }}>
            Panchi will find the smartest, safest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <input
              placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`}
              value={destination}
              readOnly
              style={{
                flex: 1,
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #eee",
                boxShadow: "0 6px 18px rgba(20,20,20,0.04)",
                background: "#fff",
              }}
            />
            <button
              onClick={handlePlanAgain}
              style={{
                background: "linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                boxShadow: "0 6px 16px rgba(127,92,255,0.18)",
              }}
            >
              Let Panchi plan →
            </button>
          </div>
        </div>

        <div style={{ width: 180, textAlign: "right" }}>
          <img src="/Panchi-logo.png" alt="Panchi" style={{ maxWidth: 160 }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginTop: 28 }}>
        {/* left main column */}
        <div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 8px 24px rgba(12,12,12,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 6px" }}>Find the best options for {destination}</h3>
                <div style={{ color: "#666", marginBottom: 12 }}>Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</div>
              </div>

              <div style={{ textAlign: "right", color: "#666" }}>
                <div style={{ fontSize: 13 }}>Mode: <strong>{mode}</strong></div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{verdict.label} — {verdict.text}</div>
              </div>
            </div>

            {/* date chips and mode tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {seven.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`chip ${selectedDate === d.iso ? "chip-active" : ""}`}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: selectedDate === d.iso ? "2px solid #7F5CFF" : "1px solid #eee",
                      background: selectedDate === d.iso ? "#F6F0FF" : "#FAFAFB",
                      cursor: "pointer",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <button
                  onClick={() => setMode("flights")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: mode === "flights" ? "none" : "1px solid #eee",
                    background: mode === "flights" ? "linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%)" : "#fff",
                    color: mode === "flights" ? "#fff" : "#333",
                    boxShadow: mode === "flights" ? "0 6px 16px rgba(127,92,255,0.12)" : "none",
                    cursor: "pointer",
                  }}
                >
                  Flights
                </button>
                <button
                  onClick={() => setMode("trains")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: mode === "trains" ? "none" : "1px solid #eee",
                    background: mode === "trains" ? "linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%)" : "#fff",
                    color: mode === "trains" ? "#fff" : "#333",
                    cursor: "pointer",
                  }}
                >
                  Trains
                </button>
                <button
                  onClick={() => setMode("cabs")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: mode === "cabs" ? "none" : "1px solid #eee",
                    background: mode === "cabs" ? "linear-gradient(90deg,#7F5CFF 0%,#FF5CA8 100%)" : "#fff",
                    color: mode === "cabs" ? "#fff" : "#333",
                    cursor: "pointer",
                  }}
                >
                  Cabs
                </button>
              </div>
            </div>

            {/* results list */}
            <div style={{ marginTop: 18 }}>
              {mode === "flights" &&
                MOCK_FLIGHTS.map((f) => (
                  <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 10, background: "#FBFBFC", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{f.carrier}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>{f.depart} → {f.arrive} · {f.dur}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>₹{f.price}</div>
                      <button onClick={() => handleBook(f)} style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Book</button>
                    </div>
                  </div>
                ))}

              {mode === "trains" &&
                MOCK_TRAINS.map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 10, background: "#FBFBFC", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{t.name}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>{t.dept} → {t.arr} · {t.dur}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>₹{t.price}</div>
                      <button onClick={() => handleBook(t)} style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Book</button>
                    </div>
                  </div>
                ))}

              {mode === "cabs" &&
                MOCK_CABS.map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 10, background: "#FBFBFC", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{c.label}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>ETA: {c.eta} · Rating: ★ {c.rating}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>₹{c.price}</div>
                      <button onClick={() => handleBook(c)} style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Book</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* events & crowd alerts */}
          <div style={{ marginTop: 18 }}>
            <div style={{ padding: 18, background: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(12,12,12,0.04)" }}>
              <h4 style={{ marginTop: 0 }}>Events & crowd alerts</h4>
              <div style={{ color: "#333" }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>HIGH</strong> — Sunburn-esque EDM Festival, Vagator, Goa · 2025-12-28<br />
                  High crowding · Hotels +30% · Cab surge likely.<br />
                  <em>Panchi: Book hotels + cabs if attending; avoid beachfront stays if you want quiet.</em>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>HIGH</strong> — IPL Playoffs (Sample), Mumbai · 2026-05-20<br />
                  High hotel & flight demand · Local transport crowded.<br />
                  <em>Panchi: Book transport early and plan longer arrival buffers to stadiums.</em>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right sidebar */}
        <aside>
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "#fff", padding: 18, borderRadius: 14, boxShadow: "0 8px 24px rgba(12,12,12,0.04)" }}>
              <h5 style={{ marginTop: 0 }}>Nudges & alerts</h5>
              <div>
                {NUDGES.map((n) => (
                  <div key={n.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F4F7FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      ⚠️
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{n.title}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>{n.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <h6 style={{ marginBottom: 8 }}>Community quick takes</h6>
                <div style={{ color: "#666", fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
                  <div><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
