// pages/index.js
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Header from "./components/Header";
import PlanCard from "./components/PlanCard";

/**
 * Mock data (realistic Indian routes/prices)
 * You can later replace these with real APIs.
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

const TRENDING = [
  { id: "r1", title: "Goa", subtitle: "Perfect weather + off-peak weekday flight deals", priceRange: "₹6,000–₹8,500" },
  { id: "r2", title: "Rishikesh", subtitle: "Great rafting season, clear skies", priceRange: "₹3,500–₹5,000" },
  { id: "r3", title: "Manali", subtitle: "Hill trip, scenic drives", priceRange: "₹4,000–₹7,000" },
];

export default function Index() {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayISO()); // simple string, can be changed
  const [mode, setMode] = useState("flights"); // flights | trains | cabs
  const [results, setResults] = useState([]);
  const [userName] = useState("Ethen"); // can be replaced by real auth

  useEffect(() => {
    // initial results: flights
    setResults(MOCK_FLIGHTS);
  }, []);

  useEffect(() => {
    // whenever mode changes, switch results
    if (mode === "flights") setResults(MOCK_FLIGHTS);
    if (mode === "trains") setResults(MOCK_TRAINS);
    if (mode === "cabs") setResults(MOCK_CABS);
  }, [mode]);

  const dateChips = useMemo(() => {
    // create 7-day chips from today (simple)
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
        iso: d.toISOString().slice(0, 10),
      });
    }
    return out;
  }, []);

  function onSearchClick() {
    // go to plan with query (simulate panching)
    const dest = encodeURIComponent(searchQ || "Goa");
    router.push(`/plan?destination=${dest}`);
  }

  function onSelectDate(iso) {
    setSelectedDate(iso);
    // in real MVP we'd recalc price predictions for that date
    // no-op here
  }

  function handleBook(item) {
    // placeholder: in real app open booking flow / api
    alert(`Book requested: ${item.carrier || item.name || item.label} — ₹${item.price}`);
  }

  return (
    <div className="page-root">
      <div className="container-wide">
        <Header userName={userName} onPlan={(q) => { setSearchQ(q); onSearchClick(); }} />

        <div className="layout-grid">
          {/* main column */}
          <main className="main-col">
            <section className="card panel">
              <div className="panel-head">
                <h3>Find the best options for {searchQ || "Goa"}</h3>
                <div className="muted">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</div>
              </div>

              <div className="date-chips">
                {dateChips.map((d) => (
                  <button
                    key={d.iso}
                    className={`chip ${selectedDate === d.iso ? "chip-active" : ""}`}
                    onClick={() => onSelectDate(d.iso)}
                  >
                    {d.label}
                  </button>
                ))}
                <div className="mode-tabs">
                  <button className={`tab ${mode === "flights" ? "tab-active" : ""}`} onClick={() => setMode("flights")}>Flights</button>
                  <button className={`tab ${mode === "trains" ? "tab-active" : ""}`} onClick={() => setMode("trains")}>Trains</button>
                  <button className={`tab ${mode === "cabs" ? "tab-active" : ""}`} onClick={() => setMode("cabs")}>Cabs</button>
                </div>
              </div>

              <div className="results-area">
                {results.length === 0 && <div className="muted">No options found for selected date/mode.</div>}

                {mode === "flights" &&
                  results.map((r) => (
                    <div key={r.id} className="flight-row">
                      <div>
                        <div className="result-title">{r.carrier}</div>
                        <div className="result-sub">{r.depart} → {r.arrive} · {r.dur}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="result-price">₹{r.price}</div>
                        <button className="btn-small" onClick={() => handleBook(r)}>Book</button>
                      </div>
                    </div>
                  ))}

                {mode === "trains" &&
                  results.map((r) => (
                    <div key={r.id} className="flight-row">
                      <div>
                        <div className="result-title">{r.name}</div>
                        <div className="result-sub">{r.dept} → {r.arr} · {r.dur}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="result-price">₹{r.price}</div>
                        <button className="btn-small" onClick={() => handleBook(r)}>Book</button>
                      </div>
                    </div>
                  ))}

                {mode === "cabs" &&
                  results.map((r) => (
                    <div key={r.id} className="flight-row">
                      <div>
                        <div className="result-title">{r.label}</div>
                        <div className="result-sub">ETA: {r.eta} · Rating: ★ {r.rating}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="result-price">₹{r.price}</div>
                        <button className="btn-small" onClick={() => handleBook(r)}>Book</button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <section className="panel">
              <h4>Events & crowd alerts</h4>
              <div className="alerts-list">
                <ul>
                  <li><strong>HIGH</strong> Sunburn-esque EDM Festival — Vagator, Goa · 2025-12-28<br/>High crowding · Hotels +30% · Cab surge likely · <em>Panchi: Book hotels + cabs if attending; avoid beachfront stays if you want quiet.</em></li>
                  <li><strong>HIGH</strong> IPL Playoffs (Sample) — Mumbai · 2026-05-20<br/>High hotel & flight demand · Local transport crowded · <em>Panchi: book transport early and plan longer arrival buffers to stadiums.</em></li>
                  <li><strong>MEDIUM</strong> Classical Music Fest — Thiruvananthapuram · 2025-11-09<br/>Boutique hotels fill fast · <em>Panchi: Book boutique stays early.</em></li>
                </ul>
              </div>
            </section>

            <section className="panel trending">
              <h4>Trending trips & ideas</h4>
              <div className="trending-grid">
                {TRENDING.map((t) => (
                  <div key={t.id} className="trend-card">
                    <div className="tag">Popular</div>
                    <div className="trend-title">{t.title}</div>
                    <div className="trend-sub">{t.subtitle}</div>
                    <div className="trend-bottom">
                      <div className="trend-price">{t.priceRange}</div>
                      <Link href={`/plan?destination=${encodeURIComponent(t.title)}`}><a className="btn-small">Explore</a></Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* right sidebar */}
          <aside className="side-col">
            <div className="panel sidebar-card">
              <h5>Nudges & alerts</h5>
              <div className="nudge-list">
                {NUDGES.map((n) => (
                  <div className="nudge-row" key={n.id}>
                    <div className="n-title">{n.title}</div>
                    <div className="n-body">{n.body}</div>
                  </div>
                ))}
              </div>

              <h5 style={{ marginTop: 18 }}>Community quick takes</h5>
              <div className="community">
                <div className="comm">Asha — "Loved morning at Baga, crowd was manageable."</div>
                <div className="comm">Rajan — "Roads good but expect diversions during festivals."</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* small helper */
function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}
