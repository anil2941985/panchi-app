import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");

  // NUDGES
  const [nudges, setNudges] = useState([]);
  const [nudgesLoading, setNudgesLoading] = useState(false);
  const [nudgesError, setNudgesError] = useState("");

  // HOT PLACES
  const [hotPlaces, setHotPlaces] = useState([]);
  const [hotLoading, setHotLoading] = useState(false);
  const [hotError, setHotError] = useState("");

  // EVENTS
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  // COMMUNITY REVIEWS
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  // NAME LOAD
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

  // LOAD DATA
  useEffect(() => {
    loadNudges();
    loadHotPlaces();
    loadEvents();
    loadReviews();
  }, []);

  // ----- FETCH NUDGES API -----
  async function loadNudges() {
    try {
      setNudgesLoading(true);
      setNudgesError("");
      const res = await fetch("/api/mockNudges");
      if (!res.ok) throw new Error("Failed to load nudges");
      const data = await res.json();
      setNudges(data);
    } catch (err) {
      console.error(err);
      setNudgesError("Could not load nudges.");
    } finally {
      setNudgesLoading(false);
    }
  }

  // ----- FETCH HOT PLACES API -----
  async function loadHotPlaces() {
    try {
      setHotLoading(true);
      setHotError("");
      const res = await fetch("/api/mockHotPlaces");
      if (!res.ok) throw new Error("Failed hot places");
      const data = await res.json();
      setHotPlaces(data);
    } catch (err) {
      console.error(err);
      setHotError("Hot places unavailable.");
    } finally {
      setHotLoading(false);
    }
  }

  // ----- FETCH EVENTS API -----
  async function loadEvents() {
    try {
      setEventsLoading(true);
      setEventsError("");
      const res = await fetch("/api/mockEvents");
      if (!res.ok) throw new Error("Failed events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setEventsError("Could not load events.");
    } finally {
      setEventsLoading(false);
    }
  }

  // ----- FETCH COMMUNITY REVIEWS -----
  async function loadReviews() {
    try {
      setReviewsLoading(true);
      setReviewsError("");
      const res = await fetch("/api/mockCommunity");
      if (!res.ok) throw new Error("Failed reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setReviewsError("Could not load community reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }

  // SAVE NAME
  function handleSaveName(e) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("panchiName", trimmed);
    }
    setStoredName(trimmed);
  }

  // FREE TEXT → AI PLANNER
  function handleFreeTextSearch(e) {
    e.preventDefault();
    // For MVP we route to the AI-style decision screen
    window.location.href = "/all-modes";
  }

  function goToSearch(o, d) {
    window.location.href = `/search?origin=${o}&destination=${d}`;
  }

  const greeting = storedName ? `Hey, ${storedName}` : "Hey,";

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
          maxWidth: "980px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.94)",
          borderRadius: "24px",
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
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/panchi-logo.png" alt="Panchi Logo" style={{ height: 70 }} />
            <div style={{ fontSize: 13, opacity: 0.7 }}>Context-aware travel · MVP</div>
          </div>

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            <a href="/waitlist" style={{ color: "#1E90FF", textDecoration: "none" }}>
              Join waitlist
            </a>
          </div>
        </header>

        {/* HERO */}
        <section
          style={{
            borderRadius: "20px",
            padding: "20px 16px",
            background:
              "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
            color: "#fff",
            marginBottom: "22px",
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: 4 }}>{greeting}</div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Where are we going next?</h1>
          <p style={{ fontSize: 14 }}>
            Panchi watches weather, events, prices and traffic so you don't have to.
          </p>
        </section>

        {/* NAME INPUT */}
        {!storedName && (
          <form
            onSubmit={handleSaveName}
            style={{
              marginBottom: "18px",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.14)",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 18,
                border: "none",
                background:
                  "linear-gradient(135deg,#1E90FF 0%,#FF6F61 60%,#FFB347 100%)",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Save
            </button>
          </form>
        )}

        {/* FREE TEXT BOX */}
        <form
          onSubmit={handleFreeTextSearch}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <input
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
            placeholder="Goa, Manali, beach trip under 5k..."
            style={{
              flex: "1 1 320px",
              padding: "12px 12px",
              borderRadius: 16,
              border: "1px solid rgba(30,144,255,0.4)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 18px",
              borderRadius: 20,
              border: "none",
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Let Panchi plan →
          </button>
        </form>

        {/* QUICK SUGGESTIONS */}
        <section style={{ marginBottom: 22 }}>
          <h3 style={{ marginBottom: 10 }}>Quick ideas</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={chip} onClick={() => goToSearch("DEL", "GOI")}>
              Goa weekend 🏖️
            </button>
            <button style={chip}>Manali cold ❄️ (soon)</button>
            <button style={chip}>Jaipur forts 🏰 (soon)</button>
          </div>
        </section>

        {/* SMART NUDGES */}
        <section style={{ marginBottom: 22 }}>
          <h3 style={{ marginBottom: 10 }}>Smart nudges for this week</h3>
          {nudgesLoading && <p style={{ fontSize: 13, opacity: 0.8 }}>Loading nudges…</p>}
          {nudgesError && (
            <p style={{ color: "#B00020", background: "#FFF4F4", padding: 8 }}>{nudgesError}</p>
          )}

          {!nudgesLoading && nudges.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {nudges.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "12px",
                    borderRadius: 16,
                    background: "rgba(30,144,255,0.06)",
                    minHeight: 96,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 18 }}>{item.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.title}</div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>{item.detail}</div>
                  <div
                    style={{
                      marginTop: 6,
                      background: "rgba(255,111,97,0.08)",
                      padding: "6px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {item.impact}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>
            Real-time nudges will come from weather, traffic & event feeds.
          </div>
        </section>

        {/* HOT PLACES */}
        <section style={{ marginBottom: 26 }}>
          <h3 style={{ marginBottom: 10 }}>🔥 Hot places in India right now</h3>
          {hotLoading && <p>Loading places…</p>}
          {hotError && <p>{hotError}</p>}

          {!hotLoading && hotPlaces.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {hotPlaces.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: "14px",
                    borderRadius: 18,
                    background:
                      "linear-gradient(135deg,#1E90FF 0%,#FFB347 80%)",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  }}
                >
                  <div style={{ fontSize: 28 }}>{p.emoji}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.95, marginTop: 8 }}>{p.reason}</div>

                  <div
                    style={{
                      marginTop: 8,
                      background: "rgba(255,255,255,0.16)",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {p.temp} · {p.trend}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      background: "rgba(255,255,255,0.12)",
                      padding: "6px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Budget: {p.budget}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EVENTS */}
        <section style={{ marginBottom: 26 }}>
          <h3 style={{ marginBottom: 10 }}>📅 What’s happening — events & crowd alerts</h3>
          {eventsLoading && <p>Loading events…</p>}
          {eventsError && <p style={{ color: "#B00020", background: "#FFF4F4", padding: 8 }}>{eventsError}</p>}

          {!eventsLoading && events.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 12,
              }}
            >
              {events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{ev.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>{ev.location} · {ev.date}</div>
                    </div>
                    <div style={{
                      fontSize: 12,
                      padding: "6px 8px",
                      borderRadius: 10,
                      background: ev.severity === "high" ? "rgba(255,111,97,0.12)" : "rgba(30,144,255,0.08)",
                      color: ev.severity === "high" ? "#B00020" : "#1E90FF",
                      fontWeight: 700,
                      whiteSpace: "nowrap"
                    }}>
                      {ev.severity.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>{ev.detail}</div>

                  <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 12, color: "#444" }}><strong>Impact:</strong> {ev.impact}</div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={smallBtnOutline}>Save alert</button>
                      <button style={smallBtnPrimary}>More info</button>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
                    Panchi suggestion: {ev.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 10, fontSize: 11, opacity: 0.75 }}>
            Event data in the production app will come from ticketing & event APIs plus civic advisories.
          </div>
        </section>

        {/* COMMUNITY REVIEWS */}
        <section style={{ marginBottom: 26 }}>
          <h3 style={{ marginBottom: 10 }}>💬 What travellers are saying</h3>

          {reviewsLoading && <p>Loading community reviews…</p>}
          {reviewsError && <p style={{ color: "#B00020" }}>{reviewsError}</p>}

          {!reviewsLoading && reviews.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                paddingBottom: 8,
                marginTop: 6,
              }}
            >
              {reviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    minWidth: 260,
                    flex: "0 0 260px",
                    background: "linear-gradient(135deg,#fff 0%,#F7FBFF 100%)",
                    borderRadius: 16,
                    padding: 12,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>{r.rating.toFixed(1)} ⭐</div>
                  </div>

                  <div style={{ fontSize: 13, opacity: 0.9 }}>{r.emoji} <strong>{r.location}</strong></div>

                  <div style={{ fontSize: 13, color: "#333" }}>{r.review}</div>

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>{r.tip}</div>
                    <button style={smallBtnOutline}>Report</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.75 }}>
            In the full app, reviews will be user-submitted, verified and geotagged. This is a preview of community-powered insights.
          </div>
        </section>

        {/* EXPLORE BY MODE */}
        <section>
          <h3 style={{ marginBottom: 8 }}>Explore by mode (MVP)</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/search"><button style={modePillPrimary}>Flights</button></a>
            <a href="/trains"><button style={modePill}>Trains</button></a>
            <a href="/buses"><button style={modePill}>Buses</button></a>
            <a href="/cabs"><button style={modePill}>Cabs</button></a>
            <a href="/all-modes"><button style={modePillOutline}>All modes</button></a>
          </div>
        </section>
      </div>
    </main>
  );
}

// STYLES
const chip = {
  padding: "8px 12px",
  borderRadius: 20,
  background: "rgba(30,144,255,0.08)",
  border: "none",
  cursor: "pointer",
};

const smallBtnPrimary = {
  padding: "8px 10px",
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
};

const smallBtnOutline = {
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
};

const modePillBase = {
  padding: "10px 16px",
  borderRadius: 999,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const modePillPrimary = {
  ...modePillBase,
  background:
    "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
  color: "#fff",
};

const modePill = {
  ...modePillBase,
  background: "rgba(30,144,255,0.06)",
};

const modePillOutline = {
  ...modePillBase,
  background: "transparent",
  color: "#1E90FF",
  border: "1px solid rgba(30,144,255,0.4)",
};
