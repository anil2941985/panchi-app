import { useState } from "react";

export default function Search() {
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("GOI");
  const [date, setDate] = useState(""); // NEW: travel date
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights([]);

    try {
      const params = new URLSearchParams({
        origin,
        destination,
        date, // will be used later when we plug real API
      }).toString();

      const res = await fetch(`/api/mockFlights?${params}`);
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError("Could not load flights right now. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const cheapest = flights[0];

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
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <a href="/" style={{ textDecoration: "none", color: "#1E90FF" }}>
            ◀︎ Panchi
          </a>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Cheapest flights · MVP</div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Find the cheapest flight (mock)
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          This MVP uses mock data for DEL → GOI but the search logic is real.
          Date is captured now so we can later plug in live APIs.
        </p>

        <form
  onSubmit={handleSearch}
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "flex-end",
  }}
>
          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>From</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(30,144,255,0.4)",
                fontWeight: 600,
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>To</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(50,205,50,0.4)",
                fontWeight: 600,
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,111,97,0.4)",
                fontWeight: 500,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: 4,
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
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
              {loading ? "Searching..." : "Search flights"}
            </button>
          </div>
        </form>

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

        {flights.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Results</h2>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>
              Sorted by price (lowest first).
            </p>

            {cheapest && (
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
                  Cheapest Today 🔥
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {cheapest.provider} · {cheapest.flight_no}
                </div>
                <div style={{ fontSize: 14 }}>
                  {cheapest.depart} → {cheapest.arrive} · {cheapest.duration}
                </div>
                <div style={{ fontSize: 18, marginTop: 4 }}>
                  ₹{cheapest.price}
                </div>
              </div>
            )}

            {flights.slice(1).map((f, idx) => (
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
                <div style={{ fontWeight: 600 }}>
                  {f.provider} · {f.flight_no}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {f.depart} → {f.arrive} · {f.duration}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>
                  ₹{f.price}
                </div>
              </div>
            ))}
          </>
        )}

        {flights.length === 0 && !loading && !error && (
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 12 }}>
            Choose date and hit “Search flights” to load sample data for DEL → GOI.
          </p>
        )}
      </div>
    </main>
  );
}
