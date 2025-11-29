// pages/plan.js
import { useEffect, useState } from "react";

/**
 * Panchi AI Planner (MVP)
 * - Reads destination from query string (?destination=Goa)
 * - Loads context (nudges, events, hotPlaces, community reviews)
 * - Loads mock transport options (flights/trains/buses/cabs)
 * - Produces a context-first verdict and ranked transport options
 *
 * NOTE:
 * - This is rules-based (MVP). Replace scoring/evidence logic with real AI later.
 * - Relies on existing mock APIs: /api/mockNudges, /api/mockEvents, /api/mockHotPlaces,
 *   /api/mockCommunity, /api/mockFlights, /api/mockTrains, /api/mockBuses, /api/mockCabs
 */

export default function Plan() {
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState("");

  // context data
  const [nudges, setNudges] = useState([]);
  const [events, setEvents] = useState([]);
  const [hotPlaces, setHotPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);

  // transport options
  const [flight, setFlight] = useState(null);
  const [train, setTrain] = useState(null);
  const [bus, setBus] = useState(null);
  const [cab, setCab] = useState(null);

  // computed
  const [verdict, setVerdict] = useState(null); // {score, label, bullets[]}
  const [rankedOptions, setRankedOptions] = useState([]);
  const [savedAlerts, setSavedAlerts] = useState([]);

  useEffect(() => {
    // read destination from URL
    try {
      if (typeof window !== "undefined") {
        const q = new URLSearchParams(window.location.search);
        const dest = q.get("destination") || q.get("q") || q.get("place") || "Goa";
        setDestination(dest);
      }
    } catch (e) {
      setDestination("Goa");
    }
  }, []);

  useEffect(() => {
    // load saved alerts from localStorage
    if (typeof window !== "undefined") {
      const s = window.localStorage.getItem("panchiAlerts");
      if (s) {
        try {
          setSavedAlerts(JSON.parse(s));
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (!destination) return;
    runPlanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  async function runPlanner() {
    setLoading(true);
    setContextLoading(true);
    setError("");
    setVerdict(null);
    setRankedOptions([]);
    try {
      // fetch context & transport in parallel
      const [
        nudgesRes,
        eventsRes,
        hotRes,
        reviewsRes,
        flightsRes,
        trainsRes,
        busesRes,
        cabsRes,
      ] = await Promise.all([
        fetch("/api/mockNudges"),
        fetch("/api/mockEvents"),
        fetch("/api/mockHotPlaces"),
        fetch("/api/mockCommunity"),
        fetch("/api/mockFlights"),
        fetch("/api/mockTrains"),
        fetch("/api/mockBuses"),
        fetch("/api/mockCabs"),
      ]);

      const [nudgesData, eventsData, hotData, reviewsData, flightsData, trainsData, busesData, cabsData] =
        await Promise.all([
          nudgesRes.ok ? nudgesRes.json() : [],
          eventsRes.ok ? eventsRes.json() : [],
          hotRes.ok ? hotRes.json() : [],
          reviewsRes.ok ? reviewsRes.json() : [],
          flightsRes.ok ? flightsRes.json() : [],
          trainsRes.ok ? trainsRes.json() : [],
          busesRes.ok ? busesRes.json() : [],
          cabsRes.ok ? cabsRes.json() : [],
        ]);

      setNudges(nudgesData || []);
      setEvents(eventsData || []);
      setHotPlaces(hotData || []);
      setReviews(reviewsData || []);

      // pick top items from each transport (mock APIs often return array)
      setFlight((flightsData && flightsData[0]) || null);
      setTrain((trainsData && trainsData[0]) || null);
      setBus((busesData && busesData[0]) || null);
      setCab((cabsData && cabsData[0]) || null);

      setContextLoading(false);

      // compute context insights for the chosen destination
      const insight = buildContextInsight({
        destination,
        nudges: nudgesData || [],
        events: eventsData || [],
        hotPlaces: hotData || [],
        reviews: reviewsData || [],
      });

      setVerdict(insight);

      // compute ranked transport options
      const ranked = scoreAndRankOptions({
        destination,
        flight: (flightsData && flightsData[0]) || null,
        train: (trainsData && trainsData[0]) || null,
        bus: (busesData && busesData[0]) || null,
        cab: (cabsData && cabsData[0]) || null,
        context: insight,
      });

      setRankedOptions(ranked);
    } catch (err) {
      console.error(err);
      setError("Could not compute plan right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Build a human-friendly verdict from context
  function buildContextInsight({ destination, nudges, events, hotPlaces, reviews }) {
    const lowerDest = destination.toLowerCase();
    const relevantNudges = nudges.filter((n) => {
      // Simple heuristic: check if any nudge text mentions the destination or generic alerts
      return (
        (n.title && n.title.toLowerCase().includes(lowerDest)) ||
        (n.detail && n.detail.toLowerCase().includes(lowerDest)) ||
        n.type === "pricing" || // global pricing spikes could be relevant
        n.type === "weather"
      );
    });

    const relevantEvents = events.filter((ev) => {
      return ev.location && ev.location.toLowerCase().includes(lowerDest);
    });

    const hot = hotPlaces.find((h) => h.title && h.title.toLowerCase() === lowerDest);

    const sampleReviews = reviews.filter((r) => r.location && r.location.toLowerCase().includes(lowerDest)).slice(0, 3);

    // Score heuristics for verdict
    let score = 50; // 0 bad — 100 great
    const bullets = [];

    // Hot place increases desirability but may indicate price spike
    if (hot) {
      bullets.push(`${hot.title} is trending: ${hot.reason} (budget ${hot.budget}).`);
      score += 10;
      // trending can increase price worry
      bullets.push("Trending week — prices might be slightly higher than usual.");
      score -= 6;
    }

    // Nudges: weather & pricing
    relevantNudges.forEach((n) => {
      if (n.type === "weather") {
        bullets.push(`Weather note: ${n.title} — ${n.detail}`);
        // weather issues reduce score
        score -= 12;
      }
      if (n.type === "pricing") {
        bullets.push(`Price alert: ${n.title} — ${n.impact}`);
        score -= 8;
      }
      if (n.type === "traffic") {
        bullets.push(`Traffic advice: ${n.title} — ${n.impact}`);
        score -= 5;
      }
      if (n.type === "event") {
        bullets.push(`Event notice: ${n.title} — ${n.detail}`);
        score -= 8;
      }
    });

    // Events (severity heavy)
    relevantEvents.forEach((ev) => {
      bullets.push(`Event: ${ev.title} on ${ev.date} — ${ev.impact}`);
      if (ev.severity === "high") score -= 18;
      else if (ev.severity === "medium") score -= 8;
      else score -= 4;
    });

    // Community reviews add trust
    if (sampleReviews.length > 0) {
      sampleReviews.forEach((rv) => {
        bullets.push(`Traveler insight: ${rv.name} — "${rv.tip}"`);
      });
      score += 6;
    }

    // clamp score
    if (score > 95) score = 95;
    if (score < 5) score = 5;

    // Human label
    let label = "Okay to visit";
    if (score >= 70) label = "Good to go";
    else if (score >= 40) label = "Plan with caution";
    else label = "Not recommended right now";

    // concise verdict summary
    const summary = `${label} — score ${Math.round(score)} / 100.`;
    return {
      score: Math.round(score),
      label,
      summary,
      bullets,
      relevantNudges,
      relevantEvents,
      hotPlace: hot || null,
      sampleReviews,
    };
  }

  // Scoring & ranking transport options using context penalties
  function scoreAndRankOptions({ destination, flight, train, bus, cab, context }) {
    const options = [];
    if (flight) options.push({ key: "flight", label: "Flight", data: flight });
    if (train) options.push({ key: "train", label: "Train", data: train });
    if (bus) options.push({ key: "bus", label: "Bus", data: bus });
    if (cab) options.push({ key: "cab", label: "Cab", data: cab });

    // Build penalties from events & nudges (simple)
    const penalties = { flight: 0, train: 0, bus: 0, cab: 0 };

    // If there's high severity event in dest, penalize cabs heavily and flights moderately
    (context.relevantEvents || []).forEach((ev) => {
      if (ev.severity === "high") {
        penalties.cab += 30;
        penalties.flight += 10;
        penalties.bus += 12;
      } else if (ev.severity === "medium") {
        penalties.cab += 14;
        penalties.bus += 8;
        penalties.flight += 5;
      } else {
        penalties.cab += 6;
      }
    });

    // Nudges: pricing -> penalize flights if surge; traffic -> penalize cabs
    (context.relevantNudges || []).forEach((n) => {
      if (n.type === "pricing") {
        penalties.flight += 12;
      }
      if (n.type === "traffic") {
        penalties.cab += 14;
      }
      if (n.type === "weather") {
        // heavy weather penalizes buses and cabs
        penalties.bus += 10;
        penalties.cab += 8;
      }
      if (n.type === "event") {
        penalties.cab += 10;
      }
    });

    // Convert transports to scored array
    const priced = options.map((o) => {
      const price = o.data.price != null ? o.data.price : 999999;
      const durationMin = parseDurationToMinutes(o.data.duration || "");
      return { ...o, price, durationMin };
    });

    // normalize price/duration
    const prices = priced.map((p) => p.price);
    const durs = priced.map((p) => p.durationMin);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minDur = Math.min(...durs);
    const maxDur = Math.max(...durs);

    const norm = (v, mn, mx) => {
      if (mx === mn) return 0;
      return (v - mn) / (mx - mn);
    };

    const scored = priced.map((p) => {
      const priceScore = norm(p.price, minPrice, maxPrice) * 100; // lower better
      const durScore = norm(p.durationMin, minDur, maxDur) * 100;
      // weights: price 0.6, duration 0.3, comfort/context 0.1
      const base = priceScore * 0.6 + durScore * 0.3;
      const pen = penalties[p.key] || 0;
      // apply user's context overall risk (if verdict low, increase penalty)
      const contextRiskPenalty = Math.max(0, 50 - (context.score || 50)) * 0.2;
      const final = base + pen + contextRiskPenalty;
      return { ...p, priceScore, durScore, baseScore: base, penalty: pen, contextRiskPenalty, finalScore: final };
    });

    // sort ascending (lower finalScore = better)
    scored.sort((a, b) => a.finalScore - b.finalScore);
    return scored;
  }

  function parseDurationToMinutes(dur) {
    // Accept formats like "2h 30m", "4h", "180m" etc.
    if (!dur) return 24 * 60;
    const hMatch = dur.match(/(\d+)\s*h/);
    const mMatch = dur.match(/(\d+)\s*m/);
    let total = 0;
    if (hMatch) total += parseInt(hMatch[1], 10) * 60;
    if (mMatch) total += parseInt(mMatch[1], 10);
    if (total === 0) {
      const onlyMin = dur.match(/(\d+)\s*min/);
      if (onlyMin) total = parseInt(onlyMin[1], 10);
    }
    if (total === 0) total = 24 * 60;
    return total;
  }

  // Save alert to localStorage
  function saveAlert() {
    try {
      const alerts = (typeof window !== "undefined" && JSON.parse(window.localStorage.getItem("panchiAlerts") || "[]")) || [];
      alerts.push({ destination, when: new Date().toISOString(), verdict });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("panchiAlerts", JSON.stringify(alerts));
        setSavedAlerts(alerts);
      }
      alert("Alert saved — Panchi will watch this destination for you.");
    } catch (e) {
      console.error(e);
      alert("Could not save alert.");
    }
  }

  function humanModeEmoji(key) {
    if (key === "flight") return "✈️";
    if (key === "train") return "🚆";
    if (key === "bus") return "🚌";
    if (key === "cab") return "🚕";
    return "✳️";
  }

  return (
    <main style={{ fontFamily: "Poppins, system-ui, sans-serif", minHeight: "100vh", padding: 24, background: "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#32CD32 100%)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: 20, boxShadow: "0 18px 45px rgba(0,0,0,0.18)" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/" style={{ textDecoration: "none", fontSize: 20, color: "#1E90FF" }}>◀︎</a>
            <img src="/panchi-logo.png" alt="Panchi" style={{ height: 46 }} />
            <div style={{ marginLeft: 8, fontSize: 13, opacity: 0.8 }}>AI Planner · Context-first</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/waitlist" style={{ color: "#1E90FF", textDecoration: "none", fontSize: 13 }}>Join waitlist</a>
            <button onClick={runPlanner} style={{ padding: "8px 12px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%)", color: "#fff", cursor: "pointer" }}>Refresh</button>
          </div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Panchi Planner — {destination}</h1>
        <p style={{ color: "#333", marginBottom: 14 }}>Before we show travel options, here’s what Panchi sees right now for <strong>{destination}</strong>.</p>

        {contextLoading && <div style={{ padding: 12, borderRadius: 12, background: "#fff8", marginBottom: 12 }}>Loading context & signals…</div>}
        {error && <div style={{ padding: 12, borderRadius: 12, background: "#FFF4F4", color: "#B00020", marginBottom: 12 }}>{error}</div>}

        {/* VERDICT CARD */}
        {verdict && (
          <div style={{ marginBottom: 14, padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#1E90FF 0%,#32CD32 100%)", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.95 }}>Panchi verdict</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{verdict.label} · {verdict.score}/100</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>{verdict.summary}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={saveAlert} style={{ padding: "8px 12px", borderRadius: 999, border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer" }}>Save alert</button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
              {verdict.bullets.slice(0, 5).map((b, idx) => (
                <div key={idx} style={{ fontSize: 13, opacity: 0.95 }}>• {b}</div>
              ))}
              {verdict.bullets.length > 5 && <div style={{ fontSize: 12, opacity: 0.8 }}>+ more insights in detailed view</div>}
            </div>
          </div>
        )}

        {/* TRANSPORT OPTIONS (ranked) */}
        <section style={{ marginBottom: 18 }}>
          <h3 style={{ marginBottom: 10 }}>Recommended travel options</h3>
          {loading && <div style={{ padding: 12, borderRadius: 12, background: "#fff8" }}>Scoring transport options…</div>}

          {!loading && rankedOptions.length === 0 && <div style={{ padding: 12, borderRadius: 12, background: "#fff8" }}>No options available right now.</div>}

          {!loading && rankedOptions.length > 0 && (
            <div style={{ display: "grid", gap: 12 }}>
              {rankedOptions.map((opt, idx) => (
                <div key={opt.key} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  background: idx === 0 ? "linear-gradient(135deg,#32CD32 0%,#1E90FF 60%)" : "#fff",
                  color: idx === 0 ? "#fff" : "#111",
                  alignItems: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontSize: 22 }}>{humanModeEmoji(opt.key)}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{opt.label} · ₹{opt.price}</div>
                      <div style={{ fontSize: 13, opacity: idx === 0 ? 0.95 : 0.7 }}>
                        {opt.data?.depart || ""} → {opt.data?.arrive || ""} · {opt.data?.duration || `${opt.durationMin} min`}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, opacity: idx === 0 ? 0.95 : 0.7 }}>Score {Math.round(opt.finalScore)}</div>
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => alert(`Proceed to book / view ${opt.label} — mock`) } style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        border: "none",
                        background: idx === 0 ? "rgba(255,255,255,0.14)" : "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%)",
                        color: idx === 0 ? "#fff" : "#fff",
                        cursor: "pointer"
                      }}>
                        {idx === 0 ? "Recommended" : "View"}
                      </button>
                    </div>

                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 8 }}>
                      Penalty: {Math.round(opt.penalty || 0)} · Time penalty: {Math.round(opt.contextRiskPenalty || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transparency: show nudges & events considered */}
        <section style={{ marginBottom: 18 }}>
          <h4 style={{ marginBottom: 8 }}>Signals Panchi looked at</h4>
          <div style={{ display: "grid", gap: 12 }}>
            {nudges.length > 0 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#fff" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Nudges</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {nudges.slice(0, 4).map((n) => (
                    <div key={n.id} style={{ padding: "8px 10px", borderRadius: 999, background: "rgba(30,144,255,0.06)", fontSize: 12 }}>
                      {n.icon} {n.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#fff" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Events</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {events.map((ev) => (
                    <div key={ev.id} style={{ fontSize: 13 }}>
                      • <strong>{ev.title}</strong> — {ev.location} ({ev.date}) — {ev.impact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hotPlaces.length > 0 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#fff" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Trending</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {hotPlaces.slice(0, 4).map((hp) => (
                    <div key={hp.id} style={{ padding: "8px 10px", borderRadius: 12, background: "rgba(255,235,205,0.8)", fontSize: 13 }}>
                      {hp.emoji} {hp.title} · {hp.trend}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Community excerpts */}
        <section>
          <h4 style={{ marginBottom: 10 }}>Community insights</h4>
          {reviews.length === 0 && <div style={{ padding: 12, borderRadius: 12, background: "#fff" }}>No community inputs for this destination yet.</div>}
          {reviews.length > 0 && (
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {reviews.slice(0, 6).map((r) => (
                <div key={r.id} style={{ minWidth: 220, padding: 12, borderRadius: 12, background: "#fff", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontWeight: 700 }}>{r.name} · {r.emoji}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{r.review}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>Tip: {r.tip}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved alerts quick view */}
        <section style={{ marginTop: 18 }}>
          <h4 style={{ marginBottom: 8 }}>Saved alerts</h4>
          {savedAlerts.length === 0 && <div style={{ padding: 10, borderRadius: 8, background: "#fff" }}>No saved alerts yet — click “Save alert” on the verdict card to watch a destination.</div>}
          {savedAlerts.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              {savedAlerts.map((a, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 8, background: "#fff", fontSize: 13 }}>
                  {a.destination} — saved {new Date(a.when).toLocaleString()} · {a.verdict?.summary || ""}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
