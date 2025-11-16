import { useState, useEffect } from "react";
const AIRPORTS = [
  { code: "DEL", city: "Delhi" },
  { code: "GOI", city: "Goa" },
  { code: "BOM", city: "Mumbai" },
  { code: "BLR", city: "Bengaluru" },
  { code: "HYD", city: "Hyderabad" },
  { code: "MAA", city: "Chennai" },
];
const [userName, setUserName] = useState("");
export default function Search() {
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("GOI");
  const [originQuery, setOriginQuery] = useState("Delhi (DEL)");
  const [destinationQuery, setDestinationQuery] = useState("Goa (GOI)");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const [date, setDate] = useState("");
  const [timePreference, setTimePreference] = useState("any"); // any / morning / afternoon / evening / night
  const [stopFilter, setStopFilter] = useState("any"); // any / nonstop / withstops

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
useEffect(() => {
    if (typeof window === "undefined") return;

    // Load stored name
    const saved = window.localStorage.getItem("panchiName");
    if (saved) setUserName(saved);

    // Read origin / destination from URL (from home page chips)
    const params = new URLSearchParams(window.location.search);
    const o = params.get("origin");
    const d = params.get("destination");

    if (o) {
      setOrigin(o);
      const ap = AIRPORTS.find((a) => a.code === o);
      setOriginQuery(ap ? `${ap.city} (${ap.code})` : o);
    }

    if (d) {
      setDestination(d);
      const ap = AIRPORTS.find((a) => a.code === d);
      setDestinationQuery(ap ? `${ap.city} (${ap.code})` : d);
    }
  }, []);
  function filterAirports(query) {
    if (!query) return AIRPORTS;
    const q = query.toLowerCase();
    return AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().startsWith(q) ||
        a.code.toLowerCase().startsWith(q)
    );
  }

  function handleSelectAirport(type, airport) {
    const label = `${airport.city} (${airport.code})`;
    if (type === "origin") {
      setOrigin(airport.code);
      setOriginQuery(label);
      setShowOriginSuggestions(false);
    } else {
      setDestination(airport.code);
      setDestinationQuery(label);
      setShowDestinationSuggestions(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights([]);

    try {
      const params = new URLSearchParams({
        origin,
        destination,
        date,
      }).toString();

      const res = await fetch(`/api/mockFlights?${params}`);
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error(err);
      setError("Could not load flights right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Apply filters: time preference + stops
  const filteredFlights = flights
    .filter((f) =>
      timePreference === "any" ? true : f.timeBand === timePreference
    )
    .filter((f) => {
      if (stopFilter === "any") return true;
      if (stopFilter === "nonstop") return f.stops === 0;
      if (stopFilter === "withstops") return f.stops > 0;
      return true;
    })
    .sort((a, b) => a.price - b.price);

  const cheapest = filteredFlights[0];

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
         <a
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
  }}
>
  <span style={{ fontSize: "18px", color: "#1E90FF" }}>◀︎</span>
  <img
    src="/panchi-logo.png"
    alt="Panchi Logo"
    style={{
      height: "34px",
      width: "auto",
      borderRadius: "6px",
    }}
  />
</a>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
  {userName ? `Cheapest options for you, ${userName}` : "Cheapest flights · MVP"}
</div>
        </header>

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Find the cheapest flight (mock)
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Type a few letters to auto-complete airports, choose your date, and
          filter by time and non-stop vs connecting. Data is mock for DEL → GOI,
          but the flow is real.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
            alignItems: "flex-end",
          }}
        >
          {/* Origin */}
          <div style={{ flex: "1 1 160px", position: "relative" }}>
            <label style={{ fontSize: 12, opacity: 0.7 }}>From</label>
            <input
              value={originQuery}
              onChange={(e) => {
                setOriginQuery(e.target.value);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
              onBlur={() => {
                // small delay so click can register
                setTimeout(() => setShowOriginSuggestions(false), 150);
              }}
              placeholder="Type city or code"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(30,144,255,0.4)",
                fontWeight: 600,
              }}
            />
            {showOriginSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  marginTop: 4,
                  maxHeight: 180,
                  overflowY: "auto",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                  zIndex: 10,
                }}
              >
                {filterAirports(originQuery)
                  .slice(0, 6)
                  .map((a) => (
                    <div
                      key={a.code}
                      onMouseDown={() => handleSelectAirport("origin", a)}
                      style={{
                        padding: "8px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {a.city} ({a.code})
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div style={{ flex: "1 1 160px", position: "relative" }}>
            <label style={{ fontSize: 12, opacity: 0.7 }}>To</label>
            <input
              value={destinationQuery}
              onChange={(e) => {
                setDestinationQuery(e.target.value);
                setShowDestinationSuggestions(true);
              }}
              onFocus={() => setShowDestinationSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowDestinationSuggestions(false), 150);
              }}
              placeholder="Type city or code"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(50,205,50,0.4)",
                fontWeight: 600,
              }}
            />
            {showDestinationSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  marginTop: 4,
                  maxHeight: 180,
                  overflowY: "auto",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                  zIndex: 10,
                }}
              >
                {filterAirports(destinationQuery)
                  .slice(0, 6)
                  .map((a) => (
                    <div
                      key={a.code}
                      onMouseDown={() => handleSelectAirport("dest", a)}
                      style={{
                        padding: "8px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {a.city} ({a.code})
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div style={{ flex: "0 0 160px" }}>
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

          {/* Button */}
          <div style={{ flex: "0 0 170px", display: "flex" }}>
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

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ opacity: 0.7, marginBottom: 4 }}>Preferred time</div>
            <select
              value={timePreference}
              onChange={(e) => setTimePreference(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <option value="any">Any</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div>
            <div style={{ opacity: 0.7, marginBottom: 4 }}>Stops</div>
            <select
              value={stopFilter}
              onChange={(e) => setStopFilter(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <option value="any">Any</option>
              <option value="nonstop">Non-stop only</option>
              <option value="withstops">With stops only</option>
            </select>
          </div>
        </div>

        {/* Errors */}
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

        {/* Results */}
        {filteredFlights.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Results</h2>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>
              Sorted by price (lowest first). Filters applied above.
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
                  Cheapest today 🔥
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {cheapest.provider} · {cheapest.flight_no}
                </div>
                <div style={{ fontSize: 14 }}>
                  {cheapest.depart} → {cheapest.arrive} · {cheapest.duration}
                </div>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  {cheapest.stops === 0 ? "Non-stop" : `${cheapest.stops} stop`}
                </div>
                <div style={{ fontSize: 18, marginTop: 4 }}>
                  ₹{cheapest.price}
                </div>
              </div>
            )}

            {filteredFlights.slice(1).map((f, idx) => (
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
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {f.stops === 0 ? "Non-stop" : `${f.stops} stop`}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>
                  ₹{f.price}
                </div>
              </div>
            ))}
          </>
        )}

        {filteredFlights.length === 0 && !loading && !error && (
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 12 }}>
            Type a few letters to select airports, choose date, and hit “Search
            flights” to load sample data for DEL → GOI.
          </p>
        )}
      </div>
    </main>
  );
}
