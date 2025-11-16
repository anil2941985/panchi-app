import { useState } from "react";

const AIRPORTS = [
  { code: "DEL", city: "Delhi" },
  { code: "GOI", city: "Goa" },
  { code: "BOM", city: "Mumbai" },
  { code: "BLR", city: "Bengaluru" },
  { code: "HYD", city: "Hyderabad" },
  { code: "MAA", city: "Chennai" },
];

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
          <a href="/" style={{ textDecoration: "none", color: "#1E90FF" }}>
            ◀︎ Panchi
          </a>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Cheapest flights · MVP
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
