// pages/buses.js

import { useEffect, useState } from "react";

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuses();
  }, []);

  async function fetchBuses() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mockBuses");
      if (!res.ok) throw new Error("Failed to load buses");
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error(err);
      setError("Could not load buses right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cheapest = buses[0];

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

          <div style={{ fontSize: 14, opacity: 0.7 }}>Buses · MVP</div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Comfortable bus options for your route
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          This MVP shows a few sample buses (AC sleeper, non-AC, semi-sleeper)
          sorted by lowest fare. In the full version, Panchi will plug into
          live bus aggregators and combine buses with flights, trains and cabs
          in one place.
        </p>

        <div style={{ marginBottom: 16 }}>
          <button
            onClick={fetchBuses}
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
            {loading ? "Refreshing buses..." : "Refresh bus options"}
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

        {buses.length > 0 && (
          <>
            {/* Cheapest bus highlight */}
            <div
              style={{
                marginBottom: 16,
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
                  opacity: 0.8,
                }}
              >
                Cheapest bus 🔥
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {cheapest.operator}
              </div>
              <div style={{ fontSize: 14 }}>
                {cheapest.depart} → {cheapest.arrive || "Next day"} ·{" "}
                {cheapest.duration}
              </div>
              <div style={{ fontSize: 13, marginTop: 2 }}>
                Type: {cheapest.type} · Rating: ⭐ {cheapest.rating}
              </div>
              <div style={{ fontSize: 18, marginTop: 4 }}>
                ₹{cheapest.price}
              </div>
              <button
                style={{
                  marginTop: 8,
                  padding: "8px 14px",
                  borderRadius: 16,
                  border: "none",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Book (placeholder)
              </button>
            </div>

            {/* Other buses */}
            {buses.slice(1).map((b, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  padding: 12,
                  borderRadius: 14,
                  background: "#F7FAFF",
                  border: "1px solid rgba(30,144,255,0.16)",
                }}
              >
                <div style={{ fontWeight: 600 }}>{b.operator}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {b.depart} → {b.arrive || "Next day"} · {b.duration}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Type: {b.type} · Rating: ⭐ {b.rating}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>
                  ₹{b.price}
                </div>
              </div>
            ))}
          </>
        )}

        {buses.length === 0 && !loading && !error && (
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 12 }}>
            Loading sample bus options… If nothing appears, tap “Refresh bus
            options”.
          </p>
        )}
      </div>
    </main>
  );
}
