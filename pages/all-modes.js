// pages/all-modes.js

import { useEffect, useState } from "react";

export default function AllModes() {
  const [flight, setFlight] = useState(null);
  const [train, setTrain] = useState(null);
  const [bus, setBus] = useState(null);
  const [cab, setCab] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [fRes, tRes, bRes, cRes] = await Promise.all([
        fetch("/api/mockFlights"),
        fetch("/api/mockTrains"),
        fetch("/api/mockBuses"),
        fetch("/api/mockCabs"),
      ]);

      if (!fRes.ok || !tRes.ok || !bRes.ok || !cRes.ok) {
        throw new Error("One of the APIs failed");
      }

      const [fData, tData, bData, cData] = await Promise.all([
        fRes.json(),
        tRes.json(),
        bRes.json(),
        cRes.json(),
      ]);

      const f = fData[0] || null;
      const t = tData[0] || null;
      const b = bData[0] || null;
      const c = cData[0] || null;

      setFlight(f);
      setTrain(t);
      setBus(b);
      setCab(c);

      // --- Simple “AI” decision logic for recommendation ---
      const options = [];
      if (f) options.push({ type: "flight", label: "Flight", data: f });
      if (t) options.push({ type: "train", label: "Train", data: t });
      if (b) options.push({ type: "bus", label: "Bus", data: b });

      if (options.length > 0) {
        let flightOpt = options.find((o) => o.type === "flight") || null;
        let trainOpt = options.find((o) => o.type === "train") || null;
        let busOpt = options.find((o) => o.type === "bus") || null;

        // Cheapest among non-cab options
        let cheapest = options.reduce((min, o) =>
          !min || o.data.price < min.data.price ? o : min
        , null);

        let rec = cheapest;
        let why = "Absolute lowest price for this trip.";

        if (flightOpt && trainOpt && busOpt) {
          const fp = flightOpt.data.price;
          const tp = trainOpt.data.price;
          const bp = busOpt.data.price;
          const minPrice = Math.min(fp, tp, bp);

          if (fp <= minPrice + 800) {
            rec = flightOpt;
            why =
              "Fastest way to travel and not much more expensive than the cheapest option.";
          } else if (tp <= minPrice + 300) {
            rec = trainOpt;
            why =
              "More comfortable than bus while staying very close to the cheapest price.";
          } else {
            rec = cheapest;
            why = "Absolute lowest price for this route.";
          }
        }

        setRecommended(rec);
        setReason(why);
      } else {
        setRecommended(null);
        setReason("");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load all modes right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function modeEmoji(type) {
    if (type === "flight") return "✈️";
    if (type === "train") return "🚆";
    if (type === "bus") return "🚌";
    return "✨";
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
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "24px 20px 32px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <a
              href="/"
              style={{
                textDecoration: "none",
                fontSize: "20px",
                color: "#1E90FF",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              ◀︎
            </a>
            <img
              src="/panchi-logo.png"
              alt="Panchi Logo"
              style={{ height: "46px", width: "auto" }}
            />
          </div>

          <div style={{ fontSize: 14, opacity: 0.7 }}>All modes · MVP</div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Best way to go Delhi → Goa (sample route)
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          This MVP compares the cheapest flight, train, bus and cab for a sample
          Delhi → Goa trip. In the full version, Panchi&apos;s AI will do this
          for any route, live — with real prices, delays and safety nudges.
        </p>

        <div style={{ marginBottom: 16 }}>
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
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Refreshing all modes..." : "Refresh all modes"}
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: 10,
              borderRadius: 12,
              background: "#FFF4F4",
              color: "#B00020",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Panchi's Recommendation */}
        {recommended && (
          <div
            style={{
              marginBottom: 18,
              padding: 16,
              borderRadius: 20,
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 40%,#FFB347 100%)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              Panchi&apos;s pick for this trip {modeEmoji(recommended.type)}
            </div>

            <div style={{ marginTop: 6 }}>
              {recommended.type === "flight" && flight && (
                <>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    Flight · {flight.airline} · {flight.flight_no}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {flight.depart} → {flight.arrive} · {flight.duration} ·{" "}
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                  </div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>
                    ₹{flight.price}
                  </div>
                </>
              )}

              {recommended.type === "train" && train && (
                <>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    Train · {train.name} · {train.number}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {train.depart} → {train.arrive} · {train.duration}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    Class: {train.class} · Rating: ⭐ {train.rating}
                  </div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>
                    ₹{train.price}
                  </div>
                </>
              )}

              {recommended.type === "bus" && bus && (
                <>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    Bus · {bus.operator}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {bus.depart} → {bus.arrive || "Next day"} · {bus.duration}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    Type: {bus.type} · Rating: ⭐ {bus.rating}
                  </div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>
                    ₹{bus.price}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                opacity: 0.92,
              }}
            >
              Why this? {reason}
            </div>
          </div>
        )}

        {/* FLIGHT CARD */}
        {flight && (
          <div
            style={{
              marginBottom: 14,
              padding: 14,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 60%,#FFB347 100%)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Flight · Cheapest option ✈️
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {flight.airline} · {flight.flight_no}
            </div>
            <div style={{ fontSize: 14 }}>
              {flight.depart} → {flight.arrive} · {flight.duration}
            </div>
            <div style={{ fontSize: 13, marginTop: 2 }}>
              {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
            </div>
            <div style={{ fontSize: 18, marginTop: 4 }}>₹{flight.price}</div>
          </div>
        )}

        {/* TRAIN CARD */}
        {train && (
          <div
            style={{
              marginBottom: 14,
              padding: 14,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#32CD32 0%,#FFB347 100%)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Train · Cheapest option 🚆
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {train.name} · {train.number}
            </div>
            <div style={{ fontSize: 14 }}>
              {train.depart} → {train.arrive} · {train.duration}
            </div>
            <div style={{ fontSize: 13, marginTop: 2 }}>
              Class: {train.class} · Rating: ⭐ {train.rating}
            </div>
            <div style={{ fontSize: 18, marginTop: 4 }}>₹{train.price}</div>
          </div>
        )}

        {/* BUS CARD */}
        {bus && (
          <div
            style={{
              marginBottom: 14,
              padding: 14,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#FF6F61 0%,#FFB347 60%,#32CD32 100%)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Bus · Cheapest option 🚌
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {bus.operator}
            </div>
            <div style={{ fontSize: 14 }}>
              {bus.depart} → {bus.arrive || "Next day"} · {bus.duration}
            </div>
            <div style={{ fontSize: 13, marginTop: 2 }}>
              Type: {bus.type} · Rating: ⭐ {bus.rating}
            </div>
            <div style={{ fontSize: 18, marginTop: 4 }}>₹{bus.price}</div>
          </div>
        )}

        {/* CAB CARD */}
        {cab && (
          <div
            style={{
              marginBottom: 8,
              padding: 14,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#32CD32 0%,#1E90FF 60%,#FFB347 100%)",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Cab · Cheapest option 🚕
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {cab.provider}
            </div>
            <div style={{ fontSize: 14 }}>
              ETA: {cab.eta} min · Rating: ⭐ {cab.rating}
            </div>
            <div style={{ fontSize: 18, marginTop: 4 }}>₹{cab.price}</div>
          </div>
        )}

        {!loading &&
          !error &&
          !flight &&
          !train &&
          !bus &&
          !cab && (
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 12 }}>
              Loading sample data… If nothing appears, tap “Refresh all modes”.
            </p>
          )}
      </div>
    </main>
  );
}
