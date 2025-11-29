// pages/all-modes.js
import { useEffect, useState } from "react";
import { evaluateEventImpact } from "../utils/eventImpact";

export default function AllModes() {
  const [flight, setFlight] = useState(null);
  const [train, setTrain] = useState(null);
  const [bus, setBus] = useState(null);
  const [cab, setCab] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recommended, setRecommended] = useState(null);
  const [explanation, setExplanation] = useState("");

  // sample destination used in evaluator; in real app this should come from user input
  const destSample = "Goa";

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    setRecommended(null);
    setExplanation("");
    try {
      const [fRes, tRes, bRes, cRes, evRes] = await Promise.all([
        fetch("/api/mockFlights"),
        fetch("/api/mockTrains"),
        fetch("/api/mockBuses"),
        fetch("/api/mockCabs"),
        fetch("/api/mockEvents"),
      ]);

      if (!fRes.ok || !tRes.ok || !bRes.ok || !cRes.ok || !evRes.ok) {
        throw new Error("One of the APIs failed");
      }

      const [fData, tData, bData, cData, evData] = await Promise.all([
        fRes.json(),
        tRes.json(),
        bRes.json(),
        cRes.json(),
        evRes.json(),
      ]);

      const f = fData[0] || null;
      const t = tData[0] || null;
      const b = bData[0] || null;
      const c = cData[0] || null;

      setFlight(f);
      setTrain(t);
      setBus(b);
      setCab(c);
      setEvents(evData || []);

      // Build options list (only non-null)
      const options = [];
      if (f) options.push({ key: "flight", label: "Flight", data: f });
      if (t) options.push({ key: "train", label: "Train", data: t });
      if (b) options.push({ key: "bus", label: "Bus", data: b });
      if (c) options.push({ key: "cab", label: "Cab", data: c });

      // If no options, bail
      if (options.length === 0) {
        setExplanation("No transport options available right now.");
        setLoading(false);
        return;
      }

      // Evaluate event impact for the chosen destination (simple match)
      const { eventSummary, penalties } = evaluateEventImpact(evData || [], destSample);

      // Score each option: normalized price + normalized duration + penalty
      // lower score = better
      const prices = options.map((o) => (o.data.price != null ? o.data.price : Infinity));
      const durationsMin = options.map((o) => {
        // parse duration like "2h 30m" -> minutes
        const d = o.data.duration || "";
        let total = 0;
        const hMatch = d.match(/(\d+)\s*h/);
        const mMatch = d.match(/(\d+)\s*m/);
        if (hMatch) total += parseInt(hMatch[1], 10) * 60;
        if (mMatch) total += parseInt(mMatch[1], 10);
        // if duration missing, fallback to large value
        if (total === 0) total = 24 * 60;
        return total;
      });

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minDur = Math.min(...durationsMin);
      const maxDur = Math.max(...durationsMin);

      function norm(val, min, max) {
        if (max === min) return 0; // all same -> neutral
        return (val - min) / (max - min); // 0..1
      }

      const scored = options.map((o, i) => {
        const price = prices[i];
        const dur = durationsMin[i];

        const priceScore = norm(price, minPrice, maxPrice) * 100; // 0..100
        const durScore = norm(dur, minDur, maxDur) * 100; // 0..100

        // weights: price 0.65, duration 0.35
        const baseScore = priceScore * 0.65 + durScore * 0.35;

        // penalty from events (0..)
        const penaltyPoints = penalties && penalties[o.key] ? penalties[o.key] : 0;

        // final score
        const finalScore = baseScore + penaltyPoints;

        return {
          ...o,
          price,
          durationMinutes: dur,
          priceScore,
          durScore,
          baseScore,
          penaltyPoints,
          finalScore,
        };
      });

      // pick minimum finalScore
      scored.sort((a, b) => a.finalScore - b.finalScore);
      const best = scored[0];

      // Create human-friendly explanation
      let why = [];
      why.push(`Panchi recommends the ${best.label} for Delhi → Goa sample route.`);

      // Provide reason based on scores
      why.push(
        `Score snapshot — price: ₹${best.price} (score ${Math.round(best.priceScore)}), duration: ${best.durationMinutes} min (score ${Math.round(
          best.durScore
        )}), penalty: ${Math.round(best.penaltyPoints)}.`
      );

      if (eventSummary && eventSummary.length > 0) {
        why.push("Event context:");
        eventSummary.forEach((s) => {
          why.push(`• ${s.title} — ${s.impact}. Panchi: ${s.recommendation}`);
        });

        // If chosen option had penalty > 0, mention avoidance
        if (best.penaltyPoints > 0) {
          why.push(
            `Panchi reduced score for modes affected by events (penalty applied). ${best.label} remained best after adjustments.`
          );
        } else {
          why.push(`${best.label} is least affected by the current events in ${destSample}.`);
        }
      } else {
        why.push("No major events detected at the destination that impact travel.");
      }

      setRecommended(best);
      setExplanation(why.join(" "));
    } catch (err) {
      console.error(err);
      setError("Could not load all modes right now. Please try again.");
    } finally {
      setLoading(false);
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
    <main
      style={{
        fontFamily: "Poppins, system-ui, sans-serif",
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(135deg, #1E90FF 0%, #FF6F61 50%, #32CD32 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "24px 20px 32px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/" style={{ textDecoration: "none", fontSize: 20, color: "#1E90FF" }}>
              ◀︎
            </a>
            <img src="/panchi-logo.png" alt="Panchi" style={{ height: 46 }} />
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>All modes · AI-aware MVP</div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Panchi’s recommendation — Delhi → Goa (sample)
        </h1>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 12 }}>
          Panchi scores price, duration and real-world event impact to pick the
          best mode for you.
        </p>

        <div style={{ marginBottom: 12 }}>
          <button
            onClick={loadAll}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
              color: "#fff",
              fontWeight: 600,
              boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
            }}
          >
            {loading ? "Refreshing..." : "Refresh recommendation"}
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: 12, color: "#B00020", background: "#FFF4F4", padding: 10, borderRadius: 10 }}>
            {error}
          </div>
        )}

        {/* Recommendation Card */}
        {recommended && (
          <div
            style={{
              marginBottom: 16,
              padding: 16,
              borderRadius: 18,
              background: "linear-gradient(135deg,#32CD32 0%,#1E90FF 60%)",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.95 }}>
              Panchi's pick {humanModeEmoji(recommended.key)}
            </div>

            <div style={{ marginTop: 8, fontSize: 17, fontWeight: 700 }}>
              {recommended.label} · ₹{recommended.price}
            </div>

            <div style={{ fontSize: 14, marginTop: 4 }}>
              Duration: {recommended.durationMinutes} min · Final score: {Math.round(recommended.finalScore)}
            </div>

            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.95 }}>
              {explanation}
            </div>
          </div>
        )}

        {/* All mode cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {/* Flight Card */}
          {flight && (
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>✈️ Flight · {flight.airline}</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>{flight.depart} → {flight.arrive}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Duration: {flight.duration}</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700 }}>₹{flight.price}</div>
            </div>
          )}

          {/* Train Card */}
          {train && (
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>🚆 Train · {train.name}</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>{train.depart} → {train.arrive}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Duration: {train.duration}</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700 }}>₹{train.price}</div>
            </div>
          )}

          {/* Bus Card */}
          {bus && (
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>🚌 Bus · {bus.operator}</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>{bus.depart} → {bus.arrive || "Next day"}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Duration: {bus.duration}</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700 }}>₹{bus.price}</div>
            </div>
          )}

          {/* Cab Card */}
          {cab && (
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>🚕 Cab · {cab.provider}</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>ETA: {cab.eta} min</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Rating: ⭐ {cab.rating}</div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700 }}>₹{cab.price}</div>
            </div>
          )}
        </div>

        {/* Events summary for transparency */}
        <section style={{ marginTop: 18 }}>
          <h3 style={{ marginBottom: 10 }}>Events & context considered</h3>

          {events.length === 0 && <p style={{ fontSize: 13, opacity: 0.8 }}>No event data loaded.</p>}

          {events.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ padding: 10, borderRadius: 12, background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: ev.severity === "high" ? "#B00020" : "#1E90FF", fontWeight: 700 }}>
                      {ev.severity.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>{ev.location} · {ev.date}</div>
                  <div style={{ marginTop: 6, fontSize: 13 }}>{ev.impact}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const cardStyle = {
  padding: 14,
  borderRadius: 14,
  background: "#fff",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  border: "1px solid rgba(0,0,0,0.04)",
};
